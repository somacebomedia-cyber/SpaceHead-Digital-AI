import crypto from "crypto";
import { getWebsitePlanConfig } from "./websitePricing.js";
import { getVibeCodingPlanConfig } from "./vibeCodingPricing.js";

/**
 * Dynamically resolves Payfast credentials and endpoints.
 *
 * - When PAYFAST_ENV === "live": uses real merchant credentials and www.payfast.co.za.
 * - When in Sandbox (default/testing): uses Payfast's public test sandbox (merchant ID 10000100,
 *   merchant key 46f0cd694581a, no passphrase) so checkout testing works out of the box
 *   with fake test cards, even if live or placeholder credentials exist in environment variables.
 */
export function getPayfastConfig() {
  const env = (process.env.PAYFAST_ENV || "sandbox").trim().toLowerCase();
  const isLive = env === "live";

  let merchantId = (process.env.PAYFAST_MERCHANT_ID || "").trim();
  let merchantKey = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
  let passphrase = (process.env.PAYFAST_PASSPHRASE || "").trim();

  if (!isLive) {
    // In sandbox mode: if credentials are unset or are live credentials (such as 34170761),
    // default strictly to Payfast's public test sandbox credentials.
    if (!merchantId || merchantId === "34170761") {
      merchantId = "10000100";
      merchantKey = "46f0cd694581a";
      passphrase = "";
    }
  }

  // Payfast's public test account 10000100 has no passphrase registered on Payfast sandbox servers.
  if (merchantId === "10000100") {
    merchantKey = merchantKey || "46f0cd694581a";
    passphrase = "";
  }

  const host = isLive ? "www.payfast.co.za" : "sandbox.payfast.co.za";
  const processUrl = `https://${host}/eng/process`;

  return {
    isLive,
    merchantId,
    merchantKey,
    passphrase,
    host,
    processUrl,
  };
}

/**
 * Generate Payfast MD5 signature.
 *
 * For checkout: leave empty fields out (keepEmptyFields = false).
 * For ITN verification: keep empty fields in (keepEmptyFields = true), as documented by Payfast.
 */
