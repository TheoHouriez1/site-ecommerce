import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext'; // Import pour useAuth
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CreditCard, 
  Mail, 
  User, 
  Home, 
  Check, 
  AlertCircle,
  Search,
  X,
  ChevronRight
} from 'lucide-react';

// Conservez votre clé Stripe
const stripePromise = loadStripe('pk_test_51QmzOTIE3DEUnxOz4D7vaYyWg2lCUfqlBuhyZr1mSPRUpWuEexP3XSBmnw1fOSBLQVUAv4YpS4KxdRbaof3FHXqf00uhvSiyP4');
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

// Composants existants comme ProductItem et OrderSummary sans changement...
const ProductItem = ({ item }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
    <div className="relative w-16 h-16 overflow-hidden rounded-md">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-grow">
      <h3 className="font-medium text-gray-800">{item.name}</h3>
      <div className="text-sm text-gray-500">
        <p>Quantité: {item.quantity}</p>
        {item.size && <p>Taille: {item.size}</p>}
      </div>
    </div>
    <p className="font-bold text-black">{(item.price * item.quantity).toFixed(2)} €</p>
  </div>
);

const OrderSummary = ({ cart, total }) => (
  <div className="p-6 bg-white rounded-lg shadow-md">
    <div className="flex items-center gap-2 mb-6">
      <Package className="text-gray-700" size={24} />
      <h2 className="text-xl font-bold text-gray-800">Résumé de la commande</h2>
    </div>
    
    <div className="space-y-4 mb-6">
      {cart.map(item => (
        <ProductItem key={`${item.id}-${item.size}`} item={item} />
      ))}
    </div>
    <div className="space-y-3 pt-4 border-t border-gray-200">
      <div className="flex justify-between text-gray-600">
        <span>Sous-total</span>
        <span>{total.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Livraison</span>
        <span className="text-green-500 font-medium">Gratuite</span>
      </div>
      <div className="h-px bg-gray-200"></div>
      <div className="flex justify-between text-lg font-bold text-black">
        <span>Total</span>
        <span>{total.toFixed(2)} €</span>
      </div>
    </div>
  </div>
);

// Version simplifiée du composant AddressAutocomplete avec format d'adresse amélioré
const AddressAutocomplete = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Fonction pour gérer les suggestions d'adresses
  const fetchAddressSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      setIsLoading(true);
      // Utilisation de l'API Nominatim (OpenStreetMap) avec paramètre pour limiter à la France
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=fr`);
      const data = await response.json();
      
      // Transformer les résultats en format plus simple
      const formattedSuggestions = data.map(item => {
        // Créer une adresse simplifiée
        const street = item.address.road || '';
        const houseNumber = item.address.house_number || '';
        const city = item.address.city || item.address.town || item.address.village || '';
        const postcode = item.address.postcode || '';
        const country = item.address.country || 'France';
        
        // Format: "NuméroRue, CodePostal Ville, France" - comme dans votre exemple
        const formattedAddress = `${houseNumber ? houseNumber + ' ' : ''}${street}, ${postcode} ${city}, ${country}`.trim().replace(/\s+/g, ' ').replace(/,\s+,/g, ',');
        
        return {
          id: item.place_id,
          text: formattedAddress,
          fullAddress: item.display_name // Garder l'adresse complète en cas de besoin
        };
      });
      
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions d\'adresse:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du changement de valeur dans l'input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchAddressSuggestions(value);
  };

  // Sélectionner une suggestion
  const selectSuggestion = (suggestion) => {
    setInputValue(suggestion.text);
    onChange(suggestion.text);
    setSuggestions([]);
  };

  // Fermer les suggestions lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={autocompleteRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Home className="text-gray-400" size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder="451 Rue des Trois Pierres, 59200 Tourcoing, France"
          required
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange('');
              setSuggestions([]);
              inputRef.current.focus();
            }}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            <X className="text-gray-400 hover:text-gray-600" size={16} />
          </button>
        )}
        {isLoading && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
      {/* Liste des suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                onClick={() => selectSuggestion(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 break-words"
              >
                {suggestion.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Version modifiée du composant InputField (rien ne change)
const InputField = ({ icon: Icon, label, type, value, onChange, placeholder }) => {
  const handleChange = (e) => {
    e.persist();
    onChange(e);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400" size={20} />
        </div>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
        />
      </div>
    </div>
  );
};

// PaymentForm modifié pour inclure l'autocomplétion d'adresse et l'ID utilisateur
const PaymentForm = ({ total, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth(); // Pour obtenir l'utilisateur connecté
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [address, setAddress] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    
    // Validation de l'adresse
    if (!address || address.trim() === '') {
      setError('L\'adresse est obligatoire');
      return;
    }
    
    setProcessing(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${prenom} ${name}`,
          email: email,
          address: { line1: address },
        },
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      const orderData = {
        nom: name,
        prenom: prenom,
        email: email,
        address: address,
        article: cart.map(item => `${item.quantity},${item.name},${item.size || 'NS'}`).join(';'),
        price: total,
        id_user: user.isAuthenticated ? user.id : null // Envoi direct de l'ID utilisateur
      };
      
      console.log("Données envoyées:", orderData); // Log pour debug
      
        
      const orderResponse = await fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "X-API-TOKEN": API_TOKEN },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => null);
        console.error('Erreur détaillée:', errorData);
        throw new Error(`Erreur lors de l'enregistrement de la commande: ${errorData ? JSON.stringify(errorData) : orderResponse.status}`);
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Erreur complète:', err);
      setError('Une erreur est survenue lors du traitement du paiement.');
    }

    setProcessing(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="text-gray-700" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Informations de paiement</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={Mail}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            icon={User}
            label="Prénom"
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="John"
          />
          <InputField
            icon={User}
            label="Nom"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Doe"
          />
        </div>
        {/* Remplacez l'InputField d'adresse par notre nouveau composant AddressAutocomplete */}
        <AddressAutocomplete
          value={address}
          onChange={(value) => setAddress(value)}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carte bancaire
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard size={20} />
          <span>{processing ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}</span>
        </motion.button>
      </form>
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h3>
                <p className="text-gray-600">Merci pour votre commande. Vous allez être redirigé...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reste du code inchangé
const CheckoutPage = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    const preremplLink = document.querySelector('.Préremplir link');
    if (preremplLink) {
      preremplLink.remove();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <button onClick={() => navigate('/panier')} className="hover:text-black transition-colors">
              Panier
            </button>
            <span>/</span>
            <span className="text-black font-medium">Paiement</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">Finaliser votre commande</h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <OrderSummary cart={cart} total={getCartTotal()} />
            <PaymentForm total={getCartTotal()} cart={cart} />
          </div> 
          
          <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-200">
            <button 
              onClick={() => navigate('/panier')} 
              className="flex items-center text-black hover:underline text-sm"
            >
              <ChevronRight size={16} className="rotate-180 mr-1" />
              Retour au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StripeCheckout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutPage />
  </Elements>
);

export default StripeCheckout;