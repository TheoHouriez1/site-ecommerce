import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CreditCard, ArrowLeft, Trash2, Plus, Minus, Loader } from 'lucide-react';

const API_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/product';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const CartItem = React.memo(({ item, updateQuantity, removeFromCart, stock }) => {
  const imageUrl = `http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/${item.image}`;
  const isMaxReached = typeof stock === 'number' && item.quantity >= stock;
  
  const handleDecrement = useCallback(() => {
    updateQuantity(item.id, item.quantity - 1);
  }, [item.id, item.quantity, updateQuantity]);
  
  const handleIncrement = useCallback(() => {
    updateQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, updateQuantity]);
  
  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
  }, [item.id, removeFromCart]);

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
              onClick={handleDecrement}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
              disabled={item.quantity <= 1}
            >
              <Minus size={16} className={`${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
              disabled={isMaxReached}
            >
              <Plus size={16} className={`${isMaxReached ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-300"
            aria-label="Supprimer l'article"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

const PannierPages = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, fetchCartFromServer } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs pour éviter les rechargements en boucle
  const hasLoadedRef = useRef(false);
  const currentUserIdRef = useRef(null);

  // Mémoriser le mapping des stocks pour éviter les recalculs
  const stockMap = useMemo(() => {
    const map = new Map();
    products.forEach(product => {
      map.set(product.name, product.stock || 0);
    });
    return map;
  }, [products]);

  // Mémoriser le total du panier
  const cartTotal = useMemo(() => {
    try {
      return getCartTotal();
    } catch (error) {
      console.error('Erreur calcul total:', error);
      return 0;
    }
  }, [cart, getCartTotal]);

  // Fonction de chargement des produits séparée et mémorisée
  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Réponse API non valide :", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Erreur récupération produits :", err);
      setError("Erreur lors du chargement des produits");
      setProducts([]);
    }
  }, []); // Pas de dépendances, cette fonction ne change jamais

  // Fonction de chargement du panier séparée et mémorisée
  const loadCart = useCallback(async () => {
    try {
      await fetchCartFromServer();
    } catch (err) {
      console.error("Erreur récupération panier :", err);
      // Ne pas arrêter le chargement pour une erreur de panier
    }
  }, [fetchCartFromServer]);

  // Effect principal - ne se déclenche qu'une fois ou quand l'utilisateur change
  useEffect(() => {
    const loadData = async () => {
      // Vérifier si on a déjà chargé pour cet utilisateur
      const currentUserId = user?.id || 'guest';
      if (hasLoadedRef.current && currentUserIdRef.current === currentUserId) {
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Charger en parallèle mais ne pas bloquer si l'un échoue
        await Promise.allSettled([
          loadCart(),
          loadProducts()
        ]);
        
        // Marquer comme chargé pour cet utilisateur
        hasLoadedRef.current = true;
        currentUserIdRef.current = currentUserId;
        
      } catch (err) {
        console.error("Erreur générale :", err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, loadCart, loadProducts]); // Seulement quand l'ID utilisateur change

  // Réinitialiser le flag de chargement quand l'utilisateur change
  useEffect(() => {
    const currentUserId = user?.id || 'guest';
    if (currentUserIdRef.current !== currentUserId) {
      hasLoadedRef.current = false;
    }
  }, [user?.id]);

  // Composant de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Loader className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-800">Chargement du panier...</h2>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              hasLoadedRef.current = false;
              window.location.reload();
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Panier vide
  if (!loading && (!cart || cart.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-medium text-gray-800 mb-2">Votre panier est vide</h1>
            <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez vos favoris !</p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="inline mr-2" size={18} />
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-2 sm:mb-0">
            Votre Panier
          </h1>
          <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            {cart?.length || 0} article{(cart?.length || 0) > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cart?.map(item => {
              const stock = stockMap.get(item.name) || 0;
              return (
                <CartItem
                  key={`${item.id}_${item.selectedSize || 'no-size'}_${item.quantity}`}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  stock={stock}
                />
              );
            })}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Livraison</span>
              <span className="text-green-500">Gratuite</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-black font-bold text-lg">
              <span>Total</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            <button
              className={`w-full mt-4 py-3 rounded-md transition-all duration-300 ${
                !cart || cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
              disabled={!cart || cart.length === 0}
              onClick={() => navigate('/checkout')}
            >
              <CreditCard className="inline mr-2" size={18} />
              Procéder au paiement
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full mt-2 py-3 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="inline mr-2" size={18} />
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PannierPages;