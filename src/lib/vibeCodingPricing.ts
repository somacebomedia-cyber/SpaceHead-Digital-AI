/**
 * Single source of truth for AI App Vibe Coding pricing, plan constants,
 * and Payfast billing schedules.
 *
 * Used across the frontend (Services page, Home page card, Modals, FAQ, Customizer)
 * and backend (server.ts, api/index.ts, payfastService.ts) so the UI and
 * payment engine can never disagree.
 */

export const VIBE_CODING_PRICING = {
  // Upfront cash plan
  cashPrice: 8999,

  // 12-month payment plan
  monthlyPrice: 1499,
  monthlyCycles: 12,
} as const;

// Derived values computed strictly from constants — never typed separately
export const VIBE_CODING_MONTHLY_TOTAL =
  VIBE_CODING_PRICING.monthlyPrice * VIBE_CODING_PRICING.monthlyCycles; // 17,988 (1499 x 12)
export const VIBE_CODING_CASH_SAVINGS =
  VIBE_CODING_MONTHLY_TOTAL - VIBE_CODING_PRICING.cashPrice; // 8,989 (17,988 - 8,999)

// Currency formatter for ZAR display
export const formatZAR = (amount: number): string =>
  `R${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const FORMATTED_VIBE_CODING_PRICING = {
  cashPrice: formatZAR(VIBE_CODING_PRICING.cashPrice), // "R8,999"
  monthlyPrice: formatZAR(VIBE_CODING_PRICING.monthlyPrice), // "R1,499"
  monthlyTotal: formatZAR(VIBE_CODING_MONTHLY_TOTAL), // "R17,988"
  cashSavings: formatZAR(VIBE_CODING_CASH_SAVINGS), // "R8,989"
};

// Plan IDs accepted by Payfast payment creation
export const VIBE_CODING_PLAN_IDS = {
  CASH: "vibe-cash",
  MONTHLY: "vibe-monthly",
} as const;

export type VibeCodingPlanId =
  (typeof VIBE_CODING_PLAN_IDS)[keyof typeof VIBE_CODING_PLAN_IDS];

// Canonical copy lines matching the pricing specification
export const VIBE_CODING_PRICING_COPY = {
  // Row for 12-month plan
  monthlyRow: `${FORMATTED_VIBE_CODING_PRICING.monthlyPrice}/month x ${VIBE_CODING_PRICING.monthlyCycles} = ${FORMATTED_VIBE_CODING_PRICING.monthlyTotal}, then maintenance & cloud care`,

  // Text inside upfront box
  upfrontBox: `${FORMATTED_VIBE_CODING_PRICING.cashPrice} once-off, then maintenance & cloud care`,

  // Label for crossed-out monthly total beside upfront price
  crossedOutLabel: `${FORMATTED_VIBE_CODING_PRICING.monthlyTotal} on the monthly plan`,

  // Savings badge (displayed only once)
  savingsBadge: `Save ${FORMATTED_VIBE_CODING_PRICING.cashSavings}`,

  // Notice near plans regarding maintenance setup
  hostingNotice: `We'll send you a link to set up your maintenance & cloud care. It isn't charged automatically.`,

  // Clarification for monthly plan
  monthlyInclusionNotice: `Maintenance & cloud care is included in the ${FORMATTED_VIBE_CODING_PRICING.monthlyPrice} while the ${VIBE_CODING_PRICING.monthlyCycles} payments run.`,
};

// Server-authoritative plan configuration
export interface ServerVibePlanConfig {
  planId: string;
  amountRands: number;
  itemName: string;
  itemDescription: string;
  isSubscription: boolean;
  subscription?: {
    recurringAmountRands: number;
    frequency: 3; // Payfast code 3 = Monthly
    cycles: number; // Payfast cycles: 12 (first payment counts as cycle 1)
  };
}

export function getVibeCodingPlanConfig(planId: string): ServerVibePlanConfig | null {
  if (
    planId === VIBE_CODING_PLAN_IDS.CASH ||
    planId === "vibe-coding-cash" ||
    planId === "vibe-app-cash"
  ) {
    return {
      planId: VIBE_CODING_PLAN_IDS.CASH,
      amountRands: VIBE_CODING_PRICING.cashPrice,
      itemName: "AI App Vibe Coding — Upfront",
      itemDescription: `AI App Vibe Coding upfront payment (${FORMATTED_VIBE_CODING_PRICING.cashPrice} once-off)`,
      isSubscription: false,
    };
  }

  if (
    planId === VIBE_CODING_PLAN_IDS.MONTHLY ||
    planId === "vibe-coding-monthly" ||
    planId === "vibe-app-monthly"
  ) {
    return {
      planId: VIBE_CODING_PLAN_IDS.MONTHLY,
      amountRands: VIBE_CODING_PRICING.monthlyPrice,
      itemName: "AI App Vibe Coding — 12-Month Plan",
      itemDescription: `AI App Vibe Coding 12-month plan (${FORMATTED_VIBE_CODING_PRICING.monthlyPrice}/mo x ${VIBE_CODING_PRICING.monthlyCycles})`,
      isSubscription: true,
      subscription: {
        recurringAmountRands: VIBE_CODING_PRICING.monthlyPrice,
        frequency: 3,
        cycles: VIBE_CODING_PRICING.monthlyCycles,
      },
    };
  }

  return null;
}
