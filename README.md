# PR Tracker — API Gateway Router

The **API Gateway Router** is the single entry point for the PR Tracker frontend. It receives all `/api/*` requests and proxies them to the correct downstream microservice.

## Architecture

```
Frontend (React)
    │
    ▼
┌──────────────────────────────┐
│   API Gateway Router (:5000) │
│   - JWT Auth                 │
│   - CORS                    │
│   - Request Logging         │
└────┬──────────┬─────────┬───┘
     │          │         │
     ▼          ▼         ▼
Auth Service  Core      AI Service
  (:5001)   (:5002)     (:5003)
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in secrets
cp .env.example .env

# 3. Start in development (with hot reload)
npm run dev

# 4. Or start in production
npm start
```

The gateway starts on `http://localhost:5000` by default.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Gateway port |
| `NODE_ENV` | `development` | Environment |
| `AUTH_SERVICE_URL` | `http://localhost:5001` | Auth microservice URL |
| `CORE_SERVICE_URL` | `http://localhost:5002` | Core backend URL |
| `AI_SERVICE_URL` | `http://localhost:5003` | AI/Risk service URL |
| `JWT_SECRET` | — | Secret for JWT verification |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL (CORS) |
| `GITHUB_WEBHOOK_SECRET` | — | GitHub webhook HMAC secret |

## Route Map

Every endpoint from the API spec is covered. The gateway forwards each request to the right service:

### Auth Service (`:5001`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/auth/github` | Redirect to GitHub OAuth |
| GET | `/api/auth/github/callback` | OAuth callback |
| POST | `/api/auth/refresh` | Refresh JWT |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user profile |
| GET | `/api/users/me` | User info |
| PUT | `/api/users/me` | Update preferences |
| GET | `/api/users/me/activity` | Activity log |

### Core Backend Service (`:5002`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/repos` | List GitHub repos |
| GET | `/api/repos/:owner/:name` | Repo details |
| POST | `/api/repos/track` | Track a repo |
| DELETE | `/api/repos/track/:repoId` | Untrack repo |
| GET | `/api/repos/tracked` | List tracked repos |
| POST | `/api/repos/:repoId/sync` | Force re-sync |
| GET | `/api/repos/:repoId/prs` | List PRs for repo |
| GET | `/api/prs/:prId` | PR details |
| GET | `/api/prs/:prId/diff` | PR diff |
| GET | `/api/prs/:prId/timeline` | PR timeline |
| POST | `/api/prs/:prId/rescan` | Re-run scans |
| POST | `/api/prs/:prId/merge` | Merge PR |
| POST | `/api/prs/:prId/close` | Close PR |
| POST | `/api/prs/:prId/reopen` | Reopen PR |
| POST | `/api/prs/:prId/reviews` | Submit review |
| GET | `/api/prs/:prId/reviews` | List reviews |
| POST | `/api/prs/:prId/tags` | Add tag |
| DELETE | `/api/prs/:prId/tags/:tag` | Remove tag |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET | `/api/dashboard/recent-prs` | Recent PRs |
| GET | `/api/dashboard/risk-snapshot` | Top risky PRs |
| GET | `/api/dashboard/security-snapshot` | Top flagged PRs |
| GET | `/api/rules` | List rules |
| POST | `/api/rules` | Create rule |
| PUT | `/api/rules/:ruleId` | Update rule |
| DELETE | `/api/rules/:ruleId` | Delete rule |
| GET | `/api/audit/logs` | Audit logs |
| GET | `/api/audit/pr/:prId` | PR audit history |
| GET | `/api/activity/events` | Recent events |
| POST | `/api/webhooks/github` | GitHub webhook receiver |
| POST | `/api/cli/login` | CLI login |
| GET | `/api/cli/status` | CLI status |
| POST | `/api/cli/pr/:prId/scan` | CLI scan |
| POST | `/api/cli/pr/:prId/merge` | CLI merge |
| POST | `/api/cli/repos/track` | CLI track repo |

### AI Service (`:5003`)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/analyze/pr/:prId` | Send PR to AI |
| GET | `/api/ai/reports/pr/:prId` | AI report |
| POST | `/api/ai/agent/action` | Agent action |
| GET | `/api/ai/agent/history` | Agent history |
| GET | `/api/risk/high` | High-risk PRs |
| GET | `/api/risk/pr/:prId` | Risk details |
| GET | `/api/security/alerts` | Security alerts |
| GET | `/api/security/pr/:prId` | Security report |

### Handled Locally (Gateway)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/internal/verify-token` | Service-to-service auth |

## Authentication

The gateway verifies JWT tokens on all routes except:
- `GET /api/auth/github` (OAuth flow)
- `GET /api/auth/github/callback` (OAuth callback)
- `GET /api/health` (health check)
- `POST /api/webhooks/github` (GitHub events)

All other routes require a `Bearer <token>` in the `Authorization` header.

## Project Structure

```
pr-tracker-service-router/
├── .env                        # Environment config (git-ignored)
├── .env.example                # Template
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── index.js                # Entry point
    ├── middleware/
    │   └── auth.js             # JWT verification
    └── routes/
        ├── auth.routes.js      # /api/auth, /api/users → Auth Service
        ├── repos.routes.js     # /api/repos → Core Service
        ├── prs.routes.js       # /api/prs → Core Service
        ├── ai.routes.js        # /api/ai, /api/risk, /api/security → AI Service
        ├── dashboard.routes.js # /api/dashboard → Core Service
        ├── rules.routes.js     # /api/rules, /api/audit, /api/activity → Core Service
        ├── webhooks.routes.js  # /api/webhooks, /api/cli → Core Service
        └── health.routes.js    # /api/health, /api/internal (local)
```

## How It Works

1. Frontend sends **all** API calls to `http://localhost:5000/api/*`
2. Gateway checks the JWT token (skips public routes)
3. Based on the route prefix, the request is proxied to the right microservice using `http-proxy-middleware`
4. Response flows back through the gateway to the frontend

This means the frontend only needs **one** API base URL — the gateway handles everything else.
