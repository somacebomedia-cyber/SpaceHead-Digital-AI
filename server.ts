import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";

let _dirname = "";
try {
  _dirname = __dirname;
} catch {
  _dirname = path.dirname(fileURLToPath(import.meta.url));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

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
