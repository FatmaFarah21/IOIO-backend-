const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname)));

// Proxy API requests to the backend
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
console.log(`Proxying API requests to: ${backendUrl}`);

// Only create proxy middleware if not in a serverless environment
if (!process.env.NOW_REGION && !process.env.VERCEL) {
  app.use('/api', createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
  }));
}

// Serve index.html for all routes (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Only listen if not in a serverless environment
if (!process.env.NOW_REGION && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;