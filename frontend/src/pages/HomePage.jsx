import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';
import ProductListingPage from './ProductListingPage';

const Home = () => {


  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent /> <br /><br />

          <ProductListingPage />
  </div>

  );
};

export default Home;