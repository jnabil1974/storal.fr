import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClientWithAuth } from '@/lib/supabase';

function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const allow = adminEmailsEnv.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return allow.includes(email.toLowerCase());
}

async function requireAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.substring('Bearer '.length) : '';
  if (!token) return { ok: false as const, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const supabase = getSupabaseClientWithAuth(token);
  if (!supabase) return { ok: false as const, error: NextResponse.json({ error: 'Server auth error' }, { status: 500 }) };
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { ok: false as const, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (!isAdminEmail(data.user.email)) return { ok: false as const, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { ok: true as const, user: data.user };
}

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.error;
  return NextResponse.json({ ok: true, email: guard.user!.email });
}
