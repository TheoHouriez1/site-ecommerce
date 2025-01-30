import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

const Productcard = () => {
  const location = useLocation();
  const { 
    image, 
    title, 
    description, 
    price 
  } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    alert(`Ajouté au panier : ${title}, Quantité : ${quantity}, Taille : ${selectedSize}`);
  };

  if (!image) {
    return <div className="text-center py-8">Aucun produit sélectionné</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <button 
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            aria-label="Ajouter aux favoris"
          >
            <Heart className="text-red-500" />
          </button>
        </div>

        {/* Détails du produit */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="mb-6">
            <p className="text-4xl font-bold text-gray-900">{price.toFixed(2)} €</p>
          </div>

          {/* Sélection de taille */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Taille :</p>
            <div className="flex space-x-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection de quantité */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Quantité :</p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Bouton Ajouter au panier */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <ShoppingCart className="mr-2" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Productcard;