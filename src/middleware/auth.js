const jwt = require("jsonwebtoken");

// Routes that don't need authentication
const PUBLIC_ROUTES = [
    "/api/auth/github",
    "/api/auth/github/callback",
    "/api/health",
    "/api/webhooks/github",
    // Internal service-to-service routes (data service, AI)
    "/api/repositories",
    "/api/pullrequests",
    "/api/reviews",
    "/api/db/users",
    "/api/ai/",
];

function auth(req, res, next) {
    // Skip auth for public routes
    if (PUBLIC_ROUTES.some((route) => req.path.startsWith(route))) {
        return next();
    }

    // DEV_SKIP_AUTH: skip JWT verification when JWT_SECRET is not set
    if (!process.env.JWT_SECRET) {
        return next();
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
        });
    }
}

module.exports = auth;
