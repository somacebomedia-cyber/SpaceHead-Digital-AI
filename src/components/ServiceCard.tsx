import React from "react";
import { ArrowRight, CreditCard, ExternalLink } from "lucide-react";
import { ServiceDefinition, Accent } from "../data/services";
import { FORMATTED_WEBSITE_PRICING, WEBSITE_PRICING_COPY } from "../lib/websitePricing";
import { FORMATTED_VIBE_CODING_PRICING, VIBE_CODING_PRICING_COPY } from "../lib/vibeCodingPricing";

export type ServiceCardData = ServiceDefinition;

const ACCENTS: Record<
  Accent,
  {
    fallback: string;
    glow: string;
    badge: string;
    button: string;
    ring: string;
  }
> = {
  indigo: {
    fallback: "from-indigo-950 via-indigo-900 to-slate-950",
    glow: "bg-indigo-500/30",
    badge: "bg-white/10 border-white/20 text-white",
    button: "bg-indigo-600 hover:bg-indigo-500 text-white",
    ring: "ring-indigo-400/70",
  },
  purple: {
    fallback: "from-purple-950 via-purple-900 to-slate-950",
    glow: "bg-purple-500/30",
    badge: "bg-white/10 border-white/20 text-white",
    button: "bg-purple-600 hover:bg-purple-500 text-white",
    ring: "ring-purple-400/70",
  },
  emerald: {
    fallback: "from-emerald-950 via-emerald-900 to-slate-950",
    glow: "bg-emerald-500/30",
    badge: "bg-white/10 border-white/20 text-white",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
    ring: "ring-emerald-400/70",
  },
};

export interface ServiceCardProps {
  key?: string;
  data: ServiceDefinition;
  ctaLabel: string;
  onCta: () => void;
  onPayfastPay?: () => void;
}

