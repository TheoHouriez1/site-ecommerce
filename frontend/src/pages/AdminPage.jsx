import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import {
  BarChart2,
  Tags,
  ShoppingBag
} from 'lucide-react';
import '../index.css';

const BACKEND_URL = 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
      alert('Vous n\'avez pas la permission d\'accéder à cette page');
      navigate('/');
      return;
    }

    // Récupérer le nombre de produits
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/product`);
        if (!response.ok) throw new Error('Erreur de récupération des produits');
        const products = await response.json();
        setProductCount(products.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    // Récupérer le nombre de commandes (à implémenter selon votre backend)
    const fetchOrders = async () => {
      try {
        // Remplacez cette URL par votre endpoint de récupération des commandes
        const response = await fetch(`${BACKEND_URL}/orders`);
        if (!response.ok) throw new Error('Erreur de récupération des commandes');
        const orders = await response.json();
        setOrderCount(orders.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    };

    fetchProducts();
    fetchOrders();
  }, [user, navigate]);

  if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
    return null;
  }

  const adminModules = [
    {
      title: "Tableau de bord",
      description: "Visualisez les statistiques et métriques clés",
      icon: BarChart2,
      path: "/admin/dashboard",
      stats: "Vue d'ensemble",
    },
    {
      title: "Produits",
      description: "Gérez votre catalogue de produits",
      icon: Tags,
      path: "/admin/products",
      stats: `${productCount} produits`,
    },
    {
      title: "Commandes",
      description: "Suivez et gérez les commandes clients",
      icon: ShoppingBag,
      path: "/admin/orders",
      stats: `${orderCount} en attente`,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
            <AdminNavbar /> <br /><br />
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
              <p className="text-gray-600 mt-2">Gérez votre boutique en ligne</p>
            </div>
          </div>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.title}
                onClick={() => navigate(module.path)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-900 rounded-xl text-white">
                    <IconComponent size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {module.stats}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {module.title}
                </h2>
                <p className="text-gray-600">
                  {module.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Admin;