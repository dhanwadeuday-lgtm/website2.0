const express = require('express');
const rateLimit = require('express-rate-limit');
const { addEmail, count } = require('./waitlistStore');

const router = express.Router();

// Basic abuse protection: 10 requests per IP per 15 minutes on this route.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/waitlist', limiter, (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const { position, ticket } = addEmail(email);

  return res.status(200).json({ position, ticket });
});

router.get('/waitlist/count', (_req, res) => {
  res.status(200).json({ count: count() });
});

module.exports = router;
