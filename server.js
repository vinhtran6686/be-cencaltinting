// Server for Vercel deployment
// This file serves as the entry point for Vercel

// Check if we're in production (Vercel) or development
if (process.env.NODE_ENV === 'production') {
  // In production, require the built app directly
  require('./dist/src/main');
} else {
  // For local development
  const express = require('express');
  const path = require('path');
  
  const app = express();
  const PORT = process.env.PORT || 4000;
  
  // Log requests for debugging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
  // Create a simple status endpoint
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      message: 'CenCal Tinting API is running (server.js)',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  // Serve static files
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // For all other routes, try to use the built NestJS app
  app.all('*', (req, res) => {
    try {
      res.status(404).json({
        status: 'error',
        message: 'Route not found in server.js',
        path: req.path
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error',
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 