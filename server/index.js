require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Import Routes
const aiRoutes = require('./routes/ai');
const storeRoutes = require('./routes/stores');
const alertRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow localhost in dev + both Render URLs in production
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  // Production — Render URLs (hardcoded for reliability)
  'https://ecotrack-ai-frontend.onrender.com',
  'https://smart-waste-dashboard-fw7r.onrender.com',
  // Dynamic env var override (set FRONTEND_URL on Render if URL changes)
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl, health checks
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked: ${origin}`);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB Atlas
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EcoTrack AI Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    groqConfigured: !!process.env.GROQ_API_KEY,
    mongoConfigured: !!process.env.MONGODB_URI,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 EcoTrack AI Backend running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Groq AI: ${process.env.GROQ_API_KEY ? '✅ Configured' : '⚠️  Not configured (add GROQ_API_KEY to .env)'}`);
  console.log(`🌿 MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '⚠️  Not configured (add MONGODB_URI to .env)'}\n`);
});

module.exports = app;
