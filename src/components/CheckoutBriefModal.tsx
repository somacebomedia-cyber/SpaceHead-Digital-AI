import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { initiatePayfastPayment } from "../lib/payfastClient";
import { whatsappLinkWithMessage } from "../lib/contactInfo";
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Loader2,
  MessageCircle,
} from "lucide-react";
import {
  WEBSITE_PRICING,
  WEBSITE_MONTHLY_TOTAL,
  FORMATTED_WEBSITE_PRICING,
  WEBSITE_PRICING_COPY,
  WEBSITE_PLAN_IDS,
} from "../lib/websitePricing";
import {
  VIBE_CODING_PRICING,
  VIBE_CODING_MONTHLY_TOTAL,
  FORMATTED_VIBE_CODING_PRICING,
  VIBE_CODING_PRICING_COPY,
  VIBE_CODING_PLAN_IDS,
} from "../lib/vibeCodingPricing";

export interface CheckoutItem {
  id: string;
  title: string;
  pricingMode: "installment" | "simple";
  /** installment details */
  fullAmount?: number;
  depositAmount?: number;
  monthlyAmount?: number;
  installmentCount?: number;
  cashAmount?: number;
  cashSavingsLabel?: string;
  installmentFormula?: string;
  installmentTotal?: number;
  hostingFee?: number;
  hostingNote?: string;
  /** simple */
  amount?: number;
  briefPlaceholder?: string;
  initialBrief?: string;
}

interface CheckoutBriefModalProps {
  item: CheckoutItem;
  onClose: () => void;
}

const inputClass =
  "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400";

function formatRands(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
}

