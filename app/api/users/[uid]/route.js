/**
 * API route for user profile management.
 * Handles fetching and updating user data with proper field whitelisting.
 */
import { dbGet, dbUpdate } from '../../../lib/firebaseAdmin';
import { ok, err, serverErr } from '../../../lib/apiHelpers';

const ALLOWED_UPDATE_FIELDS = ['name', 'balance', 'totalSpent', 'username', 'photoURL'];

export async function GET(request, { params }) {
  try {
    const { uid } = await params;
    const user = await dbGet(`users/${uid}`);
    if (!user) return err('User not found', 404);

    // Remove password before sending data
    const { password, ...safeUser } = user;
    return ok(safeUser);
  } catch (e) {
    return serverErr(e);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { uid } = await params;
    const body = await request.json();

    // Only update allowed fields
    const updates = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (body[field] !== undefined) updates[field] = body[field];
    }
    if (Object.keys(updates).length === 0) return err('No valid fields to update');

    if (updates.balance !== undefined) {
      if (isNaN(updates.balance)) return err('balance must be a number');
      updates.balance = Math.round(parseFloat(updates.balance) * 100) / 100;
    }

    const user = await dbGet(`users/${uid}`);
    if (!user) return err('User not found', 404);

    await dbUpdate(`users/${uid}`, updates);
    const updated = await dbGet(`users/${uid}`);
    return ok(updated);
  } catch (e) {
    return serverErr(e);
  }
}
