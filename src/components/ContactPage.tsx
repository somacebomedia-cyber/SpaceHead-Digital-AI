import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import SEO from "./SEO";
import { 
  CheckCircle, 
  Send, 
  ShieldCheck, 
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    service: "Premium Website Design",
    brief: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteCode, setQuoteCode] = useState<string | null>(null);

  const servicesList = [
    "Premium Website Design",
    "AI-Powered Video Adverts",
    "AI App Vibe Coding",
    "Other / Custom Portfolio Deliverable"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields (Name, Email, Phone Number).");
      return;
    }

    setLoading(true);
    setError(null);

    // Generate custom premium-looking reference quote code (e.g. SH-4890-ZA)
    const code = `SH-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear().toString().substring(2)}`;

    try {
      // Save leads dynamically to Firestore if connected, fallback cleanly to local storage if offline
      if (db) {
        await addDoc(collection(db, "workspace_leads"), {
          ...formData,
          quoteCode: code,
          createdAt: new Date().toISOString(),
          status: "New"
        });
      } else {
        // Fallback local storage
        const currentLeads = JSON.parse(localStorage.getItem("workspace_leads") || "[]");
        currentLeads.push({
          ...formData,
          quoteCode: code,
          createdAt: new Date().toISOString(),
          status: "New"
        });
        localStorage.setItem("workspace_leads", JSON.stringify(currentLeads));
      }

      setQuoteCode(code);
      // Reset form
      setFormData({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        service: "Premium Website Design",
        brief: ""
      });
    } catch (err: any) {
      console.error("Error submitting lead: ", err);
      // Fallback local storage even on DB write errors to ensure client never loses data
      const currentLeads = JSON.parse(localStorage.getItem("workspace_leads") || "[]");
      currentLeads.push({
        ...formData,
        quoteCode: code,
        createdAt: new Date().toISOString(),
        status: "New"
      });
      localStorage.setItem("workspace_leads", JSON.stringify(currentLeads));
      
      setQuoteCode(code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-view" className="space-y-12 pb-16 font-sans max-w-5xl mx-auto">
      <SEO 
        title="Request a Custom Consult | Fast SLA Business Website Design"
        description="Submit your high-level brief for a custom business website, promotional video ad, or custom AI App prototype. Guaranteed response and custom workspace pricing code generated within 2 hours."
        canonicalUrl="https://spacehead.co.za/contact"
      />
      
      {/* Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto mt-6">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          Instant Inquiry
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-none">
          Request a Custom Consult
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Send us your high-level brief. We reply within 2 hours with pricing configurations and a direct schedule slot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Support Information (Left Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-6">
            <h3 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-50 pb-3">
              Direct Contact Channels
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[9.5px] uppercase">Client Desk</span>
                  <a href="mailto:spaceheadai@gmail.com" className="font-bold text-slate-900 hover:underline">
                    spaceheadai@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[9.5px] uppercase">WhatsApp Hotdesk</span>
                  <span className="font-bold text-slate-900">
                    +27 (0) 65 890 4321
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[9.5px] uppercase">Service Response SLA</span>
                  <span className="font-bold text-slate-900 block">
                    Under 2 Hours
                  </span>
                  <span className="text-[10px] text-slate-400">Monday - Saturday</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 text-white p-6 rounded-[24px] shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.18),transparent_50%)] pointer-events-none" />
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-purple-400 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
              Sovereign SLA
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              All creative builds are backed by 3 months of free maintenance. We manage configuration updates, local host tuning, and server speed monitoring so your brand remains elite.
            </p>
          </div>
        </div>

        {/* Lead Submission Form (Right Column) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[28px] p-6 sm:p-8 shadow-sm">
          {quoteCode ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-slate-900 text-xl sm:text-2xl">
                  Consultation Proposal Initiated
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Thank you. We have generated your dynamic Workspace Proposal tracking ID. A direct specialist has been assigned to your brief.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl py-3 px-6 inline-block">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Proposal Tracking Code</span>
                <span className="text-base font-black text-slate-900 font-mono tracking-wider">{quoteCode}</span>
              </div>

              <div>
                <button
                  onClick={() => setQuoteCode(null)}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Submit Another Brief</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-700 block">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sipho Nkosi"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-1.5">
                  <label htmlFor="business" className="text-xs font-semibold text-slate-700 block">
                    Business Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="business"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Nkosi Logistics"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sipho@nkosi.co.za"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* WhatsApp / Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-700 block">
                    Contact / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 065 890 4321"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Service of Interest Pilled Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Priority Specialization <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {servicesList.map((service) => (
                    <button
                      type="button"
                      key={service}
                      onClick={() => setFormData({ ...formData, service })}
                      className={`text-left p-3 rounded-xl border text-xs font-bold transition-all relative ${
                        formData.service === service
                          ? "bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-100"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>{service}</span>
                      {formData.service === service && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Brief */}
              <div className="space-y-1.5">
                <label htmlFor="brief" className="text-xs font-semibold text-slate-700 block">
                  Project Notes & Brief <span className="text-slate-400 font-normal">(Any requirements or reference links)</span>
                </label>
                <textarea
                  id="brief"
                  rows={4}
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                  placeholder="Provide a short outline of what you're wanting to achieve..."
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Safety Shield Info */}
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  Your specifications are securely protected under NDA workspace terms. We never lease, trade, or share your contact metrics. Built & deployed in South Africa.
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Project Brief</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>

    </div>
  );
}
