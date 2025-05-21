import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CreditCard, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

const API_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/product';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const CartItem = ({ item, updateQuantity, removeFromCart, stock }) => {
  const imageUrl = `http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${item.image}`;
  const isMaxReached = typeof stock === 'number' && item.quantity >= stock;

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="relative group overflow-hidden rounded-md w-full sm:w-24 h-48 sm:h-24">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x400?text=Image+non+disponible";
            }}
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
          {item.selectedSize && (
            <p className="text-gray-500 text-sm mt-1">Taille: {item.selectedSize}</p>
          )}
          <p className="text-black font-bold mt-1">
            {typeof item.price === 'number' ? `${item.price.toFixed(2)} €` : 'Prix inconnu'}
          </p>
        </div>
        <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center gap-3 mt-4 sm:mt-0">
          <div className="flex items-center border border-gray-200 rounded-md p-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
              disabled={item.quantity <= 1}
            >
              <Minus size={16} className={`${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
              disabled={isMaxReached}
            >
              <Plus size={16} className={`${isMaxReached ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-300"
            aria-label="Supprimer l'article"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PannierPages = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, fetchCartFromServer } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      await fetchCartFromServer();
      try {
        const res = await fetch(API_URL, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-TOKEN': API_TOKEN
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Réponse API non valide :", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Erreur récupération produits :", err);
        setProducts([]);
      }
    };
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-2 sm:mb-0">
            Votre Panier
          </h1>
          <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            {cart.length} article{cart.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => {
              const matched = products.find(p => p.name === item.name);
              const stock = matched && typeof matched.stock === 'number' ? matched.stock : 0;

              return (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  stock={stock}
                />
              );
            })}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Sous-total</span>
              <span>{getCartTotal().toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Livraison</span>
              <span className="text-green-500">Gratuite</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-black font-bold text-lg">
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)} €</span>
            </div>
            <button
              className={`w-full mt-4 py-3 rounded-md transition-all duration-300 ${
                cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
              disabled={cart.length === 0}
              onClick={() => navigate('/checkout')}
            >
              <CreditCard className="inline mr-2" size={18} />
              Procéder au paiement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PannierPages;
