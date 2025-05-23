import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookieConsentComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, 
    analytics: true,
    marketing: false,
    preferences: true
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (cookieConsent === null) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAllCookies = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    setIsVisible(false);
    
    console.log('Tous les cookies acceptés');
  };


  const rejectAllCookies = () => {
    const preferences = {
      necessary: true, 
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    setIsVisible(false);
    
    console.log('Cookies non essentiels refusés');
  };

  const handleTogglePreference = (key) => {
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const popupVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const detailsVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      overflow: 'hidden'
    },
    visible: { 
      height: 'auto',
      opacity: 1,
      transition: { 
        height: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        },
        opacity: {
          duration: 0.2,
          delay: 0.1
        }
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
    },
    tap: { 
      scale: 0.95 
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres des cookies</h3>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
                aria-label="Fermer"
              >
                <X size={16} />
              </motion.button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              Vous pouvez personnaliser vos préférences ou accepter tous les cookies.
            </p>
            
            {/* Bouton pour afficher/masquer les détails */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors w-full justify-between"
            >
              <span className="flex items-center gap-1">
                <Settings size={14} />
                Personnaliser les préférences
              </span>
              <motion.div
                animate={{ y: showDetails ? -3 : 3 }}
                transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 0.5 }}
              >
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </motion.div>
            </motion.button>
            
            {/* Détails des préférences de cookies */}
            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  variants={detailsVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mb-4"
                >
                  <div className="space-y-3 bg-gray-50 p-3 rounded-md">
                    {/* Cookie nécessaires - toujours activés */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Cookies nécessaires</h4>
                        <p className="text-xs text-gray-500">Requis pour le fonctionnement du site</p>
                      </div>
                      <div className="bg-gray-300 px-2 py-0.5 rounded text-xs text-gray-700">
                        Requis
                      </div>
                    </div>
                    
                    
                      {/* Cookies de préférences */}
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Cookies de préférences</h4>
                          <p className="text-xs text-gray-500">Mémorisation de vos paramètres</p>
                        </div>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => handleTogglePreference('preferences')}
                          className={`w-10 h-5 rounded-full relative transition-colors ${
                            cookiePreferences.preferences ? 'bg-black' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div 
                            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full"
                            animate={{ 
                              x: cookiePreferences.preferences ? 20 : 0 
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30
                            }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={rejectAllCookies}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex-1 flex items-center justify-center gap-1"
              >
                <X size={16} />
                Refuser
              </motion.button>
              
              {showDetails && (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={navigateToPrivacyPolicy}
                  className="px-4 py-2 text-sm font-medium text-gray-100 bg-gray-700 hover:bg-gray-800 rounded-md transition-colors flex-1 flex items-center justify-center gap-1"
                >
                  <Settings size={16} />
                  Savoir plus
                </motion.button>
              )}
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={acceptAllCookies}
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors flex-1 flex items-center justify-center gap-1"
              >
                <Check size={16} />
                Accepter tout
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const resetCookieConsent = () => {
  localStorage.removeItem('cookieConsent');
  localStorage.removeItem('cookiePreferences');
  
  window.location.reload();
};

export default CookieConsentComponent;