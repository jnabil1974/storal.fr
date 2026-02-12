import Image from 'next/image';
import { Metadata } from 'next';
import { STORE_MODELS } from '@/lib/catalog-data';

export const metadata: Metadata = {
  title: 'Stores Bannes | Storal.fr',
  description: 'Découvrez notre gamme complète de stores bannes personnalisables pour terrasses et balcons.',
};

export default function StoreBanneCatalogPage() {
  // Récupérer tous les modèles du catalogue
  const allModels = Object.entries(STORE_MODELS).map(([id, model]) => ({
    id: id,
    name: model.name,
    type: model.type,
    image: model.image,
    description: model.description,
    features: model.features || []
  }));

  // Grouper par type
  const modelsByType = {
    coffre: allModels.filter(m => m.type === 'coffre'),
    monobloc: allModels.filter(m => m.type === 'monobloc'),
    traditionnel: allModels.filter(m => m.type === 'traditionnel'),
    specialite: allModels.filter(m => m.type === 'specialite')
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold uppercase tracking-widest mb-4">
            Notre Gamme Stores Bannes
          </h1>
          <p className="text-xl text-slate-200">
            100% sur-mesure | Fabrication Française | Garantie 12 ans sur l'armature
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {allModels.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">Aucun modèle disponible pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Section Stores Coffres */}
            {Object.entries(modelsByType).map(([typeKey, models]) => (
              models.length > 0 && (
                <div key={typeKey}>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8 capitalize">
                    Stores {typeKey === 'coffre' ? 'Coffres' : typeKey === 'monobloc' ? 'Monoblocs' : typeKey === 'traditionnel' ? 'Traditionnels' : 'Spécialité'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative h-56 bg-slate-100 overflow-hidden">
                          <Image
                            src={model.image}
                            alt={model.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {/* Badge Type */}
                          <div className="absolute top-3 right-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                              typeKey === 'coffre' ? 'bg-rose-800' :
                              typeKey === 'monobloc' ? 'bg-yellow-600' :
                              typeKey === 'traditionnel' ? 'bg-amber-700' :
                              'bg-slate-600'
                            }`}>
                              {model.type?.charAt(0).toUpperCase() + model.type?.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-rose-800 transition">
                            {model.name}
                          </h3>
                          <p className="text-slate-600 line-clamp-2 mb-4">
                            {model.description}
                          </p>
                          
                          {/* Features */}
                          {model.features.length > 0 && (
                            <ul className="text-sm text-slate-600 mb-4 flex-grow">
                              {model.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="flex items-start mb-2">
                                  <span className="text-rose-800 mr-2">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Bouton */}
                          <button
                            className="w-full bg-rose-800 hover:bg-rose-900 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                          >
                            Configurer ce modèle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
