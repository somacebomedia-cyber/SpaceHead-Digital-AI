import React, { useState, useEffect, useTransition, useDeferredValue, useMemo } from "react";
import SEO, { DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA } from "./SEO";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Calculator,
  Sparkles,
} from "lucide-react";
import ServiceCard from "./ServiceCard";
import CheckoutBriefModal, { CheckoutItem } from "./CheckoutBriefModal";
import PackageCustomizer from "./PackageCustomizer";
import ServicesFAQ from "./ServicesFAQ";
import TestimonialsStrip from "./TestimonialsStrip";
import { SERVICES, ServiceDefinition } from "../data/services";

interface ServicesPageProps {
  onTabChange: (tab: string) => void;
}

const CAPABILITIES_DATABASE = [
  { name: "Custom Website Design", cat: "Web Development" },
  { name: "Simple Landing Pages", cat: "Web Development" },
  { name: "Mobile-Friendly Layouts", cat: "Web Development" },
  { name: "Google Search & Maps Setup", cat: "Web Development" },
  { name: "Social Media Video Ads", cat: "Animated Videos" },
  { name: "Animated Logo Reveals", cat: "Animated Videos" },
  { name: "Facebook & TikTok Video Ads", cat: "Animated Videos" },
  { name: "3D Product Showcase Videos", cat: "Animated Videos" },
  { name: "Business Cards & Stationery", cat: "Graphic Design" },
  { name: "Logo Design", cat: "Graphic Design" },
  { name: "Posters & Flyers", cat: "Graphic Design" },
  { name: "Website Hosting & Support", cat: "Hosting & Support" },
];

const FLAT_FEE_ITEMS = [
  { id: "flat-logo", name: "Professional Logo Concept", desc: "Sleek tailored vector files" },
  { id: "flat-poster", name: "Printable Marketing Poster", desc: "High-contrast creative formats" },
  { id: "flat-card", name: "Bespoke Business Card Design", desc: "Premium corporate print layouts" },
  { id: "flat-doc", name: "Business Document Design", desc: "Professional letterheads, layouts & proposals" },
  { id: "flat-flyer", name: "Localized Social Media Flyer", desc: "Prepped for digital ad feeds" },
  { id: "flat-menu", name: "Custom Digital Menu Card", desc: "Responsive visual layouts" },
  { id: "flat-email", name: "Email Signature Design", desc: "Modern clickable HTML signature designs" },
  { id: "flat-cover", name: "Social Media Cover Banner", desc: "Cohesive multi-platform branding banners" },
];

function toCheckoutItem(service: ServiceDefinition): CheckoutItem {
  return {
    id: service.id,
    title: service.title,
    pricingMode: service.pricingMode,
    fullAmount: service.fullAmount,
    depositAmount: service.depositAmount,
    monthlyAmount: service.monthlyAmount,
    installmentCount: service.installmentCount,
    cashAmount: service.cashAmount,
    cashSavingsLabel: service.cashSavingsLabel,
    installmentFormula: service.installmentFormula,
    installmentTotal: service.installmentTotal,
    hostingFee: service.ongoingHostingFee,
    hostingNote: service.hostingNote,
    amount: service.amount,
    briefPlaceholder: service.briefPlaceholder,
  };
}

