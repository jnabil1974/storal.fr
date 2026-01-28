'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function KissimyConfigurator() {
  const { addItem } = useCart();
  const [avancee, setAvancee] = useState(1500);
  const [largeur, setLargeur] = useState(3800);
  const [inclinaison, setInclinaison] = useState(15);
  const [motorisationId, setMotorisationId] = useState<number | null>(null);
  const [emetteurId, setEmetteurId] = useState<number | null>(null);
  const [prixHT, setPrixHT] = useState<string | null>(null);
  const [messageTransport, setMessageTransport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [minLargeur, setMinLargeur] = useState(1835);
  const [maxLargeur, setMaxLargeur] = useState(4830);
  const [minInclinaison, setMinInclinaison] = useState(0);
  const [maxInclinaison, setMaxInclinaison] = useState(60);
  const [inclinaisonUnite, setInclinaisonUnite] = useState('°');
  const [warningLargeur, setWarningLargeur] = useState('');
  const [warningInclinaison, setWarningInclinaison] = useState('');
  const [motorisations, setMotorisations] = useState<any[]>([]);
  const [emetteurs, setEmetteurs] = useState<any[]>([]);

  // Charger les options de motorisation
  useEffect(() => {
    const fetchMotorisations = async () => {
      try {
        const response = await fetch('/api/calcul-prix/options?category=Motorisation');
        const data = await response.json();
        if (data.options) {
          setMotorisations(data.options);
          // Sélectionner automatiquement la première motorisation (Somfy IO)
          if (data.options.length > 0 && motorisationId === null) {
            setMotorisationId(data.options[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement motorisations:', err);
      }
    };
    
    fetchMotorisations();
  }, []);

  // Charger les émetteurs (télécommandes)
  useEffect(() => {
    const fetchEmetteurs = async () => {
      try {
        const response = await fetch('/api/calcul-prix/options?category=Émetteur');
        const data = await response.json();
        if (data.options) {
          setEmetteurs(data.options);
          // Sélectionner automatiquement le premier émetteur
          if (data.options.length > 0 && emetteurId === null) {
            setEmetteurId(data.options[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement émetteurs:', err);
      }
    };
    
    fetchEmetteurs();
  }, []);

  // Récupérer les limites de largeur selon la projection sélectionnée
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await fetch(`/api/calcul-prix/limits?projection=${avancee}`);
        const data = await response.json();
        
        if (data.minWidth && data.maxWidth) {
          setMinLargeur(data.minWidth);
          setMaxLargeur(data.maxWidth);
          
          // Vérifier si la largeur actuelle est hors limites
          if (largeur < data.minWidth || largeur > data.maxWidth) {
            setWarningLargeur(`⚠️ La largeur doit être entre ${data.minWidth} et ${data.maxWidth} mm`);
          } else {
            setWarningLargeur('');
          }
        }

        // Charger les limites d'inclinaison
        if (data.inclinaisonMin !== undefined && data.inclinaisonMax !== undefined) {
          setMinInclinaison(data.inclinaisonMin);
          setMaxInclinaison(data.inclinaisonMax);
          setInclinaisonUnite(data.inclinaisonUnite || '°');
          
          // Vérifier si l'inclinaison actuelle est hors limites
          if (inclinaison < data.inclinaisonMin || inclinaison > data.inclinaisonMax) {
            setWarningInclinaison(`⚠️ L'inclinaison doit être entre ${data.inclinaisonMin} et ${data.inclinaisonMax}${data.inclinaisonUnite || '°'}`);
          } else {
            setWarningInclinaison('');
          }
        }
      } catch (err) {
        console.error('Erreur chargement limites:', err);
      }
    };
    
    fetchLimits();
  }, [avancee]);

  const handleLargeurChange = (value: string) => {
    const newValue = parseInt(value) || 0;
    setLargeur(newValue);
    
    // Afficher un avertissement si hors limites
    if (newValue < minLargeur || newValue > maxLargeur) {
      setWarningLargeur(`⚠️ La largeur doit être entre ${minLargeur} et ${maxLargeur} mm`);
    } else {
      setWarningLargeur('');
    }
  };

  const handleInclinaisonChange = (value: string) => {
    const newValue = parseInt(value) || 0;
    setInclinaison(newValue);
    
    // Afficher un avertissement si hors limites
    if (newValue < minInclinaison || newValue > maxInclinaison) {
      setWarningInclinaison(`⚠️ L'inclinaison doit être entre ${minInclinaison} et ${maxInclinaison}${inclinaisonUnite}`);
    } else {
      setWarningInclinaison('');
    }
  };

  const calculerPrix = async () => {
    // Ne pas calculer si les valeurs sont invalides
    if (largeur < minLargeur || largeur > maxLargeur) {
      setPrixHT(null);
      return;
    }

    if (inclinaison < minInclinaison || inclinaison > maxInclinaison) {
      setPrixHT(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calcul-prix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'store-banne-kissimy',
          largeur: parseInt(largeur.toString()),
          avancee: parseInt(avancee.toString()),
          inclinaison: parseInt(inclinaison.toString()),
          motorisationId: motorisationId,
          emetteurId: emetteurId,
        }),
      });

      const data = await response.json();

      if (data.prixClientHT) {
        setPrixHT(data.prixClientHT);
        setMessageTransport(
          data.message === 'Surtaxe longueur incluse'
            ? '⚠️ Inclus : Forfait transport longueurs > 3.65m'
            : ''
        );
        setError('');
      } else {
        setError(data.error || 'Erreur de calcul');
        setPrixHT(null);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
      setPrixHT(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le prix automatiquement quand les valeurs changent
  useEffect(() => {
    calculerPrix();
  }, [avancee, largeur, inclinaison, motorisationId, emetteurId, minLargeur, maxLargeur, minInclinaison, maxInclinaison]);

  const ajouterAuPanier = () => {
    if (!prixHT) {
      setError('Veuillez configurer votre store avant de l\'ajouter au panier');
      return;
    }

    const motorisationNom = motorisations.find(m => m.id === motorisationId)?.name || 'Sans motorisation';
    const emetteurNom = emetteurs.find(e => e.id === emetteurId)?.name || 'Sans émetteur';

    addItem({
      productId: 'store-banne-kissimy',
      productType: 'store-banne' as any,
      productName: 'Store Banne KISSIMY',
      basePrice: parseFloat(prixHT),
      configuration: {
        largeur: largeur,
        projection: avancee,
        inclinaison: inclinaison,
        motorisation: motorisationNom,
        emetteur: emetteurNom,
        // Format texte pour affichage
        largeurDisplay: `${largeur}mm`,
        projectionDisplay: `${avancee}mm`,
        inclinaisonDisplay: `${inclinaison}°`,
      } as any,
      quantity: 1,
      pricePerUnit: parseFloat(prixHT),
    }).then(() => {
      alert('✅ Produit ajouté au panier !');
    }).catch((err) => {
      setError('Erreur lors de l\'ajout au panier: ' + err.message);
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Configurateur KISSIMY</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avancée (Projection)
          </label>
          <select
            value={avancee}
            onChange={(e) => setAvancee(parseInt(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="1500">1.50 m</option>
            <option value="2000">2.00 m</option>
            <option value="2500">2.50 m</option>
            <option value="3000">3.00 m</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Largeur (en mm)
          </label>
          <input
            type="number"
            value={largeur}
            onChange={(e) => handleLargeurChange(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded-md ${
              warningLargeur ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
            }`}
          />
          <p className={`text-xs mt-1 ${warningLargeur ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
            {warningLargeur || `Entre ${minLargeur} et ${maxLargeur} mm`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Inclinaison (réglage usine)
          </label>
          <input
            type="number"
            value={inclinaison}
            onChange={(e) => handleInclinaisonChange(e.target.value)}
            className={`mt-1 block w-full p-2 border rounded-md ${
              warningInclinaison ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
            }`}
          />
          <p className={`text-xs mt-1 ${warningInclinaison ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
            {warningInclinaison || `Entre ${minInclinaison} et ${maxInclinaison}${inclinaisonUnite}`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Motorisation (optionnelle)
          </label>
          <div className="flex gap-3 items-start">
            <select
              value={motorisationId || ''}
              onChange={(e) => setMotorisationId(e.target.value ? parseInt(e.target.value) : null)}
              className="flex-1 mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              {motorisations.map((motor) => (
                <option key={motor.id} value={motor.id}>
                  {motor.name} (+{motor.prixVenteHT}€ HT)
                </option>
              ))}
              <option value="">Sans motorisation</option>
            </select>
            {motorisationId && motorisations.find(m => m.id === motorisationId)?.imageUrl && (
              <div className="mt-1 w-20 h-20 border border-gray-300 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={motorisations.find(m => m.id === motorisationId)?.imageUrl}
                  alt="Motorisation"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choisissez une motorisation pour votre store
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Télécommande (émetteur)
          </label>
          <div className="flex gap-3 items-start">
            <select
              value={emetteurId || ''}
              onChange={(e) => setEmetteurId(e.target.value ? parseInt(e.target.value) : null)}
              className="flex-1 mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              {emetteurs.map((emetteur) => (
                <option key={emetteur.id} value={emetteur.id}>
                  {emetteur.name} (+{emetteur.prixVenteHT}€ HT)
                </option>
              ))}
              <option value="">Sans télécommande</option>
            </select>
            {emetteurId && emetteurs.find(e => e.id === emetteurId)?.imageUrl && (
              <div className="mt-1 w-20 h-20 border border-gray-300 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={emetteurs.find(e => e.id === emetteurId)?.imageUrl}
                  alt="Télécommande"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choisissez une télécommande pour contrôler votre store
          </p>
        </div>

        {/* Prix et messages */}
        {prixHT && !error && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Prix HT estimé :</p>
            <p className="text-4xl font-bold text-blue-900 mb-2">{prixHT} €</p>
            {messageTransport && (
              <p className="text-xs text-orange-600 font-semibold">
                {messageTransport}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={ajouterAuPanier}
          disabled={!prixHT || !!error}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
        >
          {!prixHT || error ? 'Configurer votre store' : `Ajouter au panier - ${prixHT}€ HT`}
        </button>
      </div>
    </div>
  );
}
