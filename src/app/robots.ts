import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/panier',
        ],
      },
    ],
    sitemap: 'https://storal.fr/sitemap.xml',
    host: 'https://storal.fr',
  };
}
