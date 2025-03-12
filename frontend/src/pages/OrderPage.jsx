import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X,
  ChevronDown,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NavbarComponent from '../components/NavBarComponents';

const UserOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
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
    
    // Récupération des commandes
    fetch("http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/orders")
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <X className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement...</h2>
          <p className="text-gray-600">Veuillez patienter pendant que nous récupérons vos commandes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <NavbarComponent /> <br /> <br />
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Mes Commandes</h1>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select 
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        </div>

        {/* Card view for all devices */}
        {sortedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium text-gray-500">
                    Commande du {new Date(order.date_commande).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
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
                      <div className="bg-gray-100 text-gray-800 font-medium rounded-full h-6 w-6 flex items-center justify-center text-xs mr-3 mt-0.5">
                        {article.quantity}
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
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Aucune commande trouvée
            </h2>
            <p className="text-gray-600">
              Vous n'avez pas encore passé de commande
            </p>
            <button 
              onClick={() => navigate('/shop')} 
              className="mt-6 inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
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