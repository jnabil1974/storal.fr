'use client';

import { useState } from 'react';

interface TechnicalSchemaImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export default function TechnicalSchemaImage({ 
  src, 
  alt,
  fallbackSrc = '/images/tech/schema-default.png'
}: TechnicalSchemaImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-video bg-white rounded-xl overflow-hidden border-2 border-gray-300">
      {/* Utilisation d'une balise <img> native pour les SVG car Next.js Image a des limitations avec les SVG */}
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-contain p-4"
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImageSrc(fallbackSrc);
          }
        }}
      />
    </div>
  );
}
