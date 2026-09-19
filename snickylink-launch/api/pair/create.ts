import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPair, checkRateLimit } from '../_lib/pairStore';
import { sendJson } from '../_lib/respond';
import type { ApiErrorResponse, CreatePairBody, CreatePairResponse } from '../_lib/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson<ApiErrorResponse>(res, 405, { error: 'Method not allowed.' });
  }

  const ip =
    (Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || ''
    )
      .split(',')[0]
      .trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  try {
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return sendJson<ApiErrorResponse>(res, 429, { error: 'Too many requests. Please try again later.' });
    }
  } catch (e) {
    // If the rate limiter itself fails, don't block the request on it.
  }

  const { name, email } = (req.body || {}) as CreatePairBody;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return sendJson<ApiErrorResponse>(res, 400, { error: 'Please enter your name.' });
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return sendJson<ApiErrorResponse>(res, 400, { error: 'Please enter a valid email address.' });
  }

  try {
    const record = await createPair(name, email);
    return sendJson<CreatePairResponse>(res, 200, { code: record.code, position: record.position });
  } catch (err) {
    console.error(err);
    return sendJson<ApiErrorResponse>(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}
