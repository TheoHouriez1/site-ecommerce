import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Truck,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const ProductCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
      
const getProductIdFromURL = () => {
  const hashValue = window.location.hash;
  
  if (hashValue) {
    const hashPath = hashValue.substring(1);
    
    const pathParts = hashPath.split('/');
    
    const lastPart = pathParts[pathParts.length - 1];
    
    if (!isNaN(lastPart)) {
      return lastPart;
    }
  }
  
  return null;
};
  const productId = getProductIdFromURL();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showAuthInfo, setShowAuthInfo] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
    
        const response = await fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/product", {
          headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": API_TOKEN
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        
        const products = await response.json();
        const foundProduct = products.find(p => p.id === parseInt(productId));
        
        
        const formattedProduct = {
          id: foundProduct.id,
          name: foundProduct.name,
          image: foundProduct.image ? BASE_URL + foundProduct.image : null,
          image2: foundProduct.image2 ? BASE_URL + foundProduct.image2 : null,
          image3: foundProduct.image3 ? BASE_URL + foundProduct.image3 : null,
          description: foundProduct.description,
          price: parseFloat(foundProduct.price),
          sizes: foundProduct.sizes,
          category: foundProduct.category || "Vêtements",
          stock: foundProduct.stock || 0
        };
        
        setProduct(formattedProduct);
        setLoading(false);
        
        console.log('Product fetched:', formattedProduct);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        setError(error.message);
        setLoading(false);
        navigate('*');
      }
    };
    
    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
      navigate('*');

    }
  }, [productId, location]);
  
  useEffect(() => {
    if (!product) return;
  
    window.scrollTo(0, 0);
    const processedUrls = [];
  
    const processImage = (img) => {
      if (img && typeof img === 'string') {
        processedUrls.push(img);
      }
    };
  
    processImage(product.image);
    processImage(product.image2);
    processImage(product.image3);
  
    if (processedUrls.length === 0) {
      processedUrls.push("https://placehold.co/600x800?text=Image+non+disponible");
    }
  
    setImageUrls(processedUrls);
  }, [product]);
  
  const handleQuantityChange = (change) => {
    if (!product) return;
    
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(Math.min(newQuantity, product.stock));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const isInStock = product.stock > 0;
    
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    if (!isInStock) {
      alert('Ce produit est actuellement épuisé.');
      return;
    }
    
    try {
        if (!user || !user.isAuthenticated) {
        alert('Veuillez vous connecter pour ajouter des produits au panier');
        return;
      }
      
      const userId = user.id;
      
      const response = await fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/cart/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: quantity,
          size: selectedSize || null 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout au panier');
      }
      
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  const goBack = () => navigate(-1);
  const formaterDateAvecJoursAjoutes = (date, joursAjoutes) => {
    
    const nouvelleDate = new Date(date);
    nouvelleDate.setDate(nouvelleDate.getDate() + joursAjoutes);
    const jour = String(nouvelleDate.getDate()).padStart(2, '0');
    const mois = String(nouvelleDate.getMonth() + 1).padStart(2, '0');
    return `${jour}/${mois}`;
  };
  const now = new Date();
  const deliveryDates = {
    received: formaterDateAvecJoursAjoutes(now, 0),
    prepared: `${formaterDateAvecJoursAjoutes(now, 2)} - ${formaterDateAvecJoursAjoutes(now, 3)}`,
    delivered: `${formaterDateAvecJoursAjoutes(now, 6)} - ${formaterDateAvecJoursAjoutes(now, 7)}`
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Loader className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-800">Chargement du produit...</h2>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg text-center p-8">
          <ArrowLeft size={32} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Erreur</h1>
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
  const isInStock = product && product.stock > 0;
  return product && (
    <div className="min-h-screen bg-gray-50">
    
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <span className="text-black font-medium">{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-7/12 relative">
        
              <div className="relative aspect-[4/5]">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x800?text=Image+non+disponible";
                  }}
                />
                
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
                        alt={`Vue ${idx + 1} de ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="lg:w-5/12 p-6 lg:p-8 lg:border-l border-gray-200">
              <h1 className="text-2xl font-medium text-gray-800 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-black mb-4">€{product.price?.toFixed(2)}</p>
              
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
              <div className="mb-6 bg-gray-50 p-3 rounded">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 fill-current text-yellow-500" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">5.0 (prochainement)</span>
                </div>
              </div>
              
              <button className="text-sm text-black font-medium mb-4 hover:underline flex items-center" onClick={() => navigate('/guide-tailles')}>
                <span className="mr-1">GUIDE DES TAILLES</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Taille</p>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
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
                    disabled={quantity >= product.stock}
                    className={`p-2 text-gray-500 ${quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : 'hover:text-black'}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
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
                      <p>{product.description || 'Aucune description disponible pour ce produit.'}</p>
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