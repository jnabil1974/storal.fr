import Link from 'next/link';
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

export default function AboutPage() {
  return (
    <div className={`min-h-screen bg-[#f5f7fa] ${epilogue.className}`}>
      {/* Header Simple */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#2c3e50] uppercase">Storal</h1>
          </Link>
          <Link href="/" className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-wider">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black text-[#2c3e50] uppercase tracking-tight">À Propos de Storal</h1>
            <p className="text-xl text-gray-600">L'expertise française au service de votre confort</p>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg space-y-6">
            <h2 className="text-3xl font-black text-[#2c3e50] uppercase tracking-wide">Notre Histoire</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Depuis plus de 15 ans, Storal accompagne les particuliers et les professionnels dans leurs projets 
              de protection solaire. Fort de notre expertise et de notre engagement envers la qualité, nous proposons 
              des stores bannes sur-mesure, fabriqués en France avec les meilleurs matériaux.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Aujourd'hui, nous révolutionnons l'expérience client en intégrant l'intelligence artificielle 
              pour vous offrir un configurateur intuitif et un accompagnement personnalisé 24/7.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-lg space-y-6">
            <h2 className="text-3xl font-black text-[#2c3e50] uppercase tracking-wide">Nos Engagements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">🇫🇷</span>
                </div>
                <h3 className="text-xl font-black text-[#2c3e50]">Fabrication Française</h3>
                <p className="text-gray-600">Tous nos stores sont fabriqués dans nos ateliers en France.</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-black text-[#2c3e50]">Garantie 12 ans</h3>
                <p className="text-gray-600">Protection totale sur l'ensemble de nos produits.</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-black text-[#2c3e50]">Rapidité</h3>
                <p className="text-gray-600">Fabrication en 24h, livraison sous 7 jours.</p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-black text-[#2c3e50]">Installation Pro</h3>
                <p className="text-gray-600">Pose réalisée par nos techniciens certifiés.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/assistant" 
              className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-lg uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Démarrer votre projet
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
