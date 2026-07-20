import React from "react";
import { Laptop } from "lucide-react";

export default function OrbitPlanetIllustration() {
  return (
    <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-50/70 via-indigo-50/50 to-purple-50/60 flex items-center justify-center border border-white/80 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),0_4px_16px_rgba(224,231,255,0.4)] group">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.06)_1px,transparent_1px)] bg-[size:16px_16px] opacity-80" />
      
      {/* Stars and Twinkles */}
      <div className="absolute top-4 left-6 w-3 h-3 text-amber-200/90 animate-twinkle-1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-8 w-4 h-4 text-pink-200/90 animate-twinkle-2">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>
      <div className="absolute top-10 right-14 w-2 h-2 text-indigo-200/80 animate-twinkle-1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      {/* Orbit paths */}
      <div className="absolute w-44 h-44 border border-dashed border-indigo-200/60 rounded-full animate-orbit-slow pointer-events-none flex items-center justify-center">
        {/* Tiny pastel planet orbiting */}
        <div className="absolute -top-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-pink-300 to-rose-300 shadow-[0_2px_6px_rgba(244,63,94,0.3)]" />
      </div>
      <div className="absolute w-56 h-28 border border-dashed border-purple-200/40 rounded-full rotate-[15deg] pointer-events-none flex items-center justify-center">
        {/* Another tiny companion node */}
        <div className="absolute right-0 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_2px_4px_rgba(34,211,238,0.3)]" />
      </div>

      {/* Big 3D Pastel Planet Core */}
      <div className="absolute -bottom-8 -right-4 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 shadow-[inset_-4px_-4px_16px_rgba(139,92,246,0.15),inset_4px_4px_16px_rgba(255,255,255,0.8),0_12px_28px_rgba(165,180,252,0.35)] animate-float-slow flex items-center justify-center">
        {/* Saturn Ring Overlay (Back) */}
        <div className="absolute w-[160%] h-3.5 border-[5px] border-indigo-200/40 rounded-full rotate-[-12deg] -translate-y-1 transform scale-y-[0.25] pointer-events-none" />
        {/* Saturn Ring Overlay (Front) */}
        <div className="absolute w-[160%] h-3.5 border-[5px] border-indigo-300/60 rounded-full rotate-[-12deg] -translate-y-1 transform scale-y-[0.25] clip-path-front pointer-events-none" />
      </div>

      {/* Interactive Floating 3D Device Card / Laptop Frame */}
      <div className="absolute left-1/3 transform -translate-x-1/2 -translate-y-2 w-32 bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-[0_12px_24px_-4px_rgba(99,102,241,0.15),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-indigo-50/80 animate-float-medium group-hover:scale-105 transition-all duration-500">
        <div className="flex items-center space-x-1 mb-1.5 pb-1 border-b border-indigo-100/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
        </div>
        <div className="space-y-1">
          <div className="w-3/4 h-2 bg-indigo-100/80 rounded" />
          <div className="w-full h-1.5 bg-slate-50 rounded" />
          <div className="grid grid-cols-3 gap-1 pt-1">
            <div className="h-4 bg-purple-50 rounded" />
            <div className="h-4 bg-indigo-50 rounded" />
            <div className="h-4 bg-blue-50 rounded" />
          </div>
        </div>
      </div>

      {/* Main Glass Icon Container - Claymorphic 3D Squircle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(99,102,241,0.4),0_0_0_8px_rgba(224,231,255,0.6)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
          <Laptop className="w-8 h-8 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
        </div>
      </div>

      {/* Miniature Floating Satellite */}
      <div className="absolute top-6 right-1/4 w-8 h-8 bg-white/90 border border-indigo-100 rounded-lg p-1 shadow-[0_6px_12px_rgba(99,102,241,0.1)] flex items-center justify-center animate-float-fast group-hover:-translate-x-1.5 group-hover:-translate-y-1 transition-all duration-300">
        <div className="w-2 h-2 rounded-full bg-indigo-500 relative">
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
        </div>
        <div className="absolute -left-2 w-1.5 h-3 bg-indigo-100 rounded-sm" />
        <div className="absolute -right-2 w-1.5 h-3 bg-indigo-100 rounded-sm" />
      </div>

      {/* Unique Design Story Watermark Accent */}
      <span className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-indigo-400/55 uppercase font-bold">
        Orbit Portal
      </span>
    </div>
  );
}
