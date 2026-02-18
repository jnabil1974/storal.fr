'use client';

import Image from 'next/image';
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

  return (
    <div className="relative aspect-video bg-white rounded-xl overflow-hidden border-2 border-gray-300">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        quality={90}
        onError={() => {
          setImageSrc(fallbackSrc);
        }}
      />
    </div>
  );
}
