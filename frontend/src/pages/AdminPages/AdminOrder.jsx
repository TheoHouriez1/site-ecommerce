import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { 
  Package, 
  Search, 
  Filter, 
  ChevronDown, 
  Calendar,
  User,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Eye,
  Box
} from 'lucide-react';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_BASE_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api';

// Fonction pour calculer le statut automatique basé sur la date de commande
const getOrderStatus = (orderDate) => {
  const orderDateTime = new Date(orderDate);
  const daysPassed = Math.floor((new Date() - orderDateTime) / (1000 * 60 * 60 * 24));
  
  if (daysPassed < 1) return "En attente";
  if (daysPassed < 3) return "En préparation";
  if (daysPassed < 5) return "Expédiée";
  return "Livrée";
};

// Composant OrderCard pour mobile
const OrderCard = ({ order, onViewDetails }) => {
  const orderStatus = getOrderStatus(order.date_commande);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'en attente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'en préparation':
        return <Box className="w-4 h-4 text-orange-500" />;
      case 'expédiée':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'livrée':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'annulée':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en préparation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expédiée':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'livrée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'annulée':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const ordername = order.prenom && order.nom ? `${order.prenom} ${order.nom}` : 'Client inconnu';
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 space-y-3">
 
      {/* En-tête de la carte */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">
            Commande #{order.id}
          </h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(order.date_commande)}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(orderStatus)}`}>
          {getStatusIcon(orderStatus)}
          <span className="ml-1">{orderStatus}</span>
        </div>
      </div>

      {/* Informations client */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          <span> {ordername || 'Client inconnu'}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-semibold text-gray-900">
            {typeof order.price === 'number' ? `${order.price.toFixed(2)} €` : 'N/A'}
          </span>
        </div>

        {order.address && (
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
            <span className="flex-1">{order.address}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-2 border-t border-gray-100">
        <button 
          onClick={() => onViewDetails(order)}
          className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          Voir les détails
        </button>
      </div>
    </div>
  );
};

// Composant TableRow pour desktop
const OrderTableRow = ({ order, onViewDetails }) => {
  const orderStatus = getOrderStatus(order.date_commande);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'en attente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'en préparation':
        return <Box className="w-4 h-4 text-orange-500" />;
      case 'expédiée':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'livrée':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'annulée':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const ordername = order.prenom && order.nom ? `${order.prenom} ${order.nom}` : 'Client inconnu';
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{order.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(order.date_commande)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {ordername || 'Client inconnu'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {typeof order.price === 'number' ? `${order.price.toFixed(2)} €` : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(orderStatus)}
          <span className="ml-2 text-sm text-gray-900">{orderStatus}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex space-x-2">
          <button 
            onClick={() => onViewDetails(order)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Voir les détails"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Fonction pour récupérer les commandes
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes:', err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtrage et tri des commandes
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const orderStatus = getOrderStatus(order.date_commande);
      const ordername = order.prenom && order.nom ? `${order.prenom} ${order.nom}` : 'Client inconnu';
      
      const matchesSearch = searchTerm === '' || 
        order.id?.toString().includes(searchTerm) ||
        ordername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderStatus?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || orderStatus.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.date_commande) - new Date(b.date_commande);
        case 'date_desc':
          return new Date(b.date_commande) - new Date(a.date_commande);
        case 'amount_asc':
          return (a.price || 0) - (b.price || 0);
        case 'amount_desc':
          return (b.price || 0) - (a.price || 0);
        case 'id_asc':
          return (a.id || 0) - (b.id || 0);
        case 'id_desc':
          return (b.id || 0) - (a.id || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  // Handlers pour les actions
  const handleViewDetails = (order) => {
    navigate(`/admin/orders/${order.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* En-tête */}
      <div className="mb-6">   
        <AdminNavbar /><br /><br /><br />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Gestion des Commandes
        </h1>
        <p className="text-gray-600">
          {filteredAndSortedOrders.length} commande{filteredAndSortedOrders.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par ID, client ou statut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtre par statut */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En préparation">En préparation</option>
            <option value="Expédiée">Expédiée</option>
            <option value="Livrée">Livrée</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="date_desc">Date (plus récent)</option>
            <option value="date_asc">Date (plus ancien)</option>
            <option value="amount_desc">Montant (décroissant)</option>
            <option value="amount_asc">Montant (croissant)</option>
            <option value="id_desc">ID (décroissant)</option>
            <option value="id_asc">ID (croissant)</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Liste des commandes */}
      {filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Aucune commande disponible pour le moment'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Vue mobile - Cartes */}
          <div className="block lg:hidden space-y-4">
            {filteredAndSortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Vue desktop - Tableau */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedOrders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;