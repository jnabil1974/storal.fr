import { STORE_MODELS, getMinimumPrice, getModelDimensions } from '@/lib/catalog-data';

interface ProductSchemaProps {
  productId: string;
  slug: string;
}

/**
 * Composant générant les données structurées JSON-LD pour le SEO
 * Permet à Google d'afficher prix, disponibilité et notes dans les résultats de recherche
 */
export default function ProductSchema({ productId, slug }: ProductSchemaProps) {
  const model = STORE_MODELS[productId as keyof typeof STORE_MODELS];
  
  if (!model) return null;

  const minPrice = getMinimumPrice(model);
  const dimensions = getModelDimensions(model);
  const baseUrl = 'https://storal.fr';
  const productUrl = `${baseUrl}/produits/${slug}`;

  // Construire la liste des caractéristiques additionnelles
  const additionalFeatures = [
    ...model.features,
    `Type: Store ${model.type}`,
    `Coffre: ${model.shape === 'carre' ? 'Carré' : 'Galbé'}`,
    `Largeur max: ${(dimensions.maxWidth / 1000).toFixed(1)}m`,
    `Projection max: ${(dimensions.maxProjection / 1000).toFixed(1)}m`,
  ];

  // Schéma JSON-LD Product pour les Rich Snippets Google
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: model.name,
    description: model.description,
    image: [
      `${baseUrl}${model.image || '/images/stores/default.png'}`,
      `${baseUrl}/images/produits/${productId}/gallery/1.jpg`,
      `${baseUrl}/images/produits/${productId}/gallery/2.jpg`,
      `${baseUrl}/images/produits/${productId}/gallery/3.jpg`,
    ],
    sku: productId.toUpperCase(),
    mpn: productId.toUpperCase(), // Manufacturer Part Number
    brand: {
      '@type': 'Brand',
      name: 'Storal',
      logo: `${baseUrl}/logo.png`,
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Storal',
      url: baseUrl,
    },
    offers: {
      '@type': 'AggregateOffer',
      url: productUrl,
      priceCurrency: 'EUR',
      lowPrice: minPrice.toString(),
      highPrice: (minPrice * 2.5).toFixed(0), // Estimation du prix max (varie selon config)
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valide 1 an
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Storal',
        url: baseUrl,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'DAY',
          },
        },
      },
    },
    // Agrégation des avis clients (à remplacer par vraies données plus tard)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    category: 'Home & Garden > Outdoor Living > Awnings',
    additionalProperty: additionalFeatures.map((feature, index) => ({
      '@type': 'PropertyValue',
      propertyID: `feature_${index + 1}`,
      name: 'Caractéristique',
      value: feature,
    })),
    // Informations spécifiques store banne
    width: {
      '@type': 'QuantitativeValue',
      minValue: dimensions.minWidth / 1000,
      maxValue: dimensions.maxWidth / 1000,
      unitCode: 'MTR',
      unitText: 'm',
    },
    depth: {
      '@type': 'QuantitativeValue',
      minValue: dimensions.minProjection / 1000,
      maxValue: dimensions.maxProjection / 1000,
      unitCode: 'MTR',
      unitText: 'm',
    },
    material: 'Aluminium et toile acrylique haute résistance',
    color: 'Personnalisable (toile et armature)',
    warranty: {
      '@type': 'WarrantyPromise',
      durationOfWarranty: {
        '@type': 'QuantitativeValue',
        value: '10',
        unitCode: 'ANN',
      },
      warrantyScope: 'Structure et mécanisme',
    },
    // Lien vers le configurateur
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${productUrl}`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema, null, 2) }}
    />
  );
}
