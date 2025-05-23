import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Eye } from 'lucide-react';
import { useCart } from './CartContext';

const BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';

// Composant CartItem mémorisé pour éviter les re-rendus
const CartPreviewItem = ({ item, index }) => {
  // Construction correcte de l'URL de l'image
  const imageUrl = useMemo(() => {
    if (item.image) {
      // Si l'image contient déjà l'URL complète
      if (item.image.startsWith('http')) {
        return item.image;
      }
      // Sinon, construire l'URL complète
      return BASE_URL + item.image;
    }
    return "https://placehold.co/100x100?text=Image";
  }, [item.image]);

  const itemTotal = useMemo(() => {
    return (item.price * item.quantity).toFixed(2);
  }, [item.price, item.quantity]);

  return (
    <div className="flex items-center space-x-3">
      <img 
        src={imageUrl}
        alt={item.name}
        className="w-12 h-12 object-cover rounded"
        loading="lazy"
        onError={(e) => {
          e.target.src = "https://placehold.co/100x100?text=Image";
        }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-500">
          {item.selectedSize && `Taille: ${item.selectedSize} • `}Qté: {item.quantity}
        </p>
      </div>
      <p className="text-sm font-medium text-gray-800">
        €{itemTotal}
      </p>
    </div>
  );
};

const CartWidget = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(false);

  // Mémoriser les calculs du panier
  const cartStats = useMemo(() => {
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    const totalPrice = cart.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + (price * quantity);
    }, 0);
    
    return { totalItems, totalPrice };
  }, [cart]);

  // Mémoriser les articles à afficher (limite de 3)
  const previewItems = useMemo(() => {
    return cart.slice(0, 3);
  }, [cart]);

  // Fermer l'aperçu du panier quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCartPreview && !event.target.closest('.cart-widget')) {
        setShowCartPreview(false);
      }
    };
    
    if (showCartPreview) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCartPreview]);

  const handleNavigateToCart = useCallback(() => {
    navigate('/panier');
    setShowCartPreview(false);
  }, [navigate]);

  const handleNavigateToCheckout = useCallback(() => {
    navigate('/checkout');
    setShowCartPreview(false);
  }, [navigate]);

  const toggleCartPreview = useCallback(() => {
    setShowCartPreview(prev => !prev);
  }, []);

  const closeCartPreview = useCallback(() => {
    setShowCartPreview(false);
  }, []);

  return (
    <div className="cart-widget fixed bottom-6 right-6 z-50">
      {/* Aperçu du panier avec contenu */}
      {showCartPreview && cart.length > 0 && (
        <div className="mb-4 bg-white rounded-lg shadow-lg border p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Mon panier</h3>
            <button 
              onClick={closeCartPreview}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Fermer l'aperçu du panier"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            {previewItems.map((item, index) => (
              <CartPreviewItem 
                key={`${item.id || item.productId}-${item.selectedSize || 'no-size'}-${index}`}
                item={item}
                index={index}
              />
            ))}
            
            {cart.length > 3 && (
              <p className="text-xs text-gray-500 text-center py-2">
                +{cart.length - 3} autre{cart.length - 3 > 1 ? 's' : ''} article{cart.length - 3 > 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-800">Total:</span>
              <span className="font-bold text-lg text-black">€{cartStats.totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={handleNavigateToCart}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors flex items-center justify-center"
              >
                <Eye size={16} className="mr-1" />
                Voir le panier
              </button>
              <button 
                onClick={handleNavigateToCheckout}
                className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white rounded transition-colors"
                disabled={cartStats.totalItems === 0}
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Aperçu panier vide */}
      {showCartPreview && cart.length === 0 && (
        <div className="mb-4 bg-white rounded-lg shadow-lg border p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Mon panier</h3>
            <button 
              onClick={closeCartPreview}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Fermer l'aperçu du panier"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="text-center py-6">
            <ShoppingCart className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-500">Votre panier est vide</p>
            <button 
              onClick={() => {
                navigate('/');
                closeCartPreview();
              }}
              className="mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        </div>
      )}

      {/* Bouton panier flottant */}
      <button 
        onClick={toggleCartPreview}
        className="relative bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        aria-label={`Panier (${cartStats.totalItems} article${cartStats.totalItems > 1 ? 's' : ''})`}
      >
        <ShoppingCart size={24} />
        {cartStats.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {cartStats.totalItems > 99 ? '99+' : cartStats.totalItems}
          </span>
        )}
      </button>
    </div>
  );
};

export default CartWidget;