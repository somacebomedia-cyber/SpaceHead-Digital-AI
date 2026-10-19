import React, { useState, useMemo } from "react";
import {
  Check,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  Zap,
  Globe,
  MapPin,
  Mail,
  Clock,
  Wrench,
  Film,
} from "lucide-react";
import { CheckoutItem } from "./CheckoutBriefModal";
import { whatsappLinkWithMessage } from "../lib/contactInfo";

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  isMonthly?: boolean;
  icon: React.ReactNode;
  popular?: boolean;
}

const AVAILABLE_ADDONS: AddOn[] = [
  {
    id: "domain-dns",
    name: "Custom .co.za Domain & DNS Setup",
    description: "1-year domain registration, DNS records, and SSL security certificate configured.",
    price: 250,
    icon: <Globe className="w-4 h-4 text-indigo-500" />,
    popular: true,
  },
  {
    id: "google-maps-seo",
    name: "Google Maps & Business Profile Setup",
    description: "Official Google Business profile setup so local customers find you on Google Search & Maps.",
    price: 450,
    icon: <MapPin className="w-4 h-4 text-emerald-500" />,
    popular: true,
  },
  {
    id: "business-emails",
    name: "Branded Business Email Accounts (up to 3)",
    description: "Professional info@yourdomain.co.za inboxes configured for your phone and computer.",
    price: 350,
    icon: <Mail className="w-4 h-4 text-purple-500" />,
  },
  {
    id: "rush-delivery",
    name: "Express Priority Turnaround (5–7 Business Days)",
    description: "Jump to the front of our development queue for rapid launch without sacrificing quality.",
    price: 650,
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  {
    id: "extra-video-format",
    name: "Extra Video Aspect Ratio Cut",
    description: "Additional 9:16 portrait (Instagram Reels/TikTok) or 16:9 widescreen format export.",
    price: 250,
    icon: <Film className="w-4 h-4 text-rose-500" />,
  },
  {
    id: "ongoing-seo-care",
    name: "Monthly Content & SEO Maintenance",
    description: "Monthly updates to hours, photos, prices, text, plus continuous security backups.",
    price: 250,
    isMonthly: true,
    icon: <Wrench className="w-4 h-4 text-cyan-600" />,
    popular: true,
  },
];

interface BasePackageOption {
  id: string;
  title: string;
  description: string;
  setupPrice: number;
  monthlyPrice?: number;
  pricingMode: "installment" | "simple";
  depositAmount?: number;
  monthlyAmount?: number;
  installmentCount?: number;
}

const BASE_PACKAGE_OPTIONS: BasePackageOption[] = [
  {
    id: "web-design",
    title: "Premium Website Design",
    description: "Custom multi-page professional site tailored for local service businesses (R3,500 cash or R499/mo × 12).",
    setupPrice: 3500,
    pricingMode: "installment",
    depositAmount: 499,
    monthlyAmount: 499,
    installmentCount: 12,
  },
  {
    id: "video-ads",
    title: "AI Video Advert",
    description: "30-second high-impact promotional video sized for WhatsApp status & ads.",
    setupPrice: 499,
    pricingMode: "simple",
  },
  {
    id: "vibe-coding",
    title: "AI App Vibe Coding",
    description: "Custom online booking system, client intake tool, or internal workflow app (R8,999 cash or R1,499/mo × 12).",
    setupPrice: 8999,
    pricingMode: "installment",
    depositAmount: 1499,
    monthlyAmount: 1499,
    installmentCount: 12,
  },
  {
    id: "custom-only",
    title: "Add-ons & Specialized Work Only",
    description: "Select individual services or add-ons without a predefined primary package.",
    setupPrice: 0,
    pricingMode: "simple",
  },
];

interface PackageCustomizerProps {
  onSelectCheckout: (item: CheckoutItem) => void;
}

export default function PackageCustomizer({ onSelectCheckout }: PackageCustomizerProps) {
  const [selectedBaseId, setSelectedBaseId] = useState<string>("web-design");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    "domain-dns",
    "google-maps-seo",
  ]);

  const currentBase = useMemo(
    () => BASE_PACKAGE_OPTIONS.find((b) => b.id === selectedBaseId) || BASE_PACKAGE_OPTIONS[0],
    [selectedBaseId]
  );

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedAddons = useMemo(
    () => AVAILABLE_ADDONS.filter((addon) => selectedAddonIds.includes(addon.id)),
    [selectedAddonIds]
  );

  const { onceOffTotal, monthlyTotal, depositOptionTotal } = useMemo(() => {
    let onceOff = currentBase.setupPrice;
    let monthly = 0;

    selectedAddons.forEach((addon) => {
      if (addon.isMonthly) {
        monthly += addon.price;
      } else {
        onceOff += addon.price;
      }
    });

    let depositOption = 0;
    if (currentBase.pricingMode === "installment" && currentBase.depositAmount) {
      // Base deposit + once-off addons
      const onceOffAddons = selectedAddons
        .filter((a) => !a.isMonthly)
        .reduce((sum, a) => sum + a.price, 0);
      depositOption = currentBase.depositAmount + onceOffAddons;
    }

    return {
      onceOffTotal: onceOff,
      monthlyTotal: monthly,
      depositOptionTotal: depositOption,
    };
  }, [currentBase, selectedAddons]);

  const handleStartBrief = () => {
    const addonNames = selectedAddons.map(
      (a) => `${a.name} (${a.isMonthly ? `+R${a.price}/mo` : `+R${a.price} once-off`})`
    );

    const initialNotes = [
      `Customized Package Selection:`,
      `• Base Service: ${currentBase.title} (R${currentBase.setupPrice.toLocaleString("en-ZA")})`,
      selectedAddons.length > 0
        ? `• Selected Add-ons:\n  - ${addonNames.join("\n  - ")}`
        : `• No extra add-ons selected`,
      monthlyTotal > 0 ? `• Ongoing Monthly Services: R${monthlyTotal}/month` : "",
      `• Estimated Total Setup: R${onceOffTotal.toLocaleString("en-ZA")}`,
      `\nTell us about your business goals and any specific details:`,
    ]
      .filter(Boolean)
      .join("\n");

    const checkoutItem: CheckoutItem = {
      id: `custom-${currentBase.id}`,
      title: `${currentBase.title} (Customized)`,
      pricingMode: "simple",
      amount: onceOffTotal,
      briefPlaceholder: "Describe your business, requirements, and preferred timeline.",
      initialBrief: initialNotes,
    };

    onSelectCheckout(checkoutItem);
  };

  const whatsappInquiryUrl = useMemo(() => {
    const addonsSummary = selectedAddons.length
      ? selectedAddons.map((a) => `• ${a.name}`).join("\n")
      : "No additional add-ons";

    const text = [
      `Hi SpaceHead AI, I customized a package estimate on your website:`,
      `📦 Base: ${currentBase.title}`,
      `⚙️ Add-ons:\n${addonsSummary}`,
      `💰 Estimated Setup: R${onceOffTotal.toLocaleString("en-ZA")}${
        monthlyTotal > 0 ? ` + R${monthlyTotal}/mo maintenance` : ""
      }`,
      `Could we discuss this brief?`,
    ].join("\n");

    return whatsappLinkWithMessage(text);
  }, [currentBase, selectedAddons, onceOffTotal, monthlyTotal]);

  return (
    <div
      id="package-customizer"
      className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden space-y-8"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-mono font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Quote Builder</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          Customize Your Exact Digital Package
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Tailor your website or advert with the exact add-ons you need. Real-time pricing with transparent South African Rand rates and zero surprises.
        </p>
      </div>

      {/* Step 1: Base Package Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Choose Your Primary Foundation</span>
          </label>
          <span className="text-[11px] text-slate-400">All prices include VAT / Net</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BASE_PACKAGE_OPTIONS.map((pkg) => {
            const isSelected = selectedBaseId === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedBaseId(pkg.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs sm:text-sm text-slate-900">
                      {pkg.title}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{pkg.description}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Base:</span>
                  <span className="font-display font-extrabold text-sm text-slate-900">
                    {pkg.setupPrice === 0 ? "R0" : `R${pkg.setupPrice.toLocaleString("en-ZA")}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Add-ons Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Select Optional Add-ons & Essentials</span>
          </label>
          <span className="text-[11px] text-slate-500">
            {selectedAddonIds.length} add-on{selectedAddonIds.length === 1 ? "" : "s"} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_ADDONS.map((addon) => {
            const isChecked = selectedAddonIds.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  isChecked
                    ? "border-indigo-500 bg-indigo-50/20 shadow-sm"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200/60">
                        {addon.icon}
                      </div>
                      <span className="font-bold text-xs text-slate-900 leading-tight">
                        {addon.name}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isChecked
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{addon.description}</p>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                  {addon.popular ? (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200/60">
                      Popular
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Optional</span>
                  )}
                  <span className="text-xs font-mono font-bold text-indigo-700">
                    +R{addon.price.toLocaleString("en-ZA")}
                    {addon.isMonthly ? "/mo" : " once-off"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Real-Time Total & Action Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/60 font-bold">
              Summary Estimate
            </span>
            <span className="text-xs text-slate-400 font-medium">· Instant Quote Lock</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-300">Total Setup:</span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                R{onceOffTotal.toLocaleString("en-ZA")}
              </span>
            </div>

            {monthlyTotal > 0 && (
              <div className="flex items-baseline gap-1 text-emerald-400 text-xs sm:text-sm font-semibold">
                <span>+ R{monthlyTotal}/month recurring care</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Includes <strong className="text-slate-200">{currentBase.title}</strong>
            {selectedAddons.length > 0 && (
              <>
                {" "}
                plus{" "}
                <strong className="text-slate-200">
                  {selectedAddons.length} customized add-on{selectedAddons.length === 1 ? "" : "s"}
                </strong>
              </>
            )}
            . We'll send you a link to set up your R199/month hosting & maintenance. It isn't charged automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleStartBrief}
            className="btn-signature inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span>Lock In Quote & Submit Brief</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors border border-slate-700/80 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Through This Quote on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
