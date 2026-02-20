'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

interface ImageCarouselProps {
  productId: string;
  productName: string;
  fallbackImage?: string;
}

export default function ImageCarousel({ productId, productName, fallbackImage }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Générer les chemins d'images de la galerie (on suppose 4 images par défaut)
  // Next.js Image component convertit automatiquement en WebP pour l'optimisation
  const galleryImages = Array.from({ length: 4 }, (_, i) => 
    `/images/produits/${productId}/gallery/${i + 1}.jpg`
  );
  
  // Alt texts descriptifs pour le SEO et l'accessibilité
  const getAltText = (index: number): string => {
    const contexts = [
      `Store banne ${productName} - Vue d'ensemble coffre et toile déployée`,
      `${productName} - Détail du mécanisme et bras articulés`,
      `Installation ${productName} - Vue de côté avec projection maximale`,
      `Store ${productName} - Finitions et coloris disponibles`
    ];
    return contexts[index] || `${productName} - Photo ${index + 1}`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="relative group">
      {/* Image principale */}
      <div 
        className="relative aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
        aria-label="Cliquer pour agrandir l'image"
      >
        <Image
          src={galleryImages[currentIndex]}
          alt={getAltText(currentIndex)}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          quality={85}
          onError={(e) => {
            // Fallback vers l'image principale du produit si l'image de galerie n'existe pas
            const target = e.target as HTMLImageElement;
            if (fallbackImage) {
              target.src = fallbackImage;
            }
          }}
        />
        
        {/* Indicateur de zoom */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Image précédente"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Image suivante"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Compteur */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full font-medium">
        {currentIndex + 1} / {galleryImages.length}
      </div>

      {/* Lightbox pour agrandir les images */}
      <ImageLightbox
        images={galleryImages}
        currentIndex={currentIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onPrevious={prevSlide}
        onNext={nextSlide}
        altTexts={galleryImages.map((_, i) => getAltText(i))}
      />
    </div>
  );
}
