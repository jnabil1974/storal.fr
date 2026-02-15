'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

function ContactFormContent() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    title: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Préremplir depuis les paramètres URL
  useEffect(() => {
    const email = searchParams.get('email');
    const orderId = searchParams.get('orderId');
    const subject = searchParams.get('subject');
    const title = searchParams.get('title');
    const message = searchParams.get('message');
    
    if (email || orderId || subject || title || message) {
      setFormData(prev => ({
        ...prev,
        email: email || prev.email,
        subject: subject || prev.subject,
        title: title || (orderId ? `Commande ${orderId}` : prev.title),
        message: message || prev.message,
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!executeRecaptcha) {
      setError('reCAPTCHA non initialisé');
      return;
    }

    setLoading(true);

    try {
      const recaptchaToken = await executeRecaptcha('contact_submit');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', title: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contactez-nous</h1>
          <p className="text-gray-600 mb-8">
            Une question ? Un projet ? Notre équipe vous répond sous 24h.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              ✓ Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="jean@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="01 85 09 34 46"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Sélectionner un sujet</option>
                  <option value="Devis">Demande de devis</option>
                  <option value="Information produit">Information produit</option>
                  <option value="SAV">Service après-vente</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du message *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Ex: Demande de devis pour store banne"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre message *
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Décrivez votre projet ou votre demande de manière détaillée
              </p>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Décrivez votre demande..."
              />
            </div>

            <div className="flex items-start gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>

              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous répondre.
                </p>
              </div>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Autres moyens de nous contacter</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Adresse</p>
                <p className="text-gray-600 text-sm">
                  58 rue de Monceau CS 48756<br />
                  75380 Paris Cedex 08
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                <a href="mailto:commandes@storal.fr" className="text-blue-600 hover:underline">
                  commandes@storal.fr
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Téléphone</p>
                <a href="tel:+33185093446" className="text-blue-600 hover:underline">
                  01 85 09 34 46
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Horaires</p>
                <p className="text-gray-600 text-sm">Lun-Ven: 9h-18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY} scriptProps={{ async: true, defer: true }}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
        <ContactFormContent />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}
