import React, { useState, useTransition, useDeferredValue, useMemo } from "react";
import SEO from "./SEO";
import { 
  Code, 
  Video, 
  Sparkles, 
  Laptop, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  HelpCircle,
  Info
} from "lucide-react";
import OrbitPlanetIllustration from "./space-illustrations/OrbitPlanetIllustration";
import CometRocketIllustration from "./space-illustrations/CometRocketIllustration";
import ConstellationRobotIllustration from "./space-illustrations/ConstellationRobotIllustration";

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

export default function ServicesPage({ onTabChange }: ServicesPageProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isObscureExpanded, setIsObscureExpanded] = useState(false);

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

  const mainServices = [
    {
      id: "web-design",
      title: "Premium Website Design",
      badge: "Flagship Core Build",
      description: "Bespoke high-performance desktop & mobile experiences built natively with modern frameworks. Engineered with high compression and low-data optimization so rural and township clients can browse your site quickly with zero lag.",
      price: "R3,499",
      originalPrice: "R7,999",
      period: "once-off (or R299/mo)",
      icon: Laptop,
      color: "from-indigo-500 to-blue-600",
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
      badge: "Local Business Booster",
      description: "Sleek promotional cinematic video ads and social media loops designed to immediately capture attention. Specifically optimized for easy sharing on WhatsApp Business, Facebook Lite, and TikTok.",
      price: "R399",
      originalPrice: "R950",
      period: "per video",
      icon: Video,
      color: "from-purple-500 to-pink-600",
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
      badge: "SMME Prototype Build",
      description: "Turn your township business idea, community workflow tool, or order management system into a living, fully functional web or mobile application in record time. Tailored for affordable, rapid local deployment.",
      price: "R8,999",
      originalPrice: "R19,999",
      period: "per prototype",
      icon: Code,
      color: "from-emerald-500 to-teal-600",
      features: [
        "Rapid prototyping and custom application MVPs",
        "Clean structural full-stack code layout",
        "Interactive dashboards & database-connected state",
        "Frictionless UI/UX styling using Tailwind CSS",
        "Automated custom workflow tools tailored to your business"
      ]
    }
  ];

  return (
    <div id="services-view" className="space-y-16 pb-16 font-sans">
      <SEO 
        title="Bespoke Design, AI Video Ads & App Vibe Coding Services"
        description="Discover our 3 core specializations: High-end bespoke responsive website design, dynamic cinematic AI-powered social video adverts, and high-speed full-stack AI App Vibe Coding prototypes."
        canonicalUrl="https://spacehead.co.za/services"
      />
      
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
        {mainServices.map((service) => {
          const Icon = service.icon;
          
          // Map illustrations and dynamic theme styling based on service.id
          let Illustration = OrbitPlanetIllustration;
          let cardBg = "bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-700 text-white";
          let borderStyle = "border-indigo-500/30 hover:border-indigo-400/50";
          let hoverGlow = "hover:shadow-[0_32px_64px_rgba(99,102,241,0.25)]";
          let badgeStyle = "text-white bg-indigo-500/40 border-indigo-400/30";
          let checkIconColor = "text-indigo-200";
          let secondaryTextColor = "text-indigo-100/85";
          let footerBorder = "border-indigo-500/40";
          let buttonStyle = "bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 shadow-md";
          
          if (service.id === "video-ads") {
            Illustration = CometRocketIllustration;
            cardBg = "bg-gradient-to-br from-purple-600 via-purple-600 to-pink-600 text-white";
            borderStyle = "border-purple-500/30 hover:border-purple-400/50";
            hoverGlow = "hover:shadow-[0_32px_64px_rgba(236,72,153,0.25)]";
            badgeStyle = "text-white bg-purple-500/40 border-purple-400/30";
            checkIconColor = "text-purple-200";
            secondaryTextColor = "text-purple-100/85";
            footerBorder = "border-purple-500/40";
            buttonStyle = "bg-white text-purple-700 hover:bg-purple-50 hover:text-purple-800 shadow-md";
          } else if (service.id === "vibe-coding") {
            Illustration = ConstellationRobotIllustration;
            cardBg = "bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white";
            borderStyle = "border-emerald-500/30 hover:border-emerald-400/50";
            hoverGlow = "hover:shadow-[0_32px_64px_rgba(16,185,129,0.25)]";
            badgeStyle = "text-white bg-emerald-500/40 border-emerald-400/30";
            checkIconColor = "text-emerald-200";
            secondaryTextColor = "text-emerald-100/85";
            footerBorder = "border-emerald-500/40";
            buttonStyle = "bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-md";
          }

          return (
            <div 
              key={service.id}
              className={`${cardBg} border ${borderStyle} rounded-[32px] p-6 sm:p-7 shadow-sm ${hoverGlow} hover:-translate-y-2.5 transition-all duration-500 relative overflow-hidden group flex flex-col justify-between`}
            >
              {/* Premium Subtle Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-6">
                {/* 3D Pastel Space Scene Header */}
                <div className="overflow-hidden rounded-[24px]">
                  <Illustration />
                </div>

                <div className="space-y-6 relative z-10">
                  {/* Category Badge & Active Label */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyle} transition-all duration-300`}>
                      {service.badge}
                    </span>
                    <span className={`text-[10px] ${secondaryTextColor} font-mono tracking-wide`}>Active Spec</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-white text-xl">
                      {service.title}
                    </h3>
                    <p className={`text-xs ${secondaryTextColor} leading-relaxed min-h-[54px]`}>
                      {service.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className={`space-y-2.5 pt-4 border-t ${footerBorder}`}>
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start text-xs text-white group/item">
                        <CheckCircle className={`w-4 h-4 ${checkIconColor} mr-2 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-200`} />
                        <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price Tag Footer */}
              <div className={`pt-6 mt-8 border-t ${footerBorder} flex items-end justify-between relative z-10`}>
                <div>
                  <span className={`text-[10px] ${secondaryTextColor} uppercase tracking-widest block font-mono`}>Investment</span>
                  <div className="flex flex-col mt-0.5">
                    {service.originalPrice && (
                      <span className="text-[11px] line-through text-white/50 font-mono tracking-wider">
                        {service.originalPrice}
                      </span>
                    )}
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-display font-black text-white">{service.price}</span>
                      <span className={`text-[10px] ${secondaryTextColor} font-mono`}>/ {service.period}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onTabChange("contact")}
                  className={`px-5 py-2.5 ${buttonStyle} rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:translate-x-0.5 cursor-pointer`}
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
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
              <p className="text-[11px] text-slate-400 font-mono">Flat-fee R499 deliverables & design capabilities database</p>
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
                  We maintain a clean flat-rate setup for individual design files, allowing you to scale creative requests on demand.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: "Professional Logo Concept", desc: "Sleek tailored vector files" },
                  { name: "Printable Marketing Poster", desc: "High-contrast creative formats" },
                  { name: "Bespoke Business Card Design", desc: "Premium corporate print layouts" },
                  { name: "Business Document Design", desc: "Professional letterheads, layouts & proposals" },
                  { name: "Localized Social Media Flyer", desc: "Prepped for digital ad feeds" },
                  { name: "Custom Digital Menu Card", desc: "Responsive visual layouts" },
                  { name: "Email Signature Design", desc: "Modern clickable HTML signature designs" },
                  { name: "Social Media Cover Banner", desc: "Cohesive multi-platform branding banners" }
                ].map((item) => (
                  <div 
                    key={item.name}
                    className="bg-white border border-slate-200/50 p-4 rounded-xl space-y-1 text-left shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer group"
                  >
                    <span className="font-bold text-slate-900 text-xs block group-hover:text-purple-600 transition-colors duration-200">{item.name}</span>
                    <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                    <span className="text-[9.5px] font-mono text-purple-600 font-bold block pt-1.5 group-hover:translate-x-0.5 transition-transform duration-200">
                      R499 once-off
                    </span>
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
            Everything you need to know about our premium production pipelines, flat-rate assets, and delivery terms.
          </p>
        </div>

        <div className="space-y-3">
          {[
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
            },
            {
              q: "How do I get started with SpaceHead AI?",
              a: "Simply click any of the 'Configure' buttons on this page, or navigate to our 'Contact' tab. Fill in your high-level brief and phone details, and our desk will generate a custom tracking code and contact you within 2 hours."
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
        className="w-full px-6 py-4.5 flex items-center justify-between text-left font-sans text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 focus:outline-none transition-colors"
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

