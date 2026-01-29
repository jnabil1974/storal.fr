import Link from 'next/link';
import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  // Le slug 'cgv' est pré-configuré dans la base de données (voir SEO_IMPLEMENTATION_COMPLETE.md)
  const seo = await getSEOMetadata('cgv');

  const defaultTitle = 'Conditions Générales de Vente - Storal';
  const defaultDescription = 'Consultez les conditions générales de vente de Storal pour les produits sur-mesure et standards.';

  return {
    title: seo?.title || defaultTitle,
    description: seo?.description || defaultDescription,
    keywords: seo?.keywords || ['cgv', 'conditions générales de vente', 'storal'],
    openGraph: {
      title: seo?.og_title || seo?.title || defaultTitle,
      description: seo?.og_description || seo?.description || defaultDescription,
    },
    robots: seo?.robots || 'index, follow',
  };
}
export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales de Vente (CGV)</h1>
          <p className="text-gray-600 italic mb-8">Spécial Sur-Mesure</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 1 - Objet</h2>
            <p className="text-gray-700">
              Les présentes conditions régissent les ventes par la société <strong>STORAL</strong> (ci-après "le Vendeur") 
              de menuiseries, stores bannes, équipements de protection solaire et solutions d'accessibilité à destination 
              de tout acheteur (ci-après "le Client").
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 2 - Prix</h2>
            <p className="text-gray-700">
              Les prix sont indiqués en euros toutes taxes comprises (TTC). La livraison est incluse dans le prix affiché 
              pour la France métropolitaine, hors zones difficiles d'accès (îles, haute montagne) qui peuvent faire l'objet 
              d'un devis spécifique.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 3 - Commandes et Validation</h2>
            <p className="text-gray-700">
              Les informations contractuelles sont présentées en langue française. La validation de la commande vaut 
              acceptation des présentes CGV. Le Client est responsable de l'exactitude des données fournies (adresse, email, 
              téléphone) et des choix techniques (dimensions, coloris).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 4 - Paiement</h2>
            <p className="text-gray-700">
              Le règlement s'effectue intégralement à la commande par carte bancaire via la plateforme sécurisée Stripe. 
              Le débit est immédiat. En cas de refus bancaire, la commande est automatiquement annulée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 5 - Absence de Droit de Rétractation (Sur-Mesure)</h2>
            <p className="text-gray-700 mb-4">
              Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux 
              contrats de fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés. 
              Par conséquent, les stores bannes fabriqués sur commande selon les dimensions et coloris choisis par le Client 
              ne sont ni repris, ni échangés, ni remboursés.
            </p>
            <p className="text-gray-700">
              Pour les produits standards (non configurables) et accessoires, le client dispose d'un délai légal de 14 jours. 
              Les frais de retour restent à la charge du Client.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 6 - Livraison</h2>
            <p className="text-gray-700 mb-4">
              La livraison est effectuée par transporteur spécialisé. La livraison s'entend "en limite de propriété" 
              (au pied du camion). Le transporteur n'est pas tenu de monter les produits à l'étage ou d'entrer dans le domicile.
            </p>
            <div className="bg-red-50 p-4 rounded border border-red-200 mb-4">
              <p className="text-gray-800 font-semibold mb-2">Important :</p>
              <p className="text-gray-700">
                Le Client doit vérifier l'état de la marchandise en présence du livreur. Toute anomalie (carton ouvert, 
                store plié) doit impérativement être signalée par des réserves manuscrites sur le bon de livraison 
                (ex: "Store refusé car tordu"). Sans ces réserves, aucun recours transport n'est possible.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 7 - Garanties</h2>
            <p className="text-gray-700 mb-4">
              Les produits bénéficient de la garantie légale de conformité (2 ans) et de la garantie contre les vices cachés. 
            </p>
            <p className="text-gray-700">
              Certaines pièces (armatures, moteurs) peuvent bénéficier d'une garantie commerciale étendue constructeur 
              (5 ans), précisée sur la fiche produit. Cette garantie couvre le remplacement des pièces défectueuses, 
              hors main d'œuvre.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 8 - Médiation</h2>
            <p className="text-gray-700 mb-4">
              En cas de litige, le Client s'adressera en priorité au service client de STORAL pour obtenir une solution amiable. 
              À défaut, le Client peut recourir à la plateforme européenne de Règlement en Ligne des Litiges (RLL) :
            </p>
            <p className="text-gray-700">
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
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
