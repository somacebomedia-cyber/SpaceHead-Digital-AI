import React, { useState, useEffect, useTransition, useDeferredValue, useMemo } from "react";
import SEO from "./SEO";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Info,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import ServiceCard, { ServiceCardData } from "./ServiceCard";
import { initiatePayfastPayment } from "../lib/payfastClient";

interface ServicesPageProps {
  onTabChange: (tab: string) => void;
}

const CAPABILITIES_DATABASE = [
  { name: "Bespoke Premium Website Design", cat: "Web Development" },
  { name: "Immersive Custom Landing Pages", cat: "Web Development" },
  { name: "Responsive Touch-Optimized Layouts", cat: "Web Development" },
  { name: "Google SEO Local Maps Optimization", cat: "Web Development" },
  { name: "Dynamic AI Social Video Adverts", cat: "Animated Videos" },
  { name: "Premium 3D Logo Animation Openers", cat: "Animated Videos" },
  { name: "High-Converting Facebook & TikTok Video Ads", cat: "Animated Videos" },
  { name: "Cinematic 3D Animated Product Reels", cat: "Animated Videos" },
  { name: "Custom Stationery & Business Cards", cat: "Graphic Design" },
  { name: "Customized Professional Logo Concepts", cat: "Graphic Design" },
  { name: "High-Impact Printable Posters & Flyers", cat: "Graphic Design" },
  { name: "High-Speed Enterprise Cloud Hosting", cat: "Cloud Infrastructure" }
];

const MAIN_SERVICES: ServiceCardData[] = [
  {
    id: "web-design",
    title: "Premium Website Design",
    category: "Web Development",
    badge: "SAVE 56% UPFRONT • R400 SETUP PLAN",
    description: "Bespoke high-performance desktop & mobile experiences. Pay R3,499 upfront for full ownership (SAVE 56% / Save R4,500 off the standard R7,999 value), OR start with an easy R400 setup fee + R150/mo subscription paid over 50 months.",
    price: "R400",
    originalPrice: "R7,999",
    period: "setup + R150/mo (or R3,499 once-off)",
    amountRands: 400,
    image: "https://lh3.googleusercontent.com/d/1nLpdWKVSUSvAh2JrtsP7EfKGUIkH6ym6=w1000",
    accent: "indigo",
    featured: true,
    features: [
      "Save 56% (Save R4,500) when paying R3,499 upfront",
      "OR R400 setup fee + R150/mo over 50 months (R7,999 value)",
      "Complete custom bespoke responsive architecture",
      "Data-light mobile mechanics for low data usage",
      "Local Google SEO & 24/7 cloud server maintenance"
    ]
  },
  {
    id: "video-ads",
    title: "AI-Powered Video Adverts",
    category: "Animated Videos",
    badge: "SAVE 58% • LOCAL BOOSTER",
    description: "Sleek promotional cinematic video ads and social media loops designed to immediately capture attention. Save 58% off standard agency rates (R399 vs R950). Optimized for WhatsApp Business, Facebook Lite, and TikTok.",
    price: "R399",
    originalPrice: "R950",
    period: "per video",
    amountRands: 399,
    image: "https://lh3.googleusercontent.com/d/1546AScUm3fseqml8dfgHEKo5t9TOfx7N=w1000",
    accent: "purple",
    features: [
      "Save 58% off standard video creation (R399 vs R950)",
      "Cinematic pattern-interrupt visual hooks",
      "Engaging narrative pacing & custom voiceover style",
      "Highly compressed for WhatsApp Status & social feeds",
      "30-second explainer & promo variants included"
    ]
  },
  {
    id: "vibe-coding",
    title: "AI App Vibe Coding",
    category: "Web Development",
    badge: "SAVE 55% UPFRONT • R400 SETUP PLAN",
    description: "Turn your business idea or workflow into a living web/mobile app in record time. Pay R8,999 upfront for full ownership (SAVE 55% / Save R11,000 off standard R19,999 value), OR start with an easy R400 setup + R150/mo subscription paid over 130 months.",
    price: "R400",
    originalPrice: "R19,999",
    period: "setup + R150/mo (or R8,999 once-off)",
    amountRands: 400,
    image: "https://lh3.googleusercontent.com/d/17U_APICMOCc44uJCSl6PkHReYuijxThu=w1000",
    accent: "emerald",
    features: [
      "Save 55% (Save R11,000) when paying R8,999 upfront",
      "OR R400 setup fee + R150/mo over 130 months (R19,999 value)",
      "Rapid prototyping and custom application MVPs",
      "Clean structural full-stack code layout",
      "Interactive dashboards & database-connected state"
    ]
  }
];

