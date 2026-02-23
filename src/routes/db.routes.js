const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const DB_SERVICE = process.env.DB_SERVICE_URL;

// MongoDB Data Service
// /api/repositories, /api/pullrequests, /api/reviews → MongoDB service directly
const dbPrefixes = ["/api/repositories", "/api/pullrequests", "/api/reviews"];

for (const prefix of dbPrefixes) {
    router.use(
        prefix,
        createProxyMiddleware({
            target: DB_SERVICE,
            changeOrigin: true,
            on: {
                proxyReq: (proxyReq, req) => {
                    proxyReq.path = req.originalUrl;
                },
            },
        })
    );
}

// /api/db/users → MongoDB service (rewrites to /api/users to avoid conflict with auth's /api/users)
router.use(
    "/api/db/users",
    createProxyMiddleware({
        target: DB_SERVICE,
        changeOrigin: true,
        on: {
            proxyReq: (proxyReq, req) => {
                proxyReq.path = req.originalUrl.replace("/api/db/users", "/api/users");
            },
        },
    })
);

module.exports = router;
