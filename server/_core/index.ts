import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Serve static files from the Expo web build
  const distPath = path.join(__dirname, "../../dist-web");
  app.use(express.static(distPath));

  // Serve index.html for all other routes (SPA fallback)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  // Use Railway's PORT or default to 3000
  // Don't try to find alternative ports - fail fast if port is in use
  const port = parseInt(process.env.PORT || "3000");

  // Graceful shutdown handling
  const shutdown = (signal: string) => {
    console.log(`[api] Received ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log("[api] Server closed successfully");
      process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
      console.error("[api] Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle port in use error
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[api] Port ${port} is already in use. Exiting...`);
      process.exit(1);
    } else {
      console.error("[api] Server error:", err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });

  return server;
}

startServer().catch((err) => {
  console.error("[api] Failed to start server:", err);
  process.exit(1);
});
