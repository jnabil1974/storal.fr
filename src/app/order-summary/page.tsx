'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { STORE_MODELS, FRAME_COLORS, FABRICS } from '@/lib/catalog-data';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface Cart {
  modelId: string | null;
  modelName?: string;
  colorId: string | null;
  fabricId: string | null;
  width?: number | null;
  projection?: number | null;
  exposure?: string | null;
  withMotor?: boolean;
  priceEco?: number;
  priceStandard?: number;
  pricePremium?: number;
  selectedPrice?: number;
  priceType?: string;
  // Détails des options et prix
  storeHT?: number;
  ledArmsPrice?: number;
  ledBoxPrice?: number;
  lambrequinPrice?: number;
  awningPrice?: number;
  sousCoffrePrice?: number;
  poseHT?: number;
  tvaAmount?: number;
  codePostal?: string | null;
  fraisDeplacement?: number;
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export default function OrderSummaryPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} scriptProps={{ async: true, defer: true }}>
      <OrderSummaryPageContent />
    </GoogleReCaptchaProvider>
  );
}

function OrderSummaryPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [cart, setCart] = useState<Cart | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPostalCode, setCustomerPostalCode] = useState('');
  const [customerCountry, setCustomerCountry] = useState('France');
  const [notes, setNotes] = useState('');
  const [password, setPassword] = useState('');
  const [billingDifferent, setBillingDifferent] = useState(false);
  const [billingData, setBillingData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const [showForm, setShowForm] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cheque' | 'virement'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Vérifier que reCAPTCHA est prêt
  useEffect(() => {
    const checkRecaptcha = () => {
      if (executeRecaptcha) {
        setRecaptchaReady(true);
        console.log('✅ reCAPTCHA prêt');
      } else if (process.env.NODE_ENV === 'development') {
        // En dev, considérer comme prêt même sans reCAPTCHA
        setRecaptchaReady(true);
      }
    };

    // Vérifier immédiatement
    checkRecaptcha();

    // Et vérifier à nouveau après un délai (au cas où reCAPTCHA charge lentement)
    const timer = setTimeout(checkRecaptcha, 2000);
    
    return () => clearTimeout(timer);
  }, [executeRecaptcha]);

  useEffect(() => {
    // Charger le panier depuis localStorage
    try {
      const savedCart = localStorage.getItem('storal-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Rediriger si pas de panier
        router.push('/');
      }
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      router.push('/');
    }

    // Générer un numéro de commande
    const orderNum = `BC-${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);

    // Pré-remplir les infos si utilisateur connecté
    if (user) {
      setCustomerName((user as any)?.user_metadata?.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone((user as any)?.user_metadata?.phone || '');
    }
  }, [router, user]);

  if (!cart || !cart.selectedPrice) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-gray-800 mb-4 text-lg font-semibold">⚠️ Panier incomplet</p>
          <p className="text-gray-600 mb-6">
            Vous devez d'abord sélectionner une offre (ECO, STANDARD ou PREMIUM) avant de finaliser votre commande.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            ← Retour à la configuration
          </button>
        </div>
      </div>
    );
  }

  const selectedModel = cart.modelId ? Object.values(STORE_MODELS).find(m => m.id === cart.modelId) : null;
  const selectedFabric = cart.fabricId ? FABRICS.find(f => f.id === cart.fabricId) : null;
  const selectedColor = cart.colorId ? FRAME_COLORS.find(c => c.id === cart.colorId) : null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation complète
    const errors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.name = 'Le nom est obligatoire (min. 2 caractères)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail)) {
      errors.email = 'Email valide requis';
    }

    if (!customerAddress.trim() || customerAddress.trim().length < 5) {
      errors.address = 'Adresse complète requise (min. 5 caractères)';
    }

    if (!customerCity.trim()) {
      errors.city = 'Ville requise';
    }

    const postalRegex = /^\d{5}$/;
    if (!customerPostalCode.trim() || !postalRegex.test(customerPostalCode.replace(/\s/g, ''))) {
      errors.postalCode = 'Code postal invalide (5 chiffres)';
    }

    // Si utilisateur non connecté, mot de passe obligatoire
    if (!user && (!password || password.length < 6)) {
      errors.password = 'Mot de passe requis (min. 6 caractères) pour créer votre compte';
    }

    // Validation adresse de facturation si différente
    if (billingDifferent) {
      if (!billingData.name.trim()) errors.billing_name = 'Nom de facturation requis';
      if (!billingData.address.trim()) errors.billing_address = 'Adresse de facturation requise';
      if (!billingData.city.trim()) errors.billing_city = 'Ville de facturation requise';
      if (!postalRegex.test(billingData.postalCode.replace(/\s/g, ''))) {
        errors.billing_postalCode = 'Code postal de facturation invalide';
      }
    }

    // Validation du panier
    if (!cart || !cart.selectedPrice) {
      errors.cart = 'Aucune offre sélectionnée. Veuillez retourner à la page de configuration.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Veuillez corriger les erreurs dans le formulaire');
      // Scroller vers le haut pour voir les erreurs
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFieldErrors({});
    setIsProcessing(true);
    setError('');

    try {
      // Obtenir le token reCAPTCHA v3
      let recaptchaToken: string | undefined = undefined;
      
      // Attendre que reCAPTCHA soit prêt
      if (!executeRecaptcha) {
        // En développement, continuer sans reCAPTCHA
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ reCAPTCHA non initialisé (mode développement - ignoré)');
        } else {
          throw new Error('Service de sécurité non disponible. Veuillez rafraîchir la page et réessayer.');
        }
      } else {
        try {
          recaptchaToken = await executeRecaptcha('order_summary_submit');
          console.log('✅ reCAPTCHA token obtenu');
        } catch (recErr) {
          console.error('❌ Erreur reCAPTCHA:', recErr);
          // En production, bloquer si reCAPTCHA échoue
          if (process.env.NODE_ENV !== 'development') {
            throw new Error('Échec de la vérification de sécurité. Veuillez réessayer.');
          }
        }
      }

      // Préparer l'item de commande au format attendu par l'API
      const orderItem = {
        product_id: cart.modelId || 'store-custom',
        product_name: selectedModel?.name || 'Store sur mesure',
        price_per_unit: cart.selectedPrice,
        quantity: 1,
        configuration: {
          modele: selectedModel?.name,
          largeur: cart.width,
          projection: cart.projection,
          couleur: selectedColor?.name,
          tissu: selectedFabric?.name,
          motorisation: cart.withMotor ? 'Oui' : 'Non',
          exposition: cart.exposure,
          formule: cart.priceType?.toUpperCase(),
          // Détails des prix
          store_base_ht: cart.storeHT,
          led_bras_ht: cart.ledArmsPrice,
          led_coffre_ht: cart.ledBoxPrice,
          lambrequin_ht: cart.lambrequinPrice,
          auvent_ht: cart.awningPrice,
          sous_coffre_ht: cart.sousCoffrePrice,
          installation_ht: cart.poseHT,
          tva: cart.tvaAmount,
        },
      };

      const requestPayload = {
        userId: user?.id,
        items: [orderItem],
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress: customerAddress,
        deliveryCity: customerCity,
        deliveryPostalCode: customerPostalCode,
        deliveryCountry: customerCountry,
        billingDifferent,
        billing: billingDifferent
          ? billingData
          : {
              name: customerName,
              address: customerAddress,
              city: customerCity,
              postalCode: customerPostalCode,
              country: customerCountry,
            },
        comment: notes.trim() || undefined,
        paymentMethod,
        createAccount: !user,
        password: !user ? password : undefined,
        recaptchaToken,
      };

      console.log('📦 Envoi de la commande:', {
        hasUser: !!user,
        itemCount: requestPayload.items.length,
        totalAmount: cart.selectedPrice,
        paymentMethod,
        hasRecaptcha: !!recaptchaToken,
        payload: requestPayload, // Afficher tout le payload
      });

      // Appeler l'API checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      console.log('📡 Réponse brute API:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      let data;
      try {
        data = await response.json();
        console.log('📄 Data JSON:', data);
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        const text = await response.text();
        console.error('📄 Réponse texte brute:', text);
        throw new Error(`Erreur serveur (code ${response.status}). Impossible de lire la réponse.`);
      }
      
      if (!response.ok) {
        console.error('❌ Erreur API complète:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          fullData: data,
        });
        throw new Error(data.error || data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Commande créée avec succès:', data);

      // Si un compte a été créé, connecter l'utilisateur automatiquement
      if (data.accountCreated && !user && password) {
        try {
          const supabase = getSupabaseClient();
          if (supabase) {
            await supabase.auth.signInWithPassword({
              email: customerEmail,
              password: password,
            });
            console.log('✅ Utilisateur connecté automatiquement après création de compte');
          }
        } catch (signInErr) {
          console.error('❌ Erreur connexion auto après création compte:', signInErr);
          // Ne pas bloquer le flux, continuer
        }
      }

      // Rediriger selon le mode de paiement
      if (paymentMethod === 'stripe' && data.clientSecret) {
        // Rediriger vers la page de paiement Stripe
        const params = new URLSearchParams({
          orderId: data.orderId,
          clientSecret: data.clientSecret,
        });
        router.push(`/payment?${params.toString()}`);
      } else {
        // Paiement manuel : rediriger directement vers la confirmation
        router.push(`/confirmation/${data.orderId}`);
      }
    } catch (err: any) {
      console.error('❌ Erreur création commande:', err);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Une erreur est survenue lors de la création de votre commande.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      // Ajouter des conseils selon le type d'erreur
      if (err.message?.includes('Supabase')) {
        errorMessage += ' Problème de connexion à la base de données. Veuillez réessayer.';
      } else if (err.message?.includes('compte')) {
        errorMessage += ' Vérifiez que votre email n\'est pas déjà utilisé.';
      } else if (err.message?.includes('reCAPTCHA')) {
        errorMessage += ' Veuillez rafraîchir la page et réessayer.';
      }
      
      setError(errorMessage);
      setIsProcessing(false);
      
      // Scroller vers le haut pour voir l'erreur
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finaliser votre commande</h1>
            <p className="text-gray-600 mb-6">Remplissez vos coordonnées pour créer votre commande</p>

            {/* Résumé du panier */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📦 Votre commande</h3>
              <div className="text-sm space-y-1">
                <p><strong>Modèle:</strong> {selectedModel?.name || 'Non défini'}</p>
                <p><strong>Dimensions:</strong> {cart?.width || '?'} cm × {cart?.projection || '?'} cm</p>
                {selectedColor && <p><strong>Couleur:</strong> {selectedColor.name}</p>}
                {selectedFabric && <p><strong>Toile:</strong> {selectedFabric.name}</p>}
                <p className="text-lg font-bold text-blue-700 mt-2">
                  Total: {cart?.selectedPrice?.toFixed(2) || '0.00'}€ TTC
                </p>
                {cart?.priceType && (
                  <p className="text-xs text-gray-600">
                    Formule: {cart.priceType.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <strong>❌ Erreur:</strong> {error}
              </div>
            )}

            {fieldErrors.cart && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                <strong>⚠️ Attention:</strong> {fieldErrors.cart}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {user && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Connecté en tant que <strong>{user.email}</strong>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setFieldErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Jean Dupont"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  disabled={!!user}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  } ${user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="jean.dupont@email.com"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.email}</p>
                )}
              </div>

              {!user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Minimum 6 caractères"
                    required
                  />
                  {fieldErrors.password && (
                    <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.password}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Un compte sera créé automatiquement pour suivre votre commande
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse de livraison <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => {
                    setCustomerAddress(e.target.value);
                    setFieldErrors(prev => ({ ...prev, address: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Rue de la Paix"
                  required
                />
                {fieldErrors.address && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => {
                      setCustomerCity(e.target.value);
                      setFieldErrors(prev => ({ ...prev, city: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Paris"
                    required
                  />
                  {fieldErrors.city && (
                    <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerPostalCode}
                    onChange={(e) => {
                      setCustomerPostalCode(e.target.value);
                      setFieldErrors(prev => ({ ...prev, postalCode: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      fieldErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="75000"
                    maxLength={5}
                    required
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.postalCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays
                </label>
                <select
                  value={customerCountry}
                  onChange={(e) => setCustomerCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Luxembourg</option>
                  <option>Autres</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes / Instructions spéciales
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digicode, étage, instructions de livraison..."
                  rows={3}
                />
              </div>

              {/* Adresse de facturation différente */}
              <div className="border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingDifferent}
                    onChange={(e) => setBillingDifferent(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  Utiliser une adresse de facturation différente
                </label>

                {billingDifferent && (
                  <div className="mt-4 space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800">Adresse de facturation</p>
                    
                    <input
                      type="text"
                      value={billingData.name}
                      onChange={(e) => {
                        setBillingData(prev => ({ ...prev, name: e.target.value }));
                        setFieldErrors(prev => ({ ...prev, billing_name: '' }));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        fieldErrors.billing_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nom *"
                    />
                    {fieldErrors.billing_name && (
                      <p className="text-red-600 text-sm">✗ {fieldErrors.billing_name}</p>
                    )}

                    <input
                      type="text"
                      value={billingData.address}
                      onChange={(e) => {
                        setBillingData(prev => ({ ...prev, address: e.target.value }));
                        setFieldErrors(prev => ({ ...prev, billing_address: '' }));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        fieldErrors.billing_address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Adresse *"
                    />
                    {fieldErrors.billing_address && (
                      <p className="text-red-600 text-sm">✗ {fieldErrors.billing_address}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={billingData.city}
                          onChange={(e) => {
                            setBillingData(prev => ({ ...prev, city: e.target.value }));
                            setFieldErrors(prev => ({ ...prev, billing_city: '' }));
                          }}
                          className={`w-full px-4 py-2 border rounded-lg ${
                            fieldErrors.billing_city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ville *"
                        />
                        {fieldErrors.billing_city && (
                          <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.billing_city}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={billingData.postalCode}
                          onChange={(e) => {
                            setBillingData(prev => ({ ...prev, postalCode: e.target.value }));
                            setFieldErrors(prev => ({ ...prev, billing_postalCode: '' }));
                          }}
                          className={`w-full px-4 py-2 border rounded-lg ${
                            fieldErrors.billing_postalCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Code postal *"
                          maxLength={5}
                        />
                        {fieldErrors.billing_postalCode && (
                          <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.billing_postalCode}</p>
                        )}
                      </div>
                    </div>

                    <select
                      value={billingData.country}
                      onChange={(e) => setBillingData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                      <option>Luxembourg</option>
                      <option>Autres</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Mode de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mode de paiement <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">💳 Carte bancaire (Stripe)</div>
                      <div className="text-sm text-gray-600">Paiement sécurisé immédiat</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cheque"
                      checked={paymentMethod === 'cheque'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">📄 Chèque</div>
                      <div className="text-sm text-gray-600">À envoyer sous 7 jours</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="virement"
                      checked={paymentMethod === 'virement'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">🏦 Virement bancaire</div>
                      <div className="text-sm text-gray-600">RIB fourni après validation</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message de protection reCAPTCHA */}
              <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                🔒 Ce site est protégé par reCAPTCHA et les{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Règles de confidentialité
                </a>
                {' '}et{' '}
                <a 
                  href="https://policies.google.com/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Conditions d'utilisation
                </a>
                {' '}de Google s'appliquent.
              </div>

              {/* Avertissement si reCAPTCHA n'est pas prêt */}
              {!recaptchaReady && process.env.NODE_ENV !== 'development' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chargement du système de sécurité...
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || (!recaptchaReady && process.env.NODE_ENV !== 'development')}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement en cours...
                    </span>
                  ) : !recaptchaReady && process.env.NODE_ENV !== 'development' ? (
                    'Chargement...'
                  ) : (
                    'Valider la commande →'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barre d'actions (ne s'imprime pas) */}
      <div className="print:hidden bg-slate-100 border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            ← Retour
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              ✏️ Modifier les infos
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              📥 Télécharger PDF
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              🖨️ Imprimer
            </button>
          </div>
        </div>
      </div>

      {/* Bon de commande */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-gray-200">
          <div>
            <Image 
              src="/images/logo-storal.png" 
              alt="Storal" 
              width={180} 
              height={60} 
              className="mb-4"
            />
            <p className="text-sm text-gray-600">
              Expert en stores et protections solaires<br />
              Fabrication française • Livraison 7 jours
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BON DE COMMANDE</h1>
            <p className="text-sm text-gray-600">N° {orderNumber}</p>
            <p className="text-sm text-gray-600">Date : {currentDate}</p>
          </div>
        </div>

        {/* Informations client */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-50 p-6 rounded-lg">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Informations Client</h2>
            <p className="font-semibold text-lg text-gray-900">{customerName}</p>
            <p className="text-gray-700">{customerEmail}</p>
            {customerPhone && <p className="text-gray-700">{customerPhone}</p>}
            {customerAddress && (
              <p className="text-gray-700 mt-2 whitespace-pre-line">{customerAddress}</p>
            )}
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Storal France</h2>
            <p className="text-gray-700">Service Commercial</p>
            <p className="text-gray-700">Email : contact@storal.fr</p>
            <p className="text-gray-700">Tél : 01 XX XX XX XX</p>
          </div>
        </div>

        {/* Configuration du produit */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration du Store</h2>
          
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Caractéristique</th>
                  <th className="text-left px-6 py-4 font-semibold">Détail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedModel && (
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Modèle</td>
                    <td className="px-6 py-4 text-gray-700">{selectedModel.name}</td>
                  </tr>
                )}
                {cart.width && (
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Largeur</td>
                    <td className="px-6 py-4 text-gray-700">{(cart.width / 100).toFixed(2)} m</td>
                  </tr>
                )}
                {cart.projection && (
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Avancée</td>
                    <td className="px-6 py-4 text-gray-700">{(cart.projection / 100).toFixed(2)} m</td>
                  </tr>
                )}
                {selectedColor && (
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Coloris Armature</td>
                    <td className="px-6 py-4 text-gray-700">{selectedColor.name}</td>
                  </tr>
                )}
                {selectedFabric && (
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Toile</td>
                    <td className="px-6 py-4 text-gray-700">{selectedFabric.name}</td>
                  </tr>
                )}
                {cart.exposure && (
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Exposition</td>
                    <td className="px-6 py-4 text-gray-700 capitalize">{cart.exposure}</td>
                  </tr>
                )}
                {cart.withMotor !== undefined && (
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Motorisation</td>
                    <td className="px-6 py-4 text-gray-700">
                      {cart.withMotor ? '⚡ Radio Somfy' : '🔧 Manuel'}
                    </td>
                  </tr>
                )}
                {cart.priceType && (
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Formule choisie</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-600 text-white font-bold rounded-full text-sm uppercase">
                        {cart.priceType}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <h3 className="font-bold text-gray-900 mb-2">📝 Notes / Instructions</h3>
            <p className="text-gray-700 whitespace-pre-line">{notes}</p>
          </div>
        )}

        {/* Tarification */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarification Détaillée</h2>
          
          <div className="space-y-3">
            {/* Prix de base du store */}
            {cart.storeHT && (
              <div className="flex justify-between text-gray-700">
                <span>Store de base (HT)</span>
                <span className="font-semibold">{cart.storeHT.toFixed(2)} €</span>
              </div>
            )}

            {/* Options incluses selon la formule */}
            {cart.priceType && (
              <div className="mt-4 mb-4 pb-3 border-b border-gray-300">
                <p className="text-sm font-semibold text-blue-600 uppercase mb-2">
                  Options de la formule {cart.priceType}
                </p>
              </div>
            )}

            {/* LED Bras */}
            {cart.ledArmsPrice && cart.ledArmsPrice > 0 && (
              <div className="flex justify-between text-gray-700 pl-4">
                <span className="flex items-center">
                  <span className="text-blue-500 mr-2">💡</span>
                  LED Bras (HT)
                </span>
                <span className="font-semibold">{cart.ledArmsPrice.toFixed(2)} €</span>
              </div>
            )}

            {/* LED Coffre */}
            {cart.ledBoxPrice && cart.ledBoxPrice > 0 && (
              <div className="flex justify-between text-gray-700 pl-4">
                <span className="flex items-center">
                  <span className="text-blue-500 mr-2">💡</span>
                  LED Coffre (HT)
                </span>
                <span className="font-semibold">{cart.ledBoxPrice.toFixed(2)} €</span>
              </div>
            )}

            {/* Lambrequin enroulable */}
            {cart.lambrequinPrice && cart.lambrequinPrice > 0 && (
              <div className="flex justify-between text-gray-700 pl-4">
                <span className="flex items-center">
                  <span className="text-orange-500 mr-2">📏</span>
                  Lambrequin enroulable (HT)
                </span>
                <span className="font-semibold">{cart.lambrequinPrice.toFixed(2)} €</span>
              </div>
            )}

            {/* Auvent */}
            {cart.awningPrice && cart.awningPrice > 0 && (
              <div className="flex justify-between text-gray-700 pl-4">
                <span className="flex items-center">
                  <span className="text-purple-500 mr-2">🏠</span>
                  Auvent (HT)
                </span>
                <span className="font-semibold">{cart.awningPrice.toFixed(2)} €</span>
              </div>
            )}

            {/* Sous-coffre */}
            {cart.sousCoffrePrice && cart.sousCoffrePrice > 0 && (
              <div className="flex justify-between text-gray-700 pl-4">
                <span className="flex items-center">
                  <span className="text-purple-500 mr-2">📦</span>
                  Sous-coffre (HT)
                </span>
                <span className="font-semibold">{cart.sousCoffrePrice.toFixed(2)} €</span>
              </div>
            )}

            {/* Installation */}
            {cart.poseHT && cart.poseHT > 0 && (
              <>
                <div className="flex justify-between text-gray-700 mt-4 pt-3 border-t border-gray-300">
                  <span className="flex items-center">
                    <span className="text-green-500 mr-2">🔧</span>
                    Installation professionnelle (HT)
                  </span>
                  <span className="font-semibold">{cart.poseHT.toFixed(2)} €</span>
                </div>
                {cart.fraisDeplacement !== undefined && cart.fraisDeplacement > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 ml-6">
                    <span>• Dont frais de déplacement</span>
                    <span>{cart.fraisDeplacement.toFixed(2)} €</span>
                  </div>
                )}
              </>
            )}

            {/* TVA */}
            {cart.tvaAmount && (
              <div className="flex justify-between text-gray-700">
                <span>TVA</span>
                <span className="font-semibold">{cart.tvaAmount.toFixed(2)} €</span>
              </div>
            )}
            
            {/* Total TTC */}
            <div className="border-t-2 border-gray-300 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">TOTAL TTC</span>
                <span className="text-3xl font-bold text-blue-600">
                  {cart.selectedPrice?.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Engagements */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-semibold text-gray-900">Fabrication 24h</p>
            <p className="text-sm text-gray-600">Production express</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-semibold text-gray-900">Livraison 7j</p>
            <p className="text-sm text-gray-600">Partout en France</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔧</div>
            <p className="font-semibold text-gray-900">Pose pro</p>
            <p className="text-sm text-gray-600">Par nos experts</p>
          </div>
        </div>

        {/* Conditions */}
        <div className="border-t-2 border-gray-200 pt-8 text-sm text-gray-600 space-y-2">
          <p>
            <strong>Conditions :</strong> Un technicien Storal validera avec vous l'ensemble des cotes avant toute mise en fabrication.
          </p>
          <p>
            <strong>Délais :</strong> Fabrication sous 24h après validation technique. Livraison sous 7 jours ouvrés.
          </p>
          <p>
            <strong>Garantie :</strong> Garantie constructeur 5 ans sur l'armature et la motorisation.
          </p>
        </div>

        {/* Pied de page */}
        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
          <p>Storal France • www.storal.fr • contact@storal.fr</p>
          <p className="mt-2">Document généré le {currentDate}</p>
        </div>
      </div>
    </div>
  );
}
