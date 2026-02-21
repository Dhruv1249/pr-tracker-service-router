const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;

// OAuth / Session
// GET  /api/auth/github          → Redirect to GitHub OAuth
// GET  /api/auth/github/callback → OAuth callback
// POST /api/auth/refresh         → Refresh JWT
// POST /api/auth/logout          → Logout user
// GET  /api/auth/me              → Get current user profile
router.use(
    "/api/auth",
    createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true })
);

// User
// GET /api/users/me          → Get user info
// PUT /api/users/me          → Update preferences
// GET /api/users/me/activity → User activity log
router.use(
    "/api/users",
    createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true })
);

module.exports = router;
