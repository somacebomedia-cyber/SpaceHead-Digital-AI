/**
 * Single source of truth for Premium Website Design pricing, plan constants,
 * and Payfast billing schedules.
 *
 * Used across the frontend (Services page, Home page card, Modals, FAQ, Customizer)
 * and backend (server.ts, api/index.ts, payfastService.ts) so the UI and
 * payment engine can never disagree.
 */

export const WEBSITE_PRICING = {
  // Upfront cash plan
  cashPrice: 3500,

  // 12-month payment plan
  monthlyPrice: 499,
  monthlyCycles: 12,

  // Ongoing hosting & maintenance (link sent, not auto-charged)
  hostingMonthlyFee: 199,
} as const;

// Derived values computed strictly from constants — never typed separately
export const WEBSITE_MONTHLY_TOTAL = WEBSITE_PRICING.monthlyPrice * WEBSITE_PRICING.monthlyCycles; // 5,988 (499 x 12)
export const WEBSITE_CASH_SAVINGS = WEBSITE_MONTHLY_TOTAL - WEBSITE_PRICING.cashPrice; // 2,488 (5,988 - 3,500)

// Currency formatter for ZAR display
export const formatZAR = (amount: number): string =>
  `R${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const FORMATTED_WEBSITE_PRICING = {
  cashPrice: formatZAR(WEBSITE_PRICING.cashPrice), // "R3,500"
  monthlyPrice: formatZAR(WEBSITE_PRICING.monthlyPrice), // "R499"
  monthlyTotal: formatZAR(WEBSITE_MONTHLY_TOTAL), // "R5,988"
  cashSavings: formatZAR(WEBSITE_CASH_SAVINGS), // "R2,488"
  hostingMonthlyFee: formatZAR(WEBSITE_PRICING.hostingMonthlyFee), // "R199"
};

// Plan IDs accepted by Payfast payment creation
export const WEBSITE_PLAN_IDS = {
  CASH: "website-cash",
  MONTHLY: "website-monthly",
} as const;

export type WebsitePlanId = (typeof WEBSITE_PLAN_IDS)[keyof typeof WEBSITE_PLAN_IDS];

// Canonical copy lines mandated by the pricing specification
export const WEBSITE_PRICING_COPY = {
  // Row for 12-month plan
  monthlyRow: `${FORMATTED_WEBSITE_PRICING.monthlyPrice}/month x ${WEBSITE_PRICING.monthlyCycles} = ${FORMATTED_WEBSITE_PRICING.monthlyTotal}, then ${FORMATTED_WEBSITE_PRICING.hostingMonthlyFee}/month hosting & maintenance`,

  // Text inside upfront box
  upfrontBox: `${FORMATTED_WEBSITE_PRICING.cashPrice} once-off, then ${FORMATTED_WEBSITE_PRICING.hostingMonthlyFee}/month hosting & maintenance`,

  // Label for crossed-out monthly total beside upfront price
  crossedOutLabel: `${FORMATTED_WEBSITE_PRICING.monthlyTotal} on the monthly plan`,

  // Savings badge (displayed only once)
  savingsBadge: `Save ${FORMATTED_WEBSITE_PRICING.cashSavings}`,

  // Notice near plans regarding hosting setup
  hostingNotice: `We'll send you a link to set up your ${FORMATTED_WEBSITE_PRICING.hostingMonthlyFee}/month hosting & maintenance. It isn't charged automatically.`,

  // Clarification for monthly plan
  monthlyInclusionNotice: `Hosting & maintenance is included in the ${FORMATTED_WEBSITE_PRICING.monthlyPrice} while the ${WEBSITE_PRICING.monthlyCycles} payments run.`,
};

// Server-authoritative plan configuration
export interface ServerPlanConfig {
  planId: WebsitePlanId;
  amountRands: number;
  itemName: string;
  itemDescription: string;
  isSubscription: boolean;
  subscription?: {
    recurringAmountRands: number;
    frequency: 3; // Payfast code 3 = Monthly
    cycles: number; // Payfast cycles: 12 (first payment counts as payment 1)
  };
}

export function getWebsitePlanConfig(planId: string): ServerPlanConfig | null {
  if (planId === WEBSITE_PLAN_IDS.CASH) {
    return {
      planId: WEBSITE_PLAN_IDS.CASH,
      amountRands: WEBSITE_PRICING.cashPrice,
      itemName: "Premium Website Design — Upfront",
      itemDescription: `Premium Website Design upfront payment (${FORMATTED_WEBSITE_PRICING.cashPrice} once-off)`,
      isSubscription: false,
    };
  }

  if (planId === WEBSITE_PLAN_IDS.MONTHLY) {
    return {
      planId: WEBSITE_PLAN_IDS.MONTHLY,
      amountRands: WEBSITE_PRICING.monthlyPrice,
      itemName: "Premium Website Design — 12-Month Plan",
      itemDescription: `Premium Website Design 12-month plan (${FORMATTED_WEBSITE_PRICING.monthlyPrice}/mo x ${WEBSITE_PRICING.monthlyCycles})`,
      isSubscription: true,
      subscription: {
        recurringAmountRands: WEBSITE_PRICING.monthlyPrice,
        frequency: 3,
        cycles: WEBSITE_PRICING.monthlyCycles,
      },
    };
  }

  return null;
}
