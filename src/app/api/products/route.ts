import { getProducts, getProductById, getProductsByType } from '@/lib/database';
import { ProductType } from '@/types/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  };

  try {
    if (id) {
      // Récupérer un produit spécifique
      const product = await getProductById(id);
      if (!product) {
        return new Response(JSON.stringify({ error: 'Produit non trouvé' }), {
          status: 404,
          headers,
        });
      }
      return new Response(JSON.stringify(product), {
        status: 200,
        headers,
      });
    }

    if (type) {
      // Récupérer les produits par type
      const products = await getProductsByType(type as ProductType);
      return new Response(JSON.stringify(products), {
        status: 200,
        headers,
      });
    }

    // Récupérer tous les produits
    const products = await getProducts();
    console.log('[API /products] Returning', products.length, 'products');
    return new Response(JSON.stringify(products), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[API /products] Error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers,
    });
  }
}
