import React from "react";
import { Video } from "lucide-react";

export default function CometRocketIllustration() {
  return (
    <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-2xl bg-gradient-to-tr from-purple-50/70 via-pink-50/50 to-orange-50/60 flex items-center justify-center border border-white/80 shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),0_4px_16px_rgba(253,242,248,0.4)] group">
      {/* Background Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.04)_1px,transparent_1px)] bg-[size:16px_16px] opacity-80" />

      {/* Stars and Twinkles */}
      <div className="absolute top-6 right-6 w-3.5 h-3.5 text-pink-300/90 animate-twinkle-2">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>
      <div className="absolute bottom-10 left-10 w-3 h-3 text-amber-200/95 animate-twinkle-1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      {/* Puffy 3D Space Clouds (Santorini style) */}
      <div className="absolute -bottom-6 left-0 right-0 h-16 flex items-end justify-center space-x-[-12px] opacity-80 pointer-events-none">
        <div className="w-24 h-12 rounded-full bg-white shadow-[0_-4px_12px_rgba(244,63,94,0.04),inset_0_-8px_16px_rgba(245,243,255,0.8)]" />
        <div className="w-32 h-16 rounded-full bg-purple-100/90 shadow-[0_-6px_16px_rgba(139,92,246,0.06),inset_0_-8px_20px_rgba(255,255,255,0.9)] animate-float-fast" />
        <div className="w-20 h-10 rounded-full bg-white shadow-[0_-4px_12px_rgba(244,63,94,0.04),inset_0_-8px_12px_rgba(245,243,255,0.8)]" />
      </div>

      {/* Exuding Comet Flame Path / Rocket Exhaust */}
      <div className="absolute bottom-6 left-1/4 transform -translate-x-1/2 w-8 h-24 bg-gradient-to-t from-transparent via-amber-200/60 to-pink-300/80 rounded-full blur-[3px] rotate-[-35deg] pointer-events-none flex flex-col justify-end items-center pb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      </div>

      {/* Mini Rocket Ship Blasting Off */}
      <div className="absolute bottom-12 left-1/3 transform -translate-x-1/2 rotate-[-35deg] animate-float-slow group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500">
        <svg className="w-10 h-14 drop-shadow-[0_4px_8px_rgba(236,72,153,0.3)]" viewBox="0 0 24 36" fill="none">
          {/* Rocket Body */}
          <path d="M12 2C12 2 18 10 18 18C18 24 16 26 12 26C8 26 6 24 6 18C6 10 12 2 12 2Z" fill="url(#rocketGrad)" />
          {/* Rocket Wings */}
          <path d="M6 18C4 19 2 24 2 26C2 28 6 27 6 27V18Z" fill="#F472B6" />
          <path d="M18 18C20 19 22 24 22 26C22 28 18 27 18 27V18Z" fill="#F472B6" />
          {/* Rocket Nose Cone */}
          <path d="M12 2C12 2 15 7 15 10H9C9 7 12 2 12 2Z" fill="#DB2777" />
          {/* Port Hole */}
          <circle cx="12" cy="15" r="3" fill="#E0F2FE" stroke="#DB2777" strokeWidth="1.5" />
          <defs>
            <linearGradient id="rocketGrad" x1="12" y1="2" x2="12" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="50%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Translucent Media Playback Panel */}
      <div className="absolute right-8 top-6 w-28 bg-white/75 backdrop-blur-md border border-purple-100 rounded-xl p-1.5 shadow-[0_8px_20px_-4px_rgba(139,92,246,0.15)] flex items-center space-x-2 animate-float-medium group-hover:scale-105 transition-all duration-300">
        <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <div className="w-12 h-1.5 bg-purple-200/80 rounded" />
          <div className="w-8 h-1 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Main Glass Icon Container - Claymorphic 3D Squircle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),0_12px_24px_-4px_rgba(139,92,246,0.4),0_0_0_8px_rgba(243,232,255,0.6)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ease-out">
          <Video className="w-8 h-8 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
        </div>
      </div>

      {/* Unique Design Story Watermark Accent */}
      <span className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-purple-400/55 uppercase font-bold">
        Comet Cine
      </span>
    </div>
  );
}
