import type { VercelResponse } from '@vercel/node';

// VercelResponse.json() isn't generic, so this wrapper is what actually
// gets us compile-time checking that every response body matches its
// declared shape (ApiErrorResponse, CreatePairResponse, etc).
export function sendJson<T>(res: VercelResponse, status: number, payload: T) {
  return res.status(status).json(payload);
}
