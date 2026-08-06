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
    badge: "Flagship Core Build",
    description: "Bespoke high-performance desktop & mobile experiences built natively with modern frameworks. Engineered with high compression and low-data optimization so rural and township clients can browse your site quickly with zero lag.",
    price: "R3,499",
    originalPrice: "R7,999",
    period: "once-off (or R299/mo)",
    amountRands: 3499,
    image: "https://lh3.googleusercontent.com/d/1nLpdWKVSUSvAh2JrtsP7EfKGUIkH6ym6=w1000",
    accent: "indigo",
    featured: true,
    features: [
      "Complete custom bespoke architecture",
      "Data-light responsive mobile mechanics",
      "High-performance speed & Core Web Vitals optimization",
      "Local Google SEO & Maps integration",
      "Custom copywriting & conversion layout blocks"
    ]
  },
  {
    id: "video-ads",
    title: "AI-Powered Video Adverts",
    category: "Animated Videos",
    badge: "Local Business Booster",
    description: "Sleek promotional cinematic video ads and social media loops designed to immediately capture attention. Specifically optimized for easy sharing on WhatsApp Business, Facebook Lite, and TikTok.",
    price: "R399",
    originalPrice: "R950",
    period: "per video",
    amountRands: 399,
    image: "https://lh3.googleusercontent.com/d/1546AScUm3fseqml8dfgHEKo5t9TOfx7N=w1000",
    accent: "purple",
    features: [
      "Cinematic pattern-interrupt visual hooks",
      "Engaging narrative pacing & custom voiceover style",
      "Highly compressed for WhatsApp Status & social feeds",
      "30-second explainer & promo variants included",
      "Fluid motion graphic transitions and branding integration"
    ]
  },
  {
    id: "vibe-coding",
    title: "AI App Vibe Coding",
    category: "Web Development",
    badge: "SMME Prototype Build",
    description: "Turn your township business idea, community workflow tool, or order management system into a living, fully functional web or mobile application in record time. Tailored for affordable, rapid local deployment.",
    price: "R8,999",
    originalPrice: "R19,999",
    period: "per prototype",
    amountRands: 8999,
    image: "https://lh3.googleusercontent.com/d/17U_APICMOCc44uJCSl6PkHReYuijxThu=w1000",
    accent: "emerald",
    features: [
      "Rapid prototyping and custom application MVPs",
      "Clean structural full-stack code layout",
      "Interactive dashboards & database-connected state",
      "Frictionless UI/UX styling using Tailwind CSS",
      "Automated custom workflow tools tailored to your business"
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

  const handlePayfastCheckout = async (title: string, amountRands: number, id: string) => {
    setPayingItem(id);
    setPayError(null);
    try {
      await initiatePayfastPayment({
        amountRands,
        itemName: `SpaceHead AI - ${title}`,
        itemDescription: `SpaceHead AI creative & technical services: ${title}`,
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
            onCta={() => onTabChange("contact")}
            onPayfastPay={() => handlePayfastCheckout(service.title, service.amountRands || 399, service.id)}
          />
        ))}
      </div>

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
              a: "Every custom website we design comes with 3 months of complimentary enterprise cloud hosting and performance tuning. Afterward, you can choose to transition to your own cloud instance or keep running on our optimized workspace setup with absolute SLA maintenance support."
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


