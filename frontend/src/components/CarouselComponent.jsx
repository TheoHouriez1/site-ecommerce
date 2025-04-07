import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CarouselComponent = ({ onShopNowClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Collections de grandes marques streetwear/vintage avec vêtements portés
  const collections = [
    {
      brand: 'Supreme',
      // Image d'un hoodie Supreme porté
      image: 'Screenshot 2025-04-07 092158.png',
      tagline: '"NE PORTE PAS DES VÊTEMENTS, PORTE DES HISTOIRES"',
      itemCount: '100+ ITEMS LIVE'
    },
    {
      brand: 'burberry',
      // Image d'un sweatshirt vintage Nike porté
      image: 'IMG_94842.jpg',
      tagline: '"CLASSIQUES INTEMPORELS, STYLE ÉTERNEL"',
      itemCount: '85+ ITEMS LIVE'
    },
    {
      brand: 'Carhartt',
      // Image d'une veste Carhartt vintage portée
      image: 'IMG_8981.jfif',
      tagline: '"LA DURABILITÉ RENCONTRE LE STREETWEAR"',
      itemCount: '70+ ITEMS LIVE'
    },
  ];
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
  };
  
  // Auto-play pour le carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <section className="w-full h-screen relative overflow-hidden">
      {/* Main carousel slide */}
      <div className="relative h-full">
        {collections.map((collection, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              activeSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative h-full">
              <img 
                src={collection.image}
                alt={`${collection.brand} vintage clothing`}
                className="absolute w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/api/placeholder/1600/900?text=${collection.brand}`;
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
                <motion.h2 
                  key={`brand-${index}-${activeSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-7xl mb-4 font-bold tracking-wider"
                >
                  {collection.brand}
                </motion.h2>
                
                <motion.p
                  key={`tagline-${index}-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl md:text-3xl mb-6 max-w-3xl font-light"
                >
                  {collection.tagline}
                </motion.p>
                
                <motion.p
                  key={`count-${index}-${activeSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg mb-10 tracking-wide"
                >
                  {collection.itemCount}
                </motion.p>
                
                <motion.button
                  key={`button-${index}-${activeSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white text-black px-10 py-4 uppercase text-sm tracking-widest font-medium hover:bg-gray-100 transition-colors"
                  onClick={onShopNowClick}
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {collections.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default CarouselComponent; 