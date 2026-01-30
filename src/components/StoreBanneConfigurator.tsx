'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

type StoreBanneProductData = {
  id?: string | number;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  img_store?: string[] | null;
  image_store_small?: string | null;
  img_larg_ht?: string | null;
  img_tol_dim?: string | null;
  img_dim_coffre?: string | null;
  bras?: string | null;
  img_bras_led?: string | null;
};

type StoreBanneConfiguratorProps = {
  product?: StoreBanneProductData;
  productSlug?: string;
  productId?: string | number;
  productName?: string;
  basePrice?: number;
  hideCarousel?: boolean;
};

export default function StoreBanneConfigurator({
  product,
  productSlug,
  productId,
  productName,
  hideCarousel = false,
}: StoreBanneConfiguratorProps) {
  const { addItem } = useCart();
  const resolvedSlug = product?.slug || productSlug || 'store-banne';
  const resolvedName = product?.name || productName || 'Store Banne';
  const resolvedDescription = product?.description || '';
  const resolvedProductId = typeof product?.id !== 'undefined' ? product?.id : productId;
  const numericProductId = typeof resolvedProductId === 'number'
    ? resolvedProductId
    : parseInt(String(resolvedProductId || ''), 10) || 1;
  const [avancee, setAvancee] = useState(1500);
  const [largeur, setLargeur] = useState(3800);
  const [inclinaison, setInclinaison] = useState(15);
  const [motorisationId, setMotorisationId] = useState<number | null>(null);
  const [emetteurId, setEmetteurId] = useState<number | null>(null);
  const [toileId, setToileId] = useState<number | null>(null);
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
  const [toiles, setToiles] = useState<any[]>([]);
  const [toileColors, setToileColors] = useState<any[]>([]);
  const [selectedToileColorId, setSelectedToileColorId] = useState<number | null>(null);

  // Charger les options de motorisation
  useEffect(() => {
    const fetchMotorisations = async () => {
      try {
        const response = await fetch(`/api/calcul-prix/options?category=Motorisation&productId=${numericProductId}`);
        if (!response.ok) {
          console.error('Erreur API motorisation:', response.status);
          return;
        }
        const data = await response.json();
        if (data.options && Array.isArray(data.options)) {
          setMotorisations(data.options);
          // Sélectionner automatiquement la première motorisation si aucune n'est sélectionnée
          if (data.options.length > 0) {
            setMotorisationId(data.options[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement motorisations:', err);
      }
    };
    
    fetchMotorisations();
  }, [numericProductId]);

  // Charger les émetteurs (télécommandes)
  useEffect(() => {
    const fetchEmetteurs = async () => {
      try {
        const category = encodeURIComponent('Émetteur');
        const response = await fetch(`/api/calcul-prix/options?category=${category}&productId=${numericProductId}`);
        if (!response.ok) {
          console.error('Erreur API émetteurs:', response.status);
          return;
        }
        const data = await response.json();
        if (data.options && Array.isArray(data.options)) {
          setEmetteurs(data.options);
          // Sélectionner automatiquement le premier émetteur si aucun n'est sélectionné
          if (data.options.length > 0) {
            setEmetteurId(data.options[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement émetteurs:', err);
      }
    };
    
    fetchEmetteurs();
  }, [numericProductId]);

  // Charger les toiles
  useEffect(() => {
    const fetchToiles = async () => {
      try {
        const response = await fetch(`/api/calcul-prix/options?category=Toile&productId=${numericProductId}`);
        if (!response.ok) {
          console.error('Erreur API toiles:', response.status);
          return;
        }
        const data = await response.json();
        if (data.options && Array.isArray(data.options)) {
          setToiles(data.options);
          // Sélectionner automatiquement la première toile si aucune n'est sélectionnée
          if (data.options.length > 0) {
            setToileId(data.options[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement toiles:', err);
      }
    };
    
    fetchToiles();
  }, [numericProductId]);

  // Charger les couleurs de toile quand une toile est sélectionnée
  useEffect(() => {
    if (!toileId) {
      setToileColors([]);
      setSelectedToileColorId(null);
      return;
    }

    const fetchToileColors = async () => {
      try {
        const response = await fetch(`/api/calcul-prix/toile-colors?optionId=${toileId}`);
        if (!response.ok) {
          console.error('Erreur API couleurs de toile:', response.status);
          setToileColors([]);
          return;
        }
        const data = await response.json();
        if (data.colors && Array.isArray(data.colors)) {
          setToileColors(data.colors);
          // Sélectionner automatiquement la première couleur
          if (data.colors.length > 0) {
            setSelectedToileColorId(data.colors[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur chargement couleurs de toile:', err);
        setToileColors([]);
      }
    };

    fetchToileColors();
  }, [toileId]);

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
          slug: resolvedSlug,
          largeur: parseInt(largeur.toString()),
          avancee: parseInt(avancee.toString()),
          inclinaison: parseInt(inclinaison.toString()),
          motorisationId: motorisationId,
          emetteurId: emetteurId,
          toileId: toileId,
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
  }, [avancee, largeur, inclinaison, motorisationId, emetteurId, toileId, minLargeur, maxLargeur, minInclinaison, maxInclinaison]);

  const ajouterAuPanier = () => {
    if (!prixHT) {
      setError('Veuillez configurer votre store avant de l\'ajouter au panier');
      return;
    }

    const motorisationNom = motorisations.find(m => m.id === motorisationId)?.name || 'Sans motorisation';
    const emetteurNom = emetteurs.find(e => e.id === emetteurId)?.name || 'Sans émetteur';
    const toileNom = toiles.find(t => t.id === toileId)?.name || 'Sans toile';

    addItem({
      productId: resolvedSlug,
      productType: 'store-banne' as any,
      productName: resolvedName,
      basePrice: parseFloat(prixHT),
      configuration: {
        largeur: largeur,
        projection: avancee,
        inclinaison: inclinaison,
        motorisation: motorisationNom,
        emetteur: emetteurNom,
        toile: toileNom,
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

  const motorisationNom = motorisations.find(m => m.id === motorisationId)?.name || 'Sans motorisation';
  const emetteurNom = emetteurs.find(e => e.id === emetteurId)?.name || 'Sans émetteur';
  const toileNom = toiles.find(t => t.id === toileId)?.name || 'Sans toile';
  const toileColorNom = toileColors.find(c => c.id === selectedToileColorId)?.color_name || 'Couleur standard';
  const carouselImages = (product?.img_store || []).filter(Boolean);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    setCarouselIndex(0);
  }, [carouselImages.length]);

  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/95 backdrop-blur border border-gray-200 p-6 md:p-8 rounded-2xl shadow-xl pb-28">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{resolvedName}</h1>
            <p className="text-base md:text-lg font-semibold text-blue-700 whitespace-nowrap">Configurer votre store</p>
          </div>
          {resolvedDescription && (
            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              {resolvedDescription}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-[1.6fr_1fr]">
          {!hideCarousel && (carouselImages.length > 0 || product?.bras || product?.img_dim_coffre || product?.img_bras_led) && (
            <div className="rounded-xl border border-gray-200 p-5 shadow-sm bg-white">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Fiche produit</h2>
              <div className="space-y-4">
                {carouselImages.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Images</p>
                    <div className="relative w-full rounded-lg border border-gray-200 bg-gray-50 overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                      <button
                        type="button"
                        onClick={() => setZoomImage(carouselImages[carouselIndex])}
                        className="w-full h-full"
                        aria-label="Agrandir l'image"
                      >
                        <img
                          src={carouselImages[carouselIndex]}
                          alt={`${resolvedName} ${carouselIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      {carouselImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-1 text-sm shadow hover:bg-white"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselImages.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-1 text-sm shadow hover:bg-white"
                          >
                            →
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {carouselImages.map((_, idx) => (
                              <span
                                key={`dot-${idx}`}
                                className={`h-2 w-2 rounded-full ${idx === carouselIndex ? 'bg-blue-600' : 'bg-white/80'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {(product?.bras || product?.img_dim_coffre || product?.img_bras_led) && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-700">Infos complémentaires</p>
                    {product?.img_dim_coffre && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Dimensions coffre</p>
                        <img
                          src={product.img_dim_coffre}
                          alt="Schéma coffre"
                          className="w-full rounded object-contain border border-gray-200 bg-gray-50"
                        />
                      </div>
                    )}
                    {product?.img_bras_led && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Bras LED</p>
                        <img
                          src={product.img_bras_led}
                          alt="Bras LED"
                          className="w-full rounded object-contain border border-gray-200 bg-gray-50"
                        />
                      </div>
                    )}
                    {product?.bras && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Type de bras</p>
                        <p className="text-base font-medium text-blue-900">{product.bras}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <section className="rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Dimensions</h2>
              
              {product?.img_larg_ht && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Schéma Largeur / Hauteur</p>
                  <img
                    src={product.img_larg_ht}
                    alt="Schéma largeur hauteur"
                    className="h-32 w-full rounded object-contain border border-gray-200 bg-gray-50"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Avancée (Projection)
                  </label>
                  <select
                    value={avancee}
                    onChange={(e) => setAvancee(parseInt(e.target.value))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      warningLargeur ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${warningLargeur ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                    {warningLargeur || `Entre ${minLargeur} et ${maxLargeur} mm`}
                  </p>
                </div>
              </div>

              {product?.img_tol_dim && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Schéma Dimensions toile</p>
                  <img
                    src={product.img_tol_dim}
                    alt="Schéma toile"
                    className="h-32 w-full rounded object-contain border border-gray-200 bg-gray-50"
                  />
                </div>
              )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Inclinaison (réglage usine)
              </label>
              <input
                type="number"
                value={inclinaison}
                onChange={(e) => handleInclinaisonChange(e.target.value)}
                className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  warningInclinaison ? 'border-orange-400 bg-orange-50' : 'border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${warningInclinaison ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                {warningInclinaison || `Entre ${minInclinaison} et ${maxInclinaison}${inclinaisonUnite}`}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">

            <section className="rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Options</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Motorisation (optionnelle)
                  </label>
                  <div className="flex gap-3 items-start">
                    <select
                      value={motorisationId || ''}
                      onChange={(e) => setMotorisationId(e.target.value ? parseInt(e.target.value) : null)}
                      className="flex-1 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {motorisations.map((motor) => (
                        <option key={motor.id} value={motor.id}>
                          {motor.name} (+{motor.prixVenteHT}€ HT)
                        </option>
                      ))}
                      <option value="">Sans motorisation</option>
                    </select>
                    {motorisationId && motorisations.find(m => m.id === motorisationId)?.imageUrl && (
                      <div className="mt-1 w-20 h-20 border border-gray-200 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
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
                      className="flex-1 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {emetteurs.map((emetteur) => (
                        <option key={emetteur.id} value={emetteur.id}>
                          {emetteur.name} (+{emetteur.prixVenteHT}€ HT)
                        </option>
                      ))}
                      <option value="">Sans télécommande</option>
                    </select>
                    {emetteurId && emetteurs.find(e => e.id === emetteurId)?.imageUrl && (
                      <div className="mt-1 w-20 h-20 border border-gray-200 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
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
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Toile</h2>
              <div className="flex gap-3 items-start">
                <select
                  value={toileId || ''}
                  onChange={(e) => setToileId(e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {toiles.map((toile) => (
                    <option key={toile.id} value={toile.id}>
                      {toile.name} (+{toile.prixVenteHT}€/m² HT)
                    </option>
                  ))}
                </select>
                {toileId && toiles.find(t => t.id === toileId)?.imageUrl && (
                  <div className="mt-1 w-20 h-20 border border-gray-200 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                    <img
                      src={toiles.find(t => t.id === toileId)?.imageUrl}
                      alt="Toile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Prix au m² - Surface calculée: {((avancee * largeur) / 1000000).toFixed(2)} m²
              </p>

              {toileColors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Couleur de toile
                  </label>
                  <div className="mt-2 space-y-2">
                    {toileColors.map((color) => (
                      <label key={color.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-blue-50">
                        <input
                          type="radio"
                          name="toileColor"
                          value={color.id}
                          checked={selectedToileColorId === color.id}
                          onChange={(e) => setSelectedToileColorId(parseInt(e.target.value))}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          {color.color_hex && (
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: color.color_hex }}
                              title={color.color_name}
                            />
                          )}
                          <span className="text-sm">
                            {color.color_name}
                            {color.price_adjustment > 0 && (
                              <span className="text-blue-600 font-semibold"> +{color.price_adjustment.toFixed(2)}€</span>
                            )}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-xl border border-gray-200 p-5 shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Résumé</p>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Avancée</span>
                  <span className="font-medium">{(avancee / 1000).toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Largeur</span>
                  <span className="font-medium">{largeur} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Inclinaison</span>
                  <span className="font-medium">{inclinaison}{inclinaisonUnite}</span>
                </div>
                <div className="flex justify-between">
                  <span>Motorisation</span>
                  <span className="font-medium text-right">{motorisationNom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Émetteur</span>
                  <span className="font-medium text-right">{emetteurNom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Toile</span>
                  <span className="font-medium text-right">{toileNom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Couleur</span>
                  <span className="font-medium text-right">{toileColorNom}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-blue-200 pt-4">
                <p className="text-xs text-gray-600 mb-1">Prix HT estimé</p>
                {loading && (
                  <p className="text-sm text-blue-700">Calcul en cours...</p>
                )}
                {prixHT && !error && (
                  <p className="text-3xl font-bold text-blue-900">{prixHT} €</p>
                )}
                {!prixHT && !loading && !error && (
                  <p className="text-sm text-gray-500">Configurez votre store pour obtenir le prix.</p>
                )}
                {messageTransport && (
                  <p className="text-xs text-orange-600 font-semibold mt-2">
                    {messageTransport}
                  </p>
                )}
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div>
            <p className="text-xs text-gray-500">Prix HT estimé</p>
            <div className="flex items-center gap-3">
              {loading && <span className="text-sm text-blue-700">Calcul en cours...</span>}
              {prixHT && !error && (
                <span className="text-2xl font-bold text-blue-900">{prixHT} €</span>
              )}
              {!prixHT && !loading && !error && (
                <span className="text-sm text-gray-500">Configurez votre store</span>
              )}
            </div>
            {messageTransport && (
              <p className="text-xs text-orange-600 font-semibold mt-1">
                {messageTransport}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </div>

          <button
            onClick={ajouterAuPanier}
            disabled={!prixHT || !!error}
            className="w-full sm:w-auto bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
          >
            {!prixHT || error ? 'Configurer votre store' : `Ajouter au panier - ${prixHT}€ HT`}
          </button>
        </div>
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              type="button"
              className="absolute -top-10 right-0 text-white text-sm"
              onClick={() => setZoomImage(null)}
            >
              Fermer ✕
            </button>
            <img
              src={zoomImage}
              alt="Aperçu"
              className="w-full max-h-[80vh] object-contain bg-white rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
