import Link from 'next/link';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité (RGPD)</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsable du traitement</h2>
            <p className="text-gray-700">
              Société <strong>STORAL</strong><br />
              58 rue de Monceau CS 48756<br />
              75380 Paris Cedex 08
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Données collectées</h2>
            <p className="text-gray-700 mb-4">
              Dans le cadre de l'utilisation du site storal.fr, nous collectons :
            </p>
            
            <ul className="space-y-3 text-gray-700 ml-4">
              <li>
                <strong>Identité :</strong> Nom, prénom, adresse, téléphone (pour la livraison).
              </li>
              <li>
                <strong>Contact :</strong> Email (pour le suivi de commande et la création de compte).
              </li>
              <li>
                <strong>Connexion :</strong> Adresse IP, logs de connexion (sécurité).
              </li>
            </ul>

            <p className="text-gray-700 mt-4 bg-blue-50 p-4 rounded border border-blue-200">
              Les données bancaires sont traitées exclusivement par notre prestataire <strong>Stripe</strong> 
              et ne sont jamais stockées sur nos serveurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finalité des données</h2>
            <p className="text-gray-700">
              Vos données sont nécessaires pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3 ml-2">
              <li>Expédier votre commande</li>
              <li>Vous envoyer les notifications de suivi</li>
              <li>Établir la facture</li>
              <li>Assurer le service après-vente</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Partage des données</h2>
            <p className="text-gray-700 mb-4">
              Nous ne vendons pas vos données. Elles sont transmises uniquement :
            </p>
            
            <ul className="space-y-3 text-gray-700 ml-4">
              <li>
                <strong>À nos fournisseurs et transporteurs</strong> (pour la livraison).
              </li>
              <li>
                <strong>À notre hébergeur OVH</strong> (stockage sécurisé en France/UE).
              </li>
              <li>
                <strong>À notre prestataire d'emailing Resend</strong> (notifications).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos droits</h2>
            <p className="text-gray-700 mb-4">
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression 
              de vos données.
            </p>
            <p className="text-gray-700 bg-green-50 p-4 rounded border border-green-200">
              Pour l'exercer, envoyez un email à <a href="mailto:commandes@storal.fr" className="text-blue-600 hover:underline font-semibold">commandes@storal.fr</a>
            </p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
