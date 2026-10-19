/**
 * Client-side helper to initiate Payfast payment checkout
 */
export interface InitiatePayfastPaymentParams {
  planId?: string;
  amountRands?: number;
  itemName?: string;
  itemDescription?: string;
  paymentId?: string;
  returnPath?: string;
  cancelPath?: string;
  customStr1?: string;
  customStr2?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  cellNumber?: string;
  /** Omit for a normal once-off payment. See payfastService.ts for details. */
  recurring?: {
    billingDate: string;
    recurringAmountRands: number;
    cycles: number;
  };
}

export async function initiatePayfastPayment(params: InitiatePayfastPaymentParams): Promise<void> {
  const response = await fetch("/api/payfast/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create Payfast checkout session");
  }

  const { processUrl, fields } = data;

  if (!processUrl || !fields) {
    throw new Error("Invalid response received from Payfast payment endpoint");
  }

  // Create an off-screen form and submit to Payfast process URL
  const form = document.createElement("form");
  form.method = "POST";
  form.action = processUrl;

  Object.keys(fields).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = fields[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
