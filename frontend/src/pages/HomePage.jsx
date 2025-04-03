import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';
import ProductListingPage from './ProductListingPage';
import { ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FooterComponent from '../components/FooterComponent';
import CookieConsentComponent from '../components/CookieConsentComponent';

const Home = () => {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const mediaCollection = [
    {
      type: 'image',
      src: '/uploads/camioneuse.jpg',
      alt: 'Modèle portant un hoodie',
      title: 'Hoodies Premium'
    },
    {
      type: 'image',
      src: '/uploads/T Shirt.jpg',
      alt: 'Modèle portant un ensemble sportswear',
      title: 'Ensembles Sportswear'
    },
    {
      type: 'image',
      src: '/uploads/PullBleu.jpg',
      alt: 'Modèle portant un ensemble sportswear',
      title: 'Ensembles Sportswear'
    },
    
  ];

  // Images du dropdown - style e-commerce
  const dropdownImages = [
    {
      type: 'image',
      src: '/uploads/product-hoodie.jpg',
      alt: 'Hoodie noir sur fond blanc',
      index: 0
    },
    {
      type: 'image',
      src: '/uploads/product-tshirt.jpg',
      alt: 'T-shirt blanc sur fond neutre',
      index: 1
    },
    {
      type: 'image',
      src: '/uploads/product-sneakers.jpg',
      alt: 'Basket streetwear sur fond blanc',
      index: 2
    },
  ];

  // Set up auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setDirection(1);
        setCurrentMedia((prev) => (prev + 1) % mediaCollection.length);
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, mediaCollection.length]);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMediaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const nextMedia = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      setIsAutoPlaying(false);
    }
    setDirection(1);
    setCurrentMedia((prev) => (prev + 1) % mediaCollection.length);
  };

  const prevMedia = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      setIsAutoPlaying(false);
    }
    setDirection(-1);
    setCurrentMedia((prev) => (prev - 1 + mediaCollection.length) % mediaCollection.length);
  };

  const selectMedia = (index) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      setIsAutoPlaying(false);
    }
    setDirection(index > currentMedia ? 1 : -1);
    setCurrentMedia(index);
    setIsMediaDropdownOpen(false);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  // Overlay text animation variants
  const textVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: 0.3, 
        duration: 0.5 
      }
    }
  };
  
  // Thumbnail animation variants
  const thumbnailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  // Button hover animation
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
    },
    tap: { 
      scale: 0.95 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      
      {/* Hero Section with Media Carousel */}
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Media Display */}
              <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  {mediaCollection[currentMedia].type === 'video' ? (
                    <motion.div
                      key={`video-${currentMedia}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0"
                    >
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={mediaCollection[currentMedia].src} type="video/mp4" />
                        Votre navigateur ne prend pas en charge la vidéo.
                      </video>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`image-${currentMedia}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0"
                    >
                      <img
                        src={mediaCollection[currentMedia].src}
                        alt={mediaCollection[currentMedia].alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/api/placeholder/400/320';
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Navigation arrows with animation */}
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevMedia();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full transition-all duration-300 z-20"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={24} className="text-gray-900" />
                </motion.button>
                
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextMedia();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full transition-all duration-300 z-20"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={24} className="text-gray-900" />
                </motion.button>
                
                {/* Bouton redirigeant vers la page Album avec animation */}
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => window.location.href = '/album'}
                  className="absolute right-4 bottom-4 bg-white bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300"
                >
                  Voir tous nos produits
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.button>
                
                {/* Toggle thumbnails button with animation */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setIsMediaDropdownOpen(!isMediaDropdownOpen)}
                  className="absolute left-4 bottom-4 bg-white bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
                >
                  <motion.div
                    animate={{ y: isMediaDropdownOpen ? -3 : 3 }}
                    transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 0.5 }}
                  >
                    {isMediaDropdownOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </motion.div>
                  Galerie
                </motion.button>
                
                {/* Media dropdown/thumbnails with animation */}
                <AnimatePresence>
                  {isMediaDropdownOpen && (
                    <motion.div 
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 right-0 bottom-16 bg-white rounded-lg shadow-xl p-2 mx-4 z-10"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {dropdownImages.map((item, index) => (
                          <motion.div 
                            key={index}
                            custom={index}
                            variants={thumbnailVariants}
                            initial="hidden"
                            animate="visible"
                            className={`cursor-pointer relative rounded-md overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                              currentMedia === item.index ? 'ring-2 ring-gray-900' : ''
                            }`}
                            onClick={() => selectMedia(item.index)}
                          >
                            <img 
                              src={item.src} 
                              alt={item.alt} 
                              className="h-16 w-full object-cover bg-gray-50"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/api/placeholder/200/160';
                              }}
                            />
                            
                            {/* Hover overlay */}
                            <motion.div 
                              className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"
                              whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                            />
                            
                            {/* Zoom in icon on current item */}
                            {currentMedia === item.index && (
                              <motion.div 
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="bg-white rounded-full p-1">
                                  <div className="w-2 h-2 bg-gray-900 rounded-full" />
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Overlay with text - now with animation */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-4 md:px-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${currentMedia}`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={textVariants}
                  >
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                      {mediaCollection[currentMedia].title}
                    </h1>
                    <p className="text-sm md:text-xl text-white mb-4 md:mb-8 max-w-lg">
                      Découvrez notre nouvelle gamme de vêtements streetwear pour un style urbain et tendance.
                    </p>
                    <div>
                      <motion.button 
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => window.scrollTo({
                          top: document.querySelector('.products-section').offsetTop,
                          behavior: 'smooth'
                        })}
                        className="bg-white text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors duration-300 text-sm md:text-base"
                      >
                        Voir la collection
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 0.8 }}
                        >
                          <ArrowRight size={16} className="md:w-5 md:h-5" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Indicator dots - now with animation */}
            <div className="flex justify-center p-4 gap-2">
              {mediaCollection.map((_, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: currentMedia === index ? [1, 1.3, 1] : 1,
                    backgroundColor: currentMedia === index ? "#111827" : "#D1D5DB"
                  }}
                  transition={{ 
                    duration: 0.5,
                    scale: { duration: 0.3 }
                  }}
                  onClick={() => selectMedia(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all`}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Autoplay toggle button */}
            <div className="flex justify-center pb-2">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
                  isAutoPlaying
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <motion.div
                  animate={{ opacity: isAutoPlaying ? [1, 0.5, 1] : 1 }}
                  transition={{ repeat: isAutoPlaying ? Infinity : 0, duration: 1.5 }}
                >
                  {isAutoPlaying ? "Pause" : "Lecture auto"}
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="products-section">
        <ProductListingPage />
      </div>
      <FooterComponent />
      <CookieConsentComponent />
    </div>
  );
};

export default Home;