'use client';

interface VisualPreviewProps {
  largeur: number;
  avancee: string;
  modele: string;
  toile: string;
  ajouterLED: boolean;
  capteurVent: boolean;
}

const TOILES = [
  { id: 'gris', nom: 'Gris', couleur: '#6B7280' },
  { id: 'blanc', nom: 'Blanc Cassé', couleur: '#F3F4F6' },
  { id: 'taupe', nom: 'Taupe', couleur: '#9CA3AF' },
  { id: 'bleu', nom: 'Bleu Marine', couleur: '#1E40AF' },
  { id: 'raye', nom: 'Rayé Bleu/Blanc', couleur: 'linear-gradient(90deg, #1E40AF 50%, #F3F4F6 50%)' }
];

const MODELES = [
  { id: 'coffre', nom: 'Coffre Intégral', description: 'Protection maximale', badge: 'BEST-SELLER' },
  { id: 'semi-coffre', nom: 'Semi-Coffre', description: 'Rapport qualité/prix', badge: '' },
  { id: 'monobloc', nom: 'Monobloc', description: 'Solution économique', badge: '' }
];

export default function StoreBanneVisualPreview({ 
  largeur, 
  avancee, 
  modele, 
  toile, 
  ajouterLED, 
  capteurVent 
}: VisualPreviewProps) {
  const toileSelec = TOILES.find(t => t.id === toile);
  const modeleSelec = MODELES.find(m => m.id === modele);
  
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-2xl">
      {/* Calque 0 - Fond Terrasse */}
      <img
        src="https://via.placeholder.com/800x600/E5E7EB/9CA3AF?text=Mur+de+Terrasse"
        alt="Fond terrasse"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Calque 10 - Toile (change selon couleur) */}
      <img
        src={`https://via.placeholder.com/800x600/${toile === 'gris' ? '6B7280' : toile === 'blanc' ? 'F3F4F6' : toile === 'taupe' ? '9CA3AF' : toile === 'bleu' ? '1E40AF' : 'FFFFFF'}/FFFFFF?text=Toile+${toileSelec?.nom || ''}`}
        alt={`Toile ${toileSelec?.nom}`}
        className="absolute inset-0 w-full h-full object-cover z-10 opacity-80 transition-all duration-500"
        key={toile} // Force re-render on color change
      />
      
      {/* Calque 20 - Structure (change selon modèle) */}
      <img
        src={`https://via.placeholder.com/800x600/1F2937/FFFFFF?text=${modele === 'coffre' ? 'Coffre+Intégral' : modele === 'semi-coffre' ? 'Semi-Coffre' : 'Monobloc'}`}
        alt={`Structure ${modeleSelec?.nom}`}
        className="absolute inset-0 w-full h-full object-contain z-20 transition-all duration-500"
        key={modele}
      />
      
      {/* Badge Dimensions */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-900 z-30 shadow-lg">
        {largeur} × {avancee} cm
      </div>
      
      {/* Badge Modèle */}
      <div className="absolute top-3 right-3 bg-rose-600/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white z-30 shadow-lg">
        {modeleSelec?.nom}
      </div>
      
      {/* Indicateur LED si activé */}
      {ajouterLED && (
        <div className="absolute bottom-3 left-3 bg-yellow-400/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-900 z-30 shadow-lg flex items-center gap-2 animate-pulse">
          💡 LED
        </div>
      )}
      
      {/* Indicateur Capteur si activé */}
      {capteurVent && (
        <div className="absolute bottom-3 right-3 bg-blue-500/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white z-30 shadow-lg flex items-center gap-2">
          🌪️ Capteur
        </div>
      )}
    </div>
  );
}
