import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import ProductCard from './pages/ProductCard.jsx';
import StripeCart from './components/Cart.jsx';
import PannierPages from './pages/PannierPages.jsx';
import ProfilePage from './pages/ProfilePages.jsx';
import Admin from './pages/AdminPage.jsx';
import AdminProducts from './pages/AdminPages/AdminProduct.jsx';
import EditProduct from './pages/AdminPages/EditProduct.jsx';
import CreateProduct from './pages/AdminPages/CreateProduct.jsx';
import AdminOrder from './pages/AdminPages/AdminOrder.jsx';
import AdminDashboard from './pages/AdminPages/AdminDashbord.jsx';
import ContactPage from './pages/ContactPage.jsx'; 
import UserOrder from './pages/OrderPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import GuideTaille from './pages/GuideTaille.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import LoginComponent from './components/LoginComponent.jsx';
import RegisterComponent from './components/RegisterComponent.jsx';
function App() {  
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductCard />} />
        <Route path="/checkout" element={<StripeCart />} />
        <Route path="/panier" element={<PannierPages />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<CreateProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/admin/orders" element={<AdminOrder />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/orders" element={<UserOrder />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/guide-tailles" element={<GuideTaille />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
