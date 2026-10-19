import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_RAW,
  whatsappLinkWithMessage,
} from "../lib/contactInfo";

interface FloatingWhatsAppWidgetProps {
  onNavigateToServices?: () => void;
}

const QUICK_PROMPTS = [
  {
    icon: "🌐",
    label: "Website Quote",
    text: "Hi SpaceHead AI, I'd like an estimated quote and timeline for a new website for my business.",
  },
  {
    icon: "🎬",
    label: "AI Video Advert",
    text: "Hi SpaceHead AI, I'm interested in creating an animated promotional video advert for WhatsApp & social media.",
  },
  {
    icon: "💳",
    label: "Pricing & Installments",
    text: "Hi SpaceHead AI, I have a few questions regarding your 50% deposit and monthly installment packages.",
  },
  {
    icon: "⚡",
    label: "Urgent Project Launch",
    text: "Hi SpaceHead AI, I have an urgent project deadline. How quickly can we kick off and launch?",
  },
];

export default function FloatingWhatsAppWidget({
  onNavigateToServices,
}: FloatingWhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOpenPrompt = (text: string) => {
    setHasInteracted(true);
    const url = whatsappLinkWithMessage(text);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    setHasInteracted(true);
    const url = whatsappLinkWithMessage(customMessage.trim());
    window.open(url, "_blank", "noopener,noreferrer");
    setCustomMessage("");
    setIsOpen(false);
  };

  return (
    <div
      ref={popoverRef}
      id="floating-whatsapp-container"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Quick Chat Popover Card */}
      {isOpen && (
        <div
          id="whatsapp-chat-popover"
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-fade-in transition-all"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 sm:p-5 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-display font-extrabold text-white text-base border border-white/30 shadow-xs">
                  SH
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-700 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-display font-bold text-sm text-white">SpaceHead Studio</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300/30" />
                </div>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-mono">
                  <span>Direct WhatsApp Line</span>
                  <span>·</span>
                  <span className="text-emerald-200">Online</span>
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[10px] text-emerald-100 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-300" />
                <span>Replies in ~15 mins</span>
              </span>
              <span>Mon–Sat 8am–7pm</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[60vh] overflow-y-auto bg-slate-50/50">
            <div className="bg-white border border-slate-200/70 p-3.5 rounded-2xl shadow-xs space-y-1">
              <p className="text-xs font-semibold text-slate-800">
                Hi there! 👋 How can we help your business?
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Choose a prompt below to launch WhatsApp instantly, or type a custom question:
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-1">
                Quick Prompts:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleOpenPrompt(prompt.text)}
                    className="w-full text-left bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{prompt.icon}</span>
                      <span className="font-semibold text-xs">{prompt.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message Input */}
            <form onSubmit={handleSendCustomMessage} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type a message or brief question..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!customMessage.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Call alternative note */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <a
                href={`tel:${CONTACT_PHONE_RAW}`}
                className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call {CONTACT_PHONE_DISPLAY}</span>
              </a>
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Spam-Free</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
        aria-expanded={isOpen}
        aria-label="Chat on WhatsApp"
        className="group flex items-center space-x-2.5 px-4 py-3 sm:px-4.5 sm:py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/20 active:scale-95"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" />
          {!hasInteracted && !isOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold font-sans tracking-tight leading-none">
            WhatsApp
          </span>
          <span className="text-[9.5px] text-emerald-100 font-mono leading-none mt-0.5">
            Quick Quote
          </span>
        </div>
      </button>
    </div>
  );
}
