import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CartContext } from '../components/CartContext';
import { NavbarComponent } from '../components/NavBarComponents';

const BACKEND_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';

const Carousel = ({ 
  slides, 
  autoPlayInterval = 5000, 
  showArrows = true,
  showDots = true,
  slidesToShow = 1,
  gap = 4,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSlides = Math.ceil(slides.length / slidesToShow);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + slidesToShow;
      return nextIndex >= slides.length ? 0 : nextIndex;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - slidesToShow;
      return nextIndex < 0 ? Math.max(0, slides.length - slidesToShow) : nextIndex;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * slidesToShow);
  };

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(goToNext, autoPlayInterval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, autoPlayInterval]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const slideWidth = 100 / slidesToShow;

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides container */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ 
          transform: `translateX(-${(currentIndex * slideWidth)}%)`,
          gap: `${gap}px`
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{ 
              width: `calc(${slideWidth}% - ${gap * (slidesToShow - 1) / slidesToShow}px)`,
            }}
            className="flex-shrink-0 h-full flex items-center justify-center"
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="max-w-full max-h-full w-full h-[500px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-800
                       hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} className="stroke-2" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-800
                       hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNext}
            disabled={currentIndex >= slides.length - slidesToShow}
          >
            <ChevronRight size={20} className="stroke-2" />
          </button>
        </>
      )} 

      {/* Dots indicators */}
      {showDots && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              className={`transition-all duration-300 rounded-full
                         ${Math.floor(currentIndex / slidesToShow) === i 
                           ? 'w-6 h-1.5 bg-blue-600' 
                           : 'w-1.5 h-1.5 bg-gray-400 hover:bg-gray-600'}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide group ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = () => {
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { 
    id, 
    image, 
    image2, 
    image3, 
    title, 
    description, 
    price, 
    sizes 
  } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Préparer les images avec URL complète
  const images = [image,image2, image3]

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    addToCart({
      id,
      name: title,
      price: price,
      image: images[0],
      quantity: quantity,
      size: selectedSize
    });
  };

  if (!image) {
    return <div className="text-center py-8">Aucun produit sélectionné</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent /><br /><br />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Image Section with Carousel */}
          <div className="relative group">
            <Carousel 
              slides={images}
              className="h-[500px]"
              slidesToShow={1}
              autoPlayInterval={3000}
              showDots={true}
              gap={8}
            />
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Ajouter aux favoris"
            >
              <Heart 
                className={`transition-colors duration-300 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`} 
                size={20}
              />
            </button>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
              <div className="mb-8">
                <p className="text-5xl font-bold text-gray-900 tracking-tight">
                  {price.toFixed(2)} €
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <p className="text-gray-700 font-medium mb-3">Taille</p>
                <div className="flex flex-wrap gap-3">
                  {sizes && sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${
                        selectedSize === size 
                          ? 'bg-gray-900 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-8">
                <p className="text-gray-700 font-medium mb-3">Quantité</p>
                <div className="flex items-center space-x-4 bg-gray-100 w-fit rounded-lg p-2">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                  >
                    <Minus size={20} className="text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-800">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                  >
                    <Plus size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="mr-2" size={20} />
              <span>Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;