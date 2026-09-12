# TaxiApp Monorepo Codebase

A modern, production-ready ride hailing, carpooling, and fleet operations platform structured into clean, modular workspaces for developer ergonomics, maintainability, and scalability.

---

## 📁 Project Architecture & Directory Structure

```
project-root/
├── frontend/                    # Client SPA Application (React 19 + Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── pages/               # High-level view & flow pages (Booking, Driver Feed, History, Admin, etc.)
│   │   ├── components/          # Reusable UI components, Modals, Cards, Maps, and Design System
│   │   ├── hooks/               # Custom React hooks (useRouting, useWalletManager)
│   │   ├── services/            # API client service, Firebase, FCM push, telemetry, audio
│   │   ├── store/               # State management & React Context (Config, Language, Session)
│   │   ├── types/               # Type definitions & domain interfaces
│   │   ├── lib/                 # Geo math, map helpers, error logging, utilities
│   │   ├── data/                # Static catalogs, place datasets, system triggers
│   │   ├── App.tsx              # Root frontend application component
│   │   ├── main.tsx             # React DOM entrypoint
│   │   ├── index.css            # Tailwind styling entrypoint
│   │   └── sw.ts                # PWA Service Worker
│   ├── public/                  # Public assets, icons, manifest, and logos
│   ├── package.json             # Frontend dependencies & scripts
│   ├── vite.config.ts           # Frontend Vite build configuration
│   └── tsconfig.json            # Frontend TypeScript configuration
│
├── backend/                     # Server & API Application (Node.js + Express 5 + Socket.IO)
│   ├── src/
│   │   ├── routes/              # Express API route definitions
│   │   │   ├── auth.routes.ts   # OTP login & authentication endpoints
│   │   │   ├── ride.routes.ts   # Ride dispatching, fare estimation, & status endpoints
│   │   │   ├── wallet.routes.ts # Wallet balance, top-up, & transaction endpoints
│   │   │   ├── trip.routes.ts   # Legacy trip lifecycle routes
│   │   │   ├── admin.routes.ts  # Admin portal, config, and system management routes
│   │   │   └── push.routes.ts   # Web Push & FCM notification routes
│   │   ├── controllers/         # Request handling & HTTP response logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── ride.controller.ts
│   │   │   ├── wallet.controller.ts
│   │   │   ├── trip.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── push.controller.ts
│   │   ├── services/            # Core business logic
│   │   │   ├── auth.service.ts       # OTP generation and rider identity management
│   │   │   ├── ride.service.ts       # Nearby driver matching & ride state transitions
│   │   │   ├── fare.service.ts       # Distance/time fare estimation & surge logic
│   │   │   ├── tripSimulation.ts     # Real-time driver movement & GPS simulation
│   │   │   ├── mail.service.ts       # SMTP transactional email service
│   │   │   ├── webPushService.ts     # Web push subscription delivery
│   │   │   └── idGenerator.ts        # Unique transaction & ticket ID generator
│   │   ├── models/              # Data schemas & persistence layers
│   │   │   ├── User.model.ts    # Rider & driver data access repository
│   │   │   ├── Ride.model.ts    # Ride/trip persistence repository
│   │   │   ├── Wallet.model.ts  # Wallet balances and transaction ledgers
│   │   │   ├── db.ts            # In-memory fast cache & sync hooks
│   │   │   └── postgres.ts      # Optional PostgreSQL connection pool
│   │   ├── middleware/          # Express request middleware
│   │   │   ├── auth.middleware.ts # Bearer token & session verification
│   │   │   ├── errorHandler.ts    # Centralized JSON error handler
│   │   │   └── rateLimiter.ts     # In-memory sliding window rate limiter
│   │   ├── utils/               # Backend utility helpers
│   │   │   ├── geoUtils.ts      # Haversine distance and bearing algorithms
│   │   │   └── logger.ts        # Structured logger
│   │   ├── config/              # Environment & database configuration
│   │   │   ├── env.ts           # Environment variables configuration
│   │   │   ├── db.ts            # Database client exports
│   │   │   └── fallbackDb.ts    # Seed data fallback
│   │   ├── types/               # Backend-specific TypeScript interfaces
│   │   └── server.ts            # Backend application bootstrapper
│   ├── package.json             # Backend dependencies & scripts
│   └── tsconfig.json            # Backend TypeScript configuration
│
├── shared/                      # Shared Code & Contracts
│   └── types/
│       ├── ride.types.ts        # Canonical types shared between Frontend and Backend
│       └── index.ts
│
├── .gitignore                   # Ignored directories & files
├── .env.example                 # Documented environment variables
├── metadata.json                # Platform capability & runtime configuration
├── package.json                 # Root orchestrator scripts
├── tsconfig.json                # Root TypeScript compiler options & path mappings
├── vite.config.ts               # Root Vite configuration with dual support
├── server.ts                    # Root server bootstrapper
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Development Mode

Run the unified full-stack server (starts backend API on port 3000 with Vite middleware hot-reload):
```bash
npm run dev
```

### Production Build

Compile the frontend bundle to `dist/` and bundle the backend server:
```bash
npm run build
```

### Production Start

Launch the compiled production server:
```bash
npm start
```

### TypeScript Validation

Validate types across the codebase:
```bash
npm run lint
```

---

## 🌐 API Overview

| Route | Method | Description |
|---|---|---|
| `/api/health` | GET | Healthcheck and timestamp |
| `/api/rides` | GET | List active rides |
| `/api/rides` | POST | Request a new ride |
| `/api/rides/estimate-fare` | POST | Calculate estimated fare |
| `/api/rides/cancel` | POST | Cancel an ongoing ride |
| `/api/wallet/balance` | GET | Check rider/driver wallet balance |
| `/api/wallet/topup` | POST | Credit balance to wallet |
| `/api/wallet/deduct` | POST | Debit fare from wallet |
| `/api/auth/send-otp` | POST | Send login verification OTP |
| `/api/auth/verify-otp` | POST | Verify login OTP |
| `/api/admin/config` | GET | Retrieve administrative system configuration |

---

## 🔒 Security & Architecture Notes
- All backend endpoints operate on port 3000.
- Secrets (`GEMINI_API_KEY`, `RAZORPAY_KEY_SECRET`, `PGPASSWORD`) remain strictly server-side.
- Shared TypeScript interfaces in `/shared/types` ensure total type safety between the client and server.
