const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const AI_SERVICE = process.env.AI_SERVICE_URL;

// Analysis
// POST /api/ai/analyze/pr/:prId  → Send PR to AI
// GET  /api/ai/reports/pr/:prId  → Get AI analysis report

// Agentic Actions
// POST /api/ai/agent/action      → Execute allowed action
// GET  /api/ai/agent/history     → Agent action history
router.use(
    "/api/ai",
    createProxyMiddleware({ target: AI_SERVICE, changeOrigin: true })
);

// Risk
// GET /api/risk/high        → List high-risk PRs
// GET /api/risk/pr/:prId    → Risk details for PR
router.use(
    "/api/risk",
    createProxyMiddleware({ target: AI_SERVICE, changeOrigin: true })
);

// Security
// GET /api/security/alerts    → List flagged PRs
// GET /api/security/pr/:prId  → Security report for PR
router.use(
    "/api/security",
    createProxyMiddleware({ target: AI_SERVICE, changeOrigin: true })
);

module.exports = router;
