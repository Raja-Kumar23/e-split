/**
 * API route for adding and retrieving group expenses.
 * Handles validation, splitting logic, and updates to the payer's wallet balance.
 */
import { dbGet, dbPush, dbUpdate } from '../../../../lib/firebaseAdmin';
import { round2, getMyDebts, getMyCredits } from '../../../../lib/calculations';
import { ok, err, serverErr } from '../../../../lib/apiHelpers';

export async function GET(request, { params }) {
  try {
    const { groupId } = await params;
    const group = await dbGet(`groups/${groupId}`);
    if (!group) return err('Group not found', 404);

    const expenses = group.expenses || {};
    const sorted = Object.entries(expenses)
      .map(([id, e]) => ({ id, ...e }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return ok(sorted);
  } catch (e) {
    return serverErr(e);
  }
}

export async function POST(request, { params }) {
  try {
    const { groupId } = await params;
    const body = await request.json();
    const { desc, amount, paidBy, splitWith, isDirectPayment, paymentMethod, paymentDetail } = body;

    // Validate input data
    if (!desc || !desc.trim()) return err('Description is required');
    if (!amount || isNaN(amount) || amount <= 0) return err('Amount must be a positive number');
    if (!paidBy) return err('paidBy is required');

    const group = await dbGet(`groups/${groupId}`);
    if (!group) return err('Group not found', 404);
    if (!group.members?.[paidBy]) return err('Payer is not a member of this group', 403);

    const memberUids = Object.keys(group.members);
    const participants = Array.isArray(splitWith) && splitWith.length > 0 ? splitWith : memberUids;

    for (const uid of participants) {
      if (!group.members[uid]) return err(`User ${uid} is not a group member`);
    }

    const parsedAmount = round2(parseFloat(amount));
    const perPerson = round2(parsedAmount / participants.length);

    const payerData = await dbGet(`users/${paidBy}`);
    if (!payerData) return err('Payer not found', 404);
    
    // Check user balance
    if ((payerData.balance || 0) < parsedAmount) {
      return err(`Insufficient balance. Have ${payerData.balance?.toFixed(2)}, need ${parsedAmount.toFixed(2)}`);
    }

    const expense = {
      desc: desc.trim(),
      amount: parsedAmount,
      paidBy,
      splitWith: participants,
      perPerson,
      isDirectPayment: isDirectPayment || false,
      paymentMethod: paymentMethod || null,
      paymentDetail: paymentDetail || null,
      createdAt: Date.now(),
    };

    const result = await dbPush(`groups/${groupId}/expenses`, expense);

    // Deduct amount from user balance
    const newBalance = round2((payerData.balance || 0) - parsedAmount);
    const newTotalSpent = round2((payerData.totalSpent || 0) + perPerson);

    await dbUpdate(`users/${paidBy}`, {
      balance: newBalance,
      totalSpent: newTotalSpent,
    });

    return ok({
      expenseId: result.name,
      expense,
      payerNewBalance: newBalance,
      perPerson,
      participantCount: participants.length,
    }, 201);
  } catch (e) {
    return serverErr(e);
  }
}
