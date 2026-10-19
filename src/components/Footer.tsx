import { Layers, Github, ExternalLink, MessageCircle, Mail, Phone } from "lucide-react";
import SpaceHeadLogo from "./SpaceHeadLogo";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_RAW,
  CONTACT_EMAIL,
  whatsappLinkWithMessage,
} from "../lib/contactInfo";

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <SpaceHeadLogo size={36} />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight text-white">
                SpaceHead <span className="text-purple-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bespoke high-performance websites, cinematic promo video ads, and next-generation AI App Vibe Coding for elite South African brands. Driven by modern AI-assisted craft.
            </p>
          </div>

          <div>
            <h3 className="font-sans font-semibold text-white text-sm tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onTabChange("home")} 
                  className="text-link hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("services")} 
                  className="text-link hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Specializations & Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("estimator")} 
                  className="text-link hover:text-white transition-colors focus:outline-none focus:underline flex items-center space-x-1.5"
                >
                  <span>AI Scope Estimator</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-300">
                    PDF
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("projects")} 
                  className="text-link hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Bespoke Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("blogs")} 
                  className="text-link hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Growth Insights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("contact")} 
                  className="text-link hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Request Consultation
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-sans font-semibold text-white text-sm tracking-wider uppercase mb-4">Direct Connect</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={`https://wa.me/${CONTACT_PHONE_RAW}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>WhatsApp: {CONTACT_PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_RAW}`}
                  className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span>Call: {CONTACT_PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              WhatsApp Business Line Online
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SpaceHead AI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1">
              <span>Johannesburg &middot; Cape Town</span>
              <span className="bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">South Africa</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
