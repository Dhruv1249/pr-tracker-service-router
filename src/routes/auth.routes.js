const { Router } = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = Router();
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;


router.get("/api/auth/success", (req, res) => {
    const token = req.query.token;

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.status(302).set("Location", `${clientUrl}/dashboard`).end();
});

router.post("/api/auth/logout", (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        path: "/",
        sameSite: "None" ,
        secure: isProduction,
        httpOnly: true
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

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
