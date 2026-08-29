// SIH26090 Backend — Express Server
// Proxies frontend requests to Gemini API securely.
// API keys never leave the backend.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { analyzeProductRouter } from './routes/analyze.js';
import { contentRouter } from './routes/content.js';
import { photoshootRouter } from './routes/photoshoot.js';
import { imageGenRouter } from './routes/imageGen.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({
  origin: true, // Allow all origins in dev; lock down in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Increase payload limit for base64 image data (5 images × ~1-2MB each)
app.use(express.json({ limit: '50mb' }));

// --- Root Status & Health Check ---
app.get('/', (req, res) => {
  const host = req.hostname || 'localhost';
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SIH26090 Backend API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #faf9f6; color: #2d2b2a; padding: 40px; text-align: center; }
          .card { background: white; max-width: 500px; margin: 0 auto; padding: 32px; border-radius: 12px; border: 1px solid #e5e0d8; }
          .btn { display: inline-block; background: #967038; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>SIH26090 AI Product Studio Backend API</h2>
          <p>The backend server is running on port 3001.</p>
          <p>To use the AI Product Studio application UI, open port <strong>3000</strong>:</p>
          <a class="btn" href="http://${host}:3000">Open AI Product Studio (Port 3000)</a>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'sih26090-backend',
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  });
});

// --- Routes ---
app.use('/api/product-sessions', analyzeProductRouter);
app.use('/api/product-sessions', contentRouter);
app.use('/api/product-sessions', photoshootRouter);
app.use('/api/product-sessions', imageGenRouter);

// --- Start ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  SIH26090 Backend`);
  console.log(`  ─────────────────────────`);
  console.log(`  Server:   http://0.0.0.0:${PORT}`);
  console.log(`  Health:   http://localhost:${PORT}/api/health`);
  console.log(`  Gemini:   ${process.env.GEMINI_API_KEY ? '✓ Key configured' : '✗ GEMINI_API_KEY missing in .env'}`);
  console.log('');
});