export default function ServicesPage({ onTabChange }: ServicesPageProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isObscureExpanded, setIsObscureExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    outcome: "success" | "cancelled" | "failed";
    message: string;
  } | null>(null);

  // The single onboarding gate: every paid item — bespoke or flat-fee —
  // opens this modal first so we always know what the client actually
  // needs before any money changes hands.
  const [briefItem, setBriefItem] = useState<CheckoutItem | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isCallback = urlParams.get("payment") === "payfast";
      const outcome = urlParams.get("outcome");

      if (isCallback && outcome) {
        if (outcome === "success") {
          setPaymentStatus({
            outcome: "success",
            message: "Payment received — thank you! We'll be in touch shortly to confirm the details and get started.",
          });
        } else if (outcome === "cancelled") {
          setPaymentStatus({
            outcome: "cancelled",
            message: "Payment was cancelled. No charge was made — you're welcome to try again whenever you're ready.",
          });
        } else {
          setPaymentStatus({
            outcome: "failed",
            message: "The payment couldn't be processed. Please try again, or message us on WhatsApp and we'll sort it out.",
          });
        }
      }
    }
  }, []);

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredTopics = useMemo(() => {
    return CAPABILITIES_DATABASE.filter((topic) => {
      const matchesSearch =
        topic.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        topic.cat.toLowerCase().includes(deferredQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || topic.cat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [deferredQuery, activeCategory]);

  const categories = ["All", "Web Development", "Animated Videos", "Graphic Design", "Hosting & Support"];

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      setActiveCategory(category);
    });
  };

  return (
    <div id="services-view" className="space-y-16 pb-16 font-sans">
      <SEO
        title="Website Design, Video Ads & SEO Services for SA Businesses"
        description="Affordable websites, promotional 2D video ads, PayFast integration, and Google Maps local SEO for doctors, accountants, trades, and local South African businesses."
        canonicalUrl="https://spaceheadai.co.za/services"
        keywords={[
          "small business website design south africa",
          "affordable web design packages za",
          "animated promotional video ads",
          "google maps local seo south africa",
          "payfast payment gateway setup",
          "medical practice website designer",
          "attorney accountant web design za",
          "local business branding johannesburg",
          "website maintenance cape town durban"
        ]}
        geoRegion="ZA"
        geoPlacename="South Africa"
        breadcrumbs={[
          { name: "Home", item: "https://spaceheadai.co.za" },
          { name: "Services", item: "https://spaceheadai.co.za/services" }
        ]}
        jsonLd={[
          DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA,
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "SpaceHead AI Digital Services & Packages",
            "description": "Website design, video ads, PayFast integrations, and local business digital marketing packages in South Africa.",
            "itemListElement": [
              {
                "@type": "Service",
                "position": 1,
                "name": "Starter Local Business Website",
                "description": "Clean, mobile-optimized 3-5 page business website with WhatsApp chat, Google Maps integration, and fast South African hosting.",
                "provider": { "@id": "https://spaceheadai.co.za/#organization" },
                "offers": {
                  "@type": "Offer",
                  "price": "1950",
                  "priceCurrency": "ZAR"
                }
              },
              {
                "@type": "Service",
                "position": 2,
                "name": "Professional Practice Website",
                "description": "Multi-page bespoke website with custom appointment booking inquiry flow, patient/client intake, and local SEO setup.",
                "provider": { "@id": "https://spaceheadai.co.za/#organization" },
                "offers": {
                  "@type": "Offer",
                  "price": "3500",
                  "priceCurrency": "ZAR"
                }
              },
              {
                "@type": "Service",
                "position": 3,
                "name": "Social Media Promotional Video Ads",
                "description": "Custom 2D animated promotional video ads formatted for Instagram Reels, TikTok, Facebook & YouTube Shorts.",
                "provider": { "@id": "https://spaceheadai.co.za/#organization" },
                "offers": {
                  "@type": "Offer",
                  "price": "1200",
                  "priceCurrency": "ZAR"
                }
              },
              {
                "@type": "Service",
                "position": 4,
                "name": "Custom Business Platform & Booking Engine",
                "description": "Full-stack web application with client authentication, database persistence, and PayFast instant EFT checkout.",
                "provider": { "@id": "https://spaceheadai.co.za/#organization" },
                "offers": {
                  "@type": "Offer",
                  "price": "7500",
                  "priceCurrency": "ZAR"
                }
              }
            ]
          }
        ]}
      />

      {/* Payment Outcome Notification Banner */}
      {paymentStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs sm:text-sm font-medium shadow-sm max-w-3xl mx-auto ${
            paymentStatus.outcome === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : paymentStatus.outcome === "cancelled"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {paymentStatus.outcome === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
          {paymentStatus.outcome === "cancelled" && <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
          {paymentStatus.outcome === "failed" && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <span>{paymentStatus.message}</span>
          </div>
          <button
            onClick={() => setPaymentStatus(null)}
            className="text-xs font-bold underline cursor-pointer opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Services Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto mt-6">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          What We Do
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-none">
          Our Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Websites, videos, and simple online tools — built to help your business look professional and be easy to find.
        </p>
      </div>

      {/* Main 3 Priority Services Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            data={service}
            ctaLabel="Get Started"
            onCta={() => setBriefItem(toCheckoutItem(service))}
          />
        ))}
      </div>

      {/* Banner for Interactive AI Project Estimator & Instant PDF Proposals */}
      <div className="max-w-5xl mx-auto w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800/40">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            <span>Interactive Scope & Proposal Engine</span>
          </div>
          <h3 className="font-sans font-bold text-xl sm:text-2xl text-white">
            Need a Custom Architecture or Multi-Feature Web App?
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl">
            Configure custom user authentication, PayFast gateway, Gemini AI agents, and KPI dashboards. Calculate real-time timelines and download a branded PDF proposal for your team in under 60 seconds.
          </p>
        </div>

        <button
          onClick={() => onTabChange("estimator")}
          className="flex-shrink-0 inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-indigo-600" />
          <span>Launch AI Project Estimator</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

      {/* Interactive Package Customizer & Add-on Calculator */}
      <div className="max-w-5xl mx-auto w-full">
        <PackageCustomizer onSelectCheckout={(item) => setBriefItem(item)} />
      </div>

      {briefItem && <CheckoutBriefModal item={briefItem} onClose={() => setBriefItem(null)} />}

      {/* Obscure Section for Miscellaneous Creative Assets & Capability Finder */}
      <div className="border border-slate-200/60 rounded-[24px] bg-slate-50/50 overflow-hidden transition-all max-w-4xl mx-auto">
        <button
          onClick={() => setIsObscureExpanded(!isObscureExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors bg-white focus:outline-none"
        >
          <div className="flex items-center space-x-3 text-left">
            <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Other Design Work</h4>
              <p className="text-[11px] text-slate-400 font-mono">Quick, flat-fee design work — logos, flyers, and more</p>
            </div>
          </div>
          {isObscureExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {isObscureExpanded && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-8 animate-fade-in">
            {/* Flat R499 Miscellaneous Assets Grid */}
            <div className="space-y-4">
              <div className="border-b border-slate-200/60 pb-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  R499 Flat-Fee Design Work
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  One fixed price, no surprises. Tell us what you need and pay securely via Payfast.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FLAT_FEE_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/50 p-4 rounded-xl space-y-2 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 ease-out group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 text-xs block group-hover:text-purple-600 transition-colors duration-200">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[9.5px] font-mono text-purple-600 font-bold block">R499 once-off</span>
                      <button
                        onClick={() =>
                          setBriefItem({
                            id: item.id,
                            title: item.name,
                            pricingMode: "simple",
                            amount: 499,
                            briefPlaceholder:
                              "What should this include? Your business name, colours, any text, and a reference style if you have one.",
                          })
                        }
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        <span>Get This</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet Interactive Capabilities Finder */}
            <div className="space-y-4">
              <div className="border-b border-slate-200/60 pb-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Everything We Can Help With
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Search or browse the full list.</p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search (e.g. logo, hosting, video)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 items-center">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`text-[9.5px] font-semibold px-2.5 py-1.5 rounded-md transition-colors ${
                          activeCategory === cat
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[100px] max-h-[180px] overflow-y-auto pr-1 space-y-1">
                  {isPending && (
                    <div className="absolute inset-0 bg-slate-50/80 flex items-center justify-center rounded-xl z-20">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    </div>
                  )}
                  {filteredTopics.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredTopics.map((topic) => (
                        <div
                          key={topic.name}
                          className="bg-white border border-slate-200/50 p-2.5 rounded-lg flex items-center justify-between text-xs hover:border-indigo-200 hover:shadow-sm hover:translate-x-0.5 transition-all duration-200 ease-out group cursor-default"
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block leading-tight group-hover:text-indigo-600 transition-colors duration-200">
                              {topic.name}
                            </span>
                            <span className="text-[8px] font-mono text-indigo-500 font-bold uppercase tracking-wider block">
                              {topic.cat}
                            </span>
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 ml-2 group-hover:scale-125 transition-transform duration-200" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-[11px] text-slate-400 font-mono">
                      No matches — try a different search term.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Social Proof & Outcomes Strip */}
      <TestimonialsStrip compact={true} onNavigateToServices={() => window.scrollTo({ top: 400, behavior: "smooth" })} />

      {/* FAQ & Confidence Guarantee Section */}
      <ServicesFAQ />
    </div>
  );
}
