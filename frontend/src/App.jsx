import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginComponent } from './components/LoginComponent.tsx';
import HomePage from './pages/HomePage.jsx';
import { RegisterComponent } from './components/RegisterComponent.jsx';
import ProductCard from './pages/ProductCard.jsx';
import StripeCart from './components/Cart.tsx';
import PannierPages from './pages/PannierPages.jsx';
import ProfilePage from './pages/ProfilePages.jsx';
import Admin from './pages/AdminPage.jsx'
import AdminProducts from './pages/AdminPages/AdminProduct.jsx'
import EditProduct from './pages/AdminPages/EditProduct.jsx'
import CreateProduct from './pages/AdminPages/CreateProduct.jsx'

const basename = "/theo/html/site-ecommerce/frontend/dist"; 

function App() {
  return (
    // <BrowserRouter basename={basename}>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/productcard" element={<ProductCard />} />
        <Route path="/cart" element={<StripeCart />} />
        <Route path="/pannier" element={<PannierPages />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<CreateProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
