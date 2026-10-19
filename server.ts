import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createPayfastPayment, verifyPayfastITN } from "./src/lib/payfastService.js";
import { 
  callGeminiWithFailover, 
  draftTechnicalBlogPost, 
  polishCaseStudy, 
  summarizeContent 
} from "./src/lib/serverAiEngine.js";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

let _dirname = "";
try {
  _dirname = __dirname;
} catch {
  _dirname = path.dirname(fileURLToPath(import.meta.url));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Raised from Express's 100kb default — the animate/start route receives a
  // base64-encoded logo image (a 2K PNG easily runs a few MB as base64 text).
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // API Route for Payfast Payment Creation
  app.post("/api/payfast/create-payment", (req, res) => {
    try {
      const {
        planId,
        amountRands,
        itemName,
        itemDescription,
        paymentId,
        returnPath,
        cancelPath,
        customStr1,
        customStr2,
        email,
        firstName,
        lastName,
        cellNumber,
        recurring,
      } = req.body;

      // If neither a valid planId nor a positive amount is provided, reject
      if (!planId && (!amountRands || Number(amountRands) <= 0)) {
        return res.status(400).json({ error: "Invalid payment plan or amount specified" });
      }

      const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
      const proto = req.headers["x-forwarded-proto"] || "https";
      const origin = (req.headers.origin as string) || `${proto}://${host}`;

      const payment = createPayfastPayment({
        planId,
        amountRands: amountRands ? Number(amountRands) : undefined,
        itemName: itemName || "SpaceHead AI Digital Service",
        itemDescription,
        paymentId,
        origin,
        returnPath: returnPath || "/services",
        cancelPath: cancelPath || "/services",
        customStr1,
        customStr2,
        email,
        firstName,
        lastName,
        cellNumber,
        recurring: recurring
          ? {
              billingDate: recurring.billingDate,
              recurringAmountRands: Number(recurring.recurringAmountRands),
              frequency: 3,
              cycles: Number(recurring.cycles),
            }
          : undefined,
      });

      res.json(payment);
    } catch (error: any) {
      console.error("Payfast payment creation error:", error);
      res.status(500).json({ error: error.message || "Could not initiate Payfast checkout" });
    }
  });

  // API Route for Payfast Instant Transaction Notification (ITN / Webhook)
  app.post("/api/payfast/notify", async (req, res) => {
    try {
      const postData = req.body as Record<string, string>;
      console.log("Received Payfast ITN payload:", postData);

      const verification = await verifyPayfastITN(postData);

      if (!verification.isValid) {
        console.warn("Payfast ITN verification failed or invalid signature.");
        return res.status(400).send("Invalid Payfast ITN payload signature");
      }

      const paymentStatus = postData.payment_status;
      const paymentId = postData.m_payment_id;
      const pfPaymentId = postData.pf_payment_id;
      const amountGross = postData.amount_gross;
      // Present only on recurring/subscription-related ITNs, per Payfast's docs —
      // its presence is how we tell "deposit just paid" apart from
      // "this month's automatic installment just landed."
      const subscriptionToken = postData.token;

      if (subscriptionToken) {
        console.log(
          `Payfast RECURRING charge received. Status: ${paymentStatus}, Order ID: ${paymentId}, ` +
          `Payfast ID: ${pfPaymentId}, Amount: R${amountGross}, Subscription token: ${subscriptionToken}`
        );
      } else {
        console.log(`Payfast payment confirmed! Status: ${paymentStatus}, Order ID: ${paymentId}, Payfast ID: ${pfPaymentId}, Amount: R${amountGross}`);
      }

      // This is the ONLY place an order is marked paid. It's server-to-server and
      // signature-verified above, so it can't be spoofed by a browser redirect.
      if (paymentStatus === "COMPLETE" && paymentId) {
        console.log(`Payfast payment marked complete for payment ${paymentId}`);
      }

      res.status(200).send("OK");
    } catch (error: any) {
      console.error("Payfast ITN error:", error);
      res.status(500).send("Error processing Payfast notification");
    }
  });

  // API Route for AI Project Scope & Architecture Analysis
  app.post("/api/ai/estimate-scope", async (req, res) => {
    try {
      const { prompt, businessType } = req.body;
      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({ error: "Missing project requirements description" });
      }

      const client = getGeminiClient();
      if (client) {
        try {
          const aiResponse = await callGeminiWithFailover(
            client,
            `You are the Lead Solutions Architect at SpaceHead AI, a premier South African digital marketing, web engineering, and AI agency.
Analyze the prospective client's project description and formulate an optimized technical architecture and scope configuration.

Client Requirements:
"""${prompt.slice(0, 1500)}"""
${businessType ? `Business Type / Industry: ${businessType}` : ""}

Available Project Archetypes:
- "web_app": Custom Web App & Portal (Base: R12,500, ~14 days) - Best for client portals, dashboards, booking systems, SaaS.
- "ai_saas": AI-Powered SaaS & Automation (Base: R17,500, ~18 days) - Best for workflow automation, AI agents, document triage.
- "ecommerce": E-Commerce & Payments Portal (Base: R14,500, ~14 days) - Best for product catalogs, PayFast checkout, orders.
- "showcase": Corporate Showcase & SEO CMS (Base: R7,900, ~7 days) - Best for company branding, blogs, local SEO, lead capture.
- "brand_launch": Complete Brand & Digital Launch (Base: R19,500, ~21 days) - Best for startups needing website + 2D animated promo reel + logo branding.

Available Modular Feature IDs:
- "auth_rbac": User Authentication & Role-Based Access Control (Admin, Client, Staff)
- "db_cloud": Real-Time Cloud Database & Offline Cache (Firestore / PostgreSQL)
- "gemini_ai": Gemini 3.7 Flash AI Copilot & Automation
- "payfast_gateway": South African PayFast Payment Engine (Cards, Instant EFT, Zapper)
- "analytics_dash": Interactive KPI Dashboard & Data Visualizations (Charts & CSV exports)
- "whatsapp_email_notif": Automated WhatsApp & Email Alert System
- "cms_blog": Custom Blog Engine & Dynamic SEO Suite
- "promo_video": 60s 2D Animated Explainer / Product Promo Reel
- "fast_track_sla": Fast-Track Sprint Acceleration (50% Faster Delivery)

Return a strictly valid JSON object matching this schema:
{
  "recommendedArchetypeId": "web_app" | "ai_saas" | "ecommerce" | "showcase" | "brand_launch",
  "recommendedModuleIds": string[],
  "executiveSummary": "2-3 concise, professional sentences explaining the strategic technical architecture tailored specifically to the client's business context.",
  "architectureHighlights": [
    "Highlight 1",
    "Highlight 2",
    "Highlight 3"
  ],
  "projectedRoiSummary": "1-2 sentences on expected time savings, conversion lift, or operational efficiency.",
  "suggestedSlaDays": number,
  "confidenceScore": number
}`
          );

          if (aiResponse && aiResponse.text) {
            const cleanJson = aiResponse.text.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return res.json({ ...parsed, modelUsed: aiResponse.modelUsed });
          }
        } catch (aiErr: any) {
          console.warn("Gemini API call failed, falling back to heuristic analyzer:", aiErr?.message || aiErr);
        }
      }

      // Fallback Heuristic Rule Engine (Guarantees immediate, high quality recommendations even offline or if API key is missing)
      const p = prompt.toLowerCase();
      let archetypeId = "web_app";
      const moduleIds: string[] = ["db_cloud"];

      if (p.includes("ai") || p.includes("bot") || p.includes("copilot") || p.includes("smart") || p.includes("automation") || p.includes("extract")) {
        archetypeId = "ai_saas";
        moduleIds.push("gemini_ai", "auth_rbac", "analytics_dash");
      } else if (p.includes("shop") || p.includes("store") || p.includes("ecommerce") || p.includes("cart") || p.includes("product") || p.includes("pay") || p.includes("buy")) {
        archetypeId = "ecommerce";
        moduleIds.push("payfast_gateway", "whatsapp_email_notif");
      } else if (p.includes("video") || p.includes("animat") || p.includes("brand") || p.includes("launch") || p.includes("logo")) {
        archetypeId = "brand_launch";
        moduleIds.push("promo_video", "cms_blog", "whatsapp_email_notif");
      } else if (p.includes("blog") || p.includes("showcase") || p.includes("portfolio") || p.includes("corporate") || p.includes("law") || p.includes("consult")) {
        archetypeId = "showcase";
        moduleIds.push("cms_blog", "whatsapp_email_notif");
      } else {
        archetypeId = "web_app";
        moduleIds.push("auth_rbac", "analytics_dash");
      }

      if (p.includes("login") || p.includes("user") || p.includes("account") || p.includes("portal") || p.includes("patient") || p.includes("staff") || p.includes("member")) {
        if (!moduleIds.includes("auth_rbac")) moduleIds.push("auth_rbac");
      }
      if (p.includes("pay") || p.includes("eft") || p.includes("card") || p.includes("deposit") || p.includes("checkout") || p.includes("billing") || p.includes("invoice")) {
        if (!moduleIds.includes("payfast_gateway")) moduleIds.push("payfast_gateway");
      }
      if (p.includes("whatsapp") || p.includes("sms") || p.includes("email") || p.includes("notify") || p.includes("alert") || p.includes("remind")) {
        if (!moduleIds.includes("whatsapp_email_notif")) moduleIds.push("whatsapp_email_notif");
      }
      if (p.includes("chart") || p.includes("stat") || p.includes("metric") || p.includes("report") || p.includes("kpi") || p.includes("dashboard")) {
        if (!moduleIds.includes("analytics_dash")) moduleIds.push("analytics_dash");
      }
      if (p.includes("urgent") || p.includes("asap") || p.includes("fast") || p.includes("rush") || p.includes("quick")) {
        if (!moduleIds.includes("fast_track_sla")) moduleIds.push("fast_track_sla");
      }

      const fallbackResult = {
        recommendedArchetypeId: archetypeId,
        recommendedModuleIds: Array.from(new Set(moduleIds)),
        executiveSummary: `SpaceHead AI has analyzed your specifications and architected an optimized ${archetypeId.replace('_', ' ').toUpperCase()} solution. The proposed platform decouples presentation from scalable backend logic, ensuring high availability, sub-second responses, and native South African transaction compliance.`,
        architectureHighlights: [
          "Zero-latency reactive user interface built with TypeScript and Tailwind CSS",
          "Automated cloud data persistence with role-based access control and security rules",
          "Direct South African payment and notification channels (PayFast, WhatsApp alerts)"
        ],
        projectedRoiSummary: "Reduces manual client communication by an estimated 65% while providing a frictionless checkout and lead capture workflow.",
        suggestedSlaDays: 14,
        confidenceScore: 0.92,
        source: "heuristic_fallback"
      };

      res.json(fallbackResult);
    } catch (err: any) {
      console.error("AI Estimate Scope error:", err);
      res.status(500).json({ error: "Failed to generate AI architecture recommendation" });
    }
  });

  // API Route for Technical Blog Drafting (Gemini + Smart Fallback)
  app.post("/api/ai/draft-blog", async (req, res) => {
    try {
      const { topic, rawPoints, category, targetAudience, tone } = req.body;
      if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
        return res.status(400).json({ error: "Missing topic for blog draft" });
      }

      const client = getGeminiClient();
      const draft = await draftTechnicalBlogPost(client, {
        topic,
        rawPoints,
        category,
        targetAudience,
        tone
      });

      res.json(draft);
    } catch (err: any) {
      console.error("AI Draft Blog error:", err);
      res.status(500).json({ error: "Failed to generate blog draft" });
    }
  });

  // API Route for Case Study Polishing (Gemini + Smart Fallback)
  app.post("/api/ai/polish-case-study", async (req, res) => {
    try {
      const { projectName, clientOrIndustry, challenge, solution, results, techStack } = req.body;
      if (!projectName || !challenge || !solution) {
        return res.status(400).json({ error: "Missing required case study fields (projectName, challenge, solution)" });
      }

      const client = getGeminiClient();
      const result = await polishCaseStudy(client, {
        projectName,
        clientOrIndustry,
        challenge,
        solution,
        results,
        techStack
      });

      res.json(result);
    } catch (err: any) {
      console.error("AI Polish Case Study error:", err);
      res.status(500).json({ error: "Failed to polish case study" });
    }
  });

  // API Route for Content Summarization & SEO Optimization (Gemini + Smart Fallback)
  app.post("/api/ai/summarize-content", async (req, res) => {
    try {
      const { content, title } = req.body;
      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Missing content to summarize" });
      }

      const client = getGeminiClient();
      const result = await summarizeContent(client, { content, title });

      res.json(result);
    } catch (err: any) {
      console.error("AI Summarize Content error:", err);
      res.status(500).json({ error: "Failed to summarize content" });
    }
  });

  // API Route for Public Google Drive Folder Scraping (Pathway 1)
  app.get("/api/drive/public-folder", async (req, res) => {
    const folderId = req.query.folderId as string;
    if (!folderId) {
      return res.status(400).json({ error: "Missing folderId query parameter" });
    }
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) {
        throw new Error(`Google Drive returned status ${response.status}`);
      }
      const html = await response.text();
      
      const cleanHtml = html
        .replace(/\\x22/g, '"')
        .replace(/\\x5b/g, '[')
        .replace(/\\x5d/g, ']')
        .replace(/\\x2f/g, '/')
        .replace(/\\u0022/g, '"')
        .replace(/\\u005b/g, '[')
        .replace(/\\u005d/g, ']');

      const regex = /\["([a-zA-Z0-9_-]{28,})",\["([a-zA-Z0-9_-]{28,})"\],"([^"]+)","([^"]+)"/g;
      let match;
      const files: any[] = [];
      const seenIds = new Set();

      while ((match = regex.exec(cleanHtml)) !== null) {
        const fileId = match[1];
        const folderIdMatch = match[2];
        const name = match[3];
        const mimeType = match[4].replace(/\\/g, ''); // Clean escaped slashes in mime-type e.g. image\/png -> image/png
        
        if (!seenIds.has(fileId)) {
          seenIds.add(fileId);
          files.push({
            id: fileId,
            name,
            mimeType,
            modifiedTime: new Date().toISOString(),
            webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
            thumbnailLink: `https://lh3.googleusercontent.com/d/${fileId}=w800-h800`,
            iconLink: "https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png"
          });
        }
      }
      res.json({ files });
    } catch (error: any) {
      console.error("Public Drive scraping error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch or parse folder" });
    }
  });

  let vite: any;

  if (process.env.NODE_ENV !== "production") {
    // Serve static files from public directory in development
    app.use(express.static(path.resolve(_dirname, "public")));

    // Development mode with custom Vite SSR middleware
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static compiled assets in production
    app.use(express.static(path.resolve(_dirname, "dist/client"), { index: false }));
  }

  // Handle SSR React routing
  app.get("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      let template: string;

      if (process.env.NODE_ENV !== "production") {
        // Read index.html raw template from root
        template = fs.readFileSync(path.resolve(_dirname, "index.html"), "utf-8");
        // Feed to Vite HTML transform pipeline for client imports injecting
        template = await vite.transformIndexHtml(url, template);
      } else {
        // Production: read compiled template
        template = fs.readFileSync(path.resolve(_dirname, "dist/client/index.html"), "utf-8");
      }

      // Optimize search engine visibility (SEO meta injection for South African local services)
      let title = "Web Design, Video Ads & SEO Services South Africa | SpaceHead AI";
      let description = "Premium website design, animated promotional video ads, PayFast integration, and local SEO services for South African businesses in Johannesburg, Cape Town, Durban and nationwide.";
      let canonical = "https://spaceheadai.co.za";
      let robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

      if (url.startsWith("/services")) {
        title = "Website Design, Video Ads & SEO Services for SA Businesses | SpaceHead AI";
        description = "Affordable websites, promotional 2D video ads, PayFast integration, and Google Maps local SEO for doctors, accountants, trades, and local South African businesses.";
        canonical = "https://spaceheadai.co.za/services";
      } else if (url.startsWith("/estimator")) {
        title = "Website Cost Calculator & Project Estimator (ZAR) | SpaceHead AI";
        description = "Calculate instant website design, e-commerce, and app development costs for your South African business in ZAR. Customize features, calculate monthly ROI & download a free PDF proposal.";
        canonical = "https://spaceheadai.co.za/estimator";
      } else if (url.startsWith("/projects")) {
        title = "Web Design & Video Ads Portfolio for SA Businesses | SpaceHead AI";
        description = "Explore custom websites, animated promotional video ads, and digital branding projects built for South African businesses, medical practices, and emerging startups.";
        canonical = "https://spaceheadai.co.za/projects";
      } else if (url.startsWith("/blog")) {
        title = "South African Business Marketing & Local SEO Guides | SpaceHead AI";
        description = "Discover high-converting website design tips, Google Maps local SEO strategies, PayFast payment tutorials, and marketing guides for South African entrepreneurs.";
        canonical = "https://spaceheadai.co.za/blog";
      } else if (url.startsWith("/contact")) {
        title = "Contact Web Designers South Africa | Get a Quote | SpaceHead AI";
        description = "Request a fast website design, promotional video ad, or custom web app quote. Guaranteed 2-hour response, direct WhatsApp chat, and ZAR pricing for South African businesses.";
        canonical = "https://spaceheadai.co.za/contact";
      } else if (url.startsWith("/auth")) {
        title = "Client Portal & Workspace Sign In | SpaceHead AI";
        description = "Sign in to the SpaceHead AI client portal to review project updates, deliverable previews, and website launch schedules.";
        canonical = "https://spaceheadai.co.za/auth";
        robots = "noindex, nofollow";
      } else if (url.startsWith("/admin")) {
        title = "Admin Command Center | SpaceHead AI Control Center";
        description = "Administrative control center for SpaceHead AI.";
        canonical = "https://spaceheadai.co.za/admin";
        robots = "noindex, nofollow";
      }

      // Inject dynamic SEO values and clean root container
      let htmlWithMeta = template
        .replace(/<title>.*?<\/title>/, `<title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}">`)
        .replace("<!--app-html-->", "");

      res.status(200).set({ "Content-Type": "text/html" }).end(htmlWithMeta);
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production") {
        vite.ssrFixStacktrace(e);
      }
      console.error("SSR Rendering crashed:", e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
