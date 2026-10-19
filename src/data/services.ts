/**
 * Single source of truth for service pricing and copy.
 *
 * Previously Home.tsx and ServicesPage.tsx each kept their own near-duplicate
 * pricing arrays, which is how they drifted out of sync. Both pages now
 * import from here, so a price only ever needs to change in one place.
 *
 * Audience note: primary buyers are small-town professionals and trades
 * (doctors, dentists, accountants, electricians, plumbers, lawyers, funeral
 * parlors) who are not familiar with digital marketing concepts, and for
 * whom a large upfront number is a real barrier. Copy is plain and
 * outcome-focused — no "SEO," "conversion," "MVP," or agency jargon.
 *
 * Pricing model ("installment" mode): one honest total price, a deposit to
 * start, then a fixed number of equal monthly payments — auto-billed via
 * Payfast's recurring billing, not a multi-year financing plan. The
 * deposit + (monthlyAmount × installmentCount) always sums to exactly
 * fullAmount, so there's no uneven, confusing final payment.
 */

import {
  WEBSITE_PRICING,
  WEBSITE_MONTHLY_TOTAL,
  WEBSITE_CASH_SAVINGS,
  FORMATTED_WEBSITE_PRICING,
  WEBSITE_PRICING_COPY,
} from "../lib/websitePricing";
import {
  VIBE_CODING_PRICING,
  VIBE_CODING_MONTHLY_TOTAL,
  VIBE_CODING_CASH_SAVINGS,
  FORMATTED_VIBE_CODING_PRICING,
  VIBE_CODING_PRICING_COPY,
} from "../lib/vibeCodingPricing";

export type ServiceId = "web-design" | "video-ads" | "vibe-coding";
export type PricingMode = "installment" | "simple";
export type Accent = "indigo" | "purple" | "emerald";

export interface ServiceDefinition {
  id: ServiceId;
  title: string;
  category: string;
  /** Short honest badge — no fake "SAVE X%" claims, no jargon. */
  badge: string;
  description: string;
  features: string[];
  image: string;
  accent: Accent;
  featured?: boolean;
  turnaround: string;

  pricingMode: PricingMode;
  /** Display price, e.g. "R3,499" or "R499". */
  price: string;
  /** e.g. "once-off, or pay it off monthly" or "per video". */
  priceSuffix: string;

  /** Required when pricingMode === "installment". */
  fullAmount?: number;
  depositAmount?: number;
  monthlyAmount?: number;
  installmentCount?: number;
  installmentFormula?: string;
  installmentTotal?: number;
  cashAmount?: number;
  cashSavingsLabel?: string;
  cashSavingsBadge?: string;
  ongoingHostingFee?: number;
  hostingStartsMonth?: number;
  hostingNote?: string;

  /** Required when pricingMode === "simple" (single fixed price). */
  amount?: number;

  /** Placeholder text for the project-brief field in the checkout modal. */
  briefPlaceholder: string;

