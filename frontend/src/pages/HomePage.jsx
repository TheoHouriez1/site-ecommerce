import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';
import ProductListingPage from './ProductListingPage';
import FooterComponent from '../components/FooterComponent';
import CookieConsentComponent from '../components/CookieConsentComponent';
import CarouselComponent from '../components/CarouselComponent';

const Home = () => {

  
  // Handler pour le bouton Shop Now
  const handleShopNowClick = () => {
    window.scrollTo({
      top: document.querySelector('.products-section').offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white"> 
    <NavbarComponent />
      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Carousel Component */}
        <CarouselComponent onShopNowClick={handleShopNowClick} />
        <div className="products-section">
          <ProductListingPage />
        </div>
      </div>
      
      <FooterComponent />
      <CookieConsentComponent />
    </div>
  );
};

export default Home;