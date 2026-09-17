// Minimal file-backed waitlist store.
// Good enough for an MVP / pre-launch waitlist. Swap this out for a real
// database (Postgres, MongoDB, etc.) once you have a backend worth scaling.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'waitlist.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readAll() {
  ensureStore();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeAll(entries) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

function generateTicket() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SNK-${random}-PAIR`;
}

/**
 * Adds an email to the waitlist if it isn't already present.
 * Returns { position, ticket, alreadyExists }.
 */
function addEmail(email) {
  const entries = readAll();
  const normalized = email.trim().toLowerCase();

  const existing = entries.find((e) => e.email === normalized);
  if (existing) {
    return {
      position: existing.position,
      ticket: existing.ticket,
      alreadyExists: true,
    };
  }

  const position = entries.length + 1;
  const ticket = generateTicket();

  entries.push({
    email: normalized,
    position,
    ticket,
    createdAt: new Date().toISOString(),
  });

  writeAll(entries);

  return { position, ticket, alreadyExists: false };
}

function count() {
  return readAll().length;
}

module.exports = { addEmail, count };
