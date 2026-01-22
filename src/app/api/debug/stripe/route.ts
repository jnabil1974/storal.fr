import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY || '';
  const type = key.startsWith('sk_test') ? 'TEST' : key.startsWith('sk_live') ? 'LIVE' : 'UNKNOWN';
  const masked = key ? `${key.slice(0, 7)}...${key.slice(-4)}` : '';
  return NextResponse.json({ type, masked });
}
