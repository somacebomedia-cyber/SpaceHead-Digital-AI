import express from "express";
import { GoogleGenAI } from "@google/genai";
import { createPayfastPayment, verifyPayfastITN } from "../src/lib/payfastService.js";

const app = express();

// Raised from Express's 100kb default — the animate/start route receives a
// base64-encoded logo image (a 2K PNG easily runs a few MB as base64 text).
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

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

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "SpaceHead AI API" });
});

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

    const host = req.headers["x-forwarded-host"] || req.headers.host || "spaceheadai.co.za";
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

// API Route for Public Google Drive Folder Scraping
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
      const name = match[3];
      const mimeType = match[4].replace(/\\/g, '');
      
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

export default app;
