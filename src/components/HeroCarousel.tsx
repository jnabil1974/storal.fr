'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgGradient: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Stores Bannes sur Mesure',
    subtitle: 'Protection Solaire Élégante',
    description: 'Créez votre store banne personnalisé en quelques clics. Dimensions, coloris et motorisation au choix.',
    buttonText: 'Configurer mon store',
    buttonLink: '/products/store-banne',
    bgGradient: 'from-orange-500 to-yellow-500',
    textColor: 'text-white',
  },
  {
    id: 2,
    title: 'Portes Blindées Certifiées A2P',
    subtitle: 'Sécurité Maximale pour Votre Domicile',
    description: 'Protection renforcée avec certification A2P. Isolation phonique et thermique incluse.',
    buttonText: 'Découvrir les portes',
    buttonLink: '/products/porte-blindee',
    bgGradient: 'from-gray-700 to-slate-600',
    textColor: 'text-white',
  },
  {
    id: 3,
    title: 'Stores Anti-Chaleur',
    subtitle: 'Réduisez la Température Intérieure',
    description: 'Solutions thermiques efficaces pour fenêtres et vérandas. Confort garanti.',
    buttonText: 'Voir les modèles',
    buttonLink: '/products/store-antichaleur',
    bgGradient: 'from-red-500 to-orange-500',
    textColor: 'text-white',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`w-full h-full bg-gradient-to-r ${slide.bgGradient} flex items-center justify-center`}>
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className={`text-5xl font-bold mb-4 ${slide.textColor}`}>
                {slide.title}
              </h2>
              <p className={`text-2xl mb-2 ${slide.textColor} opacity-90`}>
                {slide.subtitle}
              </p>
              <p className={`text-lg mb-8 ${slide.textColor} opacity-80 max-w-2xl mx-auto`}>
                {slide.description}
              </p>
              <Link href={slide.buttonLink}>
                <button className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                  {slide.buttonText} →
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition"
        aria-label="Slide précédent"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition"
        aria-label="Slide suivant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
