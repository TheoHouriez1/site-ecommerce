import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X,
  ChevronDown,
  Package,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';

const UserOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateDesc');

  const parseArticles = (articleString) => {
    if (!articleString) return [];
    try {
      const articles = articleString.split(';').map(article => {
        const [quantity, name, size] = article.split(',');
        return {
          quantity: quantity?.trim() || '',
          name: name?.trim() || '',
          size: size?.trim() || ''
        };
      });
      return articles;
    } catch (error) {
      console.error('Erreur lors du parsing des articles:', error);
      return [];
    }
  };

  useEffect(() => {
    // Vérification si l'utilisateur est connecté
    if (!user || !user.isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    
    // Récupérer d'abord tous les produits pour avoir les images
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/product")
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        return response.json();
      })
      .then((productData) => {
        setProducts(productData);
        
        // Ensuite récupérer les commandes
        return fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/orders");
      })
      .then((response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // Filtrer les commandes pour ne garder que celles de l'utilisateur connecté
        const userOrders = data.filter(order => 
          order.email.toLowerCase() === user.email.toLowerCase()
        );
        setOrders(userOrders);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [user, navigate]);

  // Fonction pour trouver l'image du produit en fonction du nom
  const findProductImage = (productName) => {
    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (product && product.image) {
      return `${BASE_URL}${product.image}`;
    }
    return "https://placehold.co/300x300?text=Image+non+disponible";
  };

  const sortedOrders = orders.sort((a, b) => {
    switch(sortBy) {
      case 'dateDesc': return new Date(b.date_commande) - new Date(a.date_commande);
      case 'dateAsc': return new Date(a.date_commande) - new Date(b.date_commande);
      case 'priceAsc': return parseFloat(a.price) - parseFloat(b.price);
      case 'priceDesc': return parseFloat(b.price) - parseFloat(a.price);
      default: return 0;
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <X className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement...</h2>
            <p className="text-gray-600">Veuillez patienter pendant que nous récupérons vos commandes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
              Accueil
            </button>
            <span>/</span>
            <span className="text-black font-medium">Mes commandes</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-800">Mes Commandes</h1>
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
              >
                <option value="dateDesc">Date (plus récent)</option>
                <option value="dateAsc">Date (plus ancien)</option>
                <option value="priceAsc">Prix croissant</option>
                <option value="priceDesc">Prix décroissant</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Card view for all devices */}
        {sortedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium text-gray-500">
                    Commande du {new Date(order.date_commande).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-black">
                    {parseFloat(order.price).toFixed(2)} €
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3 pb-1">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">Adresse de livraison</div>
                  <div className="text-sm text-gray-800 mb-3">{order.address}</div>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Articles</div>
                  {parseArticles(order.article).map((article, index) => (
                    <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                      <div className="relative overflow-hidden rounded-md w-12 h-12 mr-3">
                        <img 
                          src={findProductImage(article.name)} 
                          alt={article.name} 
                          className="object-cover w-full h-full" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/300x300?text=Image+non+disponible";
                          }}
                        />
                        <div className="absolute top-0 right-0 bg-black text-white font-medium rounded-bl-md text-xs p-0.5 min-w-[16px] text-center">
                          {article.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{article.name}</div>
                        <div className="text-xs text-gray-500">Taille: {article.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Aucune commande trouvée
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore passé de commande
            </p>
            <button 
              onClick={() => navigate('/products')} 
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;