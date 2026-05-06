/**
 * Controller for group-related operations.
 * Handles fetching groups for a user and creating new expense-sharing groups.
 */
import { dbGet, dbPush } from '../../lib/firebaseAdmin';
import { ok, err, serverErr } from '../../lib/apiHelpers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    if (!uid) return err('uid required', 400);

    const allGroups = await dbGet('groups');
    if (!allGroups) return ok({});

    // Get only the groups where user is a member
    const myGroups = {};
    for (const [gid, g] of Object.entries(allGroups)) {
      if (g.members && g.members[uid]) {
        myGroups[gid] = g;
      }
    }
    return ok(myGroups);
  } catch (e) {
    return serverErr(e);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, desc, members, createdBy } = body;

    if (!name || !name.trim()) return err('Group name is required');
    if (!createdBy) return err('createdBy is required');
    
    // Creator must be a member of the group
    if (!members || !members[createdBy]) return err('Creator must be in members');

    const newGroup = {
      name: name.trim(),
      desc: desc?.trim() || '',
      members,
      createdBy,
      createdAt: Date.now(),
      expenses: {},
      payments: {},
    };

    const result = await dbPush('groups', newGroup);
    return ok({ groupId: result.name, group: newGroup }, 201);
  } catch (e) {
    return serverErr(e);
  }
}
