const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const CORE_SERVICE = process.env.CORE_SERVICE_URL;

// POST /api/webhooks/github → Receive PR events from GitHub
router.use(
    "/api/webhooks",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

// CLI Support
// POST /api/cli/login            → Exchange token
// GET  /api/cli/status           → Summary
// POST /api/cli/pr/:prId/scan    → Trigger scan
// POST /api/cli/pr/:prId/merge   → Merge via CLI
// POST /api/cli/repos/track      → Track repo via CLI
router.use(
    "/api/cli",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

module.exports = router;
