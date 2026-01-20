import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, getSupabaseClientWithAuth } from '@/lib/supabase';

function isAdminEmail(email?: string | null): boolean {
  if (!email) {
    console.log('🔒 Admin check: No email provided');
    return false;
  }
  const allow = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  console.log('🔒 Admin check: User email:', email, '| Allowed:', allow);
  const isAllowed = allow.includes(email.toLowerCase());
  console.log('🔒 Admin check result:', isAllowed ? '✅ ALLOWED' : '❌ FORBIDDEN');
  return isAllowed;
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

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const paymentMethod = searchParams.get('paymentMethod');

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (paymentMethod) query = query.eq('payment_method', paymentMethod);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Fetch error' }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.error;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });

  const body = await request.json();
  const { id, status } = body || {};
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: 'Update error' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
