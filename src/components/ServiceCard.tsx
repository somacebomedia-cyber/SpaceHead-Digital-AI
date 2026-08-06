import React from "react";
import { ArrowRight, CreditCard } from "lucide-react";

export interface ServiceCardData {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  price: string;
  originalPrice?: string;
  period: string;
  features: string[];
  /** Path to the cinematic background image, e.g. "/images/cards/web-design.jpg".
   *  Leave empty and the card falls back to a starfield gradient in the
   *  service's accent color, so the layout still looks intentional pre-launch. */
  image?: string;
  accent: "indigo" | "purple" | "emerald";
  featured?: boolean;
  amountRands?: number;
}

const ACCENTS = {
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
} as const;

export interface ServiceCardProps {
  key?: string;
  data: ServiceCardData;
  ctaLabel: string;
  onCta: () => void;
  onPayfastPay?: () => void;
}

export default function ServiceCard({ data, ctaLabel, onCta, onPayfastPay }: ServiceCardProps) {
  const a = ACCENTS[data.accent];

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] aspect-[3/4] flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_36px_64px_-20px_rgba(15,23,42,0.5)] transition-all duration-500 hover:-translate-y-1.5 group ${
        data.featured ? `ring-2 ${a.ring} ring-offset-2 ring-offset-slate-50` : ""
      }`}
    >
      {/* Cinematic background — swap in the real image once generated; graceful starfield fallback until then */}
      {data.image ? (
        <img
          src={data.image}
          alt=""
          loading="lazy"
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

      {/* Legibility scrim — dark at the base so text stays readable, clear toward the top so the art breathes */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

      {/* Top: eyebrow badge, frosted glass on the image */}
      <div className="relative z-10 p-6 sm:p-7 flex items-center justify-between">
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
      <div className="relative z-10 p-6 sm:p-7 space-y-3">
        <h3 className="font-display font-extrabold text-white text-xl sm:text-2xl leading-tight tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
          {data.title}
        </h3>
        <p className="text-xs text-white/85 leading-relaxed [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
          {data.description}
        </p>
        <p className="text-[10px] text-white/60 font-mono uppercase tracking-wide">
          {data.features.slice(0, 2).join("  ·  ")}
        </p>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-display font-black text-white">{data.price}</span>
          {data.originalPrice && (
            <span className="text-[11px] line-through text-white/50 font-mono tracking-wide">
              {data.originalPrice}
            </span>
          )}
          <span className="text-[10px] text-white/70 font-mono">/ {data.period}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={onCta}
            className={`w-full flex items-center justify-center space-x-1 px-4 py-2.5 ${a.button} rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer`}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {onPayfastPay && (
            <button
              onClick={onPayfastPay}
              className="w-full flex items-center justify-center space-x-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payfast</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

