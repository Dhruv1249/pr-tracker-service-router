const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const CORE_SERVICE = process.env.CORE_SERVICE_URL;

// GET    /api/repos                → List user's GitHub repos
// GET    /api/repos/:owner/:name   → Repo details
// POST   /api/repos/track          → Track a repo
// DELETE /api/repos/track/:repoId  → Untrack repo
// GET    /api/repos/tracked        → List tracked repos
// POST   /api/repos/:repoId/sync   → Force re-sync from GitHub
router.use(
    "/api/repos",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

module.exports = router;
