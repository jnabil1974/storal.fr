import { NextResponse } from 'next/server';
import { checkZoneIntervention } from '@/lib/intervention-zones';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codePostal = searchParams.get('codePostal');

    if (!codePostal) {
      return NextResponse.json(
        { error: 'Code postal manquant' },
        { status: 400 }
      );
    }

    const result = checkZoneIntervention(codePostal);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur vérification zone:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
