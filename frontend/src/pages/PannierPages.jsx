import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { NavbarComponent } from '../components/NavBarComponents';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard,
  ArrowLeft,
  Info
} from 'lucide-react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="bg-white rounded-lg p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      {/* Image */}
      <div className="relative group overflow-hidden rounded-md w-full sm:w-24 h-48 sm:h-24">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x400?text=Image+non+disponible";
          }}
        />
      </div>
      
      {/* Informations produit */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
        {item.size && (
          <p className="text-gray-500 text-sm mt-1">Taille: {item.size}</p>
        )}
        <p className="text-black font-bold mt-1">{item.price.toFixed(2)} €</p>
      </div>

      {/* Contrôles quantité et suppression */}
      <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center gap-3 mt-4 sm:mt-0">
        <div className="flex items-center border border-gray-200 rounded-md p-1">
          <button 
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
            disabled={item.quantity <= 1}
          >
            <Minus size={16} className={`${item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
        <button 
          onClick={() => removeFromCart(item.id, item.size)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-300"
          aria-label="Supprimer l'article"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div> 
  </div>
);

const CartSummary = ({ total, onCheckout, isEmpty }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
    
    <div className="space-y-4 mb-6">
      <div className="flex justify-between text-gray-600">
        <span>Sous-total</span>
        <span className="font-medium">{total.toFixed(2)} €</span>
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
    <button 
      onClick={onCheckout}
      disabled={isEmpty}
      className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
        isEmpty 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      <CreditCard size={20} />
      <span>Procéder au paiement</span>
    </button>
    {isEmpty && (
      <p className="text-gray-500 text-xs text-center mt-2">
        Ajoutez des articles au panier pour passer commande
      </p>
    )}
  </div>
);

const EmptyCart = ({ onContinueShopping }) => (
  <div className="bg-white rounded-lg shadow-md p-8 text-center">
    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <ShoppingBag className="text-gray-400" size={40} />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
    <p className="text-gray-600 mb-8">Ajoutez des articles pour commencer vos achats</p>
    
    <div className="space-y-4">
      <button 
        onClick={onContinueShopping}
        className="w-full bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <ArrowLeft size={18} />
        <span>Continuer mes achats</span>
      </button>
    </div>
  </div>
);

const PannierPages = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  // Calculer le nombre total d'articles (en tenant compte des quantités)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleCheckout = () => {
    // Redirection vers la page de paiement
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <span className="text-black font-medium">Panier</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-2 sm:mb-0">
            Votre Panier
          </h1>
          <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            {totalItems} article{totalItems > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {cart.length === 0 ? (
              <EmptyCart onContinueShopping={() => navigate('/')} />
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItem 
                    key={`${item.id}-${item.size}`}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div>
            <CartSummary 
              total={getCartTotal()}
              onCheckout={handleCheckout}
              isEmpty={cart.length === 0}
            />
            
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-2">Notre service client est disponible du lundi au vendredi de 9h à 18h.</p>
              <a href="tel:+33123456789" className="text-black hover:underline text-sm font-medium">+33 1 23 45 67 89</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PannierPages;