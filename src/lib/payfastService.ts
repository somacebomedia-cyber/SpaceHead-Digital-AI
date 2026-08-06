import crypto from "crypto";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "10000100"; // Default Payfast Sandbox Merchant ID
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a"; // Default Payfast Sandbox Merchant Key
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
const PAYFAST_ENV = process.env.PAYFAST_ENV || "sandbox"; // "sandbox" or "live"

const PAYFAST_HOST = PAYFAST_ENV === "live" ? "www.payfast.co.za" : "sandbox.payfast.co.za";
export const PAYFAST_PROCESS_URL = `https://${PAYFAST_HOST}/eng/process`;

/**
 * Generate Payfast MD5 signature
 */
export function generatePayfastSignature(data: Record<string, string>, passphrase?: string): string {
  let pfOutput = "";

  // Filter empty attributes and signature key itself
  const keys = Object.keys(data).filter(
    (key) => key !== "signature" && data[key] !== undefined && data[key] !== null && data[key] !== ""
  );

  keys.forEach((key, index) => {
    const val = encodeURIComponent(data[key].trim()).replace(/%20/g, "+");
    pfOutput += `${key}=${val}${index < keys.length - 1 ? "&" : ""}`;
  });

  const pfPassphrase = passphrase || PAYFAST_PASSPHRASE;
  if (pfPassphrase) {
    pfOutput += `&passphrase=${encodeURIComponent(pfPassphrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

/**
 * Prepares payment payload for Payfast checkout form submission/redirect
 */
export function createPayfastPayment(input: {
  amountRands: number;
  itemName: string;
  itemDescription?: string;
  paymentId?: string;
  origin: string;
  returnPath?: string;
  cancelPath?: string;
  customStr1?: string;
  customStr2?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}): { processUrl: string; fields: Record<string, string> } {
  const returnPath = input.returnPath || "/services";
  const cancelPath = input.cancelPath || "/services";

  const sepReturn = returnPath.includes("?") ? "&" : "?";
  const sepCancel = cancelPath.includes("?") ? "&" : "?";

  const returnUrl = `${input.origin}${returnPath}${sepReturn}payment=payfast&outcome=success`;
  const cancelUrl = `${input.origin}${cancelPath}${sepCancel}payment=payfast&outcome=cancelled`;
  const notifyUrl = `${input.origin}/api/payfast/notify`;

  const fields: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: input.paymentId || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: input.amountRands.toFixed(2),
    item_name: input.itemName,
  };

  if (input.itemDescription) {
    fields.item_description = input.itemDescription;
  }
  if (input.customStr1) {
    fields.custom_str1 = input.customStr1;
  }
  if (input.customStr2) {
    fields.custom_str2 = input.customStr2;
  }
  if (input.email) {
    fields.email_address = input.email;
  }
  if (input.firstName) {
    fields.name_first = input.firstName;
  }
  if (input.lastName) {
    fields.name_last = input.lastName;
  }

  fields.signature = generatePayfastSignature(fields);

  return {
    processUrl: PAYFAST_PROCESS_URL,
    fields,
  };
}

/**
 * Validates Instant Transaction Notification (ITN) from Payfast
 */
export async function verifyPayfastITN(postData: Record<string, string>): Promise<{ isValid: boolean; data: Record<string, string> }> {
  const receivedSignature = postData.signature;
  if (!receivedSignature) {
    return { isValid: false, data: postData };
  }

  // 1. Validate signature locally
  const calculatedSignature = generatePayfastSignature(postData);
  if (calculatedSignature !== receivedSignature) {
    console.warn("Payfast ITN signature mismatch", { calculatedSignature, receivedSignature });
    return { isValid: false, data: postData };
  }

  // 2. Validate with Payfast server query
  try {
    const paramString = Object.keys(postData)
      .map((key) => `${key}=${encodeURIComponent(postData[key]).replace(/%20/g, "+")}`)
      .join("&");

    const validateUrl = `https://${PAYFAST_HOST}/eng/query/validate`;
    const response = await fetch(validateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: paramString,
    });

    const responseText = (await response.text()).trim();
    const isValid = responseText === "VALID";

    return { isValid, data: postData };
  } catch (err) {
    console.error("Payfast ITN server validation error:", err);
    return { isValid: false, data: postData };
  }
}
