export interface ProjectArchetype {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  basePriceZAR: number;
  baseDays: number;
  defaultModules: string[];
  icon: string;
}

export interface FeatureModule {
  id: string;
  categoryId: "core" | "auth" | "ai" | "commerce" | "analytics" | "content" | "velocity";
  categoryName: string;
  title: string;
  shortDesc: string;
  technicalSpecs: string;
  priceZAR: number;
  additionalDays: number;
  iconName: string;
  popular?: boolean;
  recommendedFor?: string[];
}

export interface EstimateSummary {
  archetype: ProjectArchetype;
  selectedModules: FeatureModule[];
  basePriceZAR: number;
  featuresPriceZAR: number;
  totalPriceZAR: number;
  depositAmountZAR: number;
  balanceAmountZAR: number;
  totalDays: number;
  sprintWeeks: string;
  fastTrackApplied: boolean;
  referenceCode: string;
  roi: {
    hoursSavedPerMonth: number;
    estimatedLaborSavingsZAR: number;
    projectedConversionLiftPct: number;
    paybackMonths: number;
  };
}

export const PROJECT_ARCHETYPES: ProjectArchetype[] = [
  {
    id: "web_app",
    name: "Custom Web App & Portal",
    badge: "Most Versatile",
    tagline: "Tailored customer portal, internal tool, or cloud SaaS app",
    description: "Responsive React/TypeScript frontend, secure Node backend, custom database schemas, and lightning-fast cloud deployment.",
    basePriceZAR: 12500,
    baseDays: 14,
    defaultModules: ["auth_rbac", "db_cloud", "analytics_dash"],
    icon: "LayoutDashboard",
  },
  {
    id: "ai_saas",
    name: "AI-Powered SaaS & Automation",
    badge: "Highest ROI",
    tagline: "Gemini 3.7 Flash AI agents, document processing, and smart workflows",
    description: "Intelligent copilot agents, automated customer triage, data extraction, and dynamic generative workflows embedded into your product.",
    basePriceZAR: 17500,
    baseDays: 18,
    defaultModules: ["auth_rbac", "db_cloud", "gemini_ai", "analytics_dash"],
    icon: "Sparkles",
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Payments Portal",
    badge: "Revenue Engine",
    tagline: "South African PayFast payments, cart checkout, and digital orders",
    description: "Full e-commerce infrastructure with card, Instant EFT, and QR payments, automated tax invoices, order status alerts, and inventory management.",
    basePriceZAR: 14500,
    baseDays: 14,
    defaultModules: ["payfast_gateway", "db_cloud", "whatsapp_email_notif"],
    icon: "ShoppingCart",
  },
  {
    id: "showcase",
    name: "Corporate Showcase & SEO CMS",
    badge: "Rapid Launch",
    tagline: "High-conversion corporate website with dynamic blog and lead CRM",
    description: "Server-side rendered performance, Google SEO meta tags, animated typography, blog engine, and direct WhatsApp lead capture.",
    basePriceZAR: 7900,
    baseDays: 7,
    defaultModules: ["cms_blog", "whatsapp_email_notif"],
    icon: "Globe",
  },
  {
    id: "brand_launch",
    name: "Complete Brand & Digital Launch",
    badge: "Turnkey Agency Bundle",
    tagline: "Web app + 60s 2D animated promo reel + brand identity collateral",
    description: "Holistic commercial launch: high-performing web application paired with custom vector brand identity, business cards, and a broadcast-ready animated video.",
    basePriceZAR: 19500,
    baseDays: 21,
    defaultModules: ["cms_blog", "promo_video", "whatsapp_email_notif"],
    icon: "Rocket",
  },
];

