const { getPair } = require('../_lib/pairStore');

const CODE_REGEX = /^[A-Z0-9]{4,10}$/;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const rawCode = req.query?.code;
  const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';

  if (!CODE_REGEX.test(code)) {
    return res.status(400).json({ error: "that code doesn't look right." });
  }

  try {
    const record = await getPair(code);
    if (!record) {
      return res.status(404).json({ error: "hmm, that code doesn't match anything yet. double-check it?" });
    }

    return res.status(200).json({
      code: record.code,
      connected: !!record.connected,
      person1Name: record.person1 ? record.person1.name : null,
      person2Name: record.person2 ? record.person2.name : null,
      position: record.position,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
