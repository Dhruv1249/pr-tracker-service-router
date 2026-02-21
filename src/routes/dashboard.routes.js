const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const CORE_SERVICE = process.env.CORE_SERVICE_URL;

// GET /api/dashboard/stats             → Open PRs, needing review, high risk, security alerts
// GET /api/dashboard/recent-prs        → Last 5–10 PRs
// GET /api/dashboard/risk-snapshot     → Top 3 risky PRs
// GET /api/dashboard/security-snapshot → Top 3 flagged PRs
router.use(
    "/api/dashboard",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

module.exports = router;
