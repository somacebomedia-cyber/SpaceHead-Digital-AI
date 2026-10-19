import { GoogleGenAI } from "@google/genai";

export interface BlogDraftRequest {
  topic: string;
  rawPoints?: string;
  category?: string;
  targetAudience?: string;
  tone?: string;
}

export interface BlogDraftResponse {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  seoMeta: string;
  source: "gemini" | "heuristic_fallback";
  modelUsed?: string;
}

export interface CaseStudyRequest {
  projectName: string;
  clientOrIndustry?: string;
  challenge: string;
  solution: string;
  results?: string;
  techStack?: string;
}

export interface CaseStudyResponse {
  title: string;
  description: string;
  category: string;
  tags: string[];
  caseStudyMarkdown: string;
  metricsHighlights: string[];
  source: "gemini" | "heuristic_fallback";
  modelUsed?: string;
}

export interface SummarizeRequest {
  content: string;
  title?: string;
}

export interface SummarizeResponse {
  summary: string;
  readTimeMinutes: number;
  suggestedTags: string[];
  seoDescription: string;
  keyTakeaways: string[];
  source: "gemini" | "heuristic_fallback";
  modelUsed?: string;
}

/**
 * Executes a Gemini request trying lower-quota and alternative models
 * if resource_exhausted or rate-limit errors are encountered.
 */
export async function callGeminiWithFailover(
  client: GoogleGenAI | null,
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string; modelUsed: string } | null> {
  if (!client) return null;

  // Ordered fallback models: start with flash-lite (cheapest/highest availability),
  // then flash-latest, 3.7-flash, and 3.1-pro-preview
  const models = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.1-pro-preview"
  ];

  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: systemInstruction || undefined,
        },
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.warn(`[AI Engine] Model ${model} call failed (${msg}). Testing next available model...`);
      // If resource exhausted or rate limit, continue attempting failover
      if (
        msg.includes("quota") ||
        msg.includes("resource_exhausted") ||
        msg.includes("429") ||
        msg.includes("ResourceExhausted") ||
        msg.includes("limit: 25000000")
      ) {
        continue;
      }
    }
  }

  return null;
}

/**
 * Calculates estimated reading time in minutes from word count
 */
export function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Generates slug from title
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Technical Blog Post Generator
 */
export async function draftTechnicalBlogPost(
  client: GoogleGenAI | null,
  req: BlogDraftRequest
): Promise<BlogDraftResponse> {
  const topic = req.topic.trim();
  const rawPoints = req.rawPoints?.trim() || "";
  const category = req.category?.trim() || "Web Engineering";
  const audience = req.targetAudience?.trim() || "South African business owners and technical decision-makers";
  const tone = req.tone?.trim() || "Authoritative, practical, and conversion-focused";

  const prompt = `You are the Principal Technical Writer and Digital Architect at SpaceHead AI, a high-performance web engineering and digital agency in South Africa.
Write a comprehensive, publication-ready technical blog article based on the following brief:

Topic / Core Thesis: "${topic}"
Target Audience: ${audience}
Preferred Tone: ${tone}
Specified Category: ${category}
${rawPoints ? `Raw Points / Arguments to Cover:\n${rawPoints}` : ""}

Ensure the article incorporates:
1. An engaging opening establishing the strategic problem for businesses (especially in the South African context).
2. Deep architectural or operational explanations (e.g. why modern TypeScript, Next.js, or AI integrations create compounding competitive advantages).
3. Concrete implementation takeaways, comparative trade-offs, and best practices.
4. Clean Markdown formatting with headers (##, ###), bullet points, and code/quote callouts.

Return a STRICT JSON object matching this schema:
{
  "title": "Compelling, high-converting article headline",
  "slug": "url-friendly-slug",
  "summary": "Crisp 2-sentence executive summary under 200 characters",
  "content": "Full markdown formatted article content with ## headings and paragraphs",
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seoMeta": "Meta description under 155 characters designed for search click-through rate"
}`;

  const aiResult = await callGeminiWithFailover(
    client,
    prompt,
    "You are a world-class technology author specializing in web performance, AI solutions, and digital growth in South Africa. Always respond with valid JSON only."
  );

  if (aiResult) {
    try {
      const cleanJson = aiResult.text.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      const content = parsed.content || "";
      return {
        title: parsed.title || topic,
        slug: parsed.slug || slugify(parsed.title || topic),
        summary: parsed.summary || `${topic} — an in-depth strategic analysis from the engineering desk at SpaceHead AI.`,
        content: content,
        category: parsed.category || category,
        tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : ["Engineering", "Web Performance", "South Africa"],
        readTimeMinutes: estimateReadTime(content),
        seoMeta: (parsed.seoMeta || parsed.summary || "").slice(0, 155),
        source: "gemini",
        modelUsed: aiResult.modelUsed
      };
    } catch (parseErr) {
      console.warn("[AI Engine] Failed to parse Gemini blog response JSON, utilizing smart fallback:", parseErr);
    }
  }

  // Smart Heuristic Fallback (Active when quota is exhausted or API is unreachable)
  return generateHeuristicBlogPost(req);
}

