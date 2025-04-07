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
  Check,
  Plus as PlusIcon,
  Box,
  Truck
} from 'lucide-react';
import { CartContext } from '../components/CartContext';
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
    category = "Vêtements",
    stock = 1
  } = location.state || {};
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showAuthInfo, setShowAuthInfo] = useState(false);
  
  // Vérifier si le produit est en stock
  const isInStock = stock > 0;

  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
    
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
    const newQuantity = Math.max(1, quantity + change);
    // Limiter la quantité au stock disponible
    setQuantity(Math.min(newQuantity, stock));
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes && sizes.length > 0) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (!isInStock) {
      alert('Ce produit est actuellement épuisé.');
      return;
    }
    
    addToCart({
      id,
      name: name,
      price: price,
      image: imageUrls[0],
      quantity: quantity,
      size: selectedSize,
      stock: stock
    });
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    setIsLiked(!isLiked);
  };

  const goBack = () => {
    navigate(-1);
  };

  const dateActuelle = new Date();

  function formaterDateAvecJoursAjoutes(date, joursAjoutes) {
    const nouvelleDate = new Date(date);
    nouvelleDate.setDate(nouvelleDate.getDate() + joursAjoutes);
    
    const jour = String(nouvelleDate.getDate()).padStart(2, '0');
    const mois = String(nouvelleDate.getMonth() + 1).padStart(2, '0'); 
    return `${jour}/${mois}`;
  }
  
  const received = formaterDateAvecJoursAjoutes(dateActuelle,0);
  const prepared1 = formaterDateAvecJoursAjoutes(dateActuelle,2);
  const prepared2 = formaterDateAvecJoursAjoutes(dateActuelle,3);
  const delivered1 = formaterDateAvecJoursAjoutes(dateActuelle,6);
  const delivered2 = formaterDateAvecJoursAjoutes(dateActuelle,7);

  // Contenu pour la section de livraison estimée
  const deliveryDates = {
    received: received,
    prepared: prepared1 +' - '+ prepared2,
    delivered: delivered1 +' - ' + delivered2
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg text-center p-8">
          <ArrowLeft size={32} className="text-gray-800 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Aucun produit sélectionné</h1>
          <p className="text-gray-600 mb-6">Veuillez retourner à la page des produits pour faire votre sélection.</p>
          <button
            onClick={goBack}
            className="w-full py-3 px-6 bg-black text-white rounded hover:bg-gray-800 transition duration-300"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-black transition-colors">
              {category}
            </button>
            <span>/</span>
            <span className="text-black font-medium">{name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="lg:flex">
            {/* Images Column */}
            <div className="lg:w-7/12 relative">
              {/* Badge "Nouvelle arrivée" */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                  Nouvelle arrivée
                </div>
              </div>
              
              {/* Wishlist button */}
              <button 
                onClick={handleWishlist}
                className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
              >
                <Heart 
                  size={20} 
                  className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
                />
              </button>
              
              {/* Main Image */}
              <div className="relative aspect-[4/5]">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x800?text=Image+non+disponible";
                  }}
                />
                
                {/* Navigation arrows */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow text-black hover:bg-gray-100 transition-all"
                      onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow text-black hover:bg-gray-100 transition-all"
                      onClick={() => setCurrentImageIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 p-4 border-t border-gray-100 bg-gray-50">
                  {imageUrls.map((img, idx) => (
                    <button
                      key={idx}
                      className={`w-20 aspect-[4/5] rounded overflow-hidden ${idx === currentImageIndex ? 'border-2 border-black shadow' : 'border border-gray-200 opacity-70 hover:opacity-100'}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img
                        src={img}
                        alt={`Vue ${idx + 1} de ${name}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info Column */}
            <div className="lg:w-5/12 p-6 lg:p-8 lg:border-l border-gray-200">
              <h1 className="text-2xl font-medium text-gray-800 mb-2">{name}</h1>
              <p className="text-2xl font-bold text-black mb-4">€{price?.toFixed(2)}</p>
              
              {/* Stock Status */}
              <div className="mb-6">
                {isInStock ? (
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">En stock</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Épuisé</span>
                  </div>
                )}
              </div>
              
              {/* Reviews */}
              <div className="mb-6 bg-gray-50 p-3 rounded">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 fill-current text-yellow-500" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">5.0 (64 avis)</span>
                </div>
              </div>
              
              {/* Size Guide Button */}
              <button className="text-sm text-black font-medium mb-4 hover:underline flex items-center" onClick={() => navigate('/guide-tailles')}>
                <span className="mr-1">GUIDE DES TAILLES</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Sizes */}
              {sizes && sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Taille</p>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!isInStock}
                        className={`py-2 border rounded-md text-sm transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white font-medium shadow-sm'
                            : 'border-gray-300 text-gray-700 hover:border-black hover:text-black'
                        } ${!isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Quantité</p>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`p-2 text-gray-500 ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-black'}`}
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 text-center font-medium text-gray-700">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= stock}
                    className={`p-2 text-gray-500 ${quantity >= stock ? 'opacity-50 cursor-not-allowed' : 'hover:text-black'}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className={`w-full py-3 rounded-md text-center uppercase font-medium flex items-center justify-center ${
                    isInStock
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  {isInStock ? (
                    <>
                      <ShoppingCart className="mr-2" size={18} />
                      Ajouter au panier
                    </>
                  ) : 'Épuisé'}
                </button>
              </div>
              
              {/* Delivery Info */}
              <div className="mb-8 bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Estimation de livraison</h3>
                <div className="flex items-center justify-between space-x-4 text-center">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center bg-black text-white mb-2">
                      <Check size={16} />
                    </div>
                    <p className="text-xs text-gray-500">Reçue</p>
                    <p className="text-xs font-medium">{deliveryDates.received}</p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 flex-grow"></div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center border-2 border-gray-300 bg-white mb-2">
                      <Box size={16} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">Préparation</p>
                    <p className="text-xs font-medium">{deliveryDates.prepared}</p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 flex-grow"></div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="rounded-full w-10 h-10 flex items-center justify-center border-2 border-gray-300 bg-white mb-2">
                      <Truck size={16} className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">Livraison</p>
                    <p className="text-xs font-medium">{deliveryDates.delivered}</p>
                  </div>
                </div>
              </div>
              
              {/* Accordion Sections */}
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <button 
                    className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    <span className="font-medium text-gray-700">Description</span>
                    <PlusIcon size={16} className={`transform transition-transform text-black ${showDescription ? 'rotate-45' : ''}`} />
                  </button>
                  {showDescription && (
                    <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
                      <p>{description || 'Aucune description disponible pour ce produit.'}</p>
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <button 
                    className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                    onClick={() => setShowShipping(!showShipping)}
                  >
                    <span className="font-medium text-gray-700">Livraisons</span>
                    <PlusIcon size={16} className={`transform transition-transform text-black ${showShipping ? 'rotate-45' : ''}`} />
                  </button>
                  {showShipping && (
                    <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
                      <div className="flex items-start mb-2">
                        <Truck size={16} className="mr-2 mt-1 text-black" />
                        <p>Expédition standard sous 5-7 jours ouvrables.</p>
                      </div>
                      <div className="flex items-start">
                        <Check size={16} className="mr-2 mt-1 text-green-500" />
                        <p>Livraison gratuite !</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <button 
                    className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                    onClick={() => setShowReturns(!showReturns)}
                  >
                    <span className="font-medium text-gray-700">Retours</span>
                    <PlusIcon size={16} className={`transform transition-transform text-black ${showReturns ? 'rotate-45' : ''}`} />
                  </button>
                  {showReturns && (
                    <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
                      <p>Retours acceptés dans les 30 jours suivant la réception.</p>
                      <p className="mt-2">Les articles doivent être en état neuf avec toutes les étiquettes d'origine.</p>
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <button 
                    className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                    onClick={() => setShowAuthInfo(!showAuthInfo)}
                  >
                    <span className="font-medium text-gray-700">Authenticité</span>
                    <PlusIcon size={16} className={`transform transition-transform text-black ${showAuthInfo ? 'rotate-45' : ''}`} />
                  </button>
                  {showAuthInfo && (
                    <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
                      <p>Tous nos articles sont 100% authentiques et vérifiés par nos experts.</p>
                      <p className="mt-2">Chaque pièce est soigneusement inspectée avant expédition.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white py-3 px-4 rounded-md shadow-lg flex items-center">
          <Check size={18} className="mr-2" />
          <span>Produit ajouté au panier</span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;