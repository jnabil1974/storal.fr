'use client';

import React from 'react';
import { Lightbulb, ChevronDown } from 'lucide-react';

const ExpertAdvice = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const advices = [
    {
      title: "Comment choisir la couleur de son coffre de store banne ?",
      content: `Le choix du RAL (couleur de l'armature) est crucial pour l'esthétique de votre façade. 
      - **Les Standards (RAL 7016, 9016, 1015) :** Ces coloris (Gris Anthracite, Blanc, Beige) sont les plus demandés. Ils s'intègrent partout sans supplément de prix.
      - **Le thermolaquage :** Toutes nos armatures bénéficient d'un thermolaquage haute résistance certifié Qualicoat®, garantissant une tenue parfaite face aux UV et à la corrosion.
      - **Conseil Pro :** Pour les modèles grandes dimensions (>6m), l'option couleur personnalisée est souvent offerte pour une intégration architecturale parfaite.`
    },
    {
      title: "Installation : pose murale ou plafond ?",
      content: `Le support détermine la sécurité et la longévité de votre installation.
      - **Pose Murale :** C'est la plus classique. Elle nécessite un mur sain (béton ou brique pleine). Sur brique creuse ou parpaing, l'usage d'un scellement chimique est impératif pour la sécurité.
      - **Pose Plafond :** Idéale pour les dessous de balcons ou les débords de toiture. Elle permet souvent une discrétion totale du coffre.
      - **Important :** Pensez à vérifier la "hauteur de passage" sous la barre de charge. Nous conseillons un minimum de 2m pour circuler librement.`
    },
    {
      title: "Pourquoi choisir les bras renforcés (Gamme Armor) ?",
      content: `La tension de la toile est le secret d'un store qui dure.
      - **Double câblage gainé :** Nos bras de la gamme Armor utilisent des câbles d'acier haute résistance protégés par une gaine, assurant une tension constante et silencieuse.
      - **Résistance au vent :** Ces bras permettent une meilleure stabilité face aux brises. Ils sont classés en haute catégorie de résistance selon les normes européennes.
      - **Protection de la toile :** Une toile bien tendue évite les poches d'eau et les battements excessifs, prolongeant la durée de vie de l'ensemble du store.`
    },
    {
      title: "Domotique et Sécurité : Vent et Automatisation",
      content: `Un store intelligent est un store qui dure plus longtemps.
      - **Capteur de vent (Anémomètre) :** C'est l'accessoire indispensable. Il replie automatiquement votre store si le vent se lève, même en votre absence.
      - **Motorisation Somfy® / Storal :** Nos moteurs intègrent des fins de course automatiques qui garantissent une fermeture parfaite du coffre à chaque cycle.
      - **Pilotage Smartphone :** En option, pilotez votre store à distance et créez des scénarios selon l'ensoleillement pour protéger la fraîcheur de votre intérieur.`
    }
  ];

  return (
    <section className="my-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Lightbulb className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-amber-900 leading-tight">Le Conseil de l'Expert Storal</h2>
          <p className="text-amber-700 text-sm italic">Tout savoir pour une installation réussie</p>
        </div>
      </div>

      <div className="space-y-3">
        {advices.map((advice, index) => (
          <div key={index} className="bg-white rounded-xl border border-amber-200 overflow-hidden transition-all duration-200">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className={`w-full p-4 text-left flex justify-between items-center transition-colors ${openIndex === index ? 'bg-amber-50/50' : 'hover:bg-amber-50/30'}`}
            >
              <span className="font-semibold text-amber-950 text-base">{advice.title}</span>
              <ChevronDown className={`w-5 h-5 text-amber-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
            </button>
            
            {openIndex === index && (
              <div className="p-4 pt-1 text-amber-900 leading-relaxed text-sm whitespace-pre-line border-t border-amber-100/50">
                {advice.content}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-white/50 rounded-xl border border-dashed border-amber-300">
        <p className="text-sm text-amber-800 text-center">
          <strong>Un doute technique ?</strong> Posez votre question directement à notre assistant IA ou contactez nos techniciens pour une étude personnalisée.
        </p>
      </div>
    </section>
  );
};

export default ExpertAdvice;
