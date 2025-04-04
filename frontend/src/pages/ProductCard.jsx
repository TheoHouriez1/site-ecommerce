import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  Check,
  Truck,
  Clock,
  Shield
} from 'lucide-react';
import { CartContext } from '../components/CartContext';
import { NavbarComponent } from '../components/NavBarComponents';
const BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';

const ProductCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const {
    id,
    name,
    image,
    image2,
    image3,
    description,
    price,
    sizes,
    category = "Vêtements"
  } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const processedUrls = [];
    
    // Fonction pour traiter et ajouter uniquement les images valides
    const processImage = (img, label) => {
      if (img && img !== null && typeof img === 'string') {
        const isFullUrl = img.startsWith('http://') || img.startsWith('https://');
        const finalUrl = isFullUrl ? img : `${BASE_URL}${img}`;
        console.log(`✔ ${label} chargée:`, finalUrl);
        processedUrls.push(finalUrl);
      } else {
        console.warn(`⚠ ${label} absente ou null, ignorée`);
      }
    };

    // Traitement des images une par une
    processImage(image, "Image principale");
    processImage(image2, "Image 2");
    processImage(image3, "Image 3");
    
    // Vérifier qu'il y a au moins une image, sinon ajouter une image par défaut
    if (processedUrls.length === 0) {
      processedUrls.push("https://placehold.co/600x800?text=Image+non+disponible");
    }
    
    setImageUrls(processedUrls);
  }, [image, image2, image3]);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes && sizes.length > 0) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    addToCart({
      id,
      name: name,
      price: price,
      image: imageUrls[0],
      quantity: quantity,
      size: selectedSize
    });
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
            <ShoppingCart size={32} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Aucun produit sélectionné</h1>
          <p className="text-gray-600 mb-6">Veuillez retourner à la page des produits pour faire votre sélection.</p>
          <button
            onClick={goBack}
            className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent /> <br /><br /> <br />
      <div className="container mx-auto px-4 py-12">
        <div className="lg:flex gap-12">
          <div className="lg:w-7/12 mb-8 lg:mb-0">
            <div className="flex gap-6">
              {/* Miniatures des images (uniquement si il y a plus d'une image) */}
              {imageUrls.length > 1 && (
                <div className="hidden lg:block w-20">
                  {imageUrls.map((img, idx) => (
                    <button
                      key={idx}
                      className={`h-20 w-20 rounded-lg overflow-hidden mb-2 transition-all duration-300 ${
                        idx === currentImageIndex
                          ? 'ring-2 ring-gray-900 ring-offset-2'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img
                        src={img}
                        alt={`Product view ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100x100?text=Erreur";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 relative h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={`Product image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x800?text=Image+non+disponible";
                  }}
                />
                {/* Boutons de navigation (uniquement si il y a plus d'une image) */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200"
                      onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
                    >
                      <ChevronLeft size={20} className="stroke-2" />
                    </button>
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200"
                      onClick={() => setCurrentImageIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
                    >
                      <ChevronRight size={20} className="stroke-2" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white transition-all duration-300"
                  aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} size={18} />
                </button>
                <button
                  className="absolute top-4 left-4 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white transition-all duration-300"
                  aria-label="Partager ce produit"
                >
                  <Share2 size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-5/12">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-4">
                  {category}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">{price?.toFixed(2)} €</p>
              </div>
              <div className="mb-8 border-b border-gray-100 pb-6">
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
              {sizes && sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-800 font-medium">Taille</p>
                    <button className="text-sm text-gray-500 hover:text-gray-800 underline"onClick={() => navigate('/guide-taille')}>
                      Guide des tailles
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] px-4 py-2.5 rounded-lg transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-1'
                            : 'bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-8">
                <p className="text-gray-800 font-medium mb-3">Quantité</p>
                <div className="flex items-center space-x-1 border border-gray-200 w-fit rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-100 transition-colors duration-200"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                  </button>
                  <div className="w-12 text-center font-medium text-gray-800 border-x border-gray-200">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2" size={18} />
                  <span className="font-medium">Ajouter au panier</span>
                </button>
                {showAddedToCart && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-4 px-6 rounded-xl flex items-center justify-center animate-fade-in-down">
                    <Check className="mr-2" size={18} />
                    <span className="font-medium">Ajouté au panier</span>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Truck className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Livraison gratuite</p>
                      <p className="text-sm text-gray-500">Pour les commandes de plus de 50€</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Livraison rapide</p>
                      <p className="text-sm text-gray-500">Expédition sous 24h</p>
                    </div>
                  </div>
                  <div className="flex items-start md:col-span-2">
                    <Shield className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Retours faciles</p>
                      <p className="text-sm text-gray-500">Retours gratuits sous 30 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;