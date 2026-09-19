import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPair } from '../_lib/pairStore';
import { sendJson } from '../_lib/respond';
import type { ApiErrorResponse, StatusResponse } from '../_lib/types';

const CODE_REGEX = /^[A-Z0-9]{4,10}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson<ApiErrorResponse>(res, 405, { error: 'Method not allowed.' });
  }

  const rawCode = req.query?.code;
  const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';

  if (!CODE_REGEX.test(code)) {
    return sendJson<ApiErrorResponse>(res, 400, { error: "that code doesn't look right." });
  }

  try {
    const record = await getPair(code);
    if (!record) {
      return sendJson<ApiErrorResponse>(res, 404, {
        error: "hmm, that code doesn't match anything yet. double-check it?",
      });
    }

    return sendJson<StatusResponse>(res, 200, {
      code: record.code,
      connected: !!record.connected,
      person1Name: record.person1 ? record.person1.name : null,
      person2Name: record.person2 ? record.person2.name : null,
      position: record.position,
    });
  } catch (err) {
    console.error(err);
    return sendJson<ApiErrorResponse>(res, 500, { error: 'Something went wrong.' });
  }
}
