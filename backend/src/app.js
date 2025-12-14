const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const sweetRoutes = require('./routes/sweet.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '🍬 Sweet Shop API is running' });
});
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sweet Shop API',
    docs: '/api/health'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

module.exports = app;