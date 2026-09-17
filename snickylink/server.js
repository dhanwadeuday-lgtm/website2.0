require('dotenv').config();

const path = require('path');
const express = require('express');
const waitlistRoute = require('./src/waitlistRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve the frontend (public/index.html, public/js/main.js, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', waitlistRoute);

// Fallback to index.html for any non-API route (simple SPA-style fallback)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SnickyLink server running on http://localhost:${PORT}`);
});
