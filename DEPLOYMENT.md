# 🚀 Deployment Guide — EcoTrack AI on Render

This guide walks you through deploying:
- **Backend** (Express + MongoDB + Groq) → Render Web Service
- **Frontend** (React/Vite) → Render Static Site

---

## Step 1: Push to GitHub

Run these commands in your project root:

```bash
cd "/Users/satwickpandey/Downloads/project 2"

# Initialize git if not already done
git init

# Add remote (your repo)
git remote add origin https://github.com/HarshdeepMishra/Smart-Waste-Dashboard.git

# Stage all files
git add .

# Commit
git commit -m "feat: EcoTrack AI — full stack Indian retail waste management"

# Push
git push -u origin main
```

> **Important:** `.env` and `server/.env` are in `.gitignore` and will NOT be pushed. ✅

---

## Step 2: MongoDB Atlas — Allow All IPs

Render's IPs change dynamically, so you must whitelist all IPs:

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Confirm**

---

## Step 3: Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub account and select `Smart-Waste-Dashboard`
3. Configure:
   - **Name:** `ecotrack-ai-backend`
   - **Runtime:** `Node`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** Free

4. Add **Environment Variables** (click "Add Environment Variable" for each):

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | *Your MongoDB Atlas connection string* |
   | `GROQ_API_KEY` | *Your Groq API key from console.groq.com* |
   | `JWT_SECRET` | *Any long random string (e.g. 32+ chars)* |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | *(leave empty for now — fill in after Step 4)* |

5. Click **Create Web Service**
6. Wait for deployment (~2 min). Note the URL: `https://ecotrack-ai-backend.onrender.com`

7. Test it: open `https://ecotrack-ai-backend.onrender.com/api/health` — should return `{"status":"ok",...}`

8. **Seed the database** — run this once from your local machine:
   ```bash
   cd server && node seed.js
   ```

---

## Step 4: Deploy Frontend on Render

1. Go to [render.com](https://render.com) → **New** → **Static Site**
2. Connect the same GitHub repo `Smart-Waste-Dashboard`
3. Configure:
   - **Name:** `ecotrack-ai-frontend`
   - **Root Directory:** *(leave empty — root of repo)*
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Add **Environment Variable**:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://ecotrack-ai-backend.onrender.com/api` |

5. Under **Redirects/Rewrites**, add:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** Rewrite

6. Click **Create Static Site**
7. Wait for build (~3 min). Note the URL: `https://ecotrack-ai-frontend.onrender.com`

---

## Step 5: Wire CORS (Backend → Frontend)

1. Go to your **Backend** service on Render → **Environment**
2. Add/update:
   - `FRONTEND_URL` = `https://ecotrack-ai-frontend.onrender.com`
3. Click **Save Changes** — Render will auto-redeploy

---

## Step 6: Verify End-to-End

1. Open `https://ecotrack-ai-frontend.onrender.com`
2. Sign up with a new email
3. Should land on the EcoTrack AI dashboard
4. Test AI chat, search bar, and action buttons

---

## ✅ Production Checklist

- [ ] MongoDB Atlas IP whitelist set to `0.0.0.0/0`
- [ ] `MONGODB_URI` set in Render backend env vars
- [ ] `GROQ_API_KEY` set in Render backend env vars
- [ ] `JWT_SECRET` set (long random string)
- [ ] `FRONTEND_URL` set to actual frontend URL
- [ ] `VITE_API_URL` set to actual backend URL
- [ ] Database seeded (`node seed.js`)
- [ ] Health check returns `{"status":"ok"}`
- [ ] Sign up / sign in working
- [ ] AI chat responding

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| `CORS error` in console | Add your frontend URL to `FRONTEND_URL` env var on backend |
| `MongoDB connection failed` | Whitelist `0.0.0.0/0` in Atlas Network Access |
| `JWT must be provided` | Set `JWT_SECRET` env var on backend |
| AI returns fallback response | Verify `GROQ_API_KEY` is set and valid |
| Blank page on frontend | Check `VITE_API_URL` points to your backend `/api` |

---

## 💡 Tips for Free Tier

- Render free tier **spins down after 15 minutes** of inactivity. First request after sleep takes ~30 seconds.
- To avoid cold starts: use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping `/api/health` every 14 minutes.
