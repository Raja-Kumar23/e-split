/**
 * API route for settling group debts.
 * Processes wallet transfers between users and records the transaction in the group.
 */
import { dbGet, dbPush, dbUpdate } from '../../../../lib/firebaseAdmin';
import { round2, getMyDebts, computeSettlementPlan } from '../../../../lib/calculations';
import { ok, err, serverErr } from '../../../../lib/apiHelpers';

export async function GET(request, { params }) {
  try {
    const { groupId } = await params;
    const group = await dbGet(`groups/${groupId}`);
    if (!group) return err('Group not found', 404);

    const payments = Object.entries(group.payments || {})
      .map(([id, p]) => ({ id, ...p }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return ok(payments);
  } catch (e) {
    return serverErr(e);
  }
}

export async function POST(request, { params }) {
  try {
    const { groupId } = await params;
    const body = await request.json();
    const { from, to, amount, note } = body;

    if (!from) return err('from (debtor uid) is required');
    if (!to)   return err('to (creditor uid) is required');
    if (from === to) return err('Cannot pay yourself');
    
    // Validate payment amount
    if (!amount || isNaN(amount) || amount <= 0) return err('Amount must be a positive number');

    const parsedAmount = round2(parseFloat(amount));

    const group = await dbGet(`groups/${groupId}`);
    if (!group) return err('Group not found', 404);
    if (!group.members?.[from]) return err('Payer is not a group member', 403);
    if (!group.members?.[to])   return err('Recipient is not a group member', 403);

    const debts = getMyDebts(group, from);
    if (!debts[to] || debts[to] < 0.005) {
      return err(`${from} does not owe money to ${to} in this group`);
    }
    
    // Check if payment amount is valid
    if (parsedAmount > round2(debts[to] + 0.005)) {
      return err(`Overpayment: ${from} only owes ${debts[to].toFixed(2)} to ${to}`);
    }

    const [fromData, toData] = await Promise.all([
      dbGet(`users/${from}`),
      dbGet(`users/${to}`),
    ]);
    if (!fromData) return err('Payer user not found', 404);
    if (!toData)   return err('Recipient user not found', 404);
    if ((fromData.balance || 0) < parsedAmount) {
      return err(`Insufficient balance. Have ${(fromData.balance || 0).toFixed(2)}, need ${parsedAmount.toFixed(2)}`);
    }

    const fromNewBal = round2((fromData.balance || 0) - parsedAmount);
    const toNewBal   = round2((toData.balance   || 0) + parsedAmount);

    // Update user balances
    await Promise.all([
      dbUpdate(`users/${from}`, { balance: fromNewBal }),
      dbUpdate(`users/${to}`,   { balance: toNewBal }),
    ]);

    const payment = {
      from,
      to,
      amount: parsedAmount,
      note: note?.trim() || 'Settlement',
      createdAt: Date.now(),
    };
    const result = await dbPush(`groups/${groupId}/payments`, payment);

    const updatedGroup = await dbGet(`groups/${groupId}`);
    const updatedPlan  = computeSettlementPlan(updatedGroup);

    return ok({
      paymentId: result.name,
      payment,
      fromNewBalance: fromNewBal,
      toNewBalance:   toNewBal,
      remainingDebt:  round2(debts[to] - parsedAmount),
      updatedSettlementPlan: updatedPlan,
    }, 201);
  } catch (e) {
    return serverErr(e);
  }
}
