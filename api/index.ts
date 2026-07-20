import fs from "fs";
import path from "path";
import express from "express";

const app = express();

// Set the directory relative to process.cwd() for Vercel execution environment
const _dirname = process.cwd();

// Serverless handler for SSR React routing
app.get("*all", async (req, res) => {
  const url = req.originalUrl;

  try {
    // Read the compiled client-side index.html template
    const templatePath = path.resolve(_dirname, "dist/client/index.html");
    const template = fs.readFileSync(templatePath, "utf-8");
    
    // Import the compiled server-side entry for rendering
    const serverBundlePath = path.resolve(_dirname, "dist/server/entry-server.js");
    const serverEntry = await import(serverBundlePath);
    const render = serverEntry.render;

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
    } else if (url === "/admin" || url.startsWith("/admin")) {
      title = "Studio Dashboard | SpaceHead AI Control Center";
      description = "Manage, create, and optimize active visual assets and technical portfolios.";
    }

    // Inject pre-rendered html and dynamic SEO values
    let htmlWithMeta = template
      .replace("<title>Firebase Web Portal</title>", `<title>${title}</title><meta name="description" content="${description}">`)
      .replace("<!--app-html-->", html);

    res.status(200).set({ "Content-Type": "text/html" }).end(htmlWithMeta);
  } catch (e: any) {
    console.error("SSR Rendering crashed on Vercel:", e.stack);
    res.status(500).end(`
      <html>
        <head><title>Rendering Error</title></head>
        <body style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc;">
          <h1>SSR Serverless Error</h1>
          <p>Please make sure you have run the build script successfully (npm run build) before invoking the serverless function.</p>
          <pre style="background: #1e293b; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">${e.stack || e.message}</pre>
        </body>
      </html>
    `);
  }
});

export default app;
