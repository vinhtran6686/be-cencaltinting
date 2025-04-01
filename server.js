// Simple Express server setup to serve the built NestJS application
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Log each request to help with debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve the static NestJS app
app.use(express.static(path.join(__dirname, 'dist')));

// All routes should point to the built NestJS app
app.all('*', (req, res) => {
  try {
    // Import and run the built app
    const server = require('./dist/src/main');
    return server; // This is just a placeholder, the actual app is handled by NestJS
  } catch (error) {
    console.error('Error serving NestJS app:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while loading NestJS application',
      timestamp: new Date().toISOString()
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 