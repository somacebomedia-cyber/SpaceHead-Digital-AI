import React from "react";
import { Code } from "lucide-react";

export default function ConstellationRobotIllustration() {
  return (
    <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-50/70 via-teal-50/50 to-cyan-50/60 flex items-center justify-center border border-white/80 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),0_4px_16px_rgba(209,250,229,0.4)] group">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:16px_16px] opacity-80" />

      {/* Stars and Twinkles */}
      <div className="absolute top-8 left-8 w-3 h-3 text-emerald-300/90 animate-twinkle-1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-12 w-4 h-4 text-teal-200/90 animate-twinkle-2">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      {/* Constellation Lines (Interactive SVG backdrop) */}
      <svg className="absolute inset-0 w-full h-full text-emerald-200/45 stroke-current pointer-events-none" viewBox="0 0 200 200" fill="none">
        {/* Star Nodes */}
        <circle cx="30" cy="50" r="2" fill="#34D399" />
        <circle cx="70" cy="20" r="2.5" fill="#10B981" />
        <circle cx="150" cy="40" r="1.5" fill="#6EE7B7" />
        <circle cx="170" cy="90" r="3" fill="#34D399" />
        <circle cx="40" cy="140" r="2" fill="#10B981" />
        <circle cx="100" cy="160" r="2" fill="#6EE7B7" />

        {/* Lines */}
        <line x1="30" y1="50" x2="70" y2="20" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="70" y1="20" x2="150" y2="40" strokeWidth="0.75" />
        <line x1="150" y1="40" x2="170" y2="90" strokeWidth="0.75" />
        <line x1="170" y1="90" x2="100" y2="160" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="40" y1="140" x2="30" y2="50" strokeWidth="0.75" />
        <line x1="40" y1="140" x2="100" y2="160" strokeWidth="0.75" />
      </svg>

      {/* Floating 3D Terminal / Code Console Overlay */}
      <div className="absolute left-6 bottom-5 w-28 bg-white/80 backdrop-blur-md border border-emerald-100 rounded-lg p-1.5 shadow-[0_6px_15px_-4px_rgba(16,185,129,0.12)] space-y-1 animate-float-medium group-hover:translate-x-1 transition-transform duration-300">
        <div className="flex items-center justify-between border-b border-emerald-50 pb-0.5 mb-1 text-[7px] font-mono text-emerald-600 font-bold">
          <span>vibe_coder.py</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="font-mono text-[7px] text-slate-400 space-y-0.5">
          <div className="text-emerald-500 font-semibold">&gt; deploy_app()</div>
          <div>loading matrix...</div>
          <div className="text-blue-400">status: active</div>
        </div>
      </div>

      {/* Floating 3D-styled Holographic Robot Droid */}
      <div className="absolute right-6 top-6 w-12 h-12 bg-gradient-to-tr from-teal-200 via-emerald-100 to-white border border-emerald-200/50 rounded-2xl p-1.5 shadow-[0_8px_16px_rgba(16,185,129,0.15)] flex flex-col items-center justify-between animate-float-slow group-hover:scale-110 transition-transform duration-300">
        {/* Robot visor */}
        <div className="w-full h-3 bg-slate-900 rounded-md flex items-center justify-center space-x-1">
          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
        </div>
        {/* Antenna */}
        <div className="w-1 h-1.5 bg-emerald-400 rounded-full" />
        {/* Cute details */}
        <div className="flex justify-between w-full text-[5px] text-teal-600 font-mono">
          <span>AI</span>
          <span>99%</span>
        </div>
      </div>

      {/* Main Glass Icon Container - Claymorphic 3D Squircle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(16,185,129,0.4),0_0_0_8px_rgba(209,250,229,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ease-out">
          <Code className="w-8 h-8 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
        </div>
      </div>

      {/* Unique Design Story Watermark Accent */}
      <span className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-emerald-400/55 uppercase font-bold">
        Matrix Station
      </span>
    </div>
  );
}
