import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavbarComponent } from '../components/NavBarComponents';
import ProductListingPage from './ProductListingPage';
import FooterComponent from '../components/FooterComponent';
import CookieConsentComponent from '../components/CookieConsentComponent';
import CarouselComponent from '../components/CarouselComponent';

const Home = () => {
  // Données pour la section des collections
  const collections = [
    {
      name: 'Supreme',
      image: 'https://images.unsplash.com/photo-1543508184-5c555b513d11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      description: 'Drops et collaborations iconiques'
    },
    {
      name: 'Nike',
      image: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      description: 'Classics réédités et pièces vintage'
    },
    {
      name: 'Carhartt',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80',
      description: 'Workwear intemporel et fonctionnel'
    },
    {
      name: 'Adidas',
      image: 'https://images.unsplash.com/photo-1578021046026-483fa99ffad3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      description: 'Classics sportifs et collaborations'
    }
  ];
  
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