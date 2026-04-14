/**
 * Finn AI CEO - Dashboard Server
 * Simple Express server for DigitalOcean deployment
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  res.status(200).json({
    app: 'Finn AI CEO',
    version: '3.0.0',
    status: 'running',
    deployment: 'DigitalOcean',
    message: 'Dashboard is live and ready for training!'
  });
});

// Root route - serve dashboard HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Finn AI CEO - Dashboard</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #001a4d 0%, #003d99 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        
        .container {
          text-align: center;
          padding: 40px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          max-width: 600px;
        }
        
        .logo {
          font-size: 4rem;
          margin-bottom: 30px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        h1 {
          font-size: 3rem;
          margin-bottom: 20px;
          color: #00d4ff;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        }
        
        .subtitle {
          font-size: 1.3rem;
          color: #b3d9ff;
          margin-bottom: 40px;
        }
        
        .status {
          background: rgba(0, 212, 255, 0.1);
          border: 2px solid #00d4ff;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          font-size: 1.1rem;
        }
        
        .status-label {
          text-align: left;
          font-weight: 600;
        }
        
        .status-value {
          background: rgba(0, 212, 255, 0.2);
          padding: 5px 15px;
          border-radius: 5px;
          color: #00ff88;
        }
        
        .button {
          display: inline-block;
          padding: 15px 40px;
          background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          margin: 10px;
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }
        
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 212, 255, 0.5);
        }
        
        .button-secondary {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .button-secondary:hover {
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
        }
        
        .info-box {
          background: rgba(0, 212, 255, 0.05);
          border-left: 4px solid #00d4ff;
          padding: 20px;
          text-align: left;
          margin-top: 30px;
          border-radius: 5px;
        }
        
        .info-box h3 {
          color: #00d4ff;
          margin-bottom: 10px;
        }
        
        .info-box p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #d9e9ff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🤖</div>
        <h1>Finn AI CEO</h1>
        <p class="subtitle">Your AI Chief Executive Officer is Online</p>
        
        <div class="status">
          <div class="status-item">
            <span class="status-label">Status:</span>
            <span class="status-value">🟢 LIVE</span>
          </div>
          <div class="status-item">
            <span class="status-label">Version:</span>
            <span class="status-value">3.0.0</span>
          </div>
          <div class="status-item">
            <span class="status-label">Deployment:</span>
            <span class="status-value">DigitalOcean</span>
          </div>
          <div class="status-item">
            <span class="status-label">Brain:</span>
            <span class="status-value">Claude Opus 4</span>
          </div>
        </div>
        
        <div>
          <button class="button" onclick="startTraining()">Start Training Finn</button>
          <button class="button button-secondary" onclick="viewDocs()">View Documentation</button>
        </div>
        
        <div class="info-box">
          <h3>✨ Ready to Begin</h3>
          <p>
            Finn is fully deployed and ready for training. Click "Start Training Finn" to begin teaching your AI CEO about your business operations, financial goals, and strategic decisions.
          </p>
        </div>
      </div>
      
      <script>
        function startTraining() {
          alert('🎯 Training Mode Activated!\\n\\nFinn is ready to learn from you.\\n\\nTell Finn about:\\n• Your business goals\\n• Financial targets\\n• Operational challenges\\n• Strategic priorities');
        }
        
        function viewDocs() {
          window.open('https://github.com/alngnn1993/betterbag-dashboard', '_blank');
        }
      </script>
    </body>
    </html>
  `);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Finn AI CEO Dashboard is running on port ${PORT}`);
  console.log(`📍 Access at: http://localhost:${PORT}`);
  console.log(`🔥 API Health: http://localhost:${PORT}/api/health`);
  console.log(`\n🚀 Finn is live and ready for training!\n`);
});
