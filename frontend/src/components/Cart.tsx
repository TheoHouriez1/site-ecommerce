import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51QmzOTIE3DEUnxOz4D7vaYyWg2lCUfqlBuhyZr1mSPRUpWuEexP3XSBmnw1fOSBLQVUAv4YpS4KxdRbaof3FHXqf00uhvSiyP4');

const CheckoutPage = () => {
  const { cart, getCartTotal } = useCart();
  
  return (
    <div className="flex justify-center items-start p-8 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg flex">
        <OrderSummary cart={cart} total={getCartTotal()} />
        <PaymentForm total={getCartTotal()} cart={cart} />
      </div>
    </div>
  );
};

const OrderSummary = ({ cart, total }) => (
  <div className="w-1/2 p-8 border-r">
    <h2 className="text-2xl font-bold mb-6">Résumé de la commande</h2>
    {cart.map(item => (
      <div key={item.id} className="flex justify-between mb-4">
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
        </div>
        <p>{(item.price * item.quantity).toFixed(2)} €</p>
      </div>
    ))}
    <div className="border-t mt-4 pt-4">
      <div className="flex justify-between">
        <p>Sous-total</p>
        <p>{total.toFixed(2)} €</p>
      </div>
      <div className="flex justify-between mt-2">
        <p>Livraison</p>
        <p>Gratuit</p>
      </div>
      <div className="flex justify-between mt-4 font-bold">
        <p>Total</p>
        <p>{total.toFixed(2)} €</p>
      </div>
    </div>
  </div>
);

const PaymentForm = ({ total, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState(''); // 🔹 Ajout du prénom
  const [address, setAddress] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
          email: email,
          address: {
            line1: address,
          },
        },
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      console.log('✅ Paiement validé !');

      // **Envoi des données au backend après un paiement réussi**
      const orderData = {
        nom: name,
        prenom: prenom,
        email: email,
        address: address,
        article: cart.map(item => `${item.quantity},${item.name}`).join(';'),
        price: total
      };

      const orderResponse = await fetch('http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('❌ Erreur lors de l\'enregistrement de la commande');
      }

      console.log('✅ Commande enregistrée en base de données !');

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/'); // Redirection vers la page d'accueil
      }, 3000);

    } catch (err) {
      setError('Une erreur est survenue lors du traitement du paiement.');
      setProcessing(false);
    }
  };

  return (
    <div className="w-1/2 p-8">
      <h2 className="text-2xl font-bold mb-6">Informations de paiement</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prénom</label> {/* 🔹 Ajout du champ prénom */}
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
            required 
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Adresse</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
            required 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Carte bancaire</label>
          <CardElement className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-black text-white py-3 rounded-md font-medium"
        >
          {processing ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
        </motion.button>
      </form>

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Paiement réussi !</h3>
              <p>Vous allez être redirigé vers la page d'accueil...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StripeCheckout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutPage />
  </Elements>
);

export default StripeCheckout;