export default function ServicesPage({ onTabChange }: ServicesPageProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isObscureExpanded, setIsObscureExpanded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    outcome: "success" | "cancelled" | "failed";
    message: string;
  } | null>(null);
  const [payingItem, setPayingItem] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  // State for Plan Chooser Modal (R400 setup vs full once-off)
  const [planModalService, setPlanModalService] = useState<ServiceCardData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isCallback = urlParams.get("payment") === "payfast";
      const outcome = urlParams.get("outcome");

      if (isCallback && outcome) {
        if (outcome === "success") {
          setPaymentStatus({
            outcome: "success",
            message: "Payfast payment confirmed! Thank you for your order. Our production desk will contact you shortly to start your project brief."
          });
        } else if (outcome === "cancelled") {
          setPaymentStatus({
            outcome: "cancelled",
            message: "Payfast payment process was cancelled. You can retry anytime or submit a custom inquiry."
          });
        } else {
          setPaymentStatus({
            outcome: "failed",
            message: "Payfast payment could not be processed. Please try again or select another payment channel."
          });
        }
      }
    }
  }, []);

  const handlePayfastCheckout = async (title: string, amountRands: number, id: string, desc?: string) => {
    setPayingItem(id);
    setPayError(null);
    setPlanModalService(null);
    try {
      await initiatePayfastPayment({
        amountRands,
        itemName: `SpaceHead AI - ${title}`,
        itemDescription: desc || `SpaceHead AI creative & technical services: ${title}`,
        returnPath: "/services",
        cancelPath: "/services",
        customStr1: id,
      });
    } catch (err: any) {
      console.error("Payfast payment trigger failed:", err);
      setPayError(err.message || "Could not launch Payfast portal.");
      setPayingItem(null);
    }
  };

  const handleServiceCardAction = (service: ServiceCardData, mode: "cta" | "payfast") => {
    if (service.id === "web-design" || service.id === "vibe-coding") {
      // Open plan selection modal allowing client to pick R400 setup or full once-off!
      setPlanModalService(service);
    } else {
      if (mode === "cta") {
        onTabChange("contact");
      } else {
        handlePayfastCheckout(service.title, service.amountRands || 399, service.id);
      }
    }
  };

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredTopics = useMemo(() => {
    return CAPABILITIES_DATABASE.filter((topic) => {
      const matchesSearch = topic.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
                            topic.cat.toLowerCase().includes(deferredQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || topic.cat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [deferredQuery, activeCategory]);

  const categories = ["All", "Web Development", "Animated Videos", "Graphic Design", "Cloud Infrastructure"];

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      setActiveCategory(category);
    });
  };

  return (
    <div id="services-view" className="space-y-16 pb-16 font-sans">
      <SEO 
        title="Bespoke Design, AI Video Ads & App Vibe Coding Services"
        description="Discover our 3 core specializations: High-end bespoke responsive website design, dynamic cinematic AI-powered social video adverts, and high-speed full-stack AI App Vibe Coding prototypes."
        canonicalUrl="https://spaceheadai.co.za/services"
      />
      
      {/* Payment Outcome Notification Banner */}
      {paymentStatus && (
        <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs sm:text-sm font-medium shadow-sm max-w-3xl mx-auto ${
          paymentStatus.outcome === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
            : paymentStatus.outcome === "cancelled" 
            ? "bg-amber-50 border-amber-200 text-amber-900" 
            : "bg-rose-50 border-rose-200 text-rose-900"
        }`}>
          {paymentStatus.outcome === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
          {paymentStatus.outcome === "cancelled" && <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
          {paymentStatus.outcome === "failed" && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <span className="font-bold block uppercase tracking-wider text-[10px] font-mono">
              Payfast Payment Notification ({paymentStatus.outcome})
            </span>
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

      {payError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs sm:text-sm font-medium max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{payError}</span>
          </div>
          <button onClick={() => setPayError(null)} className="font-bold text-rose-700 underline text-xs cursor-pointer">
            Close
          </button>
        </div>
      )}

      {/* Services Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto mt-6">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Core Focus Areas
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-none">
          Our Specializations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          We focus strictly on premium digital assets and high-impact digital products engineered to maximize South African business conversions.
        </p>
      </div>

      {/* Main 3 Priority Services Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {MAIN_SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            data={service}
            ctaLabel={payingItem === service.id ? "Redirecting..." : "Configure Build"}
            onCta={() => handleServiceCardAction(service, "cta")}
            onPayfastPay={() => handleServiceCardAction(service, "payfast")}
          />
        ))}
      </div>

      {/* Plan Selection Modal for R400 Setup vs Full Upfront */}
      {planModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setPlanModalService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60 transition-colors cursor-pointer"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block">
                Choose Payment Option
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                {planModalService.title}
              </h3>
              <p className="text-xs text-slate-300">
                Pick the payment schedule that fits your budget best. Both plans include full custom design & build quality.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Starter Easy Access (R400 Setup + R150/mo Subscription Payoff) */}
              <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border-2 border-indigo-500/60 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-lg">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-indigo-500 text-white text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full inline-block mb-1">
                      ⭐ Most Popular / Easy Monthly Payoff
                    </span>
                    <h4 className="font-bold text-sm text-white">Starter Setup & Subscription Plan</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-display font-black text-indigo-300">R400</span>
                    <span className="block text-[10px] text-slate-400 font-mono">+ R150/mo</span>
                  </div>
                </div>

                <ul className="text-[11px] text-slate-300 space-y-1.5 font-sans">
                  <li className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><strong>R400 setup fee</strong> due today to launch your custom design build immediately.</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>R150/month subscription</strong> pays off the full standard value of{" "}
                      <strong className="text-indigo-200">
                        {planModalService.id === "web-design" ? "R7,999 (over 50 months)" : "R19,999 (over 130 months)"}
                      </strong>.
                    </span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>Includes 24/7 active cloud hosting, SSL security & technical care for the duration.</span>
                  </li>
                </ul>

                <button
                  onClick={() =>
                    handlePayfastCheckout(
                      `${planModalService.title} (Starter Setup R400 + R150/mo)`,
                      400,
                      planModalService.id,
                      `R400 setup fee + R150/mo maintenance subscription for ${planModalService.title}`
                    )
                  }
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay R400 Setup Fee via Payfast</span>
                </button>
              </div>

              {/* Option 2: Full Upfront Ownership with Percentage Savings */}
              <div className="bg-slate-800/80 border border-emerald-500/50 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full inline-block mb-1">
                      {planModalService.id === "web-design" ? "🔥 SAVE 56% (SAVE R4,500)" : "🔥 SAVE 55% (SAVE R11,000)"}
                    </span>
                    <h4 className="font-bold text-sm text-white">Full Upfront Ownership Payment</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-display font-black text-emerald-400">
                      {planModalService.id === "web-design" ? "R3,499" : "R8,999"}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono line-through">
                      {planModalService.id === "web-design" ? "R7,999" : "R19,999"}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300">
                  Pay the reduced upfront price in full today. You lock in{" "}
                  <strong>{planModalService.id === "web-design" ? "56% OFF" : "55% OFF"}</strong> full project ownership with zero long-term monthly balance and 3 months complimentary cloud hosting.
                </p>

                <button
                  onClick={() =>
                    handlePayfastCheckout(
                      `${planModalService.title} (Full Upfront)`,
                      planModalService.id === "web-design" ? 3499 : 8999,
                      planModalService.id,
                      `Full upfront once-off payment for ${planModalService.title}`
                    )
                  }
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Pay {planModalService.id === "web-design" ? "R3,499" : "R8,999"} Upfront (Save {planModalService.id === "web-design" ? "R4,500" : "R11,000"})
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setPlanModalService(null);
                  onTabChange("contact");
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Need a custom enterprise arrangement? Request a consult brief →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Obscure Section for Miscellaneous Creative Assets & Capability Finder */}
      <div className="border border-slate-200/60 rounded-[24px] bg-slate-50/50 overflow-hidden transition-all max-w-4xl mx-auto">
        <button
          onClick={() => setIsObscureExpanded(!isObscureExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors bg-white focus:outline-none"
        >
          <div className="flex items-center space-x-3 text-left">
            <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Alternative Services & Creative Materials</h4>
              <p className="text-[11px] text-slate-400 font-mono">Flat-fee R499 deliverables & Payfast payment gateway</p>
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
                  ZAR R499 Flat-Fee Deliverables
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Order flat-rate design files directly online with Payfast instant checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "flat-logo", name: "Professional Logo Concept", desc: "Sleek tailored vector files" },
                  { id: "flat-poster", name: "Printable Marketing Poster", desc: "High-contrast creative formats" },
                  { id: "flat-card", name: "Bespoke Business Card Design", desc: "Premium corporate print layouts" },
                  { id: "flat-doc", name: "Business Document Design", desc: "Professional letterheads, layouts & proposals" },
                  { id: "flat-flyer", name: "Localized Social Media Flyer", desc: "Prepped for digital ad feeds" },
                  { id: "flat-menu", name: "Custom Digital Menu Card", desc: "Responsive visual layouts" },
                  { id: "flat-email", name: "Email Signature Design", desc: "Modern clickable HTML signature designs" },
                  { id: "flat-cover", name: "Social Media Cover Banner", desc: "Cohesive multi-platform branding banners" }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white border border-slate-200/50 p-4 rounded-xl space-y-2 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 ease-out group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 text-xs block group-hover:text-purple-600 transition-colors duration-200">{item.name}</span>
                      <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[9.5px] font-mono text-purple-600 font-bold block">
                        R499 once-off
                      </span>
                      <button
                        onClick={() => handlePayfastCheckout(item.name, 499, item.id)}
                        disabled={payingItem === item.id}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {payingItem === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-3 h-3" />
                            <span>Payfast</span>
                          </>
                        )}
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
                  Interactive Capabilities Finder
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Browse or search our technical stack and agency workspace specifications.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Filter specs (e.g. logo, maps, hosting)..."
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

                {/* Grid display with transition status */}
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
                            <span className="font-semibold text-slate-800 block leading-tight group-hover:text-indigo-600 transition-colors duration-200">{topic.name}</span>
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
                      No matching capabilities found.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Elegant Interactive Accordion FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-8 pt-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Client FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">
            Everything you need to know about our production pipelines, Payfast online payments, flat-rate assets, and delivery terms.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "How does the R400 setup + R150/month subscription plan work?",
              a: "To make website design and AI app development accessible for township businesses, entrepreneurs, and local brands, we offer a low barrier-to-entry plan! Pay an easy R400 setup fee today to start your custom design build. After launch, you pay an affordable R150/month subscription covering enterprise cloud hosting, SSL security certificates, and active technical maintenance."
            },
            {
              q: "How do Payfast online payments work?",
              a: "We integrate with Payfast, South Africa's premier payment gateway. You can securely pay via Credit/Debit Cards (Visa/Mastercard), Instant EFT, Masterpass, or Zapper in ZAR. Your order is verified instantly via secure ITN notifications."
            },
            {
              q: "What is 'AI App Vibe Coding' and how does it work?",
              a: "Vibe coding is our state-of-the-art interactive development pipeline. Instead of months of slow planning and manual debugging, we use cutting-edge, AI-guided engineering environments to build fully typed, modular web applications in record time. It drastically lowers development costs while maintaining production-grade standards."
            },
            {
              q: "How long does a custom premium website build take?",
              a: "Our standard turnaround time for bespoke website designs is 10 to 14 business days. Throughout the build process, you receive secure workspace preview URLs so you can review live changes, layout blocks, and content optimization blocks in real-time."
            },
            {
              q: "What is included with the R499 flat-fee deliverables?",
              a: "For all flat-fee designs (e.g. business cards, custom logos, marketing flyers), you get print-ready vector sources (SVG/PDF) and standard high-fidelity formats. Each request includes up to two complete cycles of feedback revisions to guarantee absolute branding alignment."
            },
            {
              q: "How do you handle hosting and platform maintenance after launch?",
              a: "When you sign up under our R400 setup plan, your hosting and maintenance are included for just R150/month. For full once-off ownership builds, 3 months of complimentary cloud hosting is included, after which you can transition to your own cloud instance or keep running on our workspace."
            }
          ].map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>

    </div>
  );
}

interface FAQItemProps {
  faq: { q: string; a: string };
}

const FAQItem: React.FC<FAQItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:border-slate-200 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-sans text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 focus:outline-none transition-colors"
      >
        <span className="pr-4 leading-snug">{faq.q}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-50/50 pt-3 bg-slate-50/30 animate-fade-in font-sans">
          {faq.a}
        </div>
      )}
    </div>
  );
};


