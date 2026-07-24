import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      
      // Inject OG Tags
      const isArabic = url.startsWith('/ar');
      const title = isArabic ? "موني - ملابس سباحة محتشمة" : "Moony - Modest Swimwear";
      const description = isArabic 
        ? "لأنك تستحقين ملابس سباحة مريحة، محتشمة، وعملية. تشكيلتنا مصممة عشان تعطيك التغطية اللي تحتاجينها بستايل أنيق."
        : "Modest swimwear shouldn't feel like a compromise. Dive into the Moony modular collection.";
      const host = req.get('host') || 'moony-swim.com';
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const baseUrl = `${protocol}://${host}`;
      const imageUrl = isArabic ? `${baseUrl}/images/og-ar.png` : `${baseUrl}/images/og-en.png`;
      const fullUrl = `${baseUrl}${url}`;
      
      const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
      `;
      template = template.replace('</head>', `${ogTags}\n  </head>`);

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      let template = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      
      const isArabic = url.startsWith('/ar');
      const title = isArabic ? "موني - ملابس سباحة محتشمة" : "Moony - Modest Swimwear";
      const description = isArabic 
        ? "لأنك تستحقين ملابس سباحة مريحة، محتشمة، وعملية. تشكيلتنا مصممة عشان تعطيك التغطية اللي تحتاجينها بستايل أنيق."
        : "Modest swimwear shouldn't feel like a compromise. Dive into the Moony modular collection.";
      const host = req.get('host') || 'moony-swim.com';
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const baseUrl = `${protocol}://${host}`;
      const imageUrl = isArabic ? `${baseUrl}/images/og-ar.png` : `${baseUrl}/images/og-en.png`;
      const fullUrl = `${baseUrl}${url}`;
      
      const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
      `;
      template = template.replace('</head>', `${ogTags}\n  </head>`);
      
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      next(e);
    }
  });
}
