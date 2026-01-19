import { getProducts, getProductById, getProductsByType } from '@/lib/database';
import { ProductType } from '@/types/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  try {
    if (id) {
      // Récupérer un produit spécifique
      const product = await getProductById(id);
      if (!product) {
        return new Response(JSON.stringify({ error: 'Produit non trouvé' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify(product), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type) {
      // Récupérer les produits par type
      const products = await getProductsByType(type as ProductType);
      return new Response(JSON.stringify(products), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Récupérer tous les produits
    const products = await getProducts();
    return new Response(JSON.stringify(products), {
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
