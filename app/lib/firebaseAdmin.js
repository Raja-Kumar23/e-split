/**
 * Minimal Firebase admin module for server-side usage.
 * Uses REST API to interface with the database.
 */

const DB_URL = 'https://kslcaptain-default-rtdb.firebaseio.com';

async function dbGet(path) {
  const res = await fetch(`${DB_URL}/${path}.json`);
  if (!res.ok) throw new Error(`DB GET failed: ${path} ${res.status}`);
  return res.json();
}

async function dbSet(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`DB SET failed: ${path} ${res.status}`);
  return res.json();
}

async function dbPush(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`DB PUSH failed: ${path} ${res.status}`);
  return res.json();
}

async function dbUpdate(path, data) {
  const res = await fetch(`${DB_URL}/${path}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`DB UPDATE failed: ${path} ${res.status}`);
  return res.json();
}

async function dbDelete(path) {
  const res = await fetch(`${DB_URL}/${path}.json`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DB DELETE failed: ${path} ${res.status}`);
  return true;
}

export { dbGet, dbSet, dbPush, dbUpdate, dbDelete };
