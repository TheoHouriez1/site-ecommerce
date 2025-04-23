import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CartContext = createContext();
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCartFromServer = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Erreur lors du chargement du panier');

      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error('fetchCartFromServer:', error);
    }
  };

  useEffect(() => {
    fetchCartFromServer();
  }, [user]);

  const addToCart = async (productId, quantity = 1, size = '') => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id, productId, quantity, size })
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout au panier");
      await fetchCartFromServer();
    } catch (error) {
      console.error('addToCart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));

    try {
      const res = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');
      await fetchCartFromServer();
    } catch (error) {
      console.error('removeFromCart:', error);
      await fetchCartFromServer();
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const res = await fetch(`${API_BASE_URL}/cart/update/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!res.ok) throw new Error('Erreur mise à jour quantité');
      await fetchCartFromServer();
    } catch (error) {
      console.error('updateQuantity:', error);
      await fetchCartFromServer();
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cart/clear/${user.id}`, {
        method: 'DELETE',
        headers: {
          'X-API-TOKEN': API_TOKEN
        },
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Erreur vidage panier');
      await fetchCartFromServer();
    } catch (error) {
      console.error('clearCart:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const qte = item.quantity || 0;
      const prix = item.price || 0;
      return total + qte * prix;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      fetchCartFromServer
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
