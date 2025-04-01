// Server for Vercel deployment
// This file serves as the entry point for Vercel

const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

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

// Khai báo middleware để xử lý tất cả các request API
app.all('/api/*', async (req, res) => {
  try {
    // Import NestJS bootstrap function
    const { bootstrap } = require('./dist/src/main');
    
    // Khởi động NestJS app
    const nestApp = await bootstrap();
    
    // Xử lý request
    nestApp.getHttpAdapter().getInstance()(req, res);
  } catch (error) {
    console.error('Error handling API request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process API request',
      error: error.message
    });
  }
});

// Xử lý route api-docs (Swagger)
app.all('/api-docs*', async (req, res) => {
  try {
    // Import NestJS bootstrap function
    const { bootstrap } = require('./dist/src/main');
    
    // Khởi động NestJS app
    const nestApp = await bootstrap();
    
    // Xử lý request
    nestApp.getHttpAdapter().getInstance()(req, res);
  } catch (error) {
    console.error('Error handling Swagger request:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to load Swagger documentation',
      error: error.message
    });
  }
});

// Xử lý các request khác
app.all('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/api-docs')) {
    // Đã được xử lý bởi middleware trên
    return;
  }
  
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path
  });
});

// Export app cho Vercel
module.exports = app;

// Chạy server khi không ở trên Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 