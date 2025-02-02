import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { CartContext } from '../components/CartContext';
import { NavbarComponent } from '../components/NavBarComponents';

const ProductCard = () => {
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const { id, image, title, description, price, sizes } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLiked, setIsLiked] = useState(false);

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
      image: image,
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
          {/* Image Section */}
          <div className="relative group">
            <div className="overflow-hidden rounded-xl">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
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