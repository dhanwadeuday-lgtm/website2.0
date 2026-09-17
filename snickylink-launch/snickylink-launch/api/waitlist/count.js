const { count } = require('../_lib/waitlistStore');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const total = await count();
    return res.status(200).json({ count: total });
  } catch (err) {
    console.error('Fetching waitlist count failed:', err);
    return res.status(500).json({ error: 'Could not fetch count.' });
  }
};
