import { Layers, Github, ExternalLink } from "lucide-react";
import SpaceHeadLogo from "./SpaceHeadLogo";

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
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
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("services")} 
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Specializations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("projects")} 
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Bespoke Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("blogs")} 
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Growth Insights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onTabChange("contact")} 
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                >
                  Request Consultation
                </button>
              </li>
            </ul>
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
