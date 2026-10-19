import { useState, useMemo, useTransition } from "react";
import { 
  PROJECT_ARCHETYPES, 
  FEATURE_MODULES, 
  calculateProjectEstimate, 
  EstimateSummary,
  ProjectArchetype,
  FeatureModule
} from "../data/estimatorConfig";
import { 
  generateBrandedProposalPDF, 
  ClientProposalInfo, 
  ProposalAiAnalysis 
} from "../lib/pdfProposalGenerator";
import ProposalPreviewModal from "./ProposalPreviewModal";
import SEO, { DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA } from "./SEO";
import { 
  Sparkles, 
  Calculator, 
  Download, 
  Check, 
  Clock, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Database, 
  Bot, 
  BarChart3, 
  Send, 
  FileText, 
  Video, 
  Zap, 
  LayoutDashboard, 
  ShoppingCart, 
  Globe, 
  Rocket,
  ArrowRight,
  HelpCircle,
  Eye,
  MessageCircle,
  RotateCcw
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { whatsappLinkWithMessage } from "../lib/contactInfo";

interface ProjectEstimatorProps {
  onNavigateToServices?: () => void;
  onNavigateToContact?: () => void;
}

export default function ProjectEstimator({
  onNavigateToServices,
  onNavigateToContact,
}: ProjectEstimatorProps) {
  // Config state
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>("web_app");
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "auth_rbac",
    "db_cloud",
    "analytics_dash",
  ]);

  // Interactive ROI parameters
  const [manualHoursPerWeek, setManualHoursPerWeek] = useState<number>(8);
  const [monthlyInquiries, setMonthlyInquiries] = useState<number>(35);

  // Client Details state
  const [clientInfo, setClientInfo] = useState<ClientProposalInfo>({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    briefNotes: "",
  });

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ProposalAiAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Proposal modal state
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<boolean>(false);

  // Calculate live estimate summary
  const summary: EstimateSummary = useMemo(() => {
    return calculateProjectEstimate(
      selectedArchetypeId,
      selectedModuleIds,
      manualHoursPerWeek,
      monthlyInquiries
    );
  }, [selectedArchetypeId, selectedModuleIds, manualHoursPerWeek, monthlyInquiries]);

  // Archetype change handler
  const handleSelectArchetype = (archetype: ProjectArchetype) => {
    setSelectedArchetypeId(archetype.id);
    // Keep modules that user selected or apply default recommended set
    const merged = Array.from(new Set([...archetype.defaultModules, ...selectedModuleIds]));
    setSelectedModuleIds(merged);
  };

  // Module toggle handler
  const handleToggleModule = (moduleId: string) => {
    setSelectedModuleIds((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  // Preset prompts for rapid AI scoping
  const PROMPT_PRESETS = [
    {
      label: "Medical Booking Portal",
      prompt: "We need a medical appointment booking platform for our Durban practice with automated WhatsApp reminders, patient records, and PayFast card payments.",
    },
    {
      label: "AI SaaS Platform",
      prompt: "An AI-powered customer inquiry triage platform that analyzes incoming lead emails using Gemini 3.7 Flash and displays analytics on a KPI dashboard.",
    },
    {
      label: "E-Commerce Fashion Store",
      prompt: "A boutique clothing store in Cape Town with PayFast instant EFT checkout, product catalog, customer login, and automated delivery tracking alerts.",
    },
    {
      label: "Brand & Video Launch",
      prompt: "A startup launching a financial advisory brand needing a corporate website, blog CMS for SEO, and a 60-second 2D animated promo reel for social ads.",
    },
  ];

  // AI Scope Analysis Trigger
  const handleRunAiScopeAnalysis = async (customPrompt?: string) => {
    const textToAnalyze = customPrompt || aiPrompt;
    if (!textToAnalyze.trim()) {
      setAiError("Please enter your project requirements description first.");
      return;
    }

    setAiAnalyzing(true);
    setAiError(null);

    try {
      const res = await fetch("/api/ai/estimate-scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToAnalyze }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.recommendedArchetypeId) {
        setSelectedArchetypeId(data.recommendedArchetypeId);
      }
      if (Array.isArray(data.recommendedModuleIds) && data.recommendedModuleIds.length > 0) {
        setSelectedModuleIds(data.recommendedModuleIds);
      }

      setAiAnalysisResult({
        executiveSummary: data.executiveSummary,
        architectureHighlights: data.architectureHighlights,
        projectedRoiSummary: data.projectedRoiSummary,
      });
    } catch (err: any) {
      console.warn("AI scope analysis error, applying local fallback:", err);
      // Fallback local heuristic
      const p = textToAnalyze.toLowerCase();
      if (p.includes("ai") || p.includes("bot")) {
        setSelectedArchetypeId("ai_saas");
        setSelectedModuleIds(["auth_rbac", "db_cloud", "gemini_ai", "analytics_dash"]);
      } else if (p.includes("store") || p.includes("shop") || p.includes("cart") || p.includes("product")) {
        setSelectedArchetypeId("ecommerce");
        setSelectedModuleIds(["payfast_gateway", "db_cloud", "whatsapp_email_notif"]);
      } else if (p.includes("video") || p.includes("animat") || p.includes("brand")) {
        setSelectedArchetypeId("brand_launch");
        setSelectedModuleIds(["promo_video", "cms_blog", "whatsapp_email_notif"]);
      } else {
        setSelectedArchetypeId("web_app");
        setSelectedModuleIds(["auth_rbac", "db_cloud", "analytics_dash", "whatsapp_email_notif"]);
      }

      setAiAnalysisResult({
        executiveSummary: `SpaceHead AI has tailored an architectural recommendation matching your specifications. The proposed stack ensures high performance, automated lead conversion, and seamless South African payment compliance.`,
        architectureHighlights: [
          "Responsive client interface with zero-lag interactions",
          "Automated database persistence and role-based permissions",
          "Real-time notifications and payment gateway integration",
        ],
        projectedRoiSummary: "Reduces manual operational overhead by an estimated 65% while providing a 24/7 self-service channel for your customers.",
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Instant PDF Download
  const handleQuickDownloadPDF = () => {
    try {
      const doc = generateBrandedProposalPDF(summary, clientInfo, aiAnalysisResult || undefined);
      doc.save(`SpaceHead_AI_Proposal_${summary.referenceCode}.pdf`);
      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to download PDF. Try opening the preview modal.");
    }
  };

  // Icon map helper
  const renderIcon = (name: string, className = "w-5 h-5") => {
    switch (name) {
      case "ShieldCheck":
        return <ShieldCheck className={className} />;
      case "Database":
        return <Database className={className} />;
      case "Bot":
        return <Bot className={className} />;
      case "CreditCard":
        return <CreditCard className={className} />;
      case "BarChart3":
        return <BarChart3 className={className} />;
      case "Send":
        return <Send className={className} />;
      case "FileText":
        return <FileText className={className} />;
      case "Video":
        return <Video className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "LayoutDashboard":
        return <LayoutDashboard className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "ShoppingCart":
        return <ShoppingCart className={className} />;
      case "Globe":
        return <Globe className={className} />;
      case "Rocket":
        return <Rocket className={className} />;
      default:
        return <Check className={className} />;
    }
  };

  const whatsappText = `Hi SpaceHead AI! I configured a custom scope for ${summary.archetype.name} (Ref: ${summary.referenceCode}) at R${summary.totalPriceZAR.toLocaleString()}. I would like to discuss this proposal.`;
  const whatsappUrl = whatsappLinkWithMessage(whatsappText);

  return (
    <div id="estimator-view" className="space-y-10 pb-16 animate-in fade-in duration-300">
      <SEO
        title="Website Cost Calculator & Project Estimator (ZAR)"
        description="Calculate instant website design, e-commerce, and app development costs for your South African business in ZAR. Customize features, calculate monthly ROI & download a free PDF proposal."
        canonicalUrl="https://spaceheadai.co.za/estimator"
        keywords={[
          "website cost calculator south africa",
          "how much does a website cost in south africa",
          "web design prices zar",
          "ecommerce website development cost za",
          "app development prices south africa",
          "payfast website pricing calculator",
          "software project estimator south africa",
          "custom web app quote zar"
        ]}
        geoRegion="ZA"
        geoPlacename="South Africa"
        breadcrumbs={[
          { name: "Home", item: "https://spaceheadai.co.za" },
          { name: "Project Estimator", item: "https://spaceheadai.co.za/estimator" }
        ]}
        jsonLd={[
          DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA,
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SpaceHead AI Project Estimator & Cost Calculator",
            "url": "https://spaceheadai.co.za/estimator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All modern browsers",
            "description": "Instant interactive scope and cost estimation calculator for South African businesses, featuring ZAR pricing, ROI formulas, and automated PDF proposal generation.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "ZAR"
            }
          }
        ]}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Scope & ROI Calculator</span>
          </div>

          <h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            AI Project Estimator & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
              Instant PDF Proposals
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Configure your technical requirements, preview real-time budget ranges in South African Rands (ZAR), calculate projected business ROI, and immediately download a branded quotation for your stakeholders.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Transparent ZAR Pricing</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>50% Milestone Deposit Option</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Downloadable Vector PDF Proposal</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Scope Assistant Card */}
      <div className="bg-white border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg">
                Gemini 3.7 Flash AI Scope Assistant
              </h3>
              <p className="text-xs text-slate-500">
                Describe your business idea or requirements in plain English and let AI configure the optimal architecture.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 uppercase">
            Powered by Google GenAI
          </span>
        </div>

        {/* Input Textarea & Analyze Action */}
        <div className="space-y-3">
          <textarea
            rows={3}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. We need a booking system for our medical practice in Durban. Patients must be able to log in, pay consultation fees via PayFast, and receive automated WhatsApp confirmations with appointment calendar links."
            className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all resize-none shadow-inner"
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick ideas:</span>
              {PROMPT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setAiPrompt(preset.prompt);
                    handleRunAiScopeAnalysis(preset.prompt);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer border border-slate-200/60"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleRunAiScopeAnalysis()}
              disabled={aiAnalyzing || !aiPrompt.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiAnalyzing ? "Analyzing Architecture..." : "AI Analyze & Configure Scope"}</span>
            </button>
          </div>

          {aiError && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              {aiError}
            </div>
          )}

          {/* AI Result Card */}
          {aiAnalysisResult && (
            <div className="mt-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3 animate-in fade-in">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Architectural Recommendation:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {aiAnalysisResult.executiveSummary}
              </p>
              {aiAnalysisResult.architectureHighlights && aiAnalysisResult.architectureHighlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {aiAnalysisResult.architectureHighlights.map((h, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-xl border border-indigo-100 text-[11px] text-slate-700 flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scope Configuration */}
        <div className="lg:col-span-8 space-y-10">
          {/* STEP 1: Select Project Archetype */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h2 className="font-sans font-bold text-slate-900 text-lg sm:text-xl">
                Choose Base Project Archetype
              </h2>
            </div>
            <p className="text-xs text-slate-500 ml-8">
              Select the foundational architecture that best represents your application's primary function.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {PROJECT_ARCHETYPES.map((archetype) => {
                const isSelected = selectedArchetypeId === archetype.id;
                return (
                  <div
                    key={archetype.id}
                    onClick={() => handleSelectArchetype(archetype)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-50/40 border-indigo-600 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                          {renderIcon(archetype.icon, "w-5 h-5")}
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {archetype.badge}
                        </span>
                      </div>

                      <h3 className="font-sans font-bold text-slate-900 text-base">
                        {archetype.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {archetype.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Base Investment</span>
                        <span className="font-bold font-mono text-slate-900">
                          R {archetype.basePriceZAR.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">Est. Timeline</span>
                        <span className="font-semibold text-slate-700">
                          ~{archetype.baseDays} business days
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Configure Modular Features */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                <h2 className="font-sans font-bold text-slate-900 text-lg sm:text-xl">
                  Configure Scope & Feature Modules
                </h2>
              </div>
              <button
                onClick={() => setSelectedModuleIds([])}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset selections</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 ml-8">
              Toggle specific features to meet your operational requirements. Pricing and timeline update in real time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {FEATURE_MODULES.map((module) => {
                const isChecked = selectedModuleIds.includes(module.id);
                return (
                  <div
                    key={module.id}
                    onClick={() => handleToggleModule(module.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 relative ${
                      isChecked
                        ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-indigo-600 text-white"
                            : "border-2 border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {module.title}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {module.shortDesc}
                      </p>

                      <div className="flex items-center justify-between pt-2 text-[11px] font-mono">
                        <span className="font-bold text-indigo-600">
                          +R {module.priceZAR.toLocaleString()}
                        </span>
                        <span className="text-slate-400">
                          {module.additionalDays > 0 ? `+${module.additionalDays} days` : "Accelerates 50%"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Interactive ROI & Efficiency Calculator */}
          <div className="space-y-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h2 className="font-sans font-bold text-slate-900 text-lg sm:text-xl">
                Business ROI & Efficiency Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 ml-8">
              Adjust your current operational numbers to see projected time saved and payback period.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
              {/* Slider 1: Manual Hours */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    Hours spent manually answering inquiries / week:
                  </span>
                  <span className="font-bold font-mono text-indigo-600 text-sm">
                    {manualHoursPerWeek} hrs/wk
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={35}
                  step={1}
                  value={manualHoursPerWeek}
                  onChange={(e) => setManualHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>2 hrs (Light)</span>
                  <span>18 hrs (Typical)</span>
                  <span>35 hrs (Heavy)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Inquiries */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    Expected monthly client inquiries / leads:
                  </span>
                  <span className="font-bold font-mono text-indigo-600 text-sm">
                    {monthlyInquiries} leads/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={150}
                  step={5}
                  value={monthlyInquiries}
                  onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10 leads</span>
                  <span>75 leads</span>
                  <span>150+ leads</span>
                </div>
              </div>
            </div>

            {/* Projected ROI Results Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Hours Automated</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {summary.roi.hoursSavedPerMonth} hrs/mo
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Freed for core business</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Labor Cost Savings</span>
                <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                  R {summary.roi.estimatedLaborSavingsZAR.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Estimated monthly</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Conversion Lift</span>
                <span className="text-xl font-bold font-mono text-indigo-600 mt-1 block">
                  +{summary.roi.projectedConversionLiftPct}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Frictionless checkout</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Payback Recovery</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {summary.roi.paybackMonths} mo
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Estimated breakeven</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Investment Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg space-y-6">
            {/* Quotation Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 block">
                  Live Quotation Summary
                </span>
                <span className="text-xs text-slate-500">
                  {summary.archetype.name}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                {summary.referenceCode}
              </span>
            </div>

            {/* Total Budget */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">
                Total Estimated Investment (ZAR)
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900">
                R {summary.totalPriceZAR.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Base ({summary.archetype.name}): <strong className="font-mono">R{summary.basePriceZAR.toLocaleString()}</strong> + Features: <strong className="font-mono">R{summary.featuresPriceZAR.toLocaleString()}</strong>
              </div>
            </div>

            {/* 50% Deposit Breakdown */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-indigo-900 font-semibold">50% Sprint Deposit:</span>
                <span className="font-bold font-mono text-indigo-700 text-sm">
                  R {summary.depositAmountZAR.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                Initiates Sprint 1 wireframing and architecture. Balance of R{summary.balanceAmountZAR.toLocaleString()} due only upon final QA signoff.
              </p>
            </div>

            {/* Delivery Timeline Pill */}
            <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">Delivery Roadmap:</span>
              </div>
              <span className="font-bold font-mono text-slate-900">
                {summary.totalDays} days (~{summary.sprintWeeks})
              </span>
            </div>

            {/* Quick Feature Checklist */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Configured Deliverables ({summary.selectedModules.length + 1})
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                <div className="flex items-center space-x-1.5 text-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-[11px] truncate">{summary.archetype.name} (Base)</span>
                </div>
                {summary.selectedModules.map((m) => (
                  <div key={m.id} className="flex items-center space-x-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span className="text-[11px] truncate">{m.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleQuickDownloadPDF}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Branded PDF Proposal</span>
              </button>

              <button
                onClick={() => setShowPreviewModal(true)}
                className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Review & Personalize Proposal</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp With Quote</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center space-x-4 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% IP Transfer</span>
              </span>
              <span>•</span>
              <span>30-Day SLA</span>
              <span>•</span>
              <span>SA PayFast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Success Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[130] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">PDF Proposal Downloaded</div>
            <div className="text-[11px] text-slate-400">File: SpaceHead_AI_Proposal_{summary.referenceCode}.pdf</div>
          </div>
        </div>
      )}

      {/* Proposal Full Preview & Personalization Modal */}
      {showPreviewModal && (
        <ProposalPreviewModal
          summary={summary}
          clientInfo={clientInfo}
          onUpdateClientInfo={setClientInfo}
          aiAnalysis={aiAnalysisResult || undefined}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}
