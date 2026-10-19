import React, { useState } from "react";
import { ArrowUpRight, ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import { Project } from "../types";

interface ClientShowcaseProps {
  onExplorePortfolio?: () => void;
  onSelectProject?: (project: Project) => void;
  projects?: Project[];
}

interface PartnerClient {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  location: string;
  deliverable: string;
  liveUrl?: string;
  projectId?: string;
  metrics: string;
  badge?: string;
  renderLogo: (isHovered: boolean) => React.ReactNode;
}

export default function ClientShowcase({
  onExplorePortfolio,
  onSelectProject,
  projects = [],
}: ClientShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const partners: PartnerClient[] = [
    {
      id: "partner-nawilearn",
      name: "Nawi Learn Toddler Center",
      shortName: "Nawi Learn",
      industry: "Early Childhood Development",
      location: "Umzimkhulu, KZN",
      deliverable: "Custom Web Platform & Google SEO",
      liveUrl: "https://www.nawilearn.co.za",
      projectId: "proj-web-nawilearn",
      metrics: "3x parent inquiry surge",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="Nawi Learn Toddler Center Logo"
        >
          {/* Emblem: Sunburst Seedling */}
          <g className={`transition-colors duration-300 ${hovered ? "text-amber-500" : "text-slate-700"}`}>
            <circle cx="24" cy="24" r="18" fill="currentColor" fillOpacity={hovered ? "0.15" : "0.08"} />
            <path
              d="M24 13V17M32 16L29 19M16 16L19 19M13 24H17M31 24H35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M19 28C19 25 24 22 24 22C24 22 29 25 29 28C29 31 24 33 24 33C24 33 19 31 19 28Z"
              fill={hovered ? "#F59E0B" : "currentColor"}
            />
          </g>
          {/* Wordmark */}
          <text
            x="48"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="14"
            fontWeight="700"
            letterSpacing="-0.3px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            NAWI LEARN
          </text>
          <text
            x="48"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="0.8px"
            className="fill-slate-400 uppercase font-mono"
          >
            Toddler Center · ECD
          </text>
        </svg>
      ),
    },
    {
      id: "partner-esayidi",
      name: "Esayidi TVET Incubation Hub",
      shortName: "Esayidi Hub",
      industry: "Higher Ed & Enterprise Incubation",
      location: "Port Shepstone, KZN",
      deliverable: "IncuTrack AI Web Application",
      projectId: "proj-saas-incutrack",
      metrics: "36 mos. automated tracking",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="Esayidi TVET Incubation Hub Logo"
        >
          {/* Emblem: Modular Hexagonal Network */}
          <g className={`transition-colors duration-300 ${hovered ? "text-indigo-600" : "text-slate-700"}`}>
            <rect
              x="8"
              y="10"
              width="28"
              height="28"
              rx="7"
              fill="currentColor"
              fillOpacity={hovered ? "0.15" : "0.08"}
            />
            <path
              d="M16 18H28M16 24H25M16 30H28"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="28" cy="24" r="2.5" fill={hovered ? "#4F46E5" : "currentColor"} />
          </g>
          {/* Wordmark */}
          <text
            x="44"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="13.5"
            fontWeight="700"
            letterSpacing="-0.2px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            ESAYIDI TVET
          </text>
          <text
            x="44"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="500"
            letterSpacing="0.6px"
            className="fill-slate-400 uppercase font-mono"
          >
            Incubation Center
          </text>
        </svg>
      ),
    },
    {
      id: "partner-nurserynet",
      name: "NurseryNet Platform",
      shortName: "NurseryNet",
      industry: "EdTech & Childcare Ecosystem",
      location: "South Africa",
      deliverable: "Cloud Discovery & AI Matching Suite",
      liveUrl: "https://nursery-net.vercel.app/",
      projectId: "proj-saas-nurserynet",
      metrics: "Live on Vercel Preview",
      badge: "In Development",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="NurseryNet Logo"
        >
          {/* Emblem: Connected Community Loops */}
          <g className={`transition-colors duration-300 ${hovered ? "text-violet-600" : "text-slate-700"}`}>
            <circle cx="18" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" />
            <circle
              cx="28"
              cy="24"
              r="10"
              stroke={hovered ? "#8B5CF6" : "currentColor"}
              strokeWidth="2.5"
              strokeDasharray="2 2"
            />
            <circle cx="23" cy="24" r="3.5" fill={hovered ? "#8B5CF6" : "currentColor"} />
          </g>
          {/* Wordmark */}
          <text
            x="45"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="14.5"
            fontWeight="700"
            letterSpacing="-0.3px"
            className={`transition-colors duration-300 ${hovered ? "fill-violet-950" : "fill-slate-800"}`}
          >
            Nursery<span className={hovered ? "fill-violet-600" : "fill-slate-600"}>Net</span>
          </text>
          <text
            x="45"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="0.5px"
            className="fill-slate-400 uppercase font-mono"
          >
            Preschool Network
          </text>
        </svg>
      ),
    },
    {
      id: "partner-stacfund",
      name: "StacFund AI Platform",
      shortName: "StacFund",
      industry: "FinTech & AI Venture Capital",
      location: "South Africa",
      deliverable: "Gamified Grants & Pitch Deck Engine",
      liveUrl: "https://stac-fund-ai.vercel.app/",
      projectId: "proj-saas-stacfund",
      metrics: "Live on Vercel Preview",
      badge: "In Development",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="StacFund Logo"
        >
          {/* Emblem: Ascending Stacked Capital Node */}
          <g className={`transition-colors duration-300 ${hovered ? "text-emerald-500" : "text-slate-700"}`}>
            <rect x="8" y="24" width="8" height="12" rx="2" fill="currentColor" fillOpacity={hovered ? "0.9" : "0.7"} />
            <rect x="18" y="18" width="8" height="18" rx="2" fill="currentColor" fillOpacity={hovered ? "0.9" : "0.7"} />
            <rect x="28" y="12" width="8" height="24" rx="2" fill={hovered ? "#10B981" : "currentColor"} />
            <path
              d="M12 18L24 10L32 6"
              stroke={hovered ? "#34D399" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 2"
            />
          </g>
          {/* Wordmark */}
          <text
            x="44"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="14.5"
            fontWeight="800"
            letterSpacing="-0.2px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            Stac<span className={hovered ? "fill-emerald-600" : "fill-slate-600"}>Fund</span>
          </text>
          <text
            x="44"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="0.5px"
            className="fill-slate-400 uppercase font-mono"
          >
            AI Capital & Grants
          </text>
        </svg>
      ),
    },
    {
      id: "partner-capecoastal",
      name: "Cape Coastal Logistics",
      shortName: "Cape Coastal",
      industry: "Freight & Supply Chain Logistics",
      location: "Cape Town, Western Cape",
      deliverable: "Digital Tender Intake & Web Portal",
      metrics: "Secured 2 enterprise bids",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="Cape Coastal Logistics Logo"
        >
          {/* Emblem: Twin Precision Wave Chevrons */}
          <g className={`transition-colors duration-300 ${hovered ? "text-cyan-600" : "text-slate-700"}`}>
            <path
              d="M10 28L20 16L30 28"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 32L20 27L24 32"
              stroke={hovered ? "#0891B2" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          {/* Wordmark */}
          <text
            x="40"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="12.5"
            fontWeight="800"
            letterSpacing="-0.1px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            CAPE COASTAL
          </text>
          <text
            x="40"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.8px"
            className="fill-slate-400 uppercase font-mono"
          >
            Logistics & Freight
          </text>
        </svg>
      ),
    },
    {
      id: "partner-apex",
      name: "Apex Performance Studio",
      shortName: "Apex Performance",
      industry: "Athletics & Physical Conditioning",
      location: "Sandton, Johannesburg",
      deliverable: "30s AI Video Advert Series",
      metrics: "40+ trial bookings/mo",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="Apex Performance Studio Logo"
        >
          {/* Emblem: Kinetic Prism Delta */}
          <g className={`transition-colors duration-300 ${hovered ? "text-rose-600" : "text-slate-700"}`}>
            <polygon
              points="20,12 30,32 10,32"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinejoin="round"
              fill={hovered ? "rgba(225, 29, 72, 0.1)" : "none"}
            />
            <line x1="20" y1="20" x2="20" y2="32" stroke="currentColor" strokeWidth="2" />
          </g>
          {/* Wordmark */}
          <text
            x="39"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="14"
            fontWeight="800"
            letterSpacing="0.5px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            APEX
          </text>
          <text
            x="77"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="12.5"
            fontWeight="400"
            letterSpacing="-0.2px"
            className="fill-slate-500"
          >
            STUDIO
          </text>
          <text
            x="39"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="500"
            letterSpacing="0.6px"
            className="fill-slate-400 uppercase font-mono"
          >
            Sandton · High Perf
          </text>
        </svg>
      ),
    },
    {
      id: "partner-sithole",
      name: "Sithole Aesthetic Wellness",
      shortName: "Sithole Wellness",
      industry: "Medical Practice & Wellness Care",
      location: "Pretoria East, Gauteng",
      deliverable: "Practice Website & Digital Intake",
      metrics: "70% digital appointment shift",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="Sithole Aesthetic Wellness Logo"
        >
          {/* Emblem: Minimalist Botanical Cross */}
          <g className={`transition-colors duration-300 ${hovered ? "text-emerald-600" : "text-slate-700"}`}>
            <circle cx="20" cy="24" r="11" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M20 16V32M12 24H28"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="24" r="2" fill={hovered ? "#059669" : "currentColor"} />
          </g>
          {/* Wordmark */}
          <text
            x="39"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="13"
            fontWeight="700"
            letterSpacing="-0.2px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            DR. SITHOLE
          </text>
          <text
            x="39"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="500"
            letterSpacing="0.7px"
            className="fill-slate-400 uppercase font-mono"
          >
            Aesthetic Practice
          </text>
        </svg>
      ),
    },
    {
      id: "partner-zenith",
      name: "Zenith Global Trading",
      shortName: "Zenith Global",
      industry: "Financial Advisory & Commodity FX",
      location: "Johannesburg, Gauteng",
      deliverable: "Real-Time Commodity FX Portal",
      projectId: "proj-saas-zenith",
      metrics: "Live market rates & sync",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="Zenith Global Trading Logo"
        >
          {/* Emblem: Dual Orbital Ellipses */}
          <g className={`transition-colors duration-300 ${hovered ? "text-blue-600" : "text-slate-700"}`}>
            <ellipse
              cx="20"
              cy="24"
              rx="12"
              ry="6"
              transform="rotate(-25 20 24)"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <ellipse
              cx="20"
              cy="24"
              rx="12"
              ry="6"
              transform="rotate(25 20 24)"
              stroke={hovered ? "#2563EB" : "currentColor"}
              strokeWidth="1.8"
            />
          </g>
          {/* Wordmark */}
          <text
            x="40"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="13.5"
            fontWeight="800"
            letterSpacing="0.2px"
            className={`transition-colors duration-300 ${hovered ? "fill-slate-900" : "fill-slate-800"}`}
          >
            ZENITH
          </text>
          <text
            x="40"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.8px"
            className="fill-slate-400 uppercase font-mono"
          >
            Global Markets
          </text>
        </svg>
      ),
    },
    {
      id: "partner-studioflow",
      name: "StudioFlow Creative Suite",
      shortName: "StudioFlow",
      industry: "Audio-Visual Media & Production",
      location: "Durban, KwaZulu-Natal",
      deliverable: "Asset Pipeline & Creator Hub",
      projectId: "proj-saas-studioflow",
      metrics: "Centralized cloud assets",
      renderLogo: (hovered) => (
        <svg
          viewBox="0 0 200 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto max-w-[170px] transition-all duration-300"
          aria-label="StudioFlow Creative Suite Logo"
        >
          {/* Emblem: Dynamic Soundwave Matrix */}
          <g className={`transition-colors duration-300 ${hovered ? "text-purple-600" : "text-slate-700"}`}>
            <rect x="8" y="20" width="3" height="8" rx="1.5" fill="currentColor" />
            <rect x="14" y="14" width="3" height="20" rx="1.5" fill="currentColor" />
            <rect x="20" y="8" width="3" height="32" rx="1.5" fill={hovered ? "#9333EA" : "currentColor"} />
            <rect x="26" y="16" width="3" height="16" rx="1.5" fill="currentColor" />
            <rect x="32" y="22" width="3" height="4" rx="1.5" fill="currentColor" />
          </g>
          {/* Wordmark */}
          <text
            x="44"
            y="23"
            fontFamily="system-ui, sans-serif"
            fontSize="14"
            fontWeight="700"
            letterSpacing="-0.3px"
            className={`transition-colors duration-300 ${hovered ? "fill-purple-950" : "fill-slate-800"}`}
          >
            Studio<span className={hovered ? "fill-purple-600" : "fill-slate-500"}>Flow</span>
          </text>
          <text
            x="44"
            y="35"
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="0.5px"
            className="fill-slate-400 uppercase font-mono"
          >
            Creative Cloud
          </text>
        </svg>
      ),
    },
  ];

  const handleCardClick = (partner: PartnerClient) => {
    // If it has a direct external live URL (e.g. Vercel or live domain), user can open it
    if (partner.liveUrl) {
      window.open(partner.liveUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // If it links to a known portfolio project, select it
    if (partner.projectId && onSelectProject && projects.length > 0) {
      const found = projects.find((p) => p.id === partner.projectId);
      if (found) {
        onSelectProject(found);
        return;
      }
    }

    // Default fallback to portfolio tab
    if (onExplorePortfolio) {
      onExplorePortfolio();
    }
  };

  return (
    <section
      id="client-showcase-section"
      aria-label="Client & Partner Showcase"
      className="w-full bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all shadow-sm"
    >
      {/* Top Quiet Header with Zero-Pill Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 tracking-wider uppercase">
            <span className="text-indigo-600 font-bold">Client Showcase</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Commercial Trust & Deployment Record</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Partnered with South Africa&apos;s Ambitious Brands
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            From licensed educational institutes and TVET enterprise incubators to logistics fleets and modern SaaS startups, our engineering delivers verified operational uptime and measurable growth.
          </p>
        </div>

        {onExplorePortfolio && (
          <button
            type="button"
            onClick={onExplorePortfolio}
            className="self-start md:self-auto inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 transition-colors shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <span>View Full Case Studies</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 8-Logo Partner Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
        {partners.map((partner) => {
          const isHovered = hoveredId === partner.id;

          return (
            <div
              key={partner.id}
              onMouseEnter={() => setHoveredId(partner.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(partner)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(partner);
                }
              }}
              className="group relative flex flex-col justify-between bg-white hover:bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              {/* Top row: Brand Logo + External Indicator */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center">
                  {partner.renderLogo(isHovered)}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 group-hover:text-indigo-600">
                  {partner.liveUrl ? (
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Middle & Bottom: Unboxed Metadata & Outcome Metric */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-950 transition-colors">
                  {partner.deliverable}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-sans">
                  <span>{partner.industry}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-mono text-[10px] text-slate-400">{partner.location}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span className="line-clamp-1">{partner.metrics}</span>
                  </div>

                  {partner.badge && (
                    <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                      {partner.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Proof Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Real, active South African deployments verified with direct founder collaboration.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>Fast Turnarounds</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span>Zero Retainer Lock-in</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span>50% Milestone Payments</span>
        </div>
      </div>
    </section>
  );
}