export const FEATURE_MODULES: FeatureModule[] = [
  // Authentication & Security
  {
    id: "auth_rbac",
    categoryId: "auth",
    categoryName: "Authentication & Security",
    title: "User Authentication & RBAC",
    shortDesc: "Secure user signup, Google login, and role-based permissions (Admin, Client, Staff).",
    technicalSpecs: "Firebase Auth / OAuth 2.0 with session persistence, role security rules, passwordless resets, and JWT verification.",
    priceZAR: 2800,
    additionalDays: 3,
    iconName: "ShieldCheck",
    popular: true,
  },
  {
    id: "db_cloud",
    categoryId: "core",
    categoryName: "Architecture & Data",
    title: "Real-Time Cloud Database & Offline Cache",
    shortDesc: "Scalable Firestore or PostgreSQL database with real-time multi-device sync.",
    technicalSpecs: "Cloud Firestore / Supabase schema architecture, automated backups, index optimization, and local cache fallback.",
    priceZAR: 3200,
    additionalDays: 3,
    iconName: "Database",
    popular: true,
  },
  // AI Automation
  {
    id: "gemini_ai",
    categoryId: "ai",
    categoryName: "AI & Intelligence",
    title: "Gemini 3.7 Flash AI Copilot & Automation",
    shortDesc: "Context-aware AI assistant, document summarization, or smart recommendation agent.",
    technicalSpecs: "Google GenAI SDK integration with server-side API proxying, structured JSON outputs, streaming responses, and prompt engineering.",
    priceZAR: 4500,
    additionalDays: 4,
    iconName: "Bot",
    popular: true,
  },
  // Commerce & Payments
  {
    id: "payfast_gateway",
    categoryId: "commerce",
    categoryName: "Commerce & Billing",
    title: "South African PayFast Payment Engine",
    shortDesc: "Accept Visa, Mastercard, Instant EFT, Zapper, and automated installment billing in ZAR.",
    technicalSpecs: "Live Payfast merchant integration with server-side MD5 signature hashing, Instant Transaction Notifications (ITN), and webhook validation.",
    priceZAR: 3400,
    additionalDays: 3,
    iconName: "CreditCard",
    popular: true,
  },
  // Analytics & Dashboards
  {
    id: "analytics_dash",
    categoryId: "analytics",
    categoryName: "Analytics & Control",
    title: "Interactive KPI Dashboard & Data Visualizations",
    shortDesc: "Executive analytics dashboard with Recharts visual charts, KPIs, and CSV exports.",
    technicalSpecs: "Custom dashboard widgets, responsive bar/pie/area charts, date range filtering, and one-click tabular data exports.",
    priceZAR: 3600,
    additionalDays: 3,
    iconName: "BarChart3",
    popular: true,
  },
  // Notifications & Outreach
  {
    id: "whatsapp_email_notif",
    categoryId: "core",
    categoryName: "Outreach & Alerts",
    title: "Automated WhatsApp & Email Alert System",
    shortDesc: "Real-time client dispatch alerts, quotation links, and transaction receipts.",
    technicalSpecs: "Deep-linked WhatsApp API endpoints, transactional HTML email templates, and automated webhook triggers.",
    priceZAR: 2400,
    additionalDays: 2,
    iconName: "Send",
    popular: true,
  },
  // Content & SEO
  {
    id: "cms_blog",
    categoryId: "content",
    categoryName: "SEO & Content",
    title: "Custom Blog Engine & Dynamic SEO Suite",
    shortDesc: "Rich markdown editor, OpenGraph social preview cards, and Google search schema.",
    technicalSpecs: "Slug-based dynamic routing, automated reading time estimation, tag filtering, and structured JSON-LD schema for Google bots.",
    priceZAR: 2900,
    additionalDays: 3,
    iconName: "FileText",
  },
  // Creative Animation
  {
    id: "promo_video",
    categoryId: "content",
    categoryName: "Creative Production",
    title: "60s 2D Animated Explainer / Product Promo Reel",
    shortDesc: "Custom-scripted 2D motion graphics video with sound design and brand styling.",
    technicalSpecs: "1080p full HD & vertical 9:16 reels, bespoke kinetic typography, vector character animation, licensed audio, and commercial license.",
    priceZAR: 4800,
    additionalDays: 5,
    iconName: "Video",
  },
  // Fast Track SLA
  {
    id: "fast_track_sla",
    categoryId: "velocity",
    categoryName: "Delivery Velocity",
    title: "Fast-Track Sprint Acceleration (50% Faster Delivery)",
    shortDesc: "Dedicated dual-developer sprint priority delivering the complete project in half the standard time.",
    technicalSpecs: "Direct daily Slack/WhatsApp standups, expedited code reviews, priority QA testing, and weekend sprint execution.",
    priceZAR: 4200,
    additionalDays: -7, // Accelerates delivery
    iconName: "Zap",
  },
];

