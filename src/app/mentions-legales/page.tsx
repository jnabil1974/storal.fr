import Link from 'next/link';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
            <p className="text-gray-700 mb-4">
              Le site <strong>storal.fr</strong> est édité par la société <strong>STORAL</strong>, 
              Société par Actions Simplifiée Unipersonnelle (SASU) au capital de 1 500 euros, 
              immatriculé au Registre du Commerce et des Sociétés (RCS) de Paris.
            </p>
            
            <ul className="space-y-2 text-gray-700">
              <li><strong>Siège social :</strong> 58 rue de Monceau CS 48756, 75380 Paris Cedex 08</li>
              <li><strong>Numéro de téléphone :</strong> 01 85 09 34 46</li>
              <li><strong>Email :</strong> <a href="mailto:commandes@storal.fr" className="text-blue-600 hover:underline">commandes@storal.fr</a></li>
              <li><strong>N° TVA Intracommunautaire :</strong> (En attente d'immatriculation)</li>
              <li><strong>Directeur de la publication :</strong> Monsieur Nabil JLAIEL</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <p className="text-gray-700 mb-2">
              Le site est hébergé par la société <strong>OVH SAS</strong>.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Adresse :</strong> 2 rue Kellermann - 59100 Roubaix - France
            </p>
            <p className="text-gray-700">
              <strong>Site web :</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.ovhcloud.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-700">
              L'ensemble de ce site relève de la législation française et internationale sur le droit 
              d'auteur et la propriété intellectuelle. Toute reproduction est interdite sans autorisation 
              préalable de la société STORAL.
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
