import ChatAssistant from '@/components/ChatAssistant';

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Assistant IA Storal
          </h1>
          <p className="text-xl text-gray-600">
            Posez vos questions à notre expert virtuel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Assistant */}
          <div className="lg:col-span-2">
            <ChatAssistant />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">
                💡 À propos de l'assistant
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Conseils personnalisés</li>
                <li>✓ Comparaison de modèles</li>
                <li>✓ Devis précis au centime près</li>
                <li>✓ Validation technique des dimensions (bras, encombrement)</li>
                <li>✓ Aide au choix</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">
                🎯 Votre Devis Instantané
              </h3>
              <p className="text-sm text-gray-700">
                L'assistant calcule votre tarif HT incluant toutes vos options (LED, Lambrequin, Pose). Inutile de changer de page : configurez votre store directement dans le chat.
              </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-2">
                ⚠️ Note importante
              </h3>
              <p className="text-xs text-gray-700">
                Les prix sont basés sur le tarif Pro 2026 officiel.
                Les réponses sont générées par IA et basées sur notre catalogue.
                Pour un devis officiel, contactez notre équipe commerciale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
