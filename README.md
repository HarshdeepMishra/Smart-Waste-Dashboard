# 🌿 EcoTrack AI — Smart Waste Management for Indian Retail

> AI-powered grocery waste management platform built for 5 Indian partner stores. Real-time risk alerts, Groq LLM recommendations, full MongoDB Atlas persistence.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## ✨ Features

- **3D Landing Page** with secure admin sign in / sign up (MongoDB + JWT)
- **Live Dashboard** — KPI cards (Items Tracked, Critical Items, ₹ Savings, Waste %)
- **Risk Monitor** — Kanban board with Urgent / Warning / Watch columns
- **AI Assistant** — Groq `llama-3.3-70b-versatile`, store-scoped context, single best action recommendation with historical success rates
- **Real-Time Alerts** — auto-generated, toast notifications, notification panel
- **Insights Lab** — 30-day waste trend charts, category breakdown, peer network comparison
- **Action Tracking** — every manager action (price cut, donation, transfer, promote) persisted to MongoDB
- **Search Bar** — live fuzzy search across all products in the current store
- **Settings Panel** — dark mode, alert thresholds, auto-refresh interval — all persisted

## 🏪 Partner Stores

| ID | Store | Location |
|---|---|---|
| RF001 | Reliance Fresh — Connaught Place | New Delhi |
| BB002 | BigBasket Express — Koramangala | Bengaluru |
| DM003 | D-Mart — Bandra West | Mumbai |
| MM004 | More Megastore — Salt Lake | Kolkata |
| SR005 | Spencer's Retail — Anna Nagar | Chennai |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| AI / LLM | Groq Cloud (`llama-3.3-70b-versatile`) |
| Auth | bcryptjs + JSON Web Tokens |

---

## 🚀 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/HarshdeepMishra/Smart-Waste-Dashboard.git
cd Smart-Waste-Dashboard
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server && npm install && cd ..
```

### 4. Configure environment variables

**Frontend** — create `.env` in root:
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend** — create `server/.env` (copy from `server/.env.example`):
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecotrack?...
GROQ_API_KEY=gsk_...
JWT_SECRET=your_super_secret_key
PORT=3001
```

### 5. Seed the database
```bash
cd server && node seed.js
```

### 6. Start both servers
```bash
# Terminal 1 — Backend
cd server && node index.js

# Terminal 2 — Frontend
npm run dev
```

Open **http://localhost:5173** and sign up with your email.

---

## ☁️ Deployment on Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step guide.

**Quick version:**
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo (it detects `render.yaml` automatically)
4. Set environment variables (MONGODB_URI, GROQ_API_KEY, JWT_SECRET, FRONTEND_URL)
5. Deploy 🎉

---

## 📁 Project Structure

```
ecotrack-ai/
├── src/
│   ├── components/       # React UI components
│   │   ├── LandingPage.tsx
│   │   ├── CommandCenter.tsx
│   │   ├── RiskMonitor.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── TopNav.tsx
│   │   └── ...
│   ├── data/
│   │   └── storeData.ts  # 5 Indian stores + 34 products each
│   ├── services/
│   │   └── api.ts        # Centralized API client
│   └── App.tsx           # Auth gate + app shell
├── server/
│   ├── models/           # Mongoose schemas (Store, Product, Alert, Action, User)
│   ├── routes/           # Express routes (auth, stores, ai, alerts, analytics)
│   ├── seed.js           # DB seeder (255 products, 125 actions)
│   └── index.js          # Express app entry point
├── render.yaml           # Render deployment blueprint
└── README.md
```

---

## 🔑 API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/signin` | Sign in, receive JWT |
| GET  | `/api/health` | Health check |
| GET  | `/api/stores` | All 5 stores |
| GET  | `/api/stores/:id/products` | Store products |
| POST | `/api/ai/chat` | AI chat (Groq) |
| POST | `/api/analytics/action` | Record manager action |
| GET  | `/api/analytics/network/comparison` | Cross-store comparison |

---

## 📄 License

MIT — Built for EcoTrack AI production. All store names are Indian retail chains.
