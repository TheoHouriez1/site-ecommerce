import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { NavbarComponent } from '../components/NavBarComponents';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard 
} from 'lucide-react';

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      {/* Image */}
      <div className="relative group overflow-hidden rounded-xl w-full sm:w-24 h-48 sm:h-24">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Informations produit */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        {item.size && (
          <p className="text-gray-500 text-sm mt-1">Taille: {item.size}</p>
        )}
        <p className="text-gray-900 font-medium mt-1">{item.price.toFixed(2)} €</p>
      </div>

      {/* Contrôles quantité et suppression */}
      <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center gap-3 mt-4 sm:mt-0">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-300"
          >
            <Minus size={16} className="text-gray-600" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-300"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
        <button 
          onClick={() => removeFromCart(item.id, item.size)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  </div>
);

const CartSummary = ({ total, onCheckout }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
    
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
      <div className="flex justify-between text-lg font-bold text-gray-800">
        <span>Total</span>
        <span>{total.toFixed(2)} €</span>
      </div>
    </div>
    <button 
      onClick={onCheckout}
      className="w-full bg-gray-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <CreditCard size={20} />
      <span>Procéder au paiement</span>
    </button>
  </div>
);

const EmptyCart = ({ onContinueShopping }) => (
  <div className="text-center py-16">
    <ShoppingBag className="mx-auto text-gray-400 mb-6" size={64} />
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
    <p className="text-gray-600 mb-8">Ajoutez des articles pour commencer vos achats</p>
    <button 
      onClick={onContinueShopping}
      className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300"
    >
      Continuer mes achats
    </button>
  </div>
);

const PannierPages = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Redirection vers la page de paiement
    navigate('/cart');
  };

  // Calculer le nombre total d'articles (en tenant compte des quantités)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarComponent /> <br />
        <div className="pt-20">
          <EmptyCart onContinueShopping={() => navigate('/')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent /><br /><br />
      <div className="pt-20 px-2 sm:px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
              Votre Panier
            </h1>
            <span className="text-gray-500">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            <div className="md:col-span-2 space-y-4 sm:space-y-6">
              {cart.map(item => (
                <CartItem 
                  key={`${item.id}-${item.size}`}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
            <div className="mt-6 md:mt-0">
              <CartSummary 
                total={getCartTotal()}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PannierPages;