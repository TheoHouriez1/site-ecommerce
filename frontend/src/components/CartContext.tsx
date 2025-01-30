import React, { createContext, useState, useContext, useEffect } from 'react';

// Interface pour les produits du panier
interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Interface pour le contexte du panier
interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Création du contexte
export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0
});

// Fournisseur du contexte
export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    // Charger le panier depuis le localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sauvegarder le panier dans le localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (product: CartProduct) => {
    setCart(currentCart => {
      const existingProductIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex > -1) {
        // Si le produit existe, augmenter la quantité
        const updatedCart = [...currentCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      }
      
      // Ajouter un nouveau produit
      return [...currentCart, {...product, quantity: 1}];
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId: number) => {
    setCart(currentCart => 
      currentCart.filter(item => item.id !== productId)
    );
  };

  // Mettre à jour la quantité
  const updateQuantity = (productId: number, quantity: number) => {
    setCart(currentCart => 
      currentCart.map(item => 
        item.id === productId 
          ? {...item, quantity: Math.max(0, quantity)}
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Calculer le total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCart = () => useContext(CartContext);