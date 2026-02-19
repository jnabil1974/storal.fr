'use client';

import { REGIONS_COUVERTES, ZONES_INTERVENTION } from '@/lib/intervention-zones';
import { MapPin, Clock, CheckCircle } from 'lucide-react';

export default function ZonesInterventionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos zones d'intervention
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez si nous intervenons dans votre secteur pour l'installation professionnelle de vos stores
          </p>
        </div>

        {/* Régions couvertes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {REGIONS_COUVERTES.map((region) => (
            <div
              key={region.nom}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start mb-4">
                <MapPin className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {region.nom}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Délai : {region.delai}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {region.departements.map((dept) => (
                  <span
                    key={dept}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {dept} - {ZONES_INTERVENTION[dept]?.nom}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Liste détaillée */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Liste complète des départements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ZONES_INTERVENTION).map(([code, zone]) => (
              <div
                key={code}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {code} - {zone.nom}
                  </p>
                  <p className="text-sm text-gray-600">
                    Délai : {zone.delai}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🎯 Votre département n'est pas listé ?
            </h3>
            <p className="text-blue-800 mb-4">
              Contactez-nous ! Nous étudions régulièrement l'extension de nos zones d'intervention selon la demande.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nous contacter
            </a>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              ✓ Pose professionnelle incluse
            </h3>
            <p className="text-green-800">
              Tous nos stores sont installés par des professionnels qualifiés avec garantie de pose. Délais indicatifs selon disponibilité.
            </p>
          </div>
        </div>

        {/* Vérificateur rapide */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Vérifiez votre éligibilité
          </h3>
          <p className="mb-6 text-blue-100">
            Saisissez votre code postal dans le formulaire de contact pour une vérification instantanée
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Accéder au formulaire
          </a>
        </div>
      </div>
    </div>
  );
}
