'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import ToileSelector from '@/components/ToileSelector';
import MatestColorSelector from '@/components/MatestColorSelector';

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
  const [toileTypeId, setToileTypeId] = useState<number | null>(null);
  const [toileColorId, setToileColorId] = useState<number | null>(null);
  const [toilePriceHT, setToilePriceHT] = useState<number>(0);
  const [matestColorId, setMatestColorId] = useState<number | null>(null);
  const [matestRalCode, setMatestRalCode] = useState<string>('');
  const [matestColorName, setMatestColorName] = useState<string>('');
  const [matestFinish, setMatestFinish] = useState<string>('');
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

  // Calculer la surface pour la toile
  const surfaceM2 = (avancee * largeur) / 1000000;

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
          toileTypeId: toileTypeId,
        }),
      });

      const data = await response.json();

      if (data.prixClientHT) {
        // Ajouter le prix de la toile au prix calculé
        const prixBase = parseFloat(data.prixClientHT);
        const prixTotal = prixBase + toilePriceHT;
        setPrixHT(prixTotal.toFixed(2));
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
  }, [avancee, largeur, inclinaison, motorisationId, emetteurId, toileTypeId, toilePriceHT, minLargeur, maxLargeur, minInclinaison, maxInclinaison]);

  const ajouterAuPanier = () => {
    if (!prixHT) {
      setError('Veuillez configurer votre store avant de l\'ajouter au panier');
      return;
    }

    const motorisationNom = motorisations.find(m => m.id === motorisationId)?.name || 'Sans motorisation';
    const emetteurNom = emetteurs.find(e => e.id === emetteurId)?.name || 'Sans émetteur';
    const toileNom = toileTypeId ? `Toile ID ${toileTypeId}` : 'Sans toile';
    const couleurCoffreNom = matestColorId 
      ? `${matestRalCode ? `RAL ${matestRalCode}` : ''} ${matestColorName}`.trim()
      : 'Non spécifiée';

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
        toileColorId: toileColorId,
        couleurCoffre: couleurCoffreNom,
        couleurCoffreId: matestColorId,
        couleurCoffreRal: matestRalCode,
        couleurCoffreFinish: matestFinish,
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
      <div className="p-6 md:p-8 pb-28">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Configurateur de Prix</h2>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 border-b-4 border-rose-700 inline-block pb-2">{resolvedName}</h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-slate-600 mb-1">Prix TTC</p>
              <p className="text-2xl md:text-3xl font-bold text-rose-800">{prixHT ? `${(parseFloat(prixHT) * 1.2).toFixed(2)}€` : '...'}</p>
            </div>
          </div>
          {resolvedDescription && (
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              {resolvedDescription}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-[1.6fr_1fr]">
          {!hideCarousel && (carouselImages.length > 0 || product?.bras || product?.img_dim_coffre || product?.img_bras_led) && (
            <div className="rounded-xl border border-slate-200 p-5 shadow-sm bg-white">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">📋 Fiche produit</h2>
              <div className="space-y-4">
                {carouselImages.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-2">Images</p>
                    <div className="relative w-full rounded-lg border border-slate-200 bg-slate-50 overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
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
                                className={`h-2 w-2 rounded-full ${idx === carouselIndex ? 'bg-rose-700' : 'bg-white/80'}`}
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
                    <p className="text-xs font-semibold text-slate-700">Infos complémentaires</p>
                    {product?.img_dim_coffre && (
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Dimensions coffre</p>
                        <img
                          src={product.img_dim_coffre}
                          alt="Schéma coffre"
                          className="w-full rounded object-contain border border-slate-200 bg-slate-50"
                        />
                      </div>
                    )}
                    {product?.img_bras_led && (
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Bras LED</p>
                        <img
                          src={product.img_bras_led}
                          alt="Bras LED"
                          className="w-full rounded object-contain border border-slate-200 bg-slate-50"
                        />
                      </div>
                    )}
                    {product?.bras && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-rose-900 mb-1">Type de bras</p>
                        <p className="text-base font-medium text-rose-950">{product.bras}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

<section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-rose-700 text-white rounded-full text-sm font-bold">📏</span>
                Dimensions
              </h2>
              
              {product?.img_larg_ht && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">Schéma Largeur / Hauteur</p>
                  <img
                    src={product.img_larg_ht}
                    alt="Schéma largeur hauteur"
                    className="h-32 w-full rounded object-contain border border-slate-200 bg-slate-50"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Avancée (Projection)
                  </label>
                  <select
                    value={avancee}
                    onChange={(e) => setAvancee(parseInt(e.target.value))}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-700"
                  >
                    <option value="1500">1.50 m</option>
                    <option value="2000">2.00 m</option>
                    <option value="2500">2.50 m</option>
                    <option value="3000">3.00 m</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Largeur (en mm)</label>
                  <input
                    type="number"
                    value={largeur}
                    onChange={(e) => handleLargeurChange(e.target.value)}
                    className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-700 ${
                      warningLargeur ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${warningLargeur ? 'text-rose-800 font-semibold' : 'text-slate-500'}`}>
                    {warningLargeur || `Entre ${minLargeur} et ${maxLargeur} mm`}
                  </p>
                </div>
              </div>

              {product?.img_tol_dim && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">Schéma Dimensions toile</p>
                  <img
                    src={product.img_tol_dim}
                    alt="Schéma toile"
                    className="h-32 w-full rounded object-contain border border-slate-200 bg-slate-50"
                  />
                </div>
              )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Inclinaison (réglage usine)
              </label>
              <input
                type="number"
                value={inclinaison}
                onChange={(e) => handleInclinaisonChange(e.target.value)}
                className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-700 ${
                  warningInclinaison ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              <p className={`text-xs mt-1 ${warningInclinaison ? 'text-rose-800 font-semibold' : 'text-slate-500'}`}>
                {warningInclinaison || `Entre ${minInclinaison} et ${maxInclinaison}${inclinaisonUnite}`}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">

            <section className="rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">⚙️ Options</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Motorisation (optionnelle)
                  </label>
                  <div className="flex gap-3 items-start">
                    <select
                      value={motorisationId || ''}
                      onChange={(e) => setMotorisationId(e.target.value ? parseInt(e.target.value) : null)}
                      className="flex-1 mt-1 block w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-700"
                    >
                      {motorisations.map((motor) => (
                        <option key={motor.id} value={motor.id}>
                          {motor.name} (+{motor.prixVenteHT}€ HT)
                        </option>
                      ))}
                      <option value="">Sans motorisation</option>
                    </select>
                    {motorisationId && motorisations.find(m => m.id === motorisationId)?.imageUrl && (
                      <div className="mt-1 w-20 h-20 border border-slate-200 rounded-md overflow-hidden flex-shrink-0 bg-slate-50">
                        <img
                          src={motorisations.find(m => m.id === motorisationId)?.imageUrl}
                          alt="Motorisation"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Choisissez une motorisation pour votre store
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Télécommande (émetteur)
                  </label>
                  <div className="flex gap-3 items-start">
                    <select
                      value={emetteurId || ''}
                      onChange={(e) => setEmetteurId(e.target.value ? parseInt(e.target.value) : null)}
                      className="flex-1 mt-1 block w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-700"
                    >
                      {emetteurs.map((emetteur) => (
                        <option key={emetteur.id} value={emetteur.id}>
                          {emetteur.name} (+{emetteur.prixVenteHT}€ HT)
                        </option>
                      ))}
                      <option value="">Sans télécommande</option>
                    </select>
                    {emetteurId && emetteurs.find(e => e.id === emetteurId)?.imageUrl && (
                      <div className="mt-1 w-20 h-20 border border-slate-200 rounded-md overflow-hidden flex-shrink-0 bg-slate-50">
                        <img
                          src={emetteurs.find(e => e.id === emetteurId)?.imageUrl}
                          alt="Télécommande"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Choisissez une télécommande pour contrôler votre store
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">🧵 Toile</h2>
              <ToileSelector
                productSlug={resolvedSlug}
                surfaceM2={surfaceM2}
                onToileSelect={(typeId, colorId, priceHT) => {
                  setToileTypeId(typeId);
                  setToileColorId(colorId);
                  setToilePriceHT(priceHT);
                }}
                selectedToileTypeId={toileTypeId}
                selectedToileColorId={toileColorId}
              />
            </section>

            <section className="rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">🎨 Couleur du coffre</h2>
              <MatestColorSelector
                productSlug={resolvedSlug}
                onColorSelect={(colorId, ralCode, name, finish) => {
                  setMatestColorId(colorId);
                  setMatestRalCode(ralCode);
                  setMatestColorName(name);
                  setMatestFinish(finish);
                }}
              />
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-xl border border-slate-200 p-6 shadow-md bg-gradient-to-br from-rose-50 to-white">
              <h3 className="text-base font-bold uppercase tracking-wide text-rose-900 mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-rose-700 text-white rounded-full text-sm font-bold">📋</span>
                Votre Configuration
              </h3>
              <div className="mt-3 space-y-3 text-sm text-slate-700 border-t border-rose-200 pt-4">
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
                  <span className="font-medium text-right">
                    {toileTypeId ? `Type ${toileTypeId}` : 'Non sélectionnée'}
                  </span>
                </div>
                {toilePriceHT > 0 && (
                  <div className="flex justify-between text-rose-800">
                    <span>Prix toile</span>
                    <span className="font-medium">+{toilePriceHT.toFixed(2)}€</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Couleur coffre</span>
                  <span className="font-medium text-right">
                    {matestColorId ? `${matestRalCode ? `RAL ${matestRalCode}` : matestColorName}` : 'Non sélectionnée'}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-rose-200 pt-4">
                <p className="text-xs text-slate-600 mb-1">Prix HT estimé</p>
                {loading && (
                  <p className="text-sm text-rose-900">Calcul en cours...</p>
                )}
                {prixHT && !error && (
                  <p className="text-3xl font-bold text-rose-800">{prixHT} €</p>
                )}
                {!prixHT && !loading && !error && (
                  <p className="text-sm text-slate-500">Configurez votre store pour obtenir le prix.</p>
                )}
                {messageTransport && (
                  <p className="text-xs text-rose-800 font-semibold mt-2">
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

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-gradient-to-r from-white to-slate-50/95 backdrop-blur shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="flex-1">
            <p className="text-xs text-slate-600 font-medium">Prix HT estimé</p>
            <div className="flex items-center gap-3 mt-1">
              {loading && <span className="text-sm text-rose-800 animate-pulse">Calcul en cours...</span>}
              {prixHT && !error && (
                <span className="text-3xl font-bold text-rose-800">{prixHT} €</span>
              )}
              {!prixHT && !loading && !error && (
                <span className="text-sm text-slate-500">Configurez votre store</span>
              )}
            </div>
            {messageTransport && (
              <p className="text-xs text-rose-800 font-semibold mt-2">
                {messageTransport}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>
            )}
          </div>

          <button
            onClick={ajouterAuPanier}
            disabled={!prixHT || !!error}
            className="w-full sm:w-auto bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg"
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
