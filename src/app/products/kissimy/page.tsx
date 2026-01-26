import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function KissimyProductPage() {
  // Redirige vers la page produit KISSIMY (UUID Supabase)
  redirect('/product/b0593506-2bda-4606-ba7c-d4bc1c26a1e2');
}
