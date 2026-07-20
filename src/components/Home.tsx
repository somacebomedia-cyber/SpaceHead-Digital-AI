import React from "react";
import { Project, BlogPost } from "../types";
import SpaceHeadLogo from "./SpaceHeadLogo";
import SEO from "./SEO";
import { 
  ArrowRight, 
  Sparkles,
  Laptop,
  Video,
  Code
} from "lucide-react";
import OrbitPlanetIllustration from "./space-illustrations/OrbitPlanetIllustration";
import CometRocketIllustration from "./space-illustrations/CometRocketIllustration";
import ConstellationRobotIllustration from "./space-illustrations/ConstellationRobotIllustration";

interface HomeProps {
  projects: Project[];
  blogs: BlogPost[];
  onTabChange: (tab: string) => void;
  onSelectProject: (project: Project) => void;
  onSelectBlog: (blog: BlogPost) => void;
}

export default function Home({ projects, blogs, onTabChange, onSelectProject, onSelectBlog }: HomeProps) {
  return (
    <div id="home-view" className="space-y-16 pb-20 font-sans">
      <SEO 
        title="Premium Business Website Design & Production"
        description="We design bespoke digital presences, high-converting animated promotional video ads, and next-generation AI applications engineered with world-class precision."
        canonicalUrl="https://spacehead.co.za"
      />
      
      {/* Redesigned Premium Hero inspired by Reference Images */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-[32px] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 mt-6 shadow-2xl">
        {/* Soft, beautiful background gradients mimicking reference images */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(99,102,241,0.25),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(139,92,246,0.2),transparent_50%)] pointer-events-none" />
        
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

        {/* Floating 3D decorative blur spheres like in "Launch Your Dream App" */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/25 rounded-full blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-16 left-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Text Box */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <SpaceHeadLogo className="h-10 w-auto filter drop-shadow-[0_0_12px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
                <span className="text-slate-400 block text-xl sm:text-2xl font-sans tracking-widest uppercase mb-1 font-semibold">
                  Professional
                </span>
                Business Website <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-300">
                  Design & Production
                </span>
              </h1>
            </div>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              We design bespoke digital presences, cinematic promo adverts, and modern AI app experiences engineered with world-class precision. Calm, clean execution for serious South African brands.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onTabChange("services")}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-900/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Specializations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onTabChange("contact")}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-slate-900/80 hover:bg-slate-900 text-slate-300 rounded-xl font-semibold text-sm border border-slate-800 transition-all hover:bg-slate-850 cursor-pointer"
              >
                <span>Request Custom Consult</span>
              </button>
            </div>

            {/* Quick Badges inside Hero */}
            <div className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-bold text-white font-display">500+</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Deliveries</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-display">98%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Satisfaction</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-display">24/7</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Enterprise Care</span>
              </div>
            </div>
          </div>

          {/* CSS Device Mockups (Laptop + Smartphone) matching reference images */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] lg:min-h-[460px]">
            
            {/* Soft backdrop glow panel */}
            <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* CSS LAPTOP MOCKUP (inspired by BizNext) */}
            <div className="relative w-[340px] sm:w-[460px] bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-2xl transition-transform hover:scale-[1.01] hover:border-slate-700/80 duration-500">
              
              {/* Laptop Header Bar */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800/80">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 block" />
                </div>
                <div className="bg-slate-950/80 rounded px-4 py-0.5 text-[9px] font-mono text-slate-500 tracking-wider">
                  spacehead.co.za
                </div>
                <div className="w-8" />
              </div>

              {/* Laptop Screen Content Container */}
              <div className="bg-slate-950 rounded-lg p-4 sm:p-5 aspect-[16/10] overflow-hidden relative flex flex-col justify-between">
                {/* Background flow glows inside mock screen */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.18),transparent_50%)]" />

                {/* Simulated Screen Navbar */}
                <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold tracking-tight text-white flex items-center">
                    <span className="w-2 h-2 rounded bg-indigo-500 mr-1 block" />
                    BizNext
                  </span>
                  <div className="flex space-x-2 text-[8px] text-slate-400">
                    <span>Home</span>
                    <span>Services</span>
                    <span>Portfolio</span>
                  </div>
                  <span className="bg-indigo-600 text-white rounded px-2 py-0.5 text-[7px] font-bold">
                    Get Started
                  </span>
                </div>

                {/* Hero text inside screen */}
                <div className="my-auto space-y-2 relative z-10 text-center sm:text-left">
                  <span className="bg-indigo-500/20 text-indigo-300 text-[8px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase inline-block">
                    +68% Conversion
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold tracking-tight text-white leading-tight">
                    Grow Your <br />
                    Business Online
                  </h3>
                  <p className="text-[9px] text-slate-400 max-w-[200px]">
                    We deliver custom interactive designs designed specifically for South African audiences.
                  </p>
                </div>

                {/* Footer details inside screen */}
                <div className="flex justify-between items-center border-t border-white/5 pt-2 relative z-10 text-[7px] text-slate-500 font-mono">
                  <span>Trusted by 500+ Brands</span>
                  <span className="flex space-x-1 text-slate-400">
                    <span>Google</span>
                    <span>Slack</span>
                    <span>Dropbox</span>
                  </span>
                </div>
              </div>
            </div>

            {/* CSS MOBILE SMARTPHONE OVERLAP (inspired by Launch Your Dream App / Home Ease) */}
            <div className="absolute -bottom-8 right-0 sm:right-6 w-[150px] sm:w-[170px] bg-slate-900 border border-slate-800 rounded-[28px] p-2 shadow-2xl transition-all hover:scale-105 duration-500">
              <div className="bg-slate-950 rounded-[22px] aspect-[9/19] p-3 overflow-hidden relative flex flex-col justify-between">
                
                {/* Dynamic Screen Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.22),transparent_60%)]" />

                {/* Phone Speaker/Camera Notch */}
                <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 bg-black w-14 h-3.5 rounded-full flex items-center justify-center z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 block" />
                </div>

                {/* Phone Top Header */}
                <div className="flex justify-between text-[7px] font-mono text-slate-400 pt-1.5 relative z-10">
                  <span>9:41</span>
                  <span className="text-purple-400">Dear Client</span>
                </div>

                {/* Phone Central Glass Card */}
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl space-y-2 relative z-10 my-auto shadow-lg backdrop-blur-sm">
                  <span className="text-[7px] text-purple-300 font-mono tracking-wider block font-bold uppercase">Active Plan</span>
                  <h4 className="text-[9.5px] font-bold text-white leading-none">SpaceHead Care</h4>
                  
                  {/* Miniature graph visualizer */}
                  <div className="flex items-end justify-between h-8 pt-2">
                    {[30, 45, 60, 35, 75, 90, 80].map((h, i) => (
                      <span 
                        key={i} 
                        style={{ height: `${h}%` }} 
                        className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-sm" 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[7px] text-slate-400 font-mono">
                    <span>Performance</span>
                    <span className="text-emerald-400 font-bold">+98% Fast</span>
                  </div>
                </div>

                {/* Phone Footer Navigation */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-1.5 flex justify-between items-center text-[8px] text-slate-400 relative z-10">
                  <span className="text-white font-bold">Start today</span>
                  <span className="text-purple-400">&gt;</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Floating Benefit Frost Cards - Redesigned with 3D Pastel Space Theme */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Premium Website Design", 
              desc: "Bespoke high-performance digital presences designed natively with high compression and data-light optimization for fast loading.", 
              illustration: OrbitPlanetIllustration,
              color: "text-white bg-indigo-500/40 border-indigo-400/30",
              dotColor: "bg-indigo-200",
              badge: "Flagship Core Build",
              borderColor: "border-indigo-500/30 hover:border-indigo-400/50",
              cardBg: "bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-700 text-white",
              shadow: "hover:shadow-[0_32px_64px_rgba(99,102,241,0.25)]",
              features: ["Data-light loading optimization", "Save over 56% off original price", "Local Google SEO & Maps"],
              secondaryTextColor: "text-indigo-100/85",
              footerBorder: "border-indigo-500/40",
              buttonStyle: "bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800",
              price: "R3,499",
              originalPrice: "R7,999",
              period: "once-off"
            },
            { 
              title: "AI Video Adverts", 
              desc: "High-converting promos compressed and tailored perfectly for WhatsApp Business, Facebook Lite, and local digital feeds.", 
              illustration: CometRocketIllustration,
              color: "text-white bg-purple-500/40 border-purple-400/30",
              dotColor: "bg-pink-200",
              badge: "Local Business Booster",
              borderColor: "border-pink-500/30 hover:border-pink-400/50",
              cardBg: "bg-gradient-to-br from-purple-600 via-purple-600 to-pink-600 text-white",
              shadow: "hover:shadow-[0_32px_64px_rgba(236,72,153,0.25)]",
              features: ["Perfect for WhatsApp & FB Statuses", "Save over 58% off original price", "Fluid animations & copy included"],
              secondaryTextColor: "text-purple-100/85",
              footerBorder: "border-purple-500/40",
              buttonStyle: "bg-white text-purple-700 hover:bg-purple-50 hover:text-purple-800",
              price: "R399",
              originalPrice: "R950",
              period: "per video"
            },
            { 
              title: "AI App Vibe Coding", 
              desc: "Affordable full-stack workflow and order tools built rapidly using AI code pipelines to optimize your local operations.", 
              illustration: ConstellationRobotIllustration,
              color: "text-white bg-emerald-500/40 border-emerald-400/30",
              dotColor: "bg-emerald-200",
              badge: "SMME Prototype Build",
              borderColor: "border-emerald-500/30 hover:border-emerald-400/50",
              cardBg: "bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 text-white",
              shadow: "hover:shadow-[0_32px_64px_rgba(16,185,129,0.25)]",
              features: ["Clean cloud dashboard states", "Save over 55% off original price", "Order & workflow management"],
              secondaryTextColor: "text-emerald-100/85",
              footerBorder: "border-emerald-500/40",
              buttonStyle: "bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800",
              price: "R8,999",
              originalPrice: "R19,999",
              period: "per prototype"
            }
          ].map((item) => {
            const Illustration = item.illustration;
            return (
              <div 
                key={item.title}
                className={`flex flex-col justify-between ${item.cardBg} border ${item.borderColor} p-6 sm:p-7 rounded-[32px] shadow-sm ${item.shadow} transition-all duration-500 hover:-translate-y-2.5 group`}
              >
                {/* 3D Space Scene Header */}
                <div className="mb-6">
                  <Illustration />
                </div>

                <div className="space-y-4">
                  {/* Category Badge & Label */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.color}`}>
                      {item.badge}
                    </span>
                    <span className={`text-[10px] ${item.secondaryTextColor} font-mono tracking-wide`}>Active Hub</span>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-extrabold text-white text-base sm:text-lg leading-tight tracking-tight">
                    {item.title}
                  </h4>
                  
                  {/* Description */}
                  <p className={`text-xs ${item.secondaryTextColor} leading-relaxed min-h-[36px]`}>
                    {item.desc}
                  </p>

                  {/* Price & Discount Indicator */}
                  <div className="flex items-baseline space-x-2 pt-1 pb-1">
                    <span className="text-xl font-display font-black text-white">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-[11px] line-through text-white/50 font-mono tracking-wide">
                        {item.originalPrice}
                      </span>
                    )}
                    <span className={`text-[10px] ${item.secondaryTextColor} font-mono`}>/ {item.period}</span>
                  </div>

                  {/* Highlighting 3 Bullet points of features */}
                  <div className={`space-y-2 pt-2 pb-4 border-t ${item.footerBorder}`}>
                    {item.features.map((feat) => (
                      <div key={feat} className="flex items-center text-[11px] text-white">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} mr-2`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Page Pagination Pill Indicator and Arrow Trigger */}
                <div className={`flex items-center justify-between pt-4 border-t ${item.footerBorder} mt-auto`}>
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-4 h-1.5 rounded-full ${item.dotColor} transition-all duration-300`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}/40`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}/40`} />
                  </div>
                  
                  <button
                    onClick={() => onTabChange("services")}
                    className={`flex items-center space-x-1.5 px-4.5 py-2 ${item.buttonStyle} rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg cursor-pointer`}
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
