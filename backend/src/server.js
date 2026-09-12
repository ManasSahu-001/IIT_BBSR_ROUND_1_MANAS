import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import questRoutes from './routes/questRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import economyRoutes from './routes/economyRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: '*', // In production, refine or allow frontend origin
  credentials: true
}));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    // console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    game: 'Build Your City — Life RPG',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/economy', economyRoutes);
app.use('/api/stats', statsRoutes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🏰 Life RPG Authoritative Backend running on http://localhost:${PORT}`);
  console.log(`⚔️  AI Quest Master & Boss Battles activated.`);
});

export default app;
