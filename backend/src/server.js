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

// Root status route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Life RPG Backend API</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 40px; text-align: center; }
          .card { max-width: 520px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h1 { color: #ef4444; margin-bottom: 8px; font-size: 24px; }
          .badge { display: inline-block; background: #064e3b; color: #34d399; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.5; }
          a { color: #38bdf8; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
          .btn { display: inline-block; margin-top: 16px; background: #ef4444; color: white; padding: 10px 20px; border-radius: 10px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🏰 Build Your City — Life RPG</h1>
          <div class="badge">🟢 Backend API Active & Healthy</div>
          <p>The Express.js REST API engine is listening on <strong>Port 5000</strong>.</p>
          <p>Health endpoint: <a href="/api/health">/api/health</a></p>
          <hr style="border-color: #1f2937; margin: 20px 0;" />
          <p>To use the game interface, open the frontend app:</p>
          <a class="btn" href="http://localhost:3000" target="_blank">Open Life RPG App (Port 3000)</a>
        </div>
      </body>
    </html>
  `);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏰 Life RPG Authoritative Backend running on http://localhost:${PORT}`);
  console.log(`⚔️  AI Quest Master & Boss Battles activated.`);
});

export default app;
