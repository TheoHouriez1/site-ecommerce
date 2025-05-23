import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Box,
  Truck,
  Package,
  CalendarDays,
  Home,
  CreditCard,
  Clock,
  Plus as PlusIcon,
  User,
} from 'lucide-react';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/uploads/images/';
const API_BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderArticles, setOrderArticles] = useState([]);
  
  const [showShipping, setShowShipping] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les produits
        const productsResponse = await fetch(`${API_BASE_URL}/product`, {
          headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": API_TOKEN
          }
        });
        
        if (!productsResponse.ok) {
          throw new Error(`Erreur HTTP ! statut : ${productsResponse.status}`);
        }
        
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        // Récupérer les commandes
        const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": API_TOKEN
          }
        });
        
        if (!ordersResponse.ok) {
          throw new Error(`Erreur HTTP ! statut : ${ordersResponse.status}`);
        }
        
        const ordersData = await ordersResponse.json();
        
        const targetOrder = ordersData.find(o => o.id === parseInt(orderId));
        
        if (!targetOrder) {
          throw new Error("Commande non trouvée");
        }
        
        setOrder(targetOrder);
        
        if (targetOrder.article) {
          const parsedArticles = parseArticles(targetOrder.article);
          
          const enrichedArticles = parsedArticles.map(article => {
            const product = productsData.find(p => p.name.toLowerCase() === article.name.toLowerCase());
            return {
              ...article,
              image: product ? product.image : null,
              price: product ? product.price : 0,
            };
          });
          
          setOrderArticles(enrichedArticles);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [orderId]);

  const parseArticles = (articleString) => {
    if (!articleString) return [];
    try {
      const articles = articleString.split(';').map(article => {
        const [quantity, name, size] = article.split(',');
        return {
          quantity: parseInt(quantity?.trim()) || 1,
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

  const getProductImage = (productName) => {
    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (product && product.image) {
      return `${BASE_URL}${product.image}`;
    }
    return "https://placehold.co/300x300?text=Image+non+disponible";
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getOrderStatus = () => {
    const orderDate = new Date(order.date_commande);
    const daysPassed = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24));
    
    if (daysPassed < 1) return "En attente";
    if (daysPassed < 3) return "En préparation";
    if (daysPassed < 5) return "Expédiée";
    return "Livrée";
  };

  const calculateSubtotal = () => {
    return orderArticles.reduce((total, article) => {
      return total + (article.price * article.quantity);
    }, 0);
  };

  const formaterDateAvecJoursAjoutes = (date, joursAjoutes) => {
    const nouvelleDate = new Date(date);
    nouvelleDate.setDate(nouvelleDate.getDate() + joursAjoutes);
    const jour = String(nouvelleDate.getDate()).padStart(2, '0');
    const mois = String(nouvelleDate.getMonth() + 1).padStart(2, '0');
    return `${jour}/${mois}`;
  };

  const calculateDeliveryDates = () => {
    if (!order) return {};
    
    const orderDate = new Date(order.date_commande);
    
    return {
      received: formaterDateAvecJoursAjoutes(orderDate, 0),
      prepared: `${formaterDateAvecJoursAjoutes(orderDate, 2)} - ${formaterDateAvecJoursAjoutes(orderDate, 3)}`,
      delivered: `${formaterDateAvecJoursAjoutes(orderDate, 6)} - ${formaterDateAvecJoursAjoutes(orderDate, 7)}`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement...</h2>
            <p className="text-gray-600">Veuillez patienter pendant que nous récupérons les détails de la commande</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
              <Package className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/admin/orders')} 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto"
            >
              <ArrowLeft size={18} className="mr-2" /> 
              Retour aux commandes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <Package className="text-gray-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande introuvable</h2>
            <p className="text-gray-600 mb-4">Nous n'avons pas pu trouver la commande demandée.</p>
            <button 
              onClick={() => navigate('/admin/orders')} 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto"
            >
              <ArrowLeft size={18} className="mr-2" /> 
              Retour aux commandes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryDates = calculateDeliveryDates();
  const orderStatus = getOrderStatus();
  const subtotal = calculateSubtotal();
  const customerName = order.prenom && order.nom ? `${order.prenom} ${order.nom}` : 'Client inconnu';

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 mb-6 mt-16">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <button onClick={() => navigate('/admin')} className="hover:text-black transition-colors">
              Dashboard Admin
            </button>
            <span>/</span>
            <button onClick={() => navigate('/admin/orders')} className="hover:text-black transition-colors">
              Gestion des commandes
            </button>
            <span>/</span>
            <span className="text-black font-medium">Commande #{order.id}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap">
          {/* Retour aux commandes */}
          <div className="w-full mb-6">
            <button 
              onClick={() => navigate('/admin/orders')} 
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" /> 
              Retour à la gestion des commandes
            </button>
          </div>
          
          {/* Titre de la page */}
          <div className="w-full mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
                  Détails de la commande <span className="font-bold">#{order.id}</span>
                </h1>
                <p className="text-gray-500 mt-2">
                  Commandée le {formatDate(order.date_commande)} par {customerName}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Vue Administrateur
              </div>
            </div>
          </div>
          
          {/* Colonne principale */}
          <div className="w-full lg:w-2/3 lg:pr-6">
            {/* Statut de commande */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">Statut de la commande</h2>
              
              <div className="mb-8">
                <div className="flex items-center justify-between space-x-4 text-center">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-black text-white mb-2">
                      <Check size={20} />
                    </div>
                    <p className="text-xs text-gray-500">Reçue</p>
                    <p className="text-xs font-medium">{deliveryDates.received}</p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 flex-grow"></div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${orderStatus === "En préparation" || orderStatus === "Expédiée" || orderStatus === "Livrée" ? 'bg-black text-white' : 'border-2 border-gray-300 bg-white'}`}>
                      <Box size={20} className={orderStatus === "En préparation" || orderStatus === "Expédiée" || orderStatus === "Livrée" ? 'text-white' : 'text-gray-500'} />
                    </div>
                    <p className="text-xs text-gray-500">Préparation</p>
                    <p className="text-xs font-medium">{deliveryDates.prepared}</p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 flex-grow"></div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${orderStatus === "Expédiée" || orderStatus === "Livrée" ? 'bg-black text-white' : 'border-2 border-gray-300 bg-white'}`}>
                      <Truck size={20} className={orderStatus === "Expédiée" || orderStatus === "Livrée" ? 'text-white' : 'text-gray-500'} />
                    </div>
                    <p className="text-xs text-gray-500">Expédition</p>
                    <p className="text-xs font-medium">{deliveryDates.delivered}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Statut actuel</p>
                  <p className={`text-lg font-bold ${
                    orderStatus === "Livrée" ? "text-green-600" : 
                    orderStatus === "Expédiée" ? "text-blue-600" : 
                    orderStatus === "En préparation" ? "text-orange-500" : 
                    "text-gray-600"
                  }`}>
                    {orderStatus}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${
                  orderStatus === "Livrée" ? "bg-green-100 text-green-800" : 
                  orderStatus === "Expédiée" ? "bg-blue-100 text-blue-800" : 
                  orderStatus === "En préparation" ? "bg-orange-100 text-orange-800" : 
                  "bg-gray-100 text-gray-800"
                }`}>
                  {orderStatus === "Livrée" && <Check size={18} />}
                  {orderStatus === "Expédiée" && <Truck size={18} />}
                  {orderStatus === "En préparation" && <Box size={18} />}
                  {orderStatus === "En attente" && <Clock size={18} />}
                </div>
              </div>
            </div>
            
            {/* Articles de la commande */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Articles commandés</h2>
              
              <div className="divide-y divide-gray-200">
                {orderArticles.map((article, index) => (
                  <div key={index} className="py-4 flex">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                      <img 
                        src={getProductImage(article.name)} 
                        alt={article.name} 
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/300x300?text=Image+non+disponible";
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{article.name}</h3>
                        <p className="ml-4">{(article.price * article.quantity).toFixed(2)} €</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Taille: {article.size}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <p>Qté: {article.quantity}</p>
                        <p className="ml-4">Prix unitaire: {article.price?.toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Accordéons d'informations */}
            <div className="space-y-4 mb-8">
              {/* Informations client */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <button 
                  className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                  onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-2 text-gray-700" />
                    <span className="font-medium text-gray-700">Informations client</span>
                  </div>
                  <PlusIcon size={16} className={`transform transition-transform text-black ${showCustomerInfo ? 'rotate-45' : ''}`} />
                </button>
                {showCustomerInfo && (
                  <div className="p-4 text-sm border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1">Nom complet :</p>
                        <p className="text-gray-700">{customerName}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">ID utilisateur :</p>
                        <p className="text-gray-700">#{order.id_user}</p>
                      </div>
                      {order.email && (
                        <div>
                          <p className="font-medium mb-1">Email :</p>
                          <p className="text-gray-700">{order.email}</p>
                        </div>
                      )}
                      {order.telephone && (
                        <div>
                          <p className="font-medium mb-1">Téléphone :</p>
                          <p className="text-gray-700">{order.telephone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Informations de livraison */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <button 
                  className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                  onClick={() => setShowShipping(!showShipping)}
                >
                  <div className="flex items-center">
                    <Truck size={18} className="mr-2 text-gray-700" />
                    <span className="font-medium text-gray-700">Informations de livraison</span>
                  </div>
                  <PlusIcon size={16} className={`transform transition-transform text-black ${showShipping ? 'rotate-45' : ''}`} />
                </button>
                {showShipping && (
                  <div className="p-4 text-sm border-t border-gray-200">
                    <div className="mb-4">
                      <p className="font-medium mb-1">Adresse de livraison :</p>
                      <p className="text-gray-700">{order.address}</p>
                    </div>
                    <div className="mb-2">
                      <p className="font-medium mb-1">Méthode de livraison :</p>
                      <p className="text-gray-700">Livraison standard</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Statut calculé automatiquement selon la date de commande.</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Informations de commande */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <button 
                  className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                  onClick={() => setShowOrderInfo(!showOrderInfo)}
                >
                  <div className="flex items-center">
                    <CalendarDays size={18} className="mr-2 text-gray-700" />
                    <span className="font-medium text-gray-700">Informations de commande</span>
                  </div>
                  <PlusIcon size={16} className={`transform transition-transform text-black ${showOrderInfo ? 'rotate-45' : ''}`} />
                </button>
                {showOrderInfo && (
                  <div className="p-4 text-sm border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1">Date de commande :</p>
                        <p className="text-gray-700">{formatDate(order.date_commande)}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Numéro de commande :</p>
                        <p className="text-gray-700">#{order.id}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Nombre d'articles :</p>
                        <p className="text-gray-700">{orderArticles.reduce((sum, article) => sum + article.quantity, 0)}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Total :</p>
                        <p className="text-gray-700">{parseFloat(order.price).toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Informations de paiement */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <button 
                  className="py-3 px-4 w-full flex items-center justify-between text-left bg-gray-50" 
                  onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                >
                  <div className="flex items-center">
                    <CreditCard size={18} className="mr-2 text-gray-700" />
                    <span className="font-medium text-gray-700">Paiement</span>
                  </div>
                  <PlusIcon size={16} className={`transform transition-transform text-black ${showPaymentInfo ? 'rotate-45' : ''}`} />
                </button>
                {showPaymentInfo && (
                  <div className="p-4 text-sm border-t border-gray-200">
                    <div className="mb-4">
                      <p className="font-medium mb-1">Méthode de paiement :</p>
                      <p className="text-gray-700">Carte bancaire</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Paiement traité automatiquement lors de la commande.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Colonne de résumé */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>{parseFloat(order.price).toFixed(2)} €</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <Home size={20} className="flex-shrink-0 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-700">Adresse de livraison</p>
                    <p className="text-sm text-gray-600 mt-1">{order.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <User size={20} className="flex-shrink-0 text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-blue-700">Client</p>
                    <p className="text-sm text-blue-600 mt-1">{customerName}</p>
                    <p className="text-xs text-blue-500 mt-1">ID: #{order.id_user}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/admin/orders')}
                className="block w-full py-3 px-4 bg-black text-white text-center rounded-md hover:bg-gray-800 transition-colors mb-3"
              >
                Retour à la liste
              </button>
              
              <a 
                href="mailto:admin@shop.com" 
                className="block w-full py-3 px-4 bg-gray-100 text-gray-700 text-center rounded-md hover:bg-gray-200 transition-colors"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;