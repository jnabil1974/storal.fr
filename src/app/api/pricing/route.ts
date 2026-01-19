import { calculateProductPrice, getPriceBreakdown } from '@/lib/pricing';
import { ProductConfig, ProductType } from '@/types/products';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { basePrice, config } = body;

    if (!basePrice || !config) {
      return new Response(JSON.stringify({ error: 'basePrice et config sont requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const totalPrice = calculateProductPrice(basePrice, config as ProductConfig);
    const breakdown = getPriceBreakdown(basePrice, config as ProductConfig);

    return new Response(JSON.stringify({ totalPrice, breakdown }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
