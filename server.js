// Server for Vercel deployment
// This file serves as the entry point for Vercel

const path = require('path');
const express = require('express');

// Tạo express app
const app = express();
const PORT = process.env.PORT || 4000;

// Log để debug
console.log('Starting server.js');
console.log(`Node environment: ${process.env.NODE_ENV}`);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CenCal Tinting API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint test
app.get('/vercel-test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Vercel deployment test endpoint',
    timestamp: new Date().toISOString()
  });
});

// Nếu đã build NestJS app, forward tất cả request khác đến NestJS
if (process.env.NODE_ENV === 'production') {
  try {
    console.log('Attempting to load NestJS app...');
    // Chuyển hướng tất cả các request khác đến NestJS app
    const nestApp = require('./dist/src/main');
    console.log('NestJS app loaded successfully');
  } catch (error) {
    console.error('Error loading NestJS app:', error);
    // Fallback nếu không load được NestJS app
    app.all('*', (req, res) => {
      res.status(500).json({
        status: 'error',
        message: 'Failed to load NestJS application',
        error: error.message
      });
    });
  }
} else {
  // Trong môi trường development
  app.all('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
      path: req.path
    });
  });
}

// Bắt đầu server
module.exports = app;

// Chạy server khi không ở trên Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 