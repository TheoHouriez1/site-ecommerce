import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

// Chargez votre clé publique Stripe
const stripePromise = loadStripe('pk_test_VOTRE_CLE_PUBLIQUE_STRIPE');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Créer un intent de paiement
      const response = await fetch('http://votre-backend.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(getCartTotal() * 100), // Montant en centimes
          currency: 'eur'
        })
      });

      const { clientSecret } = await response.json();

      // Confirmer le paiement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Nom du client' // Personnalisez si possible
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
          navigate('/'); // Redirection après paiement
        }
      }
    } catch (err) {
      setError('Erreur lors du paiement');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      {error && <div className="text-red-500">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {processing ? 'Paiement en cours...' : `Payer ${getCartTotal().toFixed(2)} €`}
      </button>
    </form>
  );
};

const StripeCheckout = () => {
  const { cart, getCartTotal } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Paiement</h2>
      
      {cart.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="text-xl">Récapitulatif</h3>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
            <div className="font-bold mt-2">
              Total : {getCartTotal().toFixed(2)} €
            </div>
          </div>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default StripeCheckout;  