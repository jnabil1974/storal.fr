import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  if (!token && !email) return NextResponse.json({ error: 'Paramètre manquant' }, { status: 400 });

  let query = supabase.from('newsletter').select('id, email, status');
  if (token) query = query.eq('unsubscribe_token', token);
  else if (email) query = query.eq('email', email.toLowerCase());

  const { data, error } = await query.limit(1);
  if (error) return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  const row = data?.[0];
  if (!row) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });

  const { error: updError } = await supabase
    .from('newsletter')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('id', row.id);

  if (updError) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });

  const origin = request.headers.get('origin') || process.env.APP_URL || 'https://storal.fr';
  return NextResponse.redirect(`${origin}/?newsletter=unsubscribed`);
}
