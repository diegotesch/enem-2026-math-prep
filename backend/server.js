const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const authenticate = require('./src/middleware/auth');
const authRoutes = require('./src/routes/auth');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/protected', authenticate, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: req.user
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;