/**
 * Case Study Polisher & Generator
 */
export async function polishCaseStudy(
  client: GoogleGenAI | null,
  req: CaseStudyRequest
): Promise<CaseStudyResponse> {
  const projectName = req.projectName.trim();
  const industry = req.clientOrIndustry?.trim() || "Commercial & Professional Services";
  const challenge = req.challenge.trim();
  const solution = req.solution.trim();
  const results = req.results?.trim() || "Drastically cut response latencies, improved user engagement, and eliminated manual bottlenecks.";
  const techStack = req.techStack?.trim() || "React, TypeScript, Tailwind CSS, Firebase, PayFast";

  const prompt = `You are the Lead Solutions Architect at SpaceHead AI.
Transform these raw project bullet points into a polished, high-status engineering Case Study suitable for our portfolio:

Project Name: "${projectName}"
Industry: "${industry}"
The Challenge: """${challenge}"""
The SpaceHead AI Solution: """${solution}"""
Measurable Results: """${results}"""
Tech Stack: "${techStack}"

Return a STRICT JSON object matching this schema:
{
  "title": "Clean, authoritative project title",
  "description": "Punchy 1-2 sentence elevator summary of the transformation",
  "category": "Web Application" | "E-Commerce" | "AI Automation" | "Mobile Platform",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "caseStudyMarkdown": "Full 3-section markdown: ## The Challenge, ## The Architecture & Solution, ## The Measurable Impact",
  "metricsHighlights": ["Metric 1 (e.g. +74% Lead Capture)", "Metric 2 (e.g. <200ms Load Speed)", "Metric 3 (e.g. 100% Automated Reconciliation)"]
}`;

  const aiResult = await callGeminiWithFailover(
    client,
    prompt,
    "You are a senior tech lead writing concise, evidence-driven client success case studies. Output JSON only."
  );

  if (aiResult) {
    try {
      const cleanJson = aiResult.text.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return {
        title: parsed.title || projectName,
        description: parsed.description || `Engineered bespoke ${industry} infrastructure delivering accelerated speed and operational stability.`,
        category: parsed.category || "Web Application",
        tags: Array.isArray(parsed.tags) ? parsed.tags : ["TypeScript", "Tailwind", "Firebase"],
        caseStudyMarkdown: parsed.caseStudyMarkdown || `## The Challenge\n${challenge}\n\n## The Architecture\n${solution}\n\n## The Measurable Impact\n${results}`,
        metricsHighlights: Array.isArray(parsed.metricsHighlights) && parsed.metricsHighlights.length > 0 
          ? parsed.metricsHighlights 
          : ["99.9% Uptime", "Sub-second Page Loads", "Zero Manual Friction"],
        source: "gemini",
        modelUsed: aiResult.modelUsed
      };
    } catch (parseErr) {
      console.warn("[AI Engine] Failed to parse Gemini case study JSON, using smart fallback:", parseErr);
    }
  }

  return generateHeuristicCaseStudy(req);
}

/**
 * Content Summarizer & SEO Optimizer
 */
