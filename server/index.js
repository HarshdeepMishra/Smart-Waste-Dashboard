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

// CORS — allow localhost in dev + Render/Vercel in production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL, // Set this on Render to your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
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
