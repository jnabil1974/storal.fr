'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { CheckoutFormData } from '@/types/order';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// Fonctions de validation
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Téléphone optionnel
  const regex = /^(\+33|0)[1-9](?:[0-9]{8})$/;
  return regex.test(phone.replace(/[\s.-]/g, ''));
};

const validatePostalCode = (code: string): boolean => {
  const regex = /^\d{5}$/;
  return regex.test(code.replace(/\s/g, ''));
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export default function CheckoutPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} scriptProps={{ async: true, defer: true }}>
      <CheckoutPageContent />
    </GoogleReCaptchaProvider>
  );
}

function CheckoutPageContent() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cheque' | 'virement'>('stripe');

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Votre panier est vide</p>
            <a href="/">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Continuer vos achats
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ en cours de modification
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validation du nom
    if (!formData.name.trim()) {
      errors.name = 'Le nom est obligatoire';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      errors.email = "L'email est obligatoire";
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Veuillez entrer une adresse email valide';
    }

    // Validation du téléphone (optionnel mais si fourni, doit être valide)
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Format de téléphone invalide (ex: 01 23 45 67 89 ou +33 1 23 45 67 89)';
    }

    // Validation de l'adresse
    if (!formData.address.trim()) {
      errors.address = "L'adresse est obligatoire";
    } else if (formData.address.trim().length < 5) {
      errors.address = "L'adresse doit contenir au moins 5 caractères";
    }

    // Validation de la ville
    if (!formData.city.trim()) {
      errors.city = 'La ville est obligatoire';
    } else if (formData.city.trim().length < 2) {
      errors.city = 'La ville doit contenir au moins 2 caractères';
    }

    // Validation du code postal
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Le code postal est obligatoire';
    } else if (!validatePostalCode(formData.postalCode)) {
      errors.postalCode = 'Le code postal doit contenir 5 chiffres (ex: 75001)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Valider le formulaire avant de soumettre
    if (!validateForm()) {
      setError('Veuillez corriger les erreurs ci-dessous');
      return;
    }

    setIsProcessing(true);

    try {
      // Exécuter reCAPTCHA
      if (!executeRecaptcha) {
        throw new Error('reCAPTCHA non disponible');
      }

      const recaptchaToken = await executeRecaptcha('checkout');

      // Créer la commande
      const sessionId = localStorage.getItem('cart_session_id');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          sessionId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          deliveryAddress: formData.address,
          deliveryCity: formData.city,
          deliveryPostalCode: formData.postalCode,
          deliveryCountry: formData.country,
          items: cart.items,
          totalItems: cart.totalItems,
          totalAmount: cart.totalPrice,
          paymentMethod: paymentMethod,
          recaptchaToken, // Ajouter le token reCAPTCHA
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const order = await response.json();

      // Rediriger selon le mode de paiement
      if (paymentMethod === 'stripe') {
        router.push(`/payment?orderId=${order.id}`);
      } else {
        // Paiement manuel (chèque/virement)
        try { await clearCart(); } catch {}
        router.push(`/confirmation/${order.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paiement</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de livraison</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded-lg">
                  {error}
                </div>
              )}

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.email}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 1 23 45 67 89"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.phone}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Format: 01 23 45 67 89 ou +33 1 23 45 67 89</p>
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Rue de la Paix"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.address
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.address && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.address}</p>
                )}
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.city
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.city && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.city}</p>
                )}
              </div>

              {/* Code postal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="75000"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldErrors.postalCode
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.postalCode && (
                  <p className="text-red-600 text-sm mt-1">✗ {fieldErrors.postalCode}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">5 chiffres (ex: 75001)</p>
              </div>

              {/* Pays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Luxembourg</option>
                  <option>Autres</option>
                </select>
              </div>

              {/* Mode de paiement */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mode de paiement *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Carte bancaire</div>
                      <div className="text-sm text-gray-600">Paiement sécurisé par Stripe</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cheque"
                      checked={paymentMethod === 'cheque'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Chèque</div>
                      <div className="text-sm text-gray-600">À l'ordre de la société</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="virement"
                      checked={paymentMethod === 'virement'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Virement bancaire</div>
                      <div className="text-sm text-gray-600">RIB fourni après validation</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Traitement...' : paymentMethod === 'stripe' ? 'Continuer vers le paiement' : 'Valider la commande'}
              </button>
            </form>
          </div>

          {/* Résumé commande */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-gray-600 text-xs">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {Number(item.totalPrice).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Articles:</span>
                  <span className="font-semibold">{cart.totalItems}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-blue-600">{Number(cart.totalPrice).toFixed(2)}€</span>
                </div>
              </div>

              <a href="/cart">
                <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                  Retour au panier
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
