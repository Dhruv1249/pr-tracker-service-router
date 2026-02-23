const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;

router.use(
    "/api/auth",
    createProxyMiddleware({
        target: AUTH_SERVICE,
        changeOrigin: true,
        on: {
            proxyReq: (proxyReq, req) => {
                proxyReq.path = req.originalUrl;
            },
        },
    })
);

router.use(
    "/api/users",
    createProxyMiddleware({
        target: AUTH_SERVICE,
        changeOrigin: true,
        on: {
            proxyReq: (proxyReq, req) => {
                proxyReq.path = req.originalUrl;
            },
        },
    })
);

module.exports = router;
