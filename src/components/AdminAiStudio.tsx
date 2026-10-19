import React, { useState } from "react";
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  Search, 
  Copy, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Clock, 
  Tag, 
  Layers, 
  Send, 
  AlertCircle, 
  ShieldCheck, 
  Sliders,
  Feather
} from "lucide-react";
import { BlogPost, Project } from "../types";

interface AdminAiStudioProps {
  onApplyToBlogEditor?: (draft: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    tags: string[];
  }) => void;
  onApplyToProjectEditor?: (draft: {
    title: string;
    description: string;
    category: string;
    tags: string[];
  }) => void;
  onDirectPublishBlog?: (blog: Omit<BlogPost, "id">) => Promise<void>;
  onDirectPublishProject?: (project: Omit<Project, "id">) => Promise<void>;
  user: any;
}

const BLOG_PRESETS = [
  {
    topic: "Why Custom TypeScript & Next.js Architecture Outperforms WordPress for South African Businesses",
    category: "Web Engineering",
    points: "1. WordPress mobile load latency on Vodacom and MTN 4G networks\n2. Plugin bloat and security attack surfaces\n3. Zero-maintenance cloud deployments and instant SEO advantages\n4. PayFast integration reliability and sub-second checkout speed",
    audience: "South African Business Owners & Technical Executives",
    tone: "Authoritative, practical, and business-value focused"
  },
  {
    topic: "How Local Companies Leverage Gemini AI Automation to Slash Inbound Lead Triage by 70%",
    category: "AI Engineering",
    points: "1. Moving beyond simple form emails to instant AI scope estimates\n2. Real-time client classification and WhatsApp priority routing\n3. ROI metrics: response times dropped from 18 hours to 45 seconds\n4. Practical implementation blueprint without enterprise licensing costs",
    audience: "Founders, Operations Directors & Agency Owners",
    tone: "Analytical, forward-thinking, and results-driven"
  },
  {
    topic: "PayFast vs International Gateways: The Definitive Commercial Guide for SA Digital Commerce",
    category: "Web Engineering",
    points: "1. South African card acceptance rates and 3D Secure v2\n2. Instant EFT, SnapScan, and Zapper customer preferences\n3. Hidden forex conversion fees with Stripe or PayPal\n4. Automated webhook (ITN) reconciliation and error boundaries",
    audience: "E-Commerce Merchants & SaaS Creators in South Africa",
    tone: "Practical financial advisory and engineering breakdown"
  },
  {
    topic: "The Hidden Cost of Outdated Websites: How 2-Second Latency Destroys Local Conversions",
    category: "Marketing Strategy",
    points: "1. Mobile bounce rates when initial load exceeds 2.5 seconds\n2. Google Core Web Vitals impact on local search placement\n3. Building confidence through calm typography and verified client proof\n4. Case study: converting traffic into direct WhatsApp consultations",
    audience: "Local Service Providers (Doctors, Attorneys, Engineers)",
    tone: "Persuasive, empirical, and conversion-centered"
  }
];

const CASE_STUDY_PRESETS = [
  {
    projectName: "Apex Logistics Real-Time Fleet Portal",
    clientOrIndustry: "Transport & Supply Chain",
    challenge: "Dispatchers were managing 60+ daily deliveries through unstructured WhatsApp groups and paper manifests, causing 20% billing disputes and delayed proof of deliveries.",
    solution: "Engineered a custom reactive portal with role-based dispatch views, instant mobile signature capture, automated WhatsApp client notifications, and cloud database synchronization.",
    results: "Reduced administrative dispatch overhead by 68%, achieved 100% digital proof of delivery within 60 seconds, and eliminated manual spreadsheet reconciliation.",
    techStack: "React, TypeScript, Tailwind CSS, Firestore, Cloud Functions"
  },
  {
    projectName: "MediCare Specialty Clinic Booking Suite",
    clientOrIndustry: "Healthcare & Private Practice",
    challenge: "Front desk staff were overwhelmed handling after-hours phone bookings, with a 35% drop-off rate among new patients seeking urgent appointment slots.",
    solution: "Designed and deployed a responsive, sub-second online appointment scheduling platform with SMS/WhatsApp calendar sync and optional upfront PayFast consultation deposits.",
    results: "Captured 42% of all appointments outside standard office hours, reduced patient no-shows by 75%, and eliminated scheduling double-bookings.",
    techStack: "TypeScript, Tailwind CSS, PayFast API, Automated Calendar Sync"
  }
];