export async function summarizeContent(
  client: GoogleGenAI | null,
  req: SummarizeRequest
): Promise<SummarizeResponse> {
  const content = req.content.trim();
  const title = req.title?.trim() || "";

  const prompt = `Analyze this draft content and generate an executive summary, SEO description, tags, and key takeaways:

${title ? `Title: ${title}\n` : ""}Content:
"""${content.slice(0, 3000)}"""

Return a STRICT JSON object:
{
  "summary": "Crisp 2-sentence summary under 200 characters capturing the core value proposition",
  "seoDescription": "Search-optimized meta description strictly between 120 and 155 characters",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keyTakeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ]
}`;

  const aiResult = await callGeminiWithFailover(
    client,
    prompt,
    "You are a technical editor and SEO expert. Output JSON only."
  );

  if (aiResult) {
    try {
      const cleanJson = aiResult.text.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return {
        summary: parsed.summary || content.slice(0, 180) + "...",
        readTimeMinutes: estimateReadTime(content),
        suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : ["SpaceHead AI", "Web Engineering", "Digital Growth"],
        seoDescription: (parsed.seoDescription || parsed.summary || content.slice(0, 150)).slice(0, 155),
        keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [
          "Optimized for high responsiveness and local user engagement",
          "Engineered with clean architectural separation of concerns",
          "Delivers measurable performance and operational time savings"
        ],
        source: "gemini",
        modelUsed: aiResult.modelUsed
      };
    } catch (parseErr) {
      console.warn("[AI Engine] Failed to parse Gemini summary JSON, using smart fallback:", parseErr);
    }
  }

  return generateHeuristicSummary(req);
}

// ---------------------------------------------------------------------------
// High-Precision Heuristic Engines (Active when API Quota is Exceeded)
// ---------------------------------------------------------------------------

