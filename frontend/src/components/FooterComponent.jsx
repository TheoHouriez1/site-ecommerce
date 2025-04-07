// src/components/FooterComponent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  ChevronRight
} from 'lucide-react';

const FooterComponent = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [emailInput, setEmailInput] = useState('');
  
  const handleEmailSubscribe = (e) => {
    e.preventDefault();
    // Logique d'inscription à la newsletter
    alert(`Inscription à la newsletter avec: ${emailInput}`);
    setEmailInput('');
  };
  
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Shop Théo</h3>
            <p className="text-gray-600 mb-4">
              Notre mission est de vous proposer des vêtements de qualité, tendance et accessibles pour toutes les occasions.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Informations</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/conditions-generales')}
                  className="text-gray-600 hover:text-black transition-colors duration-300 flex items-center"
                >
                  <ChevronRight size={16} className="mr-1" />
                  <span>Conditions générales de vente</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/politique-confidentialite')}
                  className="text-gray-600 hover:text-black transition-colors duration-300 flex items-center"
                >
                  <ChevronRight size={16} className="mr-1" />
                  <span>Politique de confidentialité</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/mentions-legales')}
                  className="text-gray-600 hover:text-black transition-colors duration-300 flex items-center"
                >
                  <ChevronRight size={16} className="mr-1" />
                  <span>Mentions légales</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/livraison')}
                  className="text-gray-600 hover:text-black transition-colors duration-300 flex items-center"
                >
                  <ChevronRight size={16} className="mr-1" />
                  <span>Livraison et retours</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/faq')}
                  className="text-gray-600 hover:text-black transition-colors duration-300 flex items-center"
                >
                  <ChevronRight size={16} className="mr-1" />
                  <span>FAQ</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <Mail size={18} className="mr-2 text-gray-500" />
                <span>theohouriez1@gmail.com</span>
              </li>
              <li className="flex items-start text-gray-600">
                <MapPin size={18} className="mr-2 mt-1 text-gray-500" />
                <span>80000 Amiens, France</span>
              </li>
            </ul>
          </div>
          {/* Payment & Shipping */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Paiement & Livraison</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <CreditCard size={18} className="mr-2 text-gray-500" />
                <span>site fictif</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Truck size={18} className="mr-2 text-gray-500" />
                <span>paiement non debite</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Shield size={18} className="mr-2 text-gray-500" />
                <span>Information securiser</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-2">
              <img 
                src="/images/visa.png" 
                alt="Visa" 
                className="h-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <img 
                src="/images/mastercard.png" 
                alt="Mastercard" 
                className="h-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <img 
                src="/images/paypal.png" 
                alt="PayPal" 
                className="h-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-gray-800">Inscrivez-vous à notre newsletter</h3>
              <p className="text-gray-600">Recevez nos dernières offres et actualités</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex" onSubmit={handleEmailSubscribe}>
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="px-4 py-2 rounded-l-md w-full md:w-64 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-colors duration-300"
                >
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {currentYear} Shop Théo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;