export default function AdminAiStudio({
  onApplyToBlogEditor,
  onApplyToProjectEditor,
  onDirectPublishBlog,
  onDirectPublishProject,
  user
}: AdminAiStudioProps) {
  const [activeMode, setActiveMode] = useState<"blog" | "case_study" | "summarizer">("blog");

  // Blog Drafting State
  const [blogTopic, setBlogTopic] = useState("");
  const [blogCategory, setBlogCategory] = useState("Web Engineering");
  const [blogPoints, setBlogPoints] = useState("");
  const [blogAudience, setBlogAudience] = useState("South African business owners and technical leaders");
  const [blogTone, setBlogTone] = useState("Authoritative, practical, and conversion-focused");
  const [isDraftingBlog, setIsDraftingBlog] = useState(false);
  const [blogResult, setBlogResult] = useState<any>(null);

  // Case Study Polisher State
  const [csProjectName, setCsProjectName] = useState("");
  const [csIndustry, setCsIndustry] = useState("");
  const [csChallenge, setCsChallenge] = useState("");
  const [csSolution, setCsSolution] = useState("");
  const [csResults, setCsResults] = useState("");
  const [csTechStack, setCsTechStack] = useState("React, TypeScript, Tailwind CSS, Firebase, PayFast");
  const [isPolishingCs, setIsPolishingCs] = useState(false);
  const [csResult, setCsResult] = useState<any>(null);

  // Summarizer & SEO State
  const [rawTextToSummarize, setRawTextToSummarize] = useState("");
  const [summaryTitle, setSummaryTitle] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<any>(null);

  // Status & Feedback
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate Blog Post
  const handleGenerateBlogPost = async () => {
    if (!blogTopic.trim()) {
      setStatusMessage({ text: "Please provide an article topic or core thesis.", type: "error" });
      return;
    }

    setIsDraftingBlog(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/ai/draft-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: blogTopic,
          rawPoints: blogPoints,
          category: blogCategory,
          targetAudience: blogAudience,
          tone: blogTone
        })
      });

      if (!res.ok) throw new Error("Failed to generate article draft");
      const data = await res.json();
      setBlogResult(data);
      setStatusMessage({
        text: data.source === "gemini" 
          ? `Article generated with Gemini (${data.modelUsed || "Latest"}). Ready for review or direct publishing.`
          : "Article drafted via SpaceHead Smart Heuristic Engine (Offline Resilient Mode).",
        type: "success"
      });
    } catch (err: any) {
      console.error("AI blog generation failed:", err);
      setStatusMessage({ text: err.message || "Failed to generate blog draft.", type: "error" });
    } finally {
      setIsDraftingBlog(false);
    }
  };

  // Polish Case Study
  const handlePolishCaseStudy = async () => {
    if (!csProjectName.trim() || !csChallenge.trim() || !csSolution.trim()) {
      setStatusMessage({ text: "Please enter the Project Name, Challenge, and Solution details.", type: "error" });
      return;
    }

    setIsPolishingCs(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/ai/polish-case-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: csProjectName,
          clientOrIndustry: csIndustry,
          challenge: csChallenge,
          solution: csSolution,
          results: csResults,
          techStack: csTechStack
        })
      });

      if (!res.ok) throw new Error("Failed to polish case study");
      const data = await res.json();
      setCsResult(data);
      setStatusMessage({
        text: data.source === "gemini" 
          ? `Case study polished via Gemini (${data.modelUsed || "Latest"}). Ready to push to portfolio.`
          : "Case study structured via Smart Heuristic Engine.",
        type: "success"
      });
    } catch (err: any) {
      console.error("AI case study polishing failed:", err);
      setStatusMessage({ text: err.message || "Failed to polish case study.", type: "error" });
    } finally {
      setIsPolishingCs(false);
    }
  };

  // Summarize & Optimize Content
  const handleSummarize = async () => {
    if (!rawTextToSummarize.trim()) {
      setStatusMessage({ text: "Please paste the article or project text to analyze.", type: "error" });
      return;
    }

    setIsSummarizing(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/ai/summarize-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: rawTextToSummarize,
          title: summaryTitle
        })
      });

      if (!res.ok) throw new Error("Failed to summarize content");
      const data = await res.json();
      setSummaryResult(data);
      setStatusMessage({ text: "SEO summary and metadata extracted successfully.", type: "success" });
    } catch (err: any) {
      console.error("AI summarization failed:", err);
      setStatusMessage({ text: err.message || "Failed to summarize text.", type: "error" });
    } finally {
      setIsSummarizing(false);
    }
  };

  // Direct Publish Blog
  const handleDirectPublishBlog = async () => {
    if (!blogResult || !onDirectPublishBlog) return;
    try {
      await onDirectPublishBlog({
        title: blogResult.title,
        slug: blogResult.slug,
        summary: blogResult.summary,
        content: blogResult.content,
        category: blogResult.category,
        tags: blogResult.tags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: user?.uid || "admin",
        authorName: "SpaceHead AI Editorial Desk",
        isPublished: true
      });
      setStatusMessage({ text: "Article published directly to live Blog!", type: "success" });
    } catch (err: any) {
      setStatusMessage({ text: "Failed to publish blog post: " + err.message, type: "error" });
    }
  };

  // Direct Publish Project
  const handleDirectPublishProject = async () => {
    if (!csResult || !onDirectPublishProject) return;
    try {
      await onDirectPublishProject({
        title: csResult.title,
        description: csResult.description,
        category: csResult.category,
        tags: csResult.tags,
        demoUrl: "https://spaceheadai.co.za",
        createdAt: Date.now(),
        userId: user?.uid || "admin",
        isPublic: true
      });
      setStatusMessage({ text: "Project added directly to Portfolio!", type: "success" });
    } catch (err: any) {
      setStatusMessage({ text: "Failed to save project: " + err.message, type: "error" });
    }
  };

  return (
    <div id="admin-ai-studio" className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 rounded-2xl border border-purple-800/40 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                Gemini Multi-Model Writing Assistant
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Failover Resilient
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
              AI Content Studio & SEO Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Generate structured technical blog articles, polish client success case studies, calculate read times, and extract search-optimized meta descriptions from raw notes in seconds.
            </p>
          </div>

          {/* Sub-Mode Selector */}
          <div className="flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner flex-shrink-0">
            <button
              onClick={() => setActiveMode("blog")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "blog"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Technical Blog</span>
            </button>
            <button
              onClick={() => setActiveMode("case_study")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "case_study"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Case Studies</span>
            </button>
            <button
              onClick={() => setActiveMode("summarizer")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "summarizer"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEO Summarizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === "success" ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[11px] font-bold underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: TECHNICAL BLOG DRAFTING */}
      {/* ========================================================================= */}
      {activeMode === "blog" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Presets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Feather className="w-4 h-4 text-indigo-600" />
                  <span>Article Configuration</span>
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Step 1 of 2
                </span>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  Quick Agency Presets
                </label>
                <div className="space-y-1">
                  {BLOG_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBlogTopic(p.topic);
                        setBlogCategory(p.category);
                        setBlogPoints(p.points);
                        setBlogAudience(p.audience);
                        setBlogTone(p.tone);
                      }}
                      className="w-full text-left text-xs p-2 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors text-slate-700 font-medium truncate block cursor-pointer"
                    >
                      {p.topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Topic / Core Thesis <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                  placeholder="e.g., Why Local Next.js & Server Components Outperform WordPress in South Africa"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category & Tone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Marketing Strategy">Marketing Strategy</option>
                    <option value="Cloud Architecture">Cloud Architecture</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Tone</label>
                  <select
                    value={blogTone}
                    onChange={(e) => setBlogTone(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Authoritative, practical, and business-value focused">Authoritative</option>
                    <option value="Conversational, practical, and step-by-step">Conversational</option>
                    <option value="High-level executive briefing">Executive</option>
                    <option value="In-depth technical architecture breakdown">Deep Tech</option>
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Target Audience</label>
                <input
                  type="text"
                  value={blogAudience}
                  onChange={(e) => setBlogAudience(e.target.value)}
                  placeholder="e.g. South African Business Owners & Technical Executives"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Raw Points */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Raw Key Takeaways or Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  value={blogPoints}
                  onChange={(e) => setBlogPoints(e.target.value)}
                  placeholder="Paste rough notes, metrics, or points to weave into the article..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateBlogPost}
                disabled={isDraftingBlog}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isDraftingBlog ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Article & SEO Meta...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Structured Technical Article</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Generated Result & Controls */}
          <div className="lg:col-span-7">
            {blogResult ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Result Header & Metadata */}
                <div className="border-b border-slate-100 pb-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {blogResult.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{blogResult.readTimeMinutes} min read</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        blogResult.source === "gemini" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {blogResult.source === "gemini" ? `AI (${blogResult.modelUsed || "Gemini"})` : "Heuristic Engine"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(blogResult.content, "blog-content")}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center space-x-1 transition-colors"
                      >
                        {copiedId === "blog-content" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === "blog-content" ? "Copied" : "Copy Markdown"}</span>
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold font-sans text-slate-900 leading-snug">
                    {blogResult.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    URL Slug: /{blogResult.slug}
                  </p>
                </div>

                {/* SEO Meta Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500">
                    <span>SEO Meta Description</span>
                    <span className={blogResult.seoMeta.length <= 155 ? "text-emerald-600" : "text-rose-600"}>
                      {blogResult.seoMeta.length} / 155 chars
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {blogResult.seoMeta}
                  </p>
                </div>

                {/* Excerpt Summary */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Article Summary Excerpt
                  </label>
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-indigo-50/40 p-3 rounded-lg border border-indigo-100">
                    "{blogResult.summary}"
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {blogResult.tags.map((t: string, idx: number) => (
                    <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Markdown Content Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Article Content Preview
                    </label>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
                    {blogResult.content}
                  </div>
                </div>

                {/* Actions: Push to Editor or Direct Publish */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                  {onApplyToBlogEditor && (
                    <button
                      onClick={() => {
                        onApplyToBlogEditor({
                          title: blogResult.title,
                          slug: blogResult.slug,
                          summary: blogResult.summary,
                          content: blogResult.content,
                          category: blogResult.category,
                          tags: blogResult.tags
                        });
                        setStatusMessage({ text: "Draft loaded into Blog Post editor below!", type: "success" });
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Load into Blog Editor Form</span>
                    </button>
                  )}

                  {onDirectPublishBlog && (
                    <button
                      onClick={handleDirectPublishBlog}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Direct Publish to Live Blog</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Article Drafting Workbench</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Select an agency preset or enter a custom topic on the left. Gemini will structure the headline, URL slug, SEO description, and full Markdown body.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CASE STUDY POLISHER */}
      {/* ========================================================================= */}
      {activeMode === "case_study" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Presets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Case Study Raw Details</span>
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Portfolio Mode
                </span>
              </div>

              {/* Case Study Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  Load Client Preset
                </label>
                <div className="space-y-1">
                  {CASE_STUDY_PRESETS.map((cs, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCsProjectName(cs.projectName);
                        setCsIndustry(cs.clientOrIndustry);
                        setCsChallenge(cs.challenge);
                        setCsSolution(cs.solution);
                        setCsResults(cs.results);
                        setCsTechStack(cs.techStack);
                      }}
                      className="w-full text-left text-xs p-2 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors text-slate-700 font-medium truncate block cursor-pointer"
                    >
                      {cs.projectName} ({cs.clientOrIndustry})
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Name & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={csProjectName}
                    onChange={(e) => setCsProjectName(e.target.value)}
                    placeholder="e.g. Apex Logistics Dispatch Hub"
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Industry</label>
                  <input
                    type="text"
                    value={csIndustry}
                    onChange={(e) => setCsIndustry(e.target.value)}
                    placeholder="e.g. Healthcare, Logistics, E-Commerce"
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* The Challenge */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  The Challenge <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={csChallenge}
                  onChange={(e) => setCsChallenge(e.target.value)}
                  placeholder="What operational bottleneck or revenue problem did the client face?"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* The Solution */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  The SpaceHead Solution <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={csSolution}
                  onChange={(e) => setCsSolution(e.target.value)}
                  placeholder="What architecture, UI, and integrations did we build to solve it?"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Results & Tech Stack */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Measurable Results / Metrics
                </label>
                <textarea
                  rows={2}
                  value={csResults}
                  onChange={(e) => setCsResults(e.target.value)}
                  placeholder="e.g. Slashed admin time by 60%, boosted inquiries by 45%"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Tech Stack</label>
                <input
                  type="text"
                  value={csTechStack}
                  onChange={(e) => setCsTechStack(e.target.value)}
                  placeholder="e.g. React, TypeScript, Tailwind, Firestore, PayFast"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Polish Button */}
              <button
                onClick={handlePolishCaseStudy}
                disabled={isPolishingCs}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isPolishingCs ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Polishing Case Study Narrative...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Polish Into High-Impact Case Study</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Case Study Preview */}
          <div className="lg:col-span-7">
            {csResult ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {csResult.category}
                    </span>
                    <button
                      onClick={() => copyToClipboard(csResult.caseStudyMarkdown, "cs-markdown")}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center space-x-1 transition-colors"
                    >
                      {copiedId === "cs-markdown" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === "cs-markdown" ? "Copied" : "Copy Markdown"}</span>
                    </button>
                  </div>
                  <h3 className="text-xl font-bold font-sans text-slate-900">
                    {csResult.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {csResult.description}
                  </p>
                </div>

                {/* Metrics Highlights Pills */}
                {csResult.metricsHighlights && csResult.metricsHighlights.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Key Impact Metrics
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {csResult.metricsHighlights.map((m: string, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900 text-center font-sans font-bold text-xs">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case Study Full Body */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Structured Case Study Body
                  </label>
                  <div className="max-h-72 overflow-y-auto p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
                    {csResult.caseStudyMarkdown}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {csResult.tags.map((t: string, idx: number) => (
                    <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Push to Project Editor */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                  {onApplyToProjectEditor && (
                    <button
                      onClick={() => {
                        onApplyToProjectEditor({
                          title: csResult.title,
                          description: csResult.description,
                          category: csResult.category,
                          tags: csResult.tags
                        });
                        setStatusMessage({ text: "Case study loaded into Portfolio Project form below!", type: "success" });
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Load into Project Form</span>
                    </button>
                  )}

                  {onDirectPublishProject && (
                    <button
                      onClick={handleDirectPublishProject}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Direct Save to Portfolio</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Case Study Transformer</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Fill in your raw project notes on the left. Gemini will produce a compelling, metrics-driven case study formatted with Challenge, Architecture, and Measurable Impact sections.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: CONTENT SUMMARIZER & SEO OPTIMIZER */}
      {/* ========================================================================= */}
      {activeMode === "summarizer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Content Input</span>
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Analyzer
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Title (Optional)</label>
                <input
                  type="text"
                  value={summaryTitle}
                  onChange={(e) => setSummaryTitle(e.target.value)}
                  placeholder="e.g. Next-Generation AI Automation Frameworks"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Paste Full Article or Project Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  value={rawTextToSummarize}
                  onChange={(e) => setRawTextToSummarize(e.target.value)}
                  placeholder="Paste article paragraphs, raw case study descriptions, or draft text here..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isSummarizing ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Extracting SEO Summary & Meta...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Summary, Read Time & SEO Tags</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            {summaryResult ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-sans font-bold text-sm text-slate-900">
                    Optimization Results
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{summaryResult.readTimeMinutes} min read</span>
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    2-Sentence Executive Excerpt
                  </label>
                  <p className="text-xs text-slate-800 p-3 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed font-sans">
                    {summaryResult.summary}
                  </p>
                </div>

                {/* SEO Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="uppercase tracking-wider font-semibold">SEO Meta Description</span>
                    <span className={summaryResult.seoDescription.length <= 155 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                      {summaryResult.seoDescription.length} / 155 chars
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 leading-relaxed font-sans">
                    {summaryResult.seoDescription}
                  </p>
                </div>

                {/* Key Takeaways */}
                {summaryResult.keyTakeaways && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Core Key Takeaways
                    </label>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {summaryResult.keyTakeaways.map((t: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Tags */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Suggested SEO Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {summaryResult.suggestedTags.map((t: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">SEO Analyzer & Excerpt Extractor</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Paste any existing draft on the left to extract a punchy summary, reading time estimation, and Google search-ready meta tags.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
