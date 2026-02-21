require("dotenv").config();

const express = require("express");
const cors = require("cors");


// Middleware
const auth = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/auth.routes");
const reposRoutes = require("./routes/repos.routes");
const prsRoutes = require("./routes/prs.routes");
const aiRoutes = require("./routes/ai.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const rulesRoutes = require("./routes/rules.routes");
const webhooksRoutes = require("./routes/webhooks.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Auth middleware — checks JWT on protected routes
app.use(auth);

// --- Routes ---
// Health (local, no proxy)
app.use(healthRoutes);

// Auth & Users → Auth Service (:5001)
app.use(authRoutes);

// Repos, PRs, Dashboard → Core Service (:5002)
app.use(reposRoutes);
app.use(prsRoutes);
app.use(dashboardRoutes);

// Rules, Audit, Activity, Webhooks, CLI → Core Service (:5002)
app.use(rulesRoutes);
app.use(webhooksRoutes);

// AI, Risk, Security → AI Service (:5003)
app.use(aiRoutes);

// 404 catch-all
app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
});

// --- Start ---
app.listen(PORT, () => {
    console.log(`\n API Gateway running on http://localhost:${PORT}`);
    console.log(`   Auth Service   → ${process.env.AUTH_SERVICE_URL}`);
    console.log(`   Core Service   → ${process.env.CORE_SERVICE_URL}`);
    console.log(`   AI Service     → ${process.env.AI_SERVICE_URL}\n`);
});
