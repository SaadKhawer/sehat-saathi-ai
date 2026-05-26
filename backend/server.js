require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { firebaseError } = require('./config/firebase');

const app = express();

// ─── SECURITY & MIDDLEWARE ───
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: 'Too many requests' } });
app.use('/api/', limiter);

// AI routes get a more generous limit
const aiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { success: false, message: 'AI rate limit reached. Try again later.' } });

// ─── ROUTES ───
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🌿 Sehat Saathi API is running!', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptoms', require('./routes/symptoms'));
app.use('/api/ai-analysis', aiLimiter, require('./routes/aiAnalysis'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/trends', require('./routes/trends'));

// ─── ERROR HANDLING ───
app.use(notFound);
app.use(errorHandler);

// ─── START SERVER ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿 Sehat Saathi Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Provider: Groq (LLaMA 3.3-70B) ✅`);
  if (firebaseError) {
    console.log(`🔥 Database: Firebase not ready (fix credentials in .env or serviceAccountKey.json)\n`);
  } else {
    console.log(`🔥 Database: Firebase Firestore\n`);
  }
});
