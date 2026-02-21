const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const CORE_SERVICE = process.env.CORE_SERVICE_URL;

// GET    /api/rules            → List rules
// POST   /api/rules            → Create rule
// PUT    /api/rules/:ruleId    → Update rule
// DELETE /api/rules/:ruleId    → Delete rule
router.use(
    "/api/rules",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

// GET /api/audit/logs       → System-wide audit logs
// GET /api/audit/pr/:prId   → PR-specific history
router.use(
    "/api/audit",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

// GET /api/activity/events → Recent events
router.use(
    "/api/activity",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

module.exports = router;
