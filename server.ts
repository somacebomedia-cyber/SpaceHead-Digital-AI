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

  // Raised from Express's 100kb default — the animate/start route receives a
  // base64-encoded logo image (a 2K PNG easily runs a few MB as base64 text).
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // API Route for Payfast Payment Creation
  app.post("/api/payfast/create-payment", (req, res) => {
    try {
      const { amountRands, itemName, itemDescription, paymentId, returnPath, cancelPath, customStr1, customStr2, email, firstName, lastName } = req.body;
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
        paymentId,
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
        .replace(/<title>.*?<\/title>/, `<title>${title}</title><meta name="description" content="${description}">`)
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
