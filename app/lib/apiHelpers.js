import { NextResponse } from 'next/server';

export function ok(data, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function err(message, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function serverErr(e) {
  console.error('[API ERROR]', e);
  return NextResponse.json(
    { ok: false, error: e?.message || 'Internal server error' },
    { status: 500 }
  );
}
