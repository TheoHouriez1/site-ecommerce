import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { LoginComponent } from './components/LoginComponent';
import HomePage from './pages/HomePage';
import { RegisterComponent } from './components/RegisterComponent';
import ProductCard from './pages/ProductCard';
import StripeCart from './components/Cart';
import { CartProvider } from './components/CartContext';
import PannierPages from './pages/PannierPages';
import  ProfilePage  from './pages/ProfilePages';
import StripeCheckout from './components/Cart';

 
function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Ajoutez le CartProvider ici */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="/productcard" element={<ProductCard />} />
            <Route path="/cart" element={<StripeCart />} />
            <Route path="/pannier" element={<PannierPages />} />
            <Route path="/profile" element={<ProfilePage />} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;