export default function ServiceCard({ data, ctaLabel, onCta, onPayfastPay }: ServiceCardProps) {
  const a = ACCENTS[data.accent] || ACCENTS.indigo;

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[32px] min-h-[500px] sm:min-h-[540px] h-full flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_36px_64px_-20px_rgba(15,23,42,0.5)] transition-all duration-500 hover:-translate-y-1.5 group ${
        data.featured ? `ring-2 ${a.ring} ring-offset-2 ring-offset-slate-50` : ""
      }`}
    >
      {/* Cinematic background */}
      {data.image ? (
        <img
          src={data.image}
          alt={data.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${a.fallback}`}>
          <div className={`absolute top-10 right-10 w-40 h-40 ${a.glow} rounded-full blur-3xl animate-pulse-slow`} />
          <span className="absolute top-10 left-10 w-1 h-1 rounded-full bg-white/70 animate-twinkle-1" />
          <span className="absolute top-20 right-16 w-1.5 h-1.5 rounded-full bg-white/60 animate-twinkle-2" />
          <span className="absolute bottom-1/3 left-14 w-1 h-1 rounded-full bg-white/50 animate-twinkle-1" />
          <span className="absolute bottom-1/4 right-1/3 w-1 h-1 rounded-full bg-white/40 animate-twinkle-2" />
        </div>
      )}

      {/* Legibility scrim — dark at the base so text stays readable, clear toward the top */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

      {/* Top: eyebrow badge, frosted glass on the image */}
      <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border ${a.badge}`}
        >
          {data.badge}
        </span>
        {onPayfastPay && (
          <button
            onClick={onPayfastPay}
            title="Instant Payfast Checkout"
            className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all cursor-pointer"
          >
            <CreditCard className="w-3 h-3" />
            <span>Payfast</span>
          </button>
        )}
      </div>

      {/* Bottom: title, price, CTA — sits inside the scrim zone so it's legible over any image */}
      <div className="relative z-10 p-5 sm:p-6 pt-8 space-y-3 mt-auto">
        <h3 className="font-display font-extrabold text-white text-lg sm:text-xl leading-tight tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
          {data.title}
        </h3>
        <p className="text-xs text-white/85 leading-relaxed [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
          {data.description}
        </p>
        <p className="text-[10px] text-white/60 font-mono tracking-wide">
          {data.features.slice(0, 2).join("  ·  ")}
        </p>

        {data.liveExampleUrl && (
          <div className="pt-0.5">
            <a
              href={data.liveExampleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center space-x-1 text-xs text-indigo-300 hover:text-white underline font-semibold transition-colors"
            >
              <span>{data.liveExampleLabel || "See a real site we built →"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {data.id === "web-design" ? (
          <div className="space-y-2 pt-2 border-t border-white/10 text-left">
            {/* 12-Month Plan Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider">12-Month Plan</span>
              <span className="text-xs sm:text-sm font-display font-extrabold text-white tracking-tight">
                {WEBSITE_PRICING_COPY.monthlyRow}
              </span>
            </div>

            {/* Upfront Cash Box */}
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-baseline flex-wrap gap-1.5">
                  <span className="font-display font-black text-white text-base">
                    {FORMATTED_WEBSITE_PRICING.cashPrice}
                  </span>
                  <span className="line-through text-white/60 text-xs font-semibold tabular-nums">
                    {FORMATTED_WEBSITE_PRICING.monthlyTotal}
                  </span>
                  <span className="text-[10px] text-white/60 font-mono">
                    on the monthly plan
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300 font-medium leading-snug">
                  {WEBSITE_PRICING_COPY.upfrontBox}
                </p>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                {WEBSITE_PRICING_COPY.savingsBadge}
              </span>
            </div>

            {/* Hosting & maintenance note */}
            <p className="text-[10px] text-white/70 font-sans leading-snug">
              {WEBSITE_PRICING_COPY.hostingNotice}
            </p>
          </div>
        ) : data.id === "vibe-coding" ? (
          <div className="space-y-2 pt-2 border-t border-white/10 text-left">
            {/* 12-Month Plan Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider">12-Month Plan</span>
              <span className="text-xs sm:text-sm font-display font-extrabold text-white tracking-tight">
                {VIBE_CODING_PRICING_COPY.monthlyRow}
              </span>
            </div>

            {/* Upfront Cash Box */}
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-baseline flex-wrap gap-1.5">
                  <span className="font-display font-black text-white text-base">
                    {FORMATTED_VIBE_CODING_PRICING.cashPrice}
                  </span>
                  <span className="line-through text-white/60 text-xs font-semibold tabular-nums">
                    {FORMATTED_VIBE_CODING_PRICING.monthlyTotal}
                  </span>
                  <span className="text-[10px] text-white/60 font-mono">
                    on the monthly plan
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300 font-medium leading-snug">
                  {VIBE_CODING_PRICING_COPY.upfrontBox}
                </p>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                {VIBE_CODING_PRICING_COPY.savingsBadge}
              </span>
            </div>

            {/* Maintenance note */}
            <p className="text-[10px] text-white/70 font-sans leading-snug">
              {VIBE_CODING_PRICING_COPY.hostingNotice}
            </p>
          </div>
        ) : data.installmentFormula ? (
          <div className="space-y-2 pt-2 border-t border-white/10">
            {/* Installment Plan displayed plainly */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider">12-Month Plan</span>
              <span className="text-sm sm:text-base font-display font-extrabold text-white tabular-nums tracking-tight">
                {data.installmentFormula}
              </span>
            </div>

            {/* Cash Deal with upfront savings */}
            <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  {data.cashSavingsLabel || "Pay upfront cash only"}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-display font-black text-white text-base">{data.price}</span>
                  <span className="text-[10px] text-white/70 font-mono">once-off cash only</span>
                </div>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                {data.cashSavingsBadge || "Save with cash"}
              </span>
            </div>

            {/* Ongoing hosting & maintenance disclosure */}
            <p className="text-[10px] text-white/70 font-sans leading-snug">
              {data.hostingNote || (data.ongoingHostingFee ? `R${data.ongoingHostingFee}/month hosting and maintenance starts on month 13 onwards.` : "Maintenance & care starts on month 13 onwards.")}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline gap-1.5 pt-1">
            <span className="text-xl sm:text-2xl font-display font-black text-white">{data.price}</span>
            <span className="text-[11px] text-white/75 font-mono">{data.priceSuffix}</span>
          </div>
        )}

        <div className={`grid ${onPayfastPay ? "grid-cols-2" : "grid-cols-1"} gap-2 pt-2`}>
          <button
            onClick={onCta}
            className={`w-full flex items-center justify-center space-x-1 px-3 sm:px-4 py-2.5 ${a.button} rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer`}
          >
            <span className="truncate">{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
          {onPayfastPay && (
            <button
              onClick={onPayfastPay}
              className="w-full flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Payfast</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
