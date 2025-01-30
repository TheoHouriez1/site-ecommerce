import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



// Charger Stripe (remplacez par votre clé publique)
const stripePromise = loadStripe('pk_test_VOTRE_CLE_PUBLIQUE');

const CartComponent = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart 
  } = useCart();
  const navigate = useNavigate(); // Ajoutez cette ligne
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Votre panier est vide</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => (
              <div 
                key={item.id} 
                className="flex items-center bg-white shadow-md rounded-lg p-4"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover mr-4 rounded"
                />
                
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">{item.price.toFixed(2)} €</p>
                </div>

                <div className="flex items-center space-x-2 mr-4">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>

          {/* Récapitulatif de commande */}
          <div className="bg-white shadow-md rounded-lg p-6 h">
            <h2 className="text-2xl font-bold mb-4">Récapitulatif</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>Gratuit</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)} €</span>
            </div>

              <button 
              onClick={() => navigate('/cart')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
              >
                Procéder au paiement
              </button>
           
          </div>
        </div>
      )}
    </div>
  );
};

// Formulaire de paiement Stripe
const StripeCheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Côté serveur, vous devrez créer un intent de paiement
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: total * 100 }) // Montant en centimes
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Client anonyme' // Personnalisez selon vos besoins
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          clearCart();
          alert('Paiement réussi !');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue lors du paiement');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {processing ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
      </button>
    </form>
  );
};

// Wrapper pour les éléments Stripe
const PannierComponent = () => {
  return (
    <Elements stripe={stripePromise}>
      <CartComponent />
    </Elements>
  );
};

export default PannierComponent;