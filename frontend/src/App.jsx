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
  import AdminOrder from './pages/AdminPages/AdminOrder.jsx';
  import AdminDashboard from './pages/AdminPages/AdminDashbord.jsx';
  import ContactPage from './pages/ContactPage.jsx'; 
  import Album from './pages/AlbumPage.jsx'; 
  import UserOrder from './pages/OrderPage.jsx';
  import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
  import FAQPage from './pages/FAQPage.jsx';
  import GuideTaille from './pages/GuideTaille.jsx';

  const basename = "/theo/site-ecommerce/frontend/dist"; 

  function App() {

    return (
      <BrowserRouter basename={basename}>
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
          <Route path="/admin/orders" element={<AdminOrder />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/album" element={<Album />} />
          <Route path="/orders" element={<UserOrder />} />
          <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/guide-taille" element={<GuideTaille />} />
        </Routes>
      </BrowserRouter>

    );
  }

  export default App;