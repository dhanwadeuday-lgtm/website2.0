const { addEmail, checkRateLimit } = require('../_lib/waitlistStore');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  try {
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
  } catch (err) {
    // If the rate limiter itself fails (e.g. Redis env vars missing),
    // don't block real signups over an infra issue — just skip limiting.
    console.error('Rate limit check failed:', err);
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const { position, ticket } = await addEmail(email);
    return res.status(200).json({ position, ticket });
  } catch (err) {
    console.error('Waitlist signup failed:', err);
    return res.status(500).json({
      error: 'Something went wrong saving your signup. Please try again.',
    });
  }
};
