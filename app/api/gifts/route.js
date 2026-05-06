/**
 * API route for processing and retrieving user gifts.
 * Supports balance deduction and connection validation prior to transfer.
 */
import { dbGet, dbUpdate, dbPush } from '../../lib/firebaseAdmin';
import { round2 } from '../../lib/calculations';
import { ok, err, serverErr } from '../../lib/apiHelpers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    if (!uid) return err('uid required');

    const allGifts = await dbGet('gifts');
    if (!allGifts) return ok([]);

    const myGifts = Object.entries(allGifts)
      .filter(([, g]) => g.from === uid || g.to === uid)
      .map(([id, g]) => ({ id, ...g }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return ok(myGifts);
  } catch (e) {
    return serverErr(e);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { from, to, amount, cardId, cardEmoji, cardName, message } = body;

    if (!from || !to) return err('from and to are required');
    if (from === to) return err('Cannot send gift to yourself');
    if (!amount || isNaN(amount) || amount <= 0) return err('Amount must be a positive number');
    if (!cardId || !cardName) return err('Gift card details required');

    const parsedAmount = round2(parseFloat(amount));

    // Get user details for sender and receiver
    const [fromUser, toUser] = await Promise.all([
      dbGet(`users/${from}`),
      dbGet(`users/${to}`),
    ]);
    if (!fromUser) return err('Sender not found', 404);
    if (!toUser) return err('Recipient not found', 404);

    // Check if sender has enough balance
    if ((fromUser.balance || 0) < parsedAmount) {
      return err(`Insufficient balance. Have ${(fromUser.balance || 0).toFixed(2)}, need ${parsedAmount.toFixed(2)}`);
    }

    // strangers can't send gifts, they must be  be connections
    const connection = await dbGet(`connections/${from}/accepted/${to}`);
    if (!connection) return err('You can only send gifts to your connections');

    const fromNewBal = round2((fromUser.balance || 0) - parsedAmount);
    const toNewBal = round2((toUser.balance || 0) + parsedAmount);

    await Promise.all([
      dbUpdate(`users/${from}`, { balance: fromNewBal }),
      dbUpdate(`users/${to}`, { balance: toNewBal }),
    ]);

    const gift = {
      from,
      fromName: fromUser.name,
      fromUsername: fromUser.username || '',
      to,
      toName: toUser.name,
      toUsername: toUser.username || '',
      cardId,
      cardEmoji: cardEmoji || '',
      cardName,
      amount: parsedAmount,
      message: message?.trim() || '',
      createdAt: Date.now(),
    };

    const result = await dbPush('gifts', gift);

    return ok({
      giftId: result.name,
      gift,
      senderNewBalance: fromNewBal,
      receiverNewBalance: toNewBal,
    }, 201);
  } catch (e) {
    return serverErr(e);
  }
}
