// Pairing storage backed by Upstash Redis (REST-based, works cleanly
// from Vercel serverless functions).
//
// Replaces the prototype's localStorage-based "create/join" flow
// (which only ever worked across two tabs on the *same* browser) with
// a real cross-device pairing code system:
//   - Person 1 creates a pair -> gets a 6-char code (e.g. SNKX2A)
//   - Person 2 enters that code on their own device to join
//   - Person 1's page polls /api/pair/status until Person 2 joins
//
// Works with either:
//   - Vercel KV (Storage tab in your Vercel project -> KV_REST_API_URL / KV_REST_API_TOKEN)
//   - A standalone Upstash Redis database (upstash.com -> UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)

import { Redis } from '@upstash/redis';
import type { JoinResult, PairRecord } from './types';

const redis = new Redis({
  url: (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) as string,
  token: (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN) as string,
});

const PAIRS_KEY = 'snickylink:pairs'; // hash: code -> JSON pair record
const PAIR_COUNTER_KEY = 'snickylink:pairs:counter'; // int: total pairs created
const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)

function randomCode(): string {
  let out = 'SNK';
  for (let i = 0; i < 3; i++) {
    out += CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)];
  }
  return out;
}

/**
 * Creates a new pair with person1's details and a fresh unique code.
 * Returns the pair record.
 */
export async function createPair(name: string, email: string): Promise<PairRecord> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomCode();
    const existing = await redis.hget<string>(PAIRS_KEY, code);
    if (existing) continue; // extremely rare collision, try another code

    const position = await redis.incr(PAIR_COUNTER_KEY);
    const record: PairRecord = {
      code,
      position,
      person1: { name: name.trim(), email: email.trim().toLowerCase() },
      person2: null,
      connected: false,
      createdAt: new Date().toISOString(),
      connectedAt: null,
    };
    await redis.hset(PAIRS_KEY, { [code]: JSON.stringify(record) });
    return record;
  }
  throw new Error('Could not generate a unique pairing code — please try again.');
}

export async function getPair(code: string): Promise<PairRecord | null> {
  const raw = await redis.hget<string | PairRecord>(PAIRS_KEY, code);
  if (!raw) return null;
  return typeof raw === 'string' ? (JSON.parse(raw) as PairRecord) : raw;
}

/**
 * Attempts to join an existing pair as person2.
 * Returns { record } on success, or { error } where error is one of:
 *   'not_found' | 'already_paired' | 'same_email'
 */
export async function joinPair(code: string, name: string, email: string): Promise<JoinResult> {
  const record = await getPair(code);
  if (!record) return { error: 'not_found' };

  const normalizedEmail = email.trim().toLowerCase();

  if (record.person1.email === normalizedEmail) {
    return { error: 'same_email' };
  }

  if (record.connected && record.person2) {
    // Idempotent re-join (e.g. page refresh after already joining).
    if (record.person2.email === normalizedEmail) {
      return { record };
    }
    return { error: 'already_paired' };
  }

  record.person2 = { name: name.trim(), email: normalizedEmail };
  record.connected = true;
  record.connectedAt = new Date().toISOString();

  await redis.hset(PAIRS_KEY, { [code]: JSON.stringify(record) });
  return { record };
}

/**
 * Very small fixed-window rate limiter: `max` requests per
 * `windowSeconds` per key (IP address). Returns true if allowed.
 */
export async function checkRateLimit(
  ip: string,
  max = 20,
  windowSeconds = 15 * 60
): Promise<boolean> {
  const key = `snickylink:ratelimit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current <= max;
}
