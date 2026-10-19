import { useState } from "react";
import { 
  X, 
  Download, 
  Send, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Clock,
  Briefcase,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import { EstimateSummary } from "../data/estimatorConfig";
import { 
  generateBrandedProposalPDF, 
  ClientProposalInfo, 
  ProposalAiAnalysis 
} from "../lib/pdfProposalGenerator";
import { whatsappLinkWithMessage } from "../lib/contactInfo";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

interface ProposalPreviewModalProps {
  summary: EstimateSummary;
  clientInfo: ClientProposalInfo;
  onUpdateClientInfo: (info: ClientProposalInfo) => void;
  aiAnalysis?: ProposalAiAnalysis;
  onClose: () => void;
}

export default function ProposalPreviewModal({
  summary,
  clientInfo,
  onUpdateClientInfo,
  aiAnalysis,
  onClose,
}: ProposalPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const doc = generateBrandedProposalPDF(summary, clientInfo, aiAnalysis);
      doc.save(`SpaceHead_AI_Proposal_${summary.referenceCode}.pdf`);
    } catch (err) {
      console.error("Failed to generate proposal PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitLeadToCRM = async () => {
    if (!clientInfo.name.trim() || !clientInfo.email.trim() || !clientInfo.phone.trim()) {
      alert("Please enter your name, email address, and WhatsApp/phone number to submit your proposal.");
      return;
    }

    setSubmittingLead(true);
    setLeadSubmitError(null);

    const record = {
      serviceId: `custom-estimator-${summary.archetype.id}`,
      serviceTitle: `${summary.archetype.name} (Custom Proposal)`,
      name: clientInfo.name.trim(),
      businessName: clientInfo.businessName?.trim() || "",
      email: clientInfo.email.trim(),
      phone: clientInfo.phone.trim(),
      brief: `[INTERACTIVE ESTIMATE PROPOSAL - ${summary.referenceCode}]
Archetype: ${summary.archetype.name}
Total Investment: R${summary.totalPriceZAR.toLocaleString()} (50% Deposit: R${summary.depositAmountZAR.toLocaleString()})
Timeline: ${summary.totalDays} business days (~${summary.sprintWeeks})
Configured Features: ${summary.selectedModules.map((m) => m.title).join(", ")}
Projected ROI: ${summary.roi.hoursSavedPerMonth} hrs/mo saved, R${summary.roi.estimatedLaborSavingsZAR.toLocaleString()}/mo labor savings, +${summary.roi.projectedConversionLiftPct}% conversion lift.
Client Notes: ${clientInfo.briefNotes || "None provided"}`,
      referenceCode: summary.referenceCode,
      createdAt: new Date().toISOString(),
      status: "New",
      adminNotes: `Generated via Interactive AI Estimator. Deposit required: R${summary.depositAmountZAR.toLocaleString()}`,
    };

    let saved = false;
    if (db) {
      try {
        await addDoc(collection(db, "project_briefs"), record);
        saved = true;
      } catch (err) {
        console.warn("Firestore proposal submission failed, saving locally:", err);
      }
    }

    if (!saved) {
      try {
        const current = JSON.parse(localStorage.getItem("project_briefs") || "[]");
        current.push(record);
        localStorage.setItem("project_briefs", JSON.stringify(current));
        saved = true;
      } catch (lsErr) {
        console.warn("Local storage fallback failed:", lsErr);
      }
    }

    setSubmittingLead(false);
    if (saved) {
      setSubmittedSuccess(true);
    } else {
      setLeadSubmitError("Could not submit proposal online. You can still download the PDF or message us directly on WhatsApp.");
    }
  };

  const whatsappText = `Hi SpaceHead AI team! I generated an interactive proposal for ${summary.archetype.name} (Ref: ${summary.referenceCode}) for R${summary.totalPriceZAR.toLocaleString()}. I would like to review it with you.`;
  const whatsappUrl = whatsappLinkWithMessage(whatsappText);

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              SH
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-sans font-bold text-sm">
                  SpaceHead AI Proposal Preview
                </span>
                <span className="bg-indigo-900/80 text-indigo-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-indigo-700">
                  {summary.referenceCode}
                </span>
              </div>
              <span className="text-slate-400 text-xs">
                Official Commercial Quotation & Scope of Work
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? "Generating PDF..." : "Download PDF"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-8 bg-slate-50/40">
          {/* Client Personalization Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
                Recipient Details (Appears on PDF Proposal)
              </span>
              <span className="text-[11px] text-slate-400">
                Ensure details are accurate for quotation validity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => onUpdateClientInfo({ ...clientInfo, name: e.target.value })}
                  placeholder="e.g. Sipho Sithole"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Company / Brand
                </label>
                <input
                  type="text"
                  value={clientInfo.businessName || ""}
                  onChange={(e) => onUpdateClientInfo({ ...clientInfo, businessName: e.target.value })}
                  placeholder="e.g. Apex Health Logistics"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => onUpdateClientInfo({ ...clientInfo, email: e.target.value })}
                  placeholder="e.g. sipho@apexhealth.co.za"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => onUpdateClientInfo({ ...clientInfo, phone: e.target.value })}
                  placeholder="e.g. 082 123 4567"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          {/* Proposal Document Preview Container */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="text-xl font-black font-sans tracking-tight text-slate-900">
                  SPACEHEAD <span className="text-indigo-600">AI</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Technical Proposal & Architectural Estimate
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block border border-indigo-100">
                  {summary.referenceCode}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Price Guarantee: Valid for 30 days
                </div>
              </div>
            </div>

            {/* Selected Solution Archetype */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 className="font-sans font-bold text-slate-900 text-lg">
                  {summary.archetype.name}
                </h3>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {summary.archetype.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {aiAnalysis?.executiveSummary || summary.archetype.description}
              </p>
            </div>

            {/* Scope of Deliverables Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Scope of Work & Deliverables
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {summary.selectedModules.length + 1} itemized deliverables
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {/* Base Archetype */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        {summary.archetype.name} (Base Architecture)
                      </span>
                      <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">
                        Core UX & Ingress
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {summary.archetype.tagline}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      R {summary.archetype.basePriceZAR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {summary.archetype.baseDays} days
                    </span>
                  </div>
                </div>

                {/* Additional Modules */}
                {summary.selectedModules.map((mod) => (
                  <div key={mod.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/40 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {mod.title}
                        </span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-mono">
                          {mod.categoryName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {mod.technicalSpecs}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        R {mod.priceZAR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {mod.additionalDays > 0 ? `+${mod.additionalDays} days` : "Accelerated"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment & Payment Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                  <span className="font-mono uppercase tracking-wider">Total Investment (ZAR)</span>
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">
                    No Hidden Fees
                  </span>
                </div>
                <div className="text-3xl font-black font-mono text-white">
                  R {summary.totalPriceZAR.toLocaleString()}.00
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">50% Commencement Deposit:</span>
                    <span className="font-bold font-mono text-indigo-300">
                      R {summary.depositAmountZAR.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">50% Delivery Handover:</span>
                    <span className="font-bold font-mono text-slate-200">
                      R {summary.balanceAmountZAR.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Timeline:</span>
                    <span className="font-bold text-emerald-400">
                      {summary.totalDays} Business Days (~{summary.sprintWeeks})
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Projected ROI & Efficiency Value</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white p-3 rounded-xl border border-indigo-100">
                      <div className="text-[10px] text-slate-500 font-semibold">Monthly Hours Saved</div>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                        {summary.roi.hoursSavedPerMonth} hrs
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-indigo-100">
                      <div className="text-[10px] text-slate-500 font-semibold">Est. Labor Savings</div>
                      <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
                        R {summary.roi.estimatedLaborSavingsZAR.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-indigo-100">
                      <div className="text-[10px] text-slate-500 font-semibold">Projected Conversion</div>
                      <div className="text-lg font-bold font-mono text-indigo-600 mt-0.5">
                        +{summary.roi.projectedConversionLiftPct}%
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-indigo-100">
                      <div className="text-[10px] text-slate-500 font-semibold">Payback Period</div>
                      <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                        {summary.roi.paybackMonths} mo
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-indigo-700/80 italic">
                  * Calculated from automated self-service, instant lead routing, and converted digital sales.
                </div>
              </div>
            </div>

            {/* Commercial Guarantees */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% IP & Source Code Ownership Handover</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>30-Day Post-Launch Bug Fix Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>On-Time Sprint SLA Guarantee</span>
              </div>
            </div>
          </div>

          {/* Submission and Action Confirmation Banner */}
          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center space-x-4 animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-sans font-bold text-emerald-900 text-sm">
                  Proposal Submitted Successfully to SpaceHead AI Team!
                </h4>
                <p className="text-xs text-emerald-700">
                  Your quote has been logged with reference code <strong className="font-mono">{summary.referenceCode}</strong>. Our senior solutions architect will contact you within 2 business hours.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-indigo-200">
                    Ready to Take the Next Step?
                  </span>
                </div>
                <h4 className="font-sans font-bold text-white text-base">
                  Lock in this Quote & Submit to Our Engineering Team
                </h4>
                <p className="text-xs text-indigo-200 max-w-xl">
                  Submitting sends this proposal directly to our active workspace CRM. We will prepare your sprint contract and send the PayFast deposit link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={handleSubmitLeadToCRM}
                  disabled={submittingLead}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{submittingLead ? "Submitting..." : "Submit to SpaceHead Team"}</span>
                </button>
              </div>
            </div>
          )}

          {leadSubmitError && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              {leadSubmitError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