/** First automatic recurring charge date, one calendar month from today, as YYYY-MM-DD (what Payfast expects). */
function oneMonthFromToday(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export default function CheckoutBriefModal({ item, onClose }: CheckoutBriefModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [brief, setBrief] = useState(item.initialBrief || "");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !brief.trim()) {
      setSubmitError("Please fill in your name, email, WhatsApp/phone number, and a short brief.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const code = `SH-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear().toString().substring(2)}`;
    const record = {
      serviceId: item.id,
      serviceTitle: item.title,
      name: name.trim(),
      businessName: businessName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      brief: brief.trim(),
      referenceCode: code,
      createdAt: new Date().toISOString(),
      status: "New",
    };

    let savedToFirestore = false;
    if (db) {
      try {
        const addDocPromise = addDoc(collection(db, "project_briefs"), record);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Firestore write timeout")), 3000)
        );
        await Promise.race([addDocPromise, timeoutPromise]);
        savedToFirestore = true;
      } catch (fsErr) {
        console.warn("Firestore brief submission warning, using local storage fallback:", fsErr);
      }
    }

    if (!savedToFirestore) {
      try {
        const current = JSON.parse(localStorage.getItem("project_briefs") || "[]");
        current.push(record);
        localStorage.setItem("project_briefs", JSON.stringify(current));
      } catch (lsErr) {
        console.warn("Local storage fallback also failed:", lsErr);
      }
    }

    setReferenceCode(code);
    setSubmitting(false);
  };

  const runCheckout = async (options: {
    planId?: string;
    amountRands?: number;
    planLabel?: string;
    recurring?: { billingDate: string; recurringAmountRands: number; cycles: number };
  }) => {
    setPaying(true);
    setPayError(null);
    try {
      const parts = name.trim().split(/\s+/);
      const firstName = parts[0] || "Customer";
      const lastName = parts.slice(1).join(" ") || firstName;

      await initiatePayfastPayment({
        planId: options.planId,
        amountRands: options.amountRands,
        itemName: options.planId ? undefined : `${item.title} — ${options.planLabel || "Payment"}`,
        itemDescription: brief.trim().slice(0, 200),
        paymentId: referenceCode || undefined,
        returnPath: "/services",
        cancelPath: "/services",
        customStr1: options.planId || item.id,
        customStr2: referenceCode || undefined,
        email: email.trim(),
        firstName,
        lastName,
        cellNumber: phone.trim() || undefined,
        recurring: options.recurring,
      });
      // On success the browser navigates to Payfast — nothing left to do here.
    } catch (err) {
      console.error("Payfast checkout error:", err);
      setPayError("Couldn't start checkout just now. Please try again, or message us on WhatsApp below.");
      setPaying(false);
    }
  };

  const whatsappHref = whatsappLinkWithMessage(
    `Hi, I'd like to talk about ${item.title} before paying online. My reference is ${referenceCode || "not generated yet"}.`
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl p-6 sm:p-7 space-y-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pr-8">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600">
            {item.title}
          </span>
          <h3 className="font-display font-extrabold text-slate-900 text-xl leading-tight">
            {referenceCode ? "Thanks — we've got your brief" : "Tell us a bit about your project"}
          </h3>
          {!referenceCode && (
            <p className="text-xs text-slate-500">
              No payment yet — just tell us what you need first. It takes a minute.
            </p>
          )}
        </div>

        {!referenceCode ? (
          <form onSubmit={handleSubmitBrief} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-semibold">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="brief-name" className="text-xs font-semibold text-slate-700 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="brief-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Thandeka Mkhize"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="brief-business" className="text-xs font-semibold text-slate-700 block">
                  Business Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="brief-business"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Mkhize Family Practice"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="brief-email" className="text-xs font-semibold text-slate-700 block">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="brief-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. you@example.co.za"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="brief-phone" className="text-xs font-semibold text-slate-700 block">
                  WhatsApp / Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  id="brief-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 079 448 6843"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="brief-notes" className="text-xs font-semibold text-slate-700 block">
                What do you need? <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="brief-notes"
                required
                rows={4}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={item.briefPlaceholder || "Tell us what you need, including your business name and any specific requirements."}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                We only use these details to get back to you about your project. We won't share or sell your information to anyone.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-signature w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Continue</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start space-x-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Your reference number is{" "}
                  <span className="font-mono font-bold text-slate-900">{referenceCode}</span>. Save it in
                  case you need to follow up.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">What happens next:</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>We'll go through what you've shared, usually within 1 business day.</li>
                <li>We'll confirm the details with you on WhatsApp or a quick call before any work starts.</li>
                <li>Once confirmed, your build begins.</li>
              </ol>
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-slate-800">Ready to pay?</p>

              {payError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-semibold">
                  {payError}
                </div>
              )}

              {item.id === "web-design" ? (
                <div className="space-y-3">
                  {/* Upfront Cash Option */}
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline flex-wrap gap-2">
                        <span className="font-display font-extrabold text-slate-900 text-base">
                          {FORMATTED_WEBSITE_PRICING.cashPrice}
                        </span>
                        <span className="line-through text-slate-400 text-xs font-semibold tabular-nums">
                          {FORMATTED_WEBSITE_PRICING.monthlyTotal}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          on the monthly plan
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                        {WEBSITE_PRICING_COPY.savingsBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => runCheckout({ planId: WEBSITE_PLAN_IDS.CASH })}
                      disabled={paying}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>Pay Upfront Cash — {FORMATTED_WEBSITE_PRICING.cashPrice}</span>
                    </button>

                    <p className="text-[10.5px] text-emerald-900 font-medium text-center leading-snug">
                      {WEBSITE_PRICING_COPY.upfrontBox}
                    </p>
                  </div>

                  {/* 12-Month Plan Option */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                        12-Month Plan
                      </span>
                      <span className="text-xs font-display font-bold text-slate-800 tracking-tight">
                        {WEBSITE_PRICING_COPY.monthlyRow}
                      </span>
                    </div>

                    <button
                      onClick={() => runCheckout({ planId: WEBSITE_PLAN_IDS.MONTHLY })}
                      disabled={paying}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>Pay First Month — {FORMATTED_WEBSITE_PRICING.monthlyPrice}</span>
                    </button>

                    <p className="text-[10px] text-slate-500 text-center leading-snug">
                      {WEBSITE_PRICING_COPY.monthlyInclusionNotice}
                    </p>
                  </div>

                  {/* Hosting Notice near plans */}
                  <p className="text-[10.5px] text-slate-500 text-center pt-0.5 leading-snug">
                    {WEBSITE_PRICING_COPY.hostingNotice}
                  </p>
                </div>
              ) : item.id === "vibe-coding" ? (
                <div className="space-y-3">
                  {/* Upfront Cash Option */}
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline flex-wrap gap-2">
                        <span className="font-display font-extrabold text-slate-900 text-base">
                          {FORMATTED_VIBE_CODING_PRICING.cashPrice}
                        </span>
                        <span className="line-through text-slate-400 text-xs font-semibold tabular-nums">
                          {FORMATTED_VIBE_CODING_PRICING.monthlyTotal}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          on the monthly plan
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                        {VIBE_CODING_PRICING_COPY.savingsBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => runCheckout({ planId: VIBE_CODING_PLAN_IDS.CASH })}
                      disabled={paying}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>Pay Upfront Cash — {FORMATTED_VIBE_CODING_PRICING.cashPrice}</span>
                    </button>

                    <p className="text-[10.5px] text-emerald-900 font-medium text-center leading-snug">
                      {VIBE_CODING_PRICING_COPY.upfrontBox}
                    </p>
                  </div>

                  {/* 12-Month Plan Option */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                        12-Month Plan
                      </span>
                      <span className="text-xs font-display font-bold text-slate-800 tracking-tight">
                        {VIBE_CODING_PRICING_COPY.monthlyRow}
                      </span>
                    </div>

                    <button
                      onClick={() => runCheckout({ planId: VIBE_CODING_PLAN_IDS.MONTHLY })}
                      disabled={paying}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>Pay First Month — {FORMATTED_VIBE_CODING_PRICING.monthlyPrice}</span>
                    </button>

                    <p className="text-[10px] text-slate-500 text-center leading-snug">
                      {VIBE_CODING_PRICING_COPY.monthlyInclusionNotice}
                    </p>
                  </div>

                  {/* Maintenance Notice near plans */}
                  <p className="text-[10.5px] text-slate-500 text-center pt-0.5 leading-snug">
                    {VIBE_CODING_PRICING_COPY.hostingNotice}
                  </p>
                </div>
              ) : item.pricingMode === "installment" ? (
                item.installmentFormula ? (
                  <div className="space-y-3">
                    {/* Upfront Cash Option */}
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                          {item.cashSavingsLabel || "Pay upfront cash only"}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-bold">
                          Best Value
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          runCheckout({
                            amountRands: item.cashAmount || item.fullAmount || 0,
                            planLabel: "Upfront Cash Deal",
                          })
                        }
                        disabled={paying}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        <span>Pay Upfront Cash — {formatRands(item.cashAmount || item.fullAmount || 0)}</span>
                      </button>
                      <p className="text-[10px] text-emerald-800 text-center leading-snug">
                        One single payment of {formatRands(item.cashAmount || item.fullAmount || 0)}. {item.cashSavingsLabel ? `${item.cashSavingsLabel} instantly.` : "Paid once-off in full."}
                      </p>
                    </div>

                    {/* 12-Month Plan Option */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                          12-Month Payment Plan
                        </span>
                        <span className="text-[10.5px] font-mono text-slate-700 font-bold tabular-nums">
                          {item.installmentFormula}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          runCheckout({
                            amountRands: item.monthlyAmount || 0,
                            planLabel: "12-Month Plan (Month 1)",
                            recurring: {
                              billingDate: oneMonthFromToday(),
                              recurringAmountRands: item.monthlyAmount || 0,
                              cycles: item.installmentCount || 12,
                            },
                          })
                        }
                        disabled={paying}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        <span>Pay First Month — {formatRands(item.monthlyAmount || 0)}</span>
                      </button>
                      <p className="text-[10px] text-slate-500 text-center leading-snug">
                        {item.installmentFormula} — charged automatically each month via Payfast. Cancel anytime with 30-day notice.
                      </p>
                    </div>

                    <p className="text-[10.5px] text-slate-400 text-center pt-0.5">
                      {item.hostingNote || (item.hostingFee ? `R${item.hostingFee}/month hosting and maintenance starts on month 13 onwards.` : "Maintenance & care starts on month 13 onwards.")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() =>
                        runCheckout({
                          amountRands: item.depositAmount || 0,
                          planLabel: "Deposit",
                          recurring: {
                            billingDate: oneMonthFromToday(),
                            recurringAmountRands: item.monthlyAmount || 0,
                            cycles: item.installmentCount || 0,
                          },
                        })
                      }
                      disabled={paying}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>Pay Deposit — {formatRands(item.depositAmount || 0)}</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                      Then {formatRands(item.monthlyAmount || 0)}/month for {item.installmentCount} months —
                      charged automatically via Payfast, no need to do anything. Same total either way:{" "}
                      {formatRands(item.fullAmount || 0)}.
                    </p>
                    <button
                      onClick={() =>
                        runCheckout({
                          amountRands: item.fullAmount || 0,
                          planLabel: "Paid In Full",
                        })
                      }
                      disabled={paying}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      <span>Or Pay In Full — {formatRands(item.fullAmount || 0)}</span>
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={() =>
                    runCheckout({
                      amountRands: item.amount || 0,
                      planLabel: "Full Payment",
                    })
                  }
                  disabled={paying}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  <span>Pay {formatRands(item.amount || 0)} via Payfast</span>
                </button>
              )}
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors pt-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Prefer to talk it through first? Message us on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
