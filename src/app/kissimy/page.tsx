import { Metadata } from 'next';
import StoreBanneConfigurator from '@/components/StoreBanneConfigurator';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

async function getProductBySlug(slug: string) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) return null;

	const supabase = createClient(supabaseUrl, supabaseKey);
	const { data, error } = await supabase
		.from('sb_products')
		.select('*')
		.eq('slug', slug)
		.single();

	if (error || !data) return null;
	return data;
}

export async function generateMetadata(): Promise<Metadata> {
	const product = await getProductBySlug('kissimy');

	return {
		title: `${product?.name || 'Store Banne'} - Configurateur de Prix | Storal.fr`,
		description: product?.description || 'Configurez votre store banne et obtenez un prix instantané selon vos dimensions.',
	};
}

export default async function KissimyPage() {
	const product = await getProductBySlug('kissimy');

	if (!product) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12">
			<div className="max-w-7xl mx-auto px-4">
				<div id="configurateur" className="scroll-mt-24">
					<StoreBanneConfigurator product={product} productSlug={product.slug} />
				</div>
			</div>
		</div>
	);
}
