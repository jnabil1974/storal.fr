import { MetadataRoute } from 'next';
import { STORE_MODELS, getModelSlug } from '@/lib/catalog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://storal.fr';
  const currentDate = new Date();

  // 🏠 Page d'accueil
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 📚 Page Gammes
  const gammesPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/gammes`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 🛍️ Pages produits (générées dynamiquement depuis catalog-data.ts)
  const productPages: MetadataRoute.Sitemap = Object.keys(STORE_MODELS).map((modelId) => {
    const slug = getModelSlug(modelId);
    return {
      url: `${baseUrl}/produits/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // 📄 Autres pages importantes
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/assistant`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  return [...homepage, ...gammesPage, ...productPages, ...staticPages];
}
