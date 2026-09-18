const { joinPair, checkRateLimit } = require('../_lib/pairStore');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^[A-Z0-9]{4,10}$/;

const ERROR_MESSAGES = {
  not_found: "hmm, that code doesn't match anything yet. double-check it?",
  already_paired: 'this code has already been paired with someone else.',
  same_email: 'looks like you used the same email as your person — try entering your own email instead.',
};

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

  const { code, name, email } = req.body || {};
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';

  if (!CODE_REGEX.test(normalizedCode)) {
    return res.status(400).json({ error: "that code doesn't look right." });
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const { record, error } = await joinPair(normalizedCode, name, email);
    if (error) {
      const status = error === 'not_found' ? 404 : error === 'already_paired' ? 409 : 400;
      return res.status(status).json({ error: ERROR_MESSAGES[error] });
    }
    return res.status(200).json({ person1Name: record.person1.name, code: record.code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
