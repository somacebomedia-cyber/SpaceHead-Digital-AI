import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  ShieldCheck,
  Zap,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";

interface FAQItemData {
  q: string;
  a: string;
  category: "Billing & Payment" | "Ownership & Hosting" | "Turnaround & Delivery" | "Process & Content";
}

const FAQ_DATABASE: FAQItemData[] = [
  {
    q: "Who owns the website, domain, and source code once the build is finished?",
    a: "You own 100% of your website, code, custom graphics, and domain outright. We never hold your digital assets hostage or charge exit fees. If you ever decide to move or host elsewhere, we provide full exports and transfer authorization immediately without friction.",
    category: "Ownership & Hosting",
  },
  {
    q: "How do the 12-month payment plans and upfront cash savings work?",
    a: "We keep our pricing completely transparent. For our custom website builds, you can pay upfront: R3,500 once-off, then R199/month hosting & maintenance (saving R2,488 compared to the monthly plan). Or choose the 12-month plan: R499/month for 12 months (R5,988 in total), then R199/month hosting & maintenance. Hosting & maintenance is included in the R499 while the 12 payments run. We'll send you a link to set up your R199/month hosting & maintenance. It isn't charged automatically. For custom AI web apps, you can pay upfront: R8,999 once-off, then maintenance & cloud care (saving R8,989 compared to the monthly plan). Or choose the 12-month plan: R1,499/month for 12 months (R17,988 in total), then maintenance & cloud care. Maintenance & cloud care is included in the R1,499 while the 12 payments run. We'll send you a link to set up your maintenance & cloud care. It isn't charged automatically. There are no surprise finance fees, no fake countdowns, and no artificial spot limits.",
    category: "Billing & Payment",
  },
  {
    q: "How long does it take from initial brief to live launch?",
    a: "Standard custom websites are delivered in 10 to 14 business days. AI video adverts take 3 to 5 business days. Custom vibe coding web applications take 2 to 4 weeks depending on workflow complexity. We keep you updated at every milestone via WhatsApp or email with live staging previews.",
    category: "Turnaround & Delivery",
  },
  {
    q: "What payment methods are supported via Payfast?",
    a: "Payfast is South Africa's premier payment gateway. It supports Visa, Mastercard, Instant EFT from all major SA banks (Capitec, FNB, Standard Bank, Absa, Nedbank, TymeBank, Discovery Bank, Investec), and debit cards. All payments are processed securely in ZAR with end-to-end encryption.",
    category: "Billing & Payment",
  },
  {
    q: "What happens with hosting and maintenance after my site goes live?",
    a: "For the 12-month plan (R499/month x 12 = R5,988), hosting & maintenance is included while the 12 payments run, then R199/month hosting & maintenance. For upfront purchases (R3,500 once-off), hosting & maintenance is R199/month. We'll send you a link to set up your R199/month hosting & maintenance. It isn't charged automatically.",
    category: "Ownership & Hosting",
  },
  {
    q: "Can I update the website myself once it's completed?",
    a: "Yes! We can set up intuitive content management so you or your receptionist can update text, services, and photos. Alternatively, you can select our R250/mo Content Care maintenance or message us on WhatsApp whenever you need updates done for you.",
    category: "Process & Content",
  },
  {
    q: "What if I don't have professional photos, a logo, or written copy yet?",
    a: "That's completely fine! We assist with writing clear, benefit-driven copy tailored to your clients, source high-resolution licensed stock photography, and can create a custom vector logo or corporate stationery for a flat R499 fee.",
    category: "Process & Content",
  },
  {
    q: "What is 'AI App Vibe Coding' and how does it help my business?",
    a: "A website tells people about your business; a custom vibe-coded app does work for your business. Examples include an online booking portal, a patient intake questionnaire, an automated quote generator, or a client document uploader that saves you hours of repetitive telephone and WhatsApp paperwork.",
    category: "Process & Content",
  },
  {
    q: "Can you help me set up Google Search, Google Maps, and business email?",
    a: "Yes! You can select our 'Google Maps & Business Profile Setup' and 'Branded Business Email Accounts' add-ons in the customizer above. We will verify your location on Google Maps, set up your localized SEO tags, and configure your info@company.co.za inboxes on your mobile phones.",
    category: "Turnaround & Delivery",
  },
];

export default function ServicesFAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // First item open by default

  const categories = [
    "All",
    "Billing & Payment",
    "Ownership & Hosting",
    "Turnaround & Delivery",
    "Process & Content",
  ];

  const filteredFAQs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      const qLower = item.q.toLowerCase();
      const aLower = item.a.toLowerCase();
      const sLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || qLower.includes(sLower) || aLower.includes(sLower);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pt-4 font-sans">
      {/* Trust & Guarantee Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-[24px] p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>The SpaceHead Confidence Guarantee</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
            Work with Total Peace of Mind
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-indigo-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Milestone Previews</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                You test and review your working website on a private preview link before it ever goes live to the public.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-emerald-300">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold text-white">100% Asset Ownership</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All code, graphics, domain credentials, and assets belong exclusively to your business. No lock-ins.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-amber-300">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Direct WhatsApp Access</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Communicate directly with the real developers building your site — no ticket queues or automated call centers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Everything you need to know about our workflow, payment protection, hosting, and turnaround times.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. deposit, domain)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`text-[10.5px] font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-sans text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 focus:outline-none transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="leading-snug">{faq.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-fade-in font-sans">
                    <p>{faq.a}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100/60">
                      <span>Category: {faq.category}</span>
                      <span className="text-indigo-600 font-semibold">SpaceHead Verified</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-xs text-slate-400 space-y-1">
            <HelpCircle className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No questions found matching "{searchQuery}"</p>
            <p>Try searching for a different keyword or reset the category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