function generateHeuristicBlogPost(req: BlogDraftRequest): BlogDraftResponse {
  const topic = req.topic.trim();
  const category = req.category?.trim() || "Web Engineering";
  const slug = slugify(topic);

  const formattedContent = `## Executive Overview

In South Africa’s rapidly evolving digital economy, businesses cannot afford sluggish digital interfaces or brittle architectures. As client expectations accelerate, the distinction between high-performance custom engineering and off-the-shelf templates has become a decisive competitive divide.

This analysis explores the strategic foundations of **${topic}**, outlining how forward-thinking brands leverage modern engineering practices to build compounding operational advantages.

---

## The Strategic Imperative

Traditional web setups often suffer from severe latency penalties on local cellular networks (Vodacom, MTN, Telkom). When every 100 milliseconds of latency erodes conversion rates by up to 7%, speed is not merely a technical luxury—it is core revenue infrastructure.

Key considerations include:

- **Sub-Second First Contentful Paint (FCP):** Pre-rendered static assets and server-side streaming ensure immediate interactivity even on throttled mobile connections.
- **Defensive Data Architecture:** Decoupling client rendering from secure cloud backends protects proprietary workflows while ensuring 99.9% uptime.
- **Native Transaction Flow:** Seamless integrations with South African payment gateways like PayFast remove international card declines and currency conversion friction.

${req.rawPoints ? `### Core Implementation Highlights\n\n${req.rawPoints.split('\n').filter(p => p.trim()).map(p => `- ${p.replace(/^[-*•]\s*/, '')}`).join('\n')}\n\n` : ''}
---

## Practical Architectural Takeaways

1. **Prioritize Edge Caching & Lightweight Bundles:** Minimize external script bloat and heavy third-party plugins in favor of tree-shaken TypeScript modules.
2. **Build for Resilient Connectivity:** Design optimistic UI states and robust error boundaries to maintain a calm, premium experience during intermittent network drops.
3. **Automate Operational Touchpoints:** Connect inbound client actions directly into WhatsApp alert pipelines and cloud persistence layers to eliminate manual response delays.

---

## Conclusion & Next Steps

Executing **${topic}** with intentional craft transforms your digital presence from a passive brochure into an automated growth engine. At **SpaceHead AI**, we specialize in designing and engineering bespoke digital systems that deliver measurable business outcomes.

*To evaluate how this architecture can be tailored to your specific commercial requirements, connect with our engineering team for a dedicated technical consultation.*`;

  return {
    title: topic.length > 55 ? topic : `${topic}: A Strategic Engineering Guide`,
    slug,
    summary: `Discover why ${topic} is transforming modern digital operations in South Africa, unlocking superior load speeds, seamless conversions, and lasting competitive advantage.`,
    content: formattedContent,
    category,
    tags: [category, "SpaceHead AI", "Web Engineering", "Digital Growth", "South Africa"],
    readTimeMinutes: estimateReadTime(formattedContent),
    seoMeta: `Strategic guide on ${topic} for South African businesses. Learn key architectural patterns, mobile performance gains, and ROI outcomes.`.slice(0, 155),
    source: "heuristic_fallback"
  };
}

function generateHeuristicCaseStudy(req: CaseStudyRequest): CaseStudyResponse {
  const projectName = req.projectName.trim();
  const industry = req.clientOrIndustry?.trim() || "Commercial & Professional Services";
  const challenge = req.challenge.trim();
  const solution = req.solution.trim();
  const results = req.results?.trim() || "Eliminated manual bottlenecks, boosted customer engagement, and achieved sub-second latency.";
  const techStack = req.techStack?.trim() || "TypeScript, Tailwind CSS, Firebase, PayFast";

  const caseStudyMarkdown = `## The Challenge

${challenge}

Prior to engaging SpaceHead AI, the business faced significant friction caused by outdated manual processes, fragmented communications, and inconsistent customer conversion points across devices.

---

## The Architecture & Solution

${solution}

To resolve these operational bottlenecks, SpaceHead AI engineered a custom-crafted platform built upon modern reactive principles:

- **High-Velocity Frontend:** Engineered in React and TypeScript with Tailwind CSS for zero-latency client interactions and responsive mobile ergonomics.
- **Secure Cloud Persistence:** Real-time synchronization powered by Google Cloud & Firestore with role-based access rules and data isolation.
- **Integrated Commercial Gateway:** Native South African PayFast processing for instant debit/credit card and Instant EFT settlements.

**Core Technology Stack:** \`${techStack}\`

---

## The Measurable Impact

${results}

Following deployment, the platform immediately delivered tangible commercial returns:

- **Operational Efficiency:** Slashed administrative overhead and response times by over 60%.
- **Client Conversion Rate:** Seamless mobile navigation delivered a significant uplift in verified customer inquiries.
- **Enterprise Reliability:** Maintained uninterrupted availability with automated error tracking and self-healing cloud infrastructure.`;

  return {
    title: projectName,
    description: `Bespoke ${industry} platform engineered to eliminate operational bottlenecks, accelerate client conversions, and deliver sub-second performance.`,
    category: industry.toLowerCase().includes("commerce") ? "E-Commerce" : "Web Application",
    tags: techStack.split(",").map(t => t.trim()).filter(Boolean),
    caseStudyMarkdown,
    metricsHighlights: [
      "+65% Lead Velocity",
      "<250ms Load Speed",
      "99.9% Uptime SLA"
    ],
    source: "heuristic_fallback"
  };
}

function generateHeuristicSummary(req: SummarizeRequest): SummarizeResponse {
  const content = req.content.trim();
  const title = req.title?.trim() || "SpaceHead AI Insight";
  const words = content.split(/\s+/);
  const firstSentence = content.split(/[.!?]/)[0] || title;

  const summary = firstSentence.length > 20 && firstSentence.length < 180
    ? `${firstSentence.trim()}. Engineered for high-conversion performance and operational reliability.`
    : `A comprehensive examination of ${title}, providing strategic architectural guidance and actionable implementation patterns for growing businesses.`;

  return {
    summary: summary.slice(0, 200),
    readTimeMinutes: estimateReadTime(content),
    suggestedTags: ["SpaceHead AI", "Web Engineering", "Architecture", "Digital Strategy", "South Africa"],
    seoDescription: `${summary} Learn how modern engineering unlocks compounding business value.`.slice(0, 155),
    keyTakeaways: [
      "Optimized for high-performance execution across mobile and desktop environments",
      "Architected with robust separation of concerns and clear data persistence",
      "Tailored specifically for the operational demands of South African commerce"
    ],
    source: "heuristic_fallback"
  };
}
