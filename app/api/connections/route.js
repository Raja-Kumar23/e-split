/**
 * Handles API routes for managing user connections.
 * Includes capabilities for sending, accepting, declining, and removing connection requests.
 */
import { dbGet, dbSet, dbDelete } from '../../lib/firebaseAdmin';
import { ok, err, serverErr } from '../../lib/apiHelpers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    // Check for user ID
    if (!uid) return err('uid required');

    const [acceptedSnap, incomingSnap, sentSnap] = await Promise.all([
      dbGet(`connections/${uid}/accepted`),
      dbGet(`connections/${uid}/incoming`),
      dbGet(`connections/${uid}/sent`),
    ]);

    async function hydrateUsers(uidsObj) {
      if (!uidsObj) return {};
      
      // Fetch user details for connection IDs
      const result = {};
      await Promise.all(
        Object.keys(uidsObj).map(async (targetUid) => {
          const user = await dbGet(`users/${targetUid}`);
          if (user) result[targetUid] = user;
        })
      );
      return result;
    }

    const [accepted, incoming, sent] = await Promise.all([
      hydrateUsers(acceptedSnap),
      hydrateUsers(incomingSnap),
      hydrateUsers(sentSnap),
    ]);

    return ok({ accepted, incoming, sent });
  } catch (e) {
    return serverErr(e);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, from, to } = body;

    if (!action) return err('action is required');
    if (!from || !to) return err('from and to are required');
    if (from === to) return err('Cannot connect with yourself');

    const [fromUser, toUser] = await Promise.all([
      dbGet(`users/${from}`),
      dbGet(`users/${to}`),
    ]);
    if (!fromUser) return err('from user not found', 404);
    if (!toUser)   return err('to user not found', 404);

    switch (action) {
      case 'send': {
        // Check if request already exists
        const existing = await dbGet(`connections/${from}/accepted/${to}`);
        if (existing) return err('Already connected');
        const alreadySent = await dbGet(`connections/${from}/sent/${to}`);
        if (alreadySent) return err('Request already sent');

        // Save request to database
        await Promise.all([
          dbSet(`connections/${to}/incoming/${from}`, true),
          dbSet(`connections/${from}/sent/${to}`, true),
        ]);
        return ok({ message: `Request sent to @${toUser.username}` });
      }

      case 'accept': {
        const hasRequest = await dbGet(`connections/${from}/incoming/${to}`);
        if (!hasRequest) return err('No pending request from this user');

        await Promise.all([
          dbSet(`connections/${from}/accepted/${to}`, true),
          dbSet(`connections/${to}/accepted/${from}`, true),
          dbDelete(`connections/${from}/incoming/${to}`),
          dbDelete(`connections/${to}/sent/${from}`),
        ]);
        return ok({ message: 'Connection accepted' });
      }

      case 'decline': {
        await Promise.all([
          dbDelete(`connections/${from}/incoming/${to}`),
          dbDelete(`connections/${to}/sent/${from}`),
        ]);
        return ok({ message: 'Request declined' });
      }

      case 'remove': {
        await Promise.all([
          dbDelete(`connections/${from}/accepted/${to}`),
          dbDelete(`connections/${to}/accepted/${from}`),
        ]);
        return ok({ message: 'Connection removed' });
      }

      default:
        return err(`Unknown action: ${action}`);
    }
  } catch (e) {
    return serverErr(e);
  }
}
