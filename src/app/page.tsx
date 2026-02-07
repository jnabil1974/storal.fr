import Link from 'next/link';
import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOMetadata('/');
  return {
    title: seo?.title || 'Storal.fr - Store Banne MATEST® Sur-Mesure | TVA 10%',
    description: seo?.description || 'Store banne sur-mesure fabriqué en 24h, posé en 7 jours. TVA réduite à 10% avec notre forfait pose. Configurateur en ligne.',
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.og_title || seo?.title,
      description: seo?.og_description || seo?.description,
      url: seo?.canonical_url || 'https://storal.fr/',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
    robots: seo?.robots || 'index, follow',
    alternates: {
      canonical: seo?.canonical_url || 'https://storal.fr/',
    },
  };
}

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECTION HERO - Nouvelle version vendeuse */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Pattern de fond (en attendant l'image) */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            L'Ombre Parfaite. Fabriquée en France<br />Sur-Mesure
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/95 mb-12 font-medium drop-shadow-lg">
            Fabriqué en 24h. Posé chez vous en 7 jours.<br />
            <span className="text-yellow-400 font-bold">TVA réduite à 10%</span>
          </h2>

          {/* Deux cartes côte à côte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16">
            {/* Carte Configurateur Expert */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Configurateur Expert</h3>
              <p className="text-gray-600 mb-6">Créez votre store avec précision : dimensions, toile, motorisation...</p>
              <Link href="/products/store-banne">
                <button className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg">
                  Je crée mon store →
                </button>
              </Link>
            </div>

            {/* Carte Assistant Intelligent (mise en avant) */}
            <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 text-xs font-bold rounded-bl-xl">
                RECOMMANDÉ
              </div>
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-white mb-3">Assistant Intelligent</h3>
              <p className="text-white/90 mb-6">Répondez à quelques questions, on s'occupe du reste !</p>
              <a href="/assistant">
                <button className="w-full bg-white text-rose-700 py-4 px-6 rounded-xl font-bold text-lg hover:bg-rose-50 transition shadow-lg">
                  Aidez-moi à choisir →
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION OFFRE IRRÉSISTIBLE - Bandeau TVA */}
      <section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            💰 Pourquoi payer 20% de TVA ?
          </h2>
          <p className="text-xl md:text-2xl text-gray-900 font-medium max-w-4xl mx-auto">
            Avec notre <span className="font-bold underline">Forfait Pose Sérénité</span>, profitez de la TVA à 10% sur tout votre matériel.
            <br />
            <span className="text-lg">Économisez sur votre store en le faisant installer par un pro.</span>
          </p>
        </div>
      </section>

      {/* SECTION PRODUITS - 3 cartes statiques */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nos Gammes de Stores Bannes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Trouvez le store parfait pour votre terrasse</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Carte 1 : Le Coffre Intégral */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
              <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 text-sm font-bold rounded-lg">
                  BEST-SELLER
                </div>
                <div className="flex items-center justify-center h-full">
                  <svg className="w-32 h-32 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Le Coffre Intégral</h3>
                <p className="text-gray-600 mb-4">Protection maximale de la toile et des bras. Le plus durable et esthétique.</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li>✓ Toile protégée 24h/24</li>
                  <li>✓ Design moderne et épuré</li>
                  <li>✓ Longévité exceptionnelle</li>
                </ul>
                <Link href="/products/store-banne">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    Configurer →
                  </button>
                </Link>
              </div>
            </div>

            {/* Carte 2 : Le Semi-Coffre */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
              <div className="relative h-64 bg-gradient-to-br from-green-500 to-green-700 overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  <svg className="w-32 h-32 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Le Semi-Coffre</h3>
                <p className="text-gray-600 mb-4">Le compromis parfait entre protection et budget. Le choix malin.</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li>✓ Toile protégée dans un coffre</li>
                  <li>✓ Excellent rapport qualité/prix</li>
                  <li>✓ Installation simplifiée</li>
                </ul>
                <Link href="/products/store-banne">
                  <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                    Configurer →
                  </button>
                </Link>
              </div>
            </div>

            {/* Carte 3 : Le Monobloc */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
              <div className="relative h-64 bg-gradient-to-br from-orange-500 to-orange-700 overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  <svg className="w-32 h-32 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M4 10v11M20 10v11" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Le Monobloc</h3>
                <p className="text-gray-600 mb-4">La solution économique sans compromis sur la qualité. Simple et efficace.</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li>✓ Prix le plus accessible</li>
                  <li>✓ Robuste et fiable</li>
                  <li>✓ Idéal pour petit budget</li>
                </ul>
                <Link href="/products/store-banne">
                  <button className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                    Configurer →
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bouton Voir tous les modèles */}
          <div className="text-center">
            <Link href="/products/store-banne">
              <button className="bg-gray-900 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg">
                Voir tous les modèles →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Confiance */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">L'Excellence du Sur-Mesure, La Sérénité en Plus</h2>
          <p className="text-xl text-gray-300 mb-8">
            Fabrication française, garanties étendues, service client dédié.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold">✓ Certification QUALICOAT</span>
            <span className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold">✓ Garantie 10 ans</span>
            <span className="px-6 py-3 bg-white/10 rounded-lg backdrop-blur-sm font-semibold">✓ SAV Réactif</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 mb-12">
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-12 text-white text-center shadow-xl">
          <h2 className="text-4xl font-bold mb-4">Une Question ? Besoin d'un Conseil ?</h2>
          <p className="text-rose-100 mb-8 text-lg max-w-2xl mx-auto">Notre équipe d'experts vous accompagne dans votre projet. Devis gratuit et sans engagement.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <button className="bg-white text-rose-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-50 transition shadow-lg">
                Demander un Devis
              </button>
            </Link>
            <a href="tel:+33185093446" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition">
              Appeler le 01 85 09 34 46
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