export function calculateProjectEstimate(
  archetypeId: string,
  selectedModuleIds: string[],
  manualHoursSavedPerWeek: number = 7,
  monthlyClientInquiries: number = 30
): EstimateSummary {
  const archetype =
    PROJECT_ARCHETYPES.find((a) => a.id === archetypeId) || PROJECT_ARCHETYPES[0];

  const selectedModules = FEATURE_MODULES.filter((m) =>
    selectedModuleIds.includes(m.id)
  );

  const featuresPriceZAR = selectedModules.reduce((acc, m) => acc + m.priceZAR, 0);
  const totalPriceZAR = archetype.basePriceZAR + featuresPriceZAR;

  // 50% deposit schedule
  const depositAmountZAR = Math.round(totalPriceZAR * 0.5);
  const balanceAmountZAR = totalPriceZAR - depositAmountZAR;

  // Days calculation
  const additionalDaysTotal = selectedModules.reduce(
    (acc, m) => acc + m.additionalDays,
    0
  );
  const rawDays = archetype.baseDays + additionalDaysTotal;
  const isFastTrack = selectedModuleIds.includes("fast_track_sla");
  const totalDays = Math.max(5, isFastTrack ? Math.round(rawDays * 0.6) : rawDays);

  const sprintWeeks =
    totalDays <= 7
      ? "1 - 2 weeks"
      : totalDays <= 14
      ? "2 - 3 weeks"
      : totalDays <= 21
      ? "3 - 4 weeks"
      : "4 - 5 weeks";

  // Reference Code generation helper
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const referenceCode = `SH-EST-${randomNum}-26`;

  // ROI calculations
  // Average South African skilled staff hourly rate baseline: R350/hr
  const staffHourlyRateZAR = 350;
  const hoursSavedPerMonth = Math.round(manualHoursSavedPerWeek * 4.3);
  const estimatedLaborSavingsZAR = hoursSavedPerMonth * staffHourlyRateZAR;

  // Conversion lift benchmark based on feature sophistication
  let liftPct = 12;
  if (selectedModuleIds.includes("payfast_gateway")) liftPct += 8;
  if (selectedModuleIds.includes("gemini_ai")) liftPct += 10;
  if (selectedModuleIds.includes("whatsapp_email_notif")) liftPct += 6;
  if (selectedModuleIds.includes("promo_video")) liftPct += 7;

  // Payback period in months
  const monthlyImpactValue =
    estimatedLaborSavingsZAR + (monthlyClientInquiries * (liftPct / 100) * 850);
  const paybackMonths =
    monthlyImpactValue > 0
      ? Number((totalPriceZAR / monthlyImpactValue).toFixed(1))
      : 2.5;

  return {
    archetype,
    selectedModules,
    basePriceZAR: archetype.basePriceZAR,
    featuresPriceZAR,
    totalPriceZAR,
    depositAmountZAR,
    balanceAmountZAR,
    totalDays,
    sprintWeeks,
    fastTrackApplied: isFastTrack,
    referenceCode,
    roi: {
      hoursSavedPerMonth,
      estimatedLaborSavingsZAR,
      projectedConversionLiftPct: liftPct,
      paybackMonths: Math.max(0.8, paybackMonths),
    },
  };
}
