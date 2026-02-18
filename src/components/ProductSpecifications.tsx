'use client';

import { Shield, Wind, Wrench, Droplet, Sun } from 'lucide-react';

/**
 * Composant ProductSpecifications - Fiche technique SEO-optimisée
 * Affiche les spécifications techniques avec mots-clés pour référencement Google
 * Mots-clés ciblés : NF EN 13561, Aluminium extrudé, Inox A2, teint masse, etc.
 */
export default function ProductSpecifications() {
  const specifications = [
    {
      icon: <Wind className="w-6 h-6" />,
      title: "Résistance au Vent",
      value: "Classe 2",
      description: "Norme NF EN 13561",
      detail: "Certification européenne garantissant la résistance aux rafales jusqu'à 50 km/h",
      color: "blue"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Armature",
      value: "Aluminium extrudé",
      description: "Haute résistance",
      detail: "Aluminium extrudé à chaud pour une rigidité et durabilité maximales, bien supérieur à l'aluminium moulé",
      color: "gray"
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Visserie",
      value: "Inox A2",
      description: "Anti-corrosion",
      detail: "Acier inoxydable A2 (AISI 304) résistant à la corrosion marine et atmosphérique, idéal zones côtières",
      color: "slate"
    },
    {
      icon: <Droplet className="w-6 h-6" />,
      title: "Inclinaison",
      value: "Réglable",
      description: "De 0° à 45°",
      detail: "Angle d'inclinaison ajustable pour optimiser l'ombre selon l'heure et la saison",
      color: "indigo"
    },
    {
      icon: <Sun className="w-6 h-6" />,
      title: "Toile Premium",
      value: "100% Acrylique",
      description: "Teint masse 290g/m²",
      detail: "Toile acrylique teint masse garantie imputrescible. Protection UV 100% (UPF 50+). Les pigments traversent la fibre : couleurs inaltérables pendant 10 ans minimum",
      color: "orange"
    }
  ];

  const colorClasses: Record<string, { bg: string, border: string, text: string, iconBg: string }> = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      iconBg: "bg-blue-500"
    },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-900",
      iconBg: "bg-gray-600"
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-900",
      iconBg: "bg-slate-600"
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-900",
      iconBg: "bg-indigo-500"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-900",
      iconBg: "bg-orange-500"
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
          <span className="text-3xl">🔬</span>
          Fiche Technique & Qualité
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Tous nos stores respectent les normes européennes les plus strictes. 
          Matériaux premium sélectionnés pour leur durabilité exceptionnelle.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specifications.map((spec, index) => {
          const colors = colorClasses[spec.color] || colorClasses.blue;
          
          return (
            <div 
              key={index}
              className={`${colors.bg} border-2 ${colors.border} rounded-xl p-5 hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`${colors.iconBg} text-white p-2 rounded-lg flex-shrink-0`}>
                  {spec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold ${colors.text} text-sm mb-1`}>
                    {spec.title}
                  </h4>
                  <p className="text-lg font-black text-gray-900 leading-tight">
                    {spec.value}
                  </p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {spec.description}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-200 pt-3">
                {spec.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Certifications supplémentaires */}
      <div className="mt-6 pt-6 border-t-2 border-gray-300">
        <div className="flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇪🇺</span>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-700 leading-tight">Norme CE</p>
              <p className="text-xs text-gray-500">Conforme UE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-700 leading-tight">Garantie 12 ans</p>
              <p className="text-xs text-gray-500">Structure aluminium</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇫🇷</span>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-700 leading-tight">Fabrication française</p>
              <p className="text-xs text-gray-500">Atelier certifié</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
