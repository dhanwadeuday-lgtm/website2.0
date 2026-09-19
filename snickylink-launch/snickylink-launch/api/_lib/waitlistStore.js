// Waitlist storage backed by Upstash Redis (REST-based, so it works
// cleanly from Vercel serverless functions — no persistent TCP connection
// needed, unlike a traditional Postgres/Mongo driver).
//
// Works with either:
//   - Vercel KV (Storage tab in your Vercel project → uses KV_REST_API_URL / KV_REST_API_TOKEN)
//   - A standalone Upstash Redis database (upstash.com → uses UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
// Set whichever pair you use in your environment variables — see .env.example.

const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const EMAILS_KEY = 'snickylink:waitlist:emails'; // hash: email -> JSON entry
const COUNTER_KEY = 'snickylink:waitlist:counter'; // int: total signups

function generateTicket() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SNK-${random}-PAIR`;
}

/**
 * Adds an email (optionally paired with a partner's email) to the
 * waitlist if it isn't already present.
 * Returns { position, ticket, alreadyExists }.
 */
async function addEmail(email, partnerEmail) {
  const normalized = email.trim().toLowerCase();
  const normalizedPartner = partnerEmail ? partnerEmail.trim().toLowerCase() : undefined;

  const existingRaw = await redis.hget(EMAILS_KEY, normalized);
  if (existingRaw) {
    const existing =
      typeof existingRaw === 'string' ? JSON.parse(existingRaw) : existingRaw;
    return { position: existing.position, ticket: existing.ticket, alreadyExists: true };
  }

  const position = await redis.incr(COUNTER_KEY);
  const ticket = generateTicket();
  const entry = {
    position,
    ticket,
    partnerEmail: normalizedPartner || null,
    createdAt: new Date().toISOString(),
  };

  await redis.hset(EMAILS_KEY, { [normalized]: JSON.stringify(entry) });

  return { position, ticket, alreadyExists: false };
}

async function count() {
  const value = await redis.get(COUNTER_KEY);
  return Number(value) || 0;
}

/**
 * Very small fixed-window rate limiter: `max` requests per `windowSeconds`
 * per key (IP address). Returns true if the request is allowed.
 */
async function checkRateLimit(ip, max = 10, windowSeconds = 15 * 60) {
  const key = `snickylink:ratelimit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return current <= max;
}

module.exports = { addEmail, count, checkRateLimit };
