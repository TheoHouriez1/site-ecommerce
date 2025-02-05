import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginComponent } from './components/LoginComponent';
import HomePage from './pages/HomePage';
import { RegisterComponent } from './components/RegisterComponent';
import ProductCard from './pages/ProductCard';
import StripeCart from './components/Cart';
import PannierPages from './pages/PannierPages';
import ProfilePage from './pages/ProfilePages';
import Admin from './pages/ArticlePage'

const basename = "/theo/html/site-ecommerce/frontend/dist"; 

function App() {
  return (
    <BrowserRouter basename={basename}>
     {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/productcard" element={<ProductCard />} />
        <Route path="/cart" element={<StripeCart />} />
        <Route path="/pannier" element={<PannierPages />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
