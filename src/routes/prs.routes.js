const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const CORE_SERVICE = process.env.CORE_SERVICE_URL;

// Lists & Details
// GET  /api/repos/:repoId/prs  → List PRs for a repo
// GET  /api/prs/:prId          → PR details
// GET  /api/prs/:prId/diff     → PR diff
// GET  /api/prs/:prId/timeline → PR event timeline

// Lifecycle
// POST /api/prs/:prId/rescan   → Re-run AI + security scan
// POST /api/prs/:prId/merge    → Merge PR
// POST /api/prs/:prId/close    → Close PR
// POST /api/prs/:prId/reopen   → Reopen PR

// Reviews
// POST /api/prs/:prId/reviews  → Submit review
// GET  /api/prs/:prId/reviews  → List reviews

// Tags
// POST   /api/prs/:prId/tags      → Add tag
// DELETE /api/prs/:prId/tags/:tag → Remove tag

router.use(
    "/api/prs",
    createProxyMiddleware({ target: CORE_SERVICE, changeOrigin: true })
);

module.exports = router;
