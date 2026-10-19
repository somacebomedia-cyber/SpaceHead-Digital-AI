import React from "react";
import { Project, BlogPost } from "../types";
import SpaceHeadLogo from "./SpaceHeadLogo";
import SEO, { DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA } from "./SEO";
import { 
  ArrowRight, 
  Briefcase,
  Laptop,
  Video,
  Code,
  Mail,
  Calculator
} from "lucide-react";
import ServiceCard from "./ServiceCard";
import DeviceShowcase from "./DeviceShowcase";
import ClientShowcase from "./ClientShowcase";
import TestimonialsStrip from "./TestimonialsStrip";
import { SERVICES } from "../data/services";

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
        title="Web Design, Video Ads & SEO for South African Businesses"
        description="High-converting bespoke websites, animated promotional video ads, PayFast payments, and local SEO for businesses across Johannesburg, Cape Town, Durban and South Africa."
        canonicalUrl="https://spaceheadai.co.za"
        keywords={[
          "web design south africa",
          "website designer johannesburg",
          "cape town web design",
          "durban digital marketing",
          "local business websites za",
          "video ads south africa",
          "payfast website integration",
          "google maps local seo south africa",
          "south african small business marketing",
          "affordable web design packages zar"
        ]}
        geoRegion="ZA"
        geoPlacename="South Africa"
        breadcrumbs={[
          { name: "Home", item: "https://spaceheadai.co.za" }
        ]}
        jsonLd={[
          DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA,
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SpaceHead AI",
            "url": "https://spaceheadai.co.za",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://spaceheadai.co.za/services?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        ]}
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

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onTabChange("contact")}
                className="btn-signature w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Request Custom Consult</span>
              </button>
              <button
                onClick={() => onTabChange("services")}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-transparent hover:bg-slate-900 text-slate-200 rounded-xl font-bold text-sm border border-slate-700 cursor-pointer"
              >
                <span>Explore Specializations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Badges inside Hero */}
            <div className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-bold text-white font-display">240+</span>
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

          {/* Device Showcase (MacBook Pro + iPhone renders) */}
          <div className="lg:col-span-6">
            <DeviceShowcase />
          </div>

        </div>
      </section>

      {/* Client Showcase Section - Social Proof Partner Company Logo Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientShowcase
          onExplorePortfolio={() => onTabChange("portfolio")}
          onSelectProject={onSelectProject}
          projects={projects}
        />
      </section>

      {/* Interactive AI Estimator Callout Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">
                  Interactive AI Project Estimator & Scope Calculator
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline">
                  Instant PDF Proposals
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your custom web app or SaaS requirements, simulate business ROI, and download a branded PDF quotation in real time.
              </p>
            </div>
          </div>

          <button
            onClick={() => onTabChange("estimator")}
            className="flex-shrink-0 inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>Launch Estimator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Benefit Cards — shared ServiceCard component, kept in sync with ServicesPage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-3">
          {SERVICES.map((item) => (
            <ServiceCard
              key={item.id}
              data={item}
              ctaLabel="View Details"
              onCta={() => onTabChange("services")}
            />
          ))}
        </div>
      </section>

      {/* Social Proof & Client Testimonials Strip */}
      <section className="px-4 sm:px-6 lg:px-8">
        <TestimonialsStrip onNavigateToServices={() => onTabChange("services")} />
      </section>
    </div>
  );
}
