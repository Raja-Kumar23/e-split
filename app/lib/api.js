/**
 * Centralized API client for all server communication.
 * Wraps native fetch to interact with backend endpoints seamlessly.
 */

async function call(path, options = {}) {
  // Helper function for API requests
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  // if the server yells at us, throw a proper error so the frontend can show a toast
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data;
}

export const fetchGroups = (uid) =>
  call(`/api/groups?uid=${uid}`);

export const fetchGroup = (groupId, uid) =>
  call(`/api/groups/${groupId}?uid=${uid}`);

export const createGroup = (body) =>
  call('/api/groups', { method: 'POST', body: JSON.stringify(body) });

export const createExpense = (groupId, body) =>
  call(`/api/groups/${groupId}/expenses`, { method: 'POST', body: JSON.stringify(body) });

export const createPayment = (groupId, body) =>
  call(`/api/groups/${groupId}/payments`, { method: 'POST', body: JSON.stringify(body) });

export const fetchUser = (uid) =>
  call(`/api/users/${uid}`);

export const updateUser = (uid, body) =>
  call(`/api/users/${uid}`, { method: 'PATCH', body: JSON.stringify(body) });

export const fetchConnections = (uid) =>
  call(`/api/connections?uid=${uid}`);

export const connectionAction = (action, from, to) =>
  call('/api/connections', { method: 'POST', body: JSON.stringify({ action, from, to }) });

export const fetchGifts = (uid) =>
  call(`/api/gifts?uid=${uid}`);

export const sendGiftApi = (body) =>
  call('/api/gifts', { method: 'POST', body: JSON.stringify(body) });
