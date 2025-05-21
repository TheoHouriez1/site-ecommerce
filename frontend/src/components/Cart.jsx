import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package, CreditCard, Mail, User, Home, Check, AlertCircle, ChevronRight
} from 'lucide-react';

const stripePromise = loadStripe('pk_test_51QmzOTIE3DEUnxOz4D7vaYyWg2lCUfqlBuhyZr1mSPRUpWuEexP3XSBmnw1fOSBLQVUAv4YpS4KxdRbaof3FHXqf00uhvSiyP4');
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api';

const ProductItem = ({ item }) => {
  const BASE_IMAGE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';
  const imageUrl = `${BASE_IMAGE_URL}${item.image}`;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
      <div className="relative w-16 h-16 overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={item.name}
          onError={(e) => {
            e.target.src = "https://placehold.co/400x400?text=Image+non+disponible";
          }}
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
};

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

const PaymentForm = ({ total, cart, clearCartFromServer }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const updateProductStocks = async () => {
    try {
      const updatePromises = cart.map(async item => {
        const productId = item.product_id || item.productId || item.id;
        await fetch(`${API_BASE_URL}/product/update-stock`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            "X-API-TOKEN": API_TOKEN
          },
          body: JSON.stringify({ id: productId, quantity: item.quantity })
        });
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des stocks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!address || address.trim() === '') {
      setError("L'adresse est obligatoire");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${prenom} ${name}`,
          email,
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
        prenom,
        email,
        address,
        article: cart.map(item => `${item.quantity},${item.name},${item.size || 'NS'}`).join(';'),
        price: total,
        id_user: user?.id || null
      };

      const orderResponse = await fetch(`${API_BASE_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "X-API-TOKEN": API_TOKEN },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error(`Erreur commande: ${orderResponse.status}`);
      }

      await updateProductStocks();

      if (user?.id) {
        await clearCartFromServer(user.id);
      }

      setShowSuccessPopup(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(`Erreur paiement: ${err.message}`);
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Prénom</label>
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="John" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Nom</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Doe" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md" />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <input
            type="text"
            value={address}
            onChange={async (e) => {
              const value = e.target.value;
              setAddress(value);

              if (value.length > 3) {
                const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(value)}&limit=5`);
                const data = await res.json();
                setSuggestions(data.features.map(f => f.properties.label));
              } else {
                setSuggestions([]);
              }
            }}
            placeholder="2 Rue de Paris, 75001 Paris"
            required
            className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-md"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setAddress(s);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Carte bancaire</label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } }, invalid: { color: '#9e2146' } } }} />
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
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
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

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Erreur lors du chargement du panier');

      const data = await res.json();
      setCart(data);
      
      const total = data.reduce((acc, item) => {
        const qte = item.quantity || 0;
        const prix = item.price || 0;
        return acc + qte * prix;
      }, 0);
      
      setCartTotal(total);
    } catch (error) {
      console.error('Erreur de récupération du panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCartFromServer = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/clear/${userId}`, {
        method: 'DELETE',
        headers: {
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Erreur lors du vidage du panier');
      
      setCart([]);
      setCartTotal(0);
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">Accueil</button>
            <span>/</span>
            <button onClick={() => navigate('/panier')} className="hover:text-black transition-colors">Panier</button>
            <span>/</span>
            <span className="text-black font-medium">Paiement</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">Finaliser votre commande</h1>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <OrderSummary cart={cart} total={cartTotal} />
            <PaymentForm total={cartTotal} cart={cart} clearCartFromServer={clearCartFromServer} />
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