  /** Optional proof link to a real, live example — only set when verified. */
  liveExampleUrl?: string;
  liveExampleLabel?: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: "web-design",
    title: "Premium Website Design",
    category: "Web Development",
    badge: "Fixed Price · 10–14 Day Build",
    description:
      "A professional website for your practice or business — so people searching for you online can find you, see what you offer, and get in touch easily. Built to make a strong first impression the moment someone opens it.",
    features: [
      "Custom-designed for your business — not a generic template",
      "Works properly on phones, where most people will find you",
      "Helps you show up when people search for you on Google",
      "Enquiry form that lands straight in your inbox or WhatsApp",
      "Ready in 10–14 business days",
      "Hosting & maintenance included during 12-month plan (or R199/mo on upfront)",
    ],
    image: "https://lh3.googleusercontent.com/d/1nLpdWKVSUSvAh2JrtsP7EfKGUIkH6ym6=w1000",
    accent: "indigo",
    featured: true,
    turnaround: "10–14 business days",
    pricingMode: "installment",
    price: FORMATTED_WEBSITE_PRICING.cashPrice,
    priceSuffix: "once-off",
    cashAmount: WEBSITE_PRICING.cashPrice,
    cashSavingsLabel: WEBSITE_PRICING_COPY.upfrontBox,
    cashSavingsBadge: WEBSITE_PRICING_COPY.savingsBadge,
    fullAmount: WEBSITE_PRICING.cashPrice,
    depositAmount: WEBSITE_PRICING.monthlyPrice,
    monthlyAmount: WEBSITE_PRICING.monthlyPrice,
    installmentCount: WEBSITE_PRICING.monthlyCycles,
    installmentTotal: WEBSITE_MONTHLY_TOTAL,
    installmentFormula: WEBSITE_PRICING_COPY.monthlyRow,
    ongoingHostingFee: WEBSITE_PRICING.hostingMonthlyFee,
    hostingNote: WEBSITE_PRICING_COPY.hostingNotice,
    briefPlaceholder:
      "Tell us about your business and what you'd like on the site — your services, hours, location, and any photos you can share. Do you already have a domain name?",
    liveExampleUrl: "https://www.nawilearn.co.za",
    liveExampleLabel: "See a real site we built →",
  },
  {
    id: "video-ads",
    title: "AI Video Adverts",
    category: "Animated Videos",
    badge: "Fixed Price · Fast Turnaround",
    description:
      "A short, professional video for your business — introduce your practice, showcase your work, or promote a service. Sized for WhatsApp Status, Facebook, and TikTok.",
    features: [
      "30-second format, easy to share",
      "Made for WhatsApp Status & social media",
      "Small file size — won't eat data bundles",
      "Delivered in 3–5 business days",
    ],
    image: "https://lh3.googleusercontent.com/d/1546AScUm3fseqml8dfgHEKo5t9TOfx7N=w1000",
    accent: "purple",
    turnaround: "3–5 business days",
    pricingMode: "simple",
    price: "R499",
    priceSuffix: "per video",
    amount: 499,
    briefPlaceholder:
      "What's the video for, and what should people do after watching (call you, WhatsApp you, visit you)? Share your business name and any details you'd like included.",
  },
  {
    id: "vibe-coding",
    title: "AI App Vibe Coding",
    category: "App Development",
    badge: "Fixed Price · Full Ownership",
    description:
      "For practices and businesses that need more than a website — an online booking system, a simple client portal, or a tool that saves you from doing everything by phone or on paper.",
    features: [
      "Online booking or enquiry system, built around how you work",
      "A simple, secure way for clients or patients to submit info online",
      "You own it outright — no ongoing licence fees to anyone else",
      "Free chat first to understand exactly what you need",
      "Typically 2–4 weeks, depending on what's needed",
      "Maintenance & cloud care included during 12-month plan (or on upfront)",
    ],
    image: "https://lh3.googleusercontent.com/d/17U_APICMOCc44uJCSl6PkHReYuijxThu=w1000",
    accent: "emerald",
    turnaround: "Typically 2–4 weeks, depending on scope",
    pricingMode: "installment",
    price: FORMATTED_VIBE_CODING_PRICING.cashPrice,
    priceSuffix: "once-off",
    cashAmount: VIBE_CODING_PRICING.cashPrice,
    cashSavingsLabel: VIBE_CODING_PRICING_COPY.upfrontBox,
    cashSavingsBadge: VIBE_CODING_PRICING_COPY.savingsBadge,
    fullAmount: VIBE_CODING_PRICING.cashPrice,
    depositAmount: VIBE_CODING_PRICING.monthlyPrice,
    monthlyAmount: VIBE_CODING_PRICING.monthlyPrice,
    installmentCount: VIBE_CODING_PRICING.monthlyCycles,
    installmentTotal: VIBE_CODING_MONTHLY_TOTAL,
    installmentFormula: VIBE_CODING_PRICING_COPY.monthlyRow,
    hostingNote: VIBE_CODING_PRICING_COPY.hostingNotice,
    briefPlaceholder:
      "Tell us what you're hoping to solve — e.g. online bookings, taking in client documents, cutting down on phone calls. We'll figure out the right build together on a quick call.",
  },
];

export function getService(id: string): ServiceDefinition | undefined {
  return SERVICES.find((s) => s.id === id);
}
