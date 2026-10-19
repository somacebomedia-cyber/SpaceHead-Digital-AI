import React from "react";

/**
 * Shimmer placeholder skeleton for project cards.
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
      {/* Video / Image canvas shimmer */}
      <div className="relative aspect-video w-full bg-slate-200/70 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
      {/* Content lines */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-200 rounded-md" />
            <div className="h-3 w-12 bg-slate-200 rounded-md" />
          </div>
          <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full bg-slate-200/80 rounded" />
            <div className="h-3 w-4/5 bg-slate-200/80 rounded" />
          </div>
        </div>
        <div className="flex gap-1.5 pt-2">
          <div className="h-5 w-14 bg-slate-100 rounded-md" />
          <div className="h-5 w-16 bg-slate-100 rounded-md" />
          <div className="h-5 w-12 bg-slate-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Shimmer placeholder skeleton for blog cards.
 */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs animate-pulse flex flex-col justify-between h-64 border-l-4 border-l-slate-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-200 rounded-md" />
          <div className="h-3 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 w-4/5 bg-slate-200 rounded-md" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full bg-slate-200/70 rounded" />
          <div className="h-3 w-5/6 bg-slate-200/70 rounded" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-1.5">
          <div className="h-4 w-12 bg-slate-100 rounded" />
          <div className="h-4 w-14 bg-slate-100 rounded" />
        </div>
        <div className="h-4 w-20 bg-purple-100 rounded" />
      </div>
    </div>
  );
}
