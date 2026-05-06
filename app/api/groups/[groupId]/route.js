/**
 * Group details API route.
 * Retrieves comprehensive group information including member balances and settlement plans.
 */
import { dbGet, dbDelete } from '../../../lib/firebaseAdmin';
import { getGroupSummary, computeSettlementPlan } from '../../../lib/calculations';
import { ok, err, serverErr } from '../../../lib/apiHelpers';

export async function GET(request, { params }) {
  try {
    const { groupId } = await params;
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    const group = await dbGet(`groups/${groupId}`);
    if (!group) return err('Group not found', 404);
    
    // Check if user is a member of this group
    if (uid && !group.members?.[uid]) return err('Not a member of this group', 403);

    // Calculate the settlement plan
    const settlementPlan = computeSettlementPlan(group);
    const memberBalances = {};

    for (const memberUid of Object.keys(group.members || {})) {
      const summary = getGroupSummary(group, memberUid);
      memberBalances[memberUid] = {
        netBalance: summary.netBal,
        totalOwed: summary.totalOwed,
        totalOwe: summary.totalOwe,
        debts: summary.debts,
        credits: summary.credits,
      };
    }

    return ok({
      group,
      memberBalances,
      settlementPlan,
      ...(uid ? { myBalance: memberBalances[uid] } : {}),
    });
  } catch (e) {
    return serverErr(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { groupId } = await params;
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    const group = await dbGet(`groups/${groupId}`);
    if (!group) return err('Group not found', 404);
    if (group.createdBy !== uid) return err('Only the creator can delete this group', 403);

    await dbDelete(`groups/${groupId}`);
    return ok({ deleted: true });
  } catch (e) {
    return serverErr(e);
  }
}
