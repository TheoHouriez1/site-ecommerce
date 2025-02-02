import React, { createContext, useState, useContext, useEffect } from 'react';

// Interface pour les produits du panier
interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string; // Ajout de la taille comme propriété optionnelle
}

// Interface pour le contexte du panier
interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => void;
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
      const existingProductIndex = currentCart.findIndex(
        item => item.id === product.id && item.size === product.size
      );
      
      if (existingProductIndex > -1) {
        // Si le produit existe avec la même taille, augmenter la quantité
        const updatedCart = [...currentCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      }
      
      // Ajouter un nouveau produit
      return [...currentCart, product];
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId: number, size?: string) => {
    setCart(currentCart => 
      currentCart.filter(item => {
        if (size) {
          // Si une taille est spécifiée, supprimer uniquement le produit avec cette taille
          return !(item.id === productId && item.size === size);
        }
        // Sinon, supprimer toutes les variantes du produit
        return item.id !== productId;
      })
    );
  };

  // Mettre à jour la quantité
  const updateQuantity = (productId: number, quantity: number, size?: string) => {
    setCart(currentCart => 
      currentCart.map(item => {
        if (size) {
          // Si une taille est spécifiée, mettre à jour uniquement le produit avec cette taille
          return (item.id === productId && item.size === size)
            ? {...item, quantity: Math.max(0, quantity)}
            : item;
        }
        // Sinon, mettre à jour toutes les variantes du produit
        return item.id === productId
          ? {...item, quantity: Math.max(0, quantity)}
          : item;
      }).filter(item => item.quantity > 0)
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