import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NavbarComponent } from './NavBarComponents';
import { 
  Package, 
  CreditCard, 
  Mail, 
  User, 
  Home, 
  Check, 
  AlertCircle 
} from 'lucide-react';

const stripePromise = loadStripe('pk_test_51QmzOTIE3DEUnxOz4D7vaYyWg2lCUfqlBuhyZr1mSPRUpWuEexP3XSBmnw1fOSBLQVUAv4YpS4KxdRbaof3FHXqf00uhvSiyP4');

const ProductItem = ({ item }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
    <div className="relative w-16 h-16 overflow-hidden rounded-lg">
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
    <p className="font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
  </div>
);

const OrderSummary = ({ cart, total }) => (
  <div className="p-6 bg-white rounded-2xl shadow-lg">
    <div className="flex items-center gap-2 mb-6">
      <Package className="text-gray-600" size={24} />
      <h2 className="text-2xl font-bold text-gray-800">Résumé de la commande</h2>
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
      <div className="flex justify-between text-lg font-bold text-gray-800">
        <span>Total</span>
        <span>{total.toFixed(2)} €</span>
      </div>
    </div>
  </div>
);

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
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
        />
      </div>
    </div>
  );
};

const PaymentForm = ({ total, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
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
        price: total
      };

      const orderResponse = await fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Erreur lors de l\'enregistrement de la commande');
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/');
      }, 3000);

    } catch (err) {
      setError('Une erreur est survenue lors du traitement du paiement.');
    }
    setProcessing(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="text-gray-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Informations de paiement</h2>
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

        <InputField
          icon={Home}
          label="Adresse"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 rue Example"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carte bancaire
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
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
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-gray-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4"
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

const CheckoutPage = () => {
  const { cart, getCartTotal } = useCart();
  
  useEffect(() => {
    const preremplLink = document.querySelector('.Préremplir link');
    if (preremplLink) {
      preremplLink.remove();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <OrderSummary cart={cart} total={getCartTotal()} />
            <PaymentForm total={getCartTotal()} cart={cart} />
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