export function generatePayfastSignature(
  data: Record<string, string>,
  passphrase?: string,
  keepEmptyFields: boolean = false
): string {
  let pfOutput = "";

  const keys = Object.keys(data).filter((key) => {
    if (key === "signature") return false;
    if (data[key] === undefined || data[key] === null) return false;
    if (!keepEmptyFields && data[key].trim() === "") return false;
    return true;
  });

  keys.forEach((key, index) => {
    const val = encodeURIComponent(data[key].trim()).replace(/%20/g, "+");
    pfOutput += `${key}=${val}${index < keys.length - 1 ? "&" : ""}`;
  });

  const pfPassphrase = passphrase !== undefined ? passphrase : getPayfastConfig().passphrase;
  if (pfPassphrase) {
    pfOutput += `&passphrase=${encodeURIComponent(pfPassphrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

export interface PayfastPaymentInput {
  planId?: string;
  amountRands?: number;
  itemName?: string;
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
  cellNumber?: string;
  recurring?: {
    billingDate: string;
    recurringAmountRands: number;
    frequency: 3;
    cycles: number;
  };
}

/**
 * Prepares payment payload for Payfast checkout form submission/redirect.
 *
 * Fields are built strictly in Payfast's documented order:
 * 1. Merchant details (merchant_id, merchant_key, return_url, cancel_url, notify_url)
 * 2. Buyer details (name_first, name_last, email_address, cell_number)
 * 3. Transaction details (m_payment_id, amount, item_name, item_description)
 * 4. Custom fields (custom_str1, custom_str2)
 * 5. Subscription fields (subscription_type, billing_date, recurring_amount, frequency, cycles)
 *
 * For website & vibe-coding plan IDs, the server decides the amount, item name,
 * and billing schedule from authoritative constants.
 */
export function createPayfastPayment(input: PayfastPaymentInput): {
  processUrl: string;
  fields: Record<string, string>;
} {
  const config = getPayfastConfig();

  let amountRands = Number(input.amountRands || 0);
  let itemName = input.itemName || "SpaceHead AI Digital Service";
  let itemDescription = input.itemDescription;
  let customStr1 = input.customStr1;
  let recurring = input.recurring;

  // Authoritative plan enforcement: Never trust an amount or recurring schedule
  // sent by the browser for fixed plans (website & vibe coding).
  if (input.planId) {
    const planConfig = getWebsitePlanConfig(input.planId) || getVibeCodingPlanConfig(input.planId);
    if (planConfig) {
      amountRands = planConfig.amountRands;
      itemName = planConfig.itemName;
      itemDescription = input.itemDescription || planConfig.itemDescription;
      customStr1 = planConfig.planId;

      if (planConfig.isSubscription && planConfig.subscription) {
        // First payment counts as payment 1, total 12 payments
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        recurring = {
          billingDate: nextMonth.toISOString().slice(0, 10),
          recurringAmountRands: planConfig.subscription.recurringAmountRands,
          frequency: 3,
          cycles: planConfig.subscription.cycles,
        };
      } else {
        recurring = undefined;
      }
    }
  }

  const returnPath = input.returnPath || "/services";
  const cancelPath = input.cancelPath || "/services";

  const sepReturn = returnPath.includes("?") ? "&" : "?";
  const sepCancel = cancelPath.includes("?") ? "&" : "?";

  const returnUrl = `${input.origin}${returnPath}${sepReturn}payment=payfast&outcome=success`;
  const cancelUrl = `${input.origin}${cancelPath}${sepCancel}payment=payfast&outcome=cancelled`;
  const notifyUrl = `${input.origin}/api/payfast/notify`;

  // Build the fields in Payfast's documented order:
  // 1. Merchant details
  // 2. Buyer details
  // 3. m_payment_id, amount, item_name, item_description
  // 4. custom_str1, custom_str2
  // 5. subscription_type, billing_date, recurring_amount, frequency, cycles
  const fields: Record<string, string> = {};

  // 1. Merchant details
  fields.merchant_id = config.merchantId;
  fields.merchant_key = config.merchantKey;
  if (returnUrl) fields.return_url = returnUrl;
  if (cancelUrl) fields.cancel_url = cancelUrl;
  if (notifyUrl) fields.notify_url = notifyUrl;

  // 2. Buyer details (leave empty fields out)
  if (input.firstName && input.firstName.trim()) {
    fields.name_first = input.firstName.trim();
  }
  if (input.lastName && input.lastName.trim()) {
    fields.name_last = input.lastName.trim();
  }
  if (input.email && input.email.trim()) {
    fields.email_address = input.email.trim();
  }
  if (input.cellNumber && input.cellNumber.trim()) {
    fields.cell_number = input.cellNumber.trim();
  }

  // 3. Transaction details
  fields.m_payment_id = input.paymentId || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  fields.amount = amountRands.toFixed(2);
  fields.item_name = itemName;
  if (itemDescription && itemDescription.trim()) {
    fields.item_description = itemDescription.trim();
  }

  // 4. Custom fields
  if (customStr1 && customStr1.trim()) {
    fields.custom_str1 = customStr1.trim();
  }
  if (input.customStr2 && input.customStr2.trim()) {
    fields.custom_str2 = input.customStr2.trim();
  }

  // 5. Subscription fields (real Payfast subscription when recurring is configured)
  if (recurring) {
    fields.subscription_type = "1";
    fields.billing_date = recurring.billingDate;
    fields.recurring_amount = recurring.recurringAmountRands.toFixed(2);
    fields.frequency = String(recurring.frequency);
    fields.cycles = String(recurring.cycles);
  }

  // Leave empty fields out of the checkout signature
  fields.signature = generatePayfastSignature(fields, config.passphrase, false);

  return {
    processUrl: config.processUrl,
    fields,
  };
}

/**
 * Validates Instant Transaction Notification (ITN) from Payfast.
 * Payfast documentation requires that blank/empty fields are KEPT IN when verifying the ITN signature.
 */
export async function verifyPayfastITN(postData: Record<string, string>): Promise<{ isValid: boolean; data: Record<string, string> }> {
  const config = getPayfastConfig();
  const receivedSignature = postData.signature;
  if (!receivedSignature) {
    return { isValid: false, data: postData };
  }

  // 1. Validate signature locally with empty fields KEPT IN
  const calculatedSignature = generatePayfastSignature(postData, config.passphrase, true);
  if (calculatedSignature !== receivedSignature) {
    console.warn("Payfast ITN signature mismatch", { calculatedSignature, receivedSignature });
    return { isValid: false, data: postData };
  }

  // 2. Validate with Payfast server query
  try {
    const paramString = Object.keys(postData)
      .map((key) => `${key}=${encodeURIComponent(postData[key]).replace(/%20/g, "+")}`)
      .join("&");

    const validateUrl = `https://${config.host}/eng/query/validate`;
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
