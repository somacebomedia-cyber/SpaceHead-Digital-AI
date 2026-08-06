import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createPayfastPayment, verifyPayfastITN } from "./src/lib/payfastService.js";

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

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route for Payfast Payment Creation
  app.post("/api/payfast/create-payment", (req, res) => {
    try {
      const { amountRands, itemName, itemDescription, returnPath, cancelPath, customStr1, customStr2, email, firstName, lastName } = req.body;
      if (!amountRands || Number(amountRands) <= 0) {
        return res.status(400).json({ error: "Invalid payment amount specified" });
      }

      const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
      const proto = req.headers["x-forwarded-proto"] || "https";
      const origin = (req.headers.origin as string) || `${proto}://${host}`;

      const payment = createPayfastPayment({
        amountRands: Number(amountRands),
        itemName: itemName || "SpaceHead AI Digital Service",
        itemDescription,
        origin,
        returnPath: returnPath || "/services",
        cancelPath: cancelPath || "/services",
        customStr1,
        customStr2,
        email,
        firstName,
        lastName,
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

      console.log(`Payfast payment confirmed! Status: ${paymentStatus}, Order ID: ${paymentId}, Payfast ID: ${pfPaymentId}, Amount: R${amountGross}`);

      // Always send HTTP 200 OK to Payfast to acknowledge ITN receipt
      res.status(200).send("OK");
    } catch (error: any) {
      console.error("Payfast ITN error:", error);
      res.status(500).send("Error processing Payfast notification");
    }
  });

  // API Route for AI Logo Prompt Enhancer using Gemini
  app.post("/api/logo-studio/enhance-prompt", async (req, res) => {
    const { businessName, tagline, industry, style, colors, customDetails } = req.body;
    const fallbackPrompt = `Vector emblem logo for "${businessName || "Brand"}"${tagline ? ` with tagline "${tagline}"` : ""}. Industry: ${industry || "Technology"}. Style: ${style || "Modern Minimalist"}. Colors: ${colors || "Indigo and Gold"}. High contrast vector graphics on clean isolated neutral background, sharp typography, golden ratio geometry, sleek icon badge, 8k resolution graphic design asset.`;

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({ enhancedPrompt: fallbackPrompt, source: "fallback" });
      }

      const prompt = `You are a world-class graphic designer and brand identity specialist. Create a detailed, highly effective image generation prompt for creating a professional business logo.
Business Name: "${businessName}"
Tagline: "${tagline || "None"}"
Industry/Niche: ${industry || "General"}
Visual Archetype/Style: ${style || "Modern Minimalist"}
Color Palette: ${colors || "Premium Gradient"}
Custom Notes: ${customDetails || "Clean vector logo"}

Return ONLY a concise, vivid prompt (1-3 sentences) optimized for AI image generation. Emphasize vector clarity, flat design/3D emblem specs, crisp typography placement, isolated solid background, and high contrast. Do not include markdown or conversational filler.`;

      const result = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      const enhancedText = result.text ? result.text.trim() : prompt;
      return res.json({ enhancedPrompt: enhancedText, source: "gemini" });
    } catch (err: any) {
      console.warn("Gemini prompt enhance fallback engaged:", err?.message || err);
      return res.json({ enhancedPrompt: fallbackPrompt, source: "fallback", note: "Gemini quota or API limit reached" });
    }
  });

  // API Route for AI Logo Studio Generation (SVG Vector + Image Fallback + Procedural Engine)
  app.post("/api/logo-studio/generate", async (req, res) => {
    try {
      const { prompt, businessName, style, colorPalette, aspectRatio } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          status: "fallback",
          message: "Gemini API key not attached on server. Providing interactive canvas vector logo builder.",
          logoData: null
        });
      }

      // Step 1: Try generating clean, scalable SVG vector code with gemini-2.5-flash
      try {
        const svgPrompt = `You are a world-class brand identity graphic designer. Generate a clean, modern, professional vector logo in standalone SVG format for business name "${businessName || "Brand"}". 
Style instructions: ${style || "Modern Emblem"}. Color theme: ${colorPalette || "Indigo & Purple"}. Details: ${prompt}.
CRITICAL REQUIREMENTS:
- Output ONLY valid, raw, standalone SVG code starting with <svg> and ending with </svg>.
- Do not wrap in markdown code blocks or backticks.
- Include viewBox="0 0 500 500", width="500", height="500", xmlns="http://www.w3.org/2000/svg".
- Create beautiful geometric shapes, vibrant gradient definitions (<defs><linearGradient>...), crisp typography, and an aesthetically pleasing icon mark.
- Use a solid or gradient background <rect> for high contrast.`;

        const textResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: svgPrompt }] }]
        });

        const rawText = textResponse.text || "";
        const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
        if (svgMatch) {
          const svgCode = svgMatch[0];
          const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString("base64")}`;
          return res.json({ 
            status: "success", 
            imageUrl: svgDataUrl, 
            svgContent: svgCode,
            source: "gemini-svg" 
          });
        }
      } catch (svgErr: any) {
        // Continue to image model fallback if SVG generation missed
      }

      // Step 2: Secondary attempt with image generation model if available and not quota-limited
      try {
        const imagePrompt = `Professional vector logo mark for "${businessName || "Brand"}". ${prompt}. Clean background, high resolution graphic design icon.`;
        const imageResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: { parts: [{ text: imagePrompt }] },
          config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } }
        });

        if (imageResponse.candidates && imageResponse.candidates[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              return res.json({ 
                status: "success", 
                imageUrl: `data:${mime};base64,${part.inlineData.data}`,
                source: "gemini-image"
              });
            }
          }
        }
      } catch (imgErr: any) {
        // Soft fallback to procedural canvas vector generator
      }

      return res.json({ 
        status: "fallback", 
        message: "Using high-resolution procedural vector generator", 
        logoData: null 
      });
    } catch (err: any) {
      return res.json({ 
        status: "fallback", 
        message: "Using high-resolution procedural vector generator", 
        logoData: null 
      });
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
      let render: any;

      if (process.env.NODE_ENV !== "production") {
        // Read index.html raw template from root
        template = fs.readFileSync(path.resolve(_dirname, "index.html"), "utf-8");
        
        // Feed to Vite HTML transform pipeline for client imports injecting
        template = await vite.transformIndexHtml(url, template);
        
        // Dynamically load server entry module
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        // Production: read compiled template
        template = fs.readFileSync(path.resolve(_dirname, "dist/client/index.html"), "utf-8");
        
        // Import pre-rendered server production bundle
        const serverBundlePath = path.resolve(_dirname, "dist/server/entry-server.js");
        const serverEntry = await import(serverBundlePath);
        render = serverEntry.render;
      }

      // Pre-render the component tree
      const { html } = render();

      // Optimize search engine visibility (SEO meta injection)
      let title = "SpaceHead AI | South African Digital Marketing & Web Agency";
      let description = "Bespoke social media graphic posts, engaging 2D animated videos, and custom-built websites for South African businesses from R699 setup.";

      if (url.startsWith("/blog")) {
        title = "Marketing & Design Insights | SpaceHead AI";
        description = "Discover high-converting social media design tips, video marketing strategies, and web design articles written for local South African brands.";
      } else if (url.startsWith("/projects")) {
        title = "Our Creative Showcase & Portfolio | SpaceHead AI";
        description = "Browse our high-end responsive websites, custom branding post bundles, and animated promo video reels built for SA clients.";
      } else if (url === "/admin") {
        title = "Studio Dashboard | SpaceHead AI Control Center";
        description = "Manage, create, and optimize active visual assets and technical portfolios.";
      }

      // Inject pre-rendered html and dynamic SEO values
      let htmlWithMeta = template
        .replace("<title>Firebase Web Portal</title>", `<title>${title}</title><meta name="description" content="${description}">`)
        .replace("<!--app-html-->", html);

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
