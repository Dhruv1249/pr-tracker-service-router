const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const CORE_SERVICE = process.env.CORE_SERVICE_URL;

// /api/repos, /api/prs, /api/dashboard, /api/webhooks, /api/cli → Core Service
const corePrefixes = ["/api/repos", "/api/prs", "/api/dashboard", "/api/webhooks", "/api/cli"];

for (const prefix of corePrefixes) {
    router.use(
        prefix,
        createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
    );
}

module.exports = router;
