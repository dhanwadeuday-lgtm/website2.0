import type { VercelRequest, VercelResponse } from '@vercel/node';
import { joinPair, checkRateLimit } from '../_lib/pairStore';
import { sendJson } from '../_lib/respond';
import type { ApiErrorResponse, JoinError, JoinPairBody, JoinPairResponse } from '../_lib/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^[A-Z0-9]{4,10}$/;

const ERROR_MESSAGES: Record<JoinError, string> = {
  not_found: "hmm, that code doesn't match anything yet. double-check it?",
  already_paired: 'this code has already been paired with someone else.',
  same_email: 'looks like you used the same email as your person — try entering your own email instead.',
};

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

  const { code, name, email } = (req.body || {}) as JoinPairBody;
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';

  if (!CODE_REGEX.test(normalizedCode)) {
    return sendJson<ApiErrorResponse>(res, 400, { error: "that code doesn't look right." });
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    return sendJson<ApiErrorResponse>(res, 400, { error: 'Please enter your name.' });
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return sendJson<ApiErrorResponse>(res, 400, { error: 'Please enter a valid email address.' });
  }

  try {
    const { record, error } = await joinPair(normalizedCode, name, email);
    if (error) {
      const status = error === 'not_found' ? 404 : error === 'already_paired' ? 409 : 400;
      return sendJson<ApiErrorResponse>(res, status, { error: ERROR_MESSAGES[error] });
    }
    return sendJson<JoinPairResponse>(res, 200, { person1Name: record.person1.name, code: record.code });
  } catch (err) {
    console.error(err);
    return sendJson<ApiErrorResponse>(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}
