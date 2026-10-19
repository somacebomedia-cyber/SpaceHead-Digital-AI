import React, { useState } from "react";
import { ListOrdered, ChevronDown, ChevronUp, Hash, BookOpen } from "lucide-react";

export interface HeadingItem {
  id: string;
  text: string;
  level: number; // 2 or 3
}

interface ArticleTableOfContentsProps {
  headings: HeadingItem[];
  activeId: string;
  onSelectHeading: (id: string) => void;
}

export default function ArticleTableOfContents({
  headings,
  activeId,
  onSelectHeading,
}: ArticleTableOfContentsProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC Drawer/Dropdown */}
      <div className="lg:hidden mb-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <ListOrdered className="w-4 h-4 text-purple-600" />
            <span>Table of Contents ({headings.length} sections)</span>
          </div>
          {isOpenMobile ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isOpenMobile && (
          <nav className="mt-3 pt-3 border-t border-slate-200/70 space-y-1 max-h-60 overflow-y-auto">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    onSelectHeading(h.id);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-colors block truncate cursor-pointer ${
                    h.level === 3 ? "pl-5 text-[11px]" : "font-semibold"
                  } ${
                    isActive
                      ? "bg-purple-100/70 text-purple-800 font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {h.text}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900 leading-tight">
                Table of Contents
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                {headings.length} Key Sections
              </p>
            </div>
          </div>

          <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onSelectHeading(h.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xl text-xs transition-all flex items-start space-x-2 group cursor-pointer ${
                    h.level === 3 ? "pl-5 text-[11px] text-slate-500" : "font-medium text-slate-700"
                  } ${
                    isActive
                      ? "bg-purple-50 text-purple-700 font-bold border border-purple-200/60"
                      : "hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Hash
                    className={`w-3 h-3 mt-0.5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-purple-600"
                        : "text-slate-300 group-hover:text-slate-400"
                    }`}
                  />
                  <span className="leading-snug line-clamp-2">{h.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
