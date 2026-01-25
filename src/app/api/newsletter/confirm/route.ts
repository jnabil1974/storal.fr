import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Token manquant' }, { status: 400 });

  const { data, error } = await supabase
    .from('newsletter')
    .select('id, email, status, verified_at')
    .eq('verification_token', token)
    .limit(1);

  if (error) return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  const row = data?.[0];
  if (!row) return NextResponse.json({ error: 'Token invalide' }, { status: 400 });

  const { error: updError } = await supabase
    .from('newsletter')
    .update({ status: 'active', verified_at: new Date().toISOString(), verification_token: null })
    .eq('id', row.id);

  if (updError) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });

  const origin = request.headers.get('origin') || process.env.APP_URL || 'https://storal.fr';
  return NextResponse.redirect(`${origin}/?newsletter=confirmed`);
}
