const { createPair, checkRateLimit } = require('../_lib/pairStore');

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
  } catch (e) {
    // If the rate limiter itself fails, don't block the request on it.
  }

  const { name, email } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const record = await createPair(name, email);
    return res.status(200).json({ code: record.code, position: record.position });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
