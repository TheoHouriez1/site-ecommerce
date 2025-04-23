// src/pages/AdminPages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingBag,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    monthlyRevenue: []
  });

  const parseArticles = (articleString) => {
    if (!articleString) return [];
    try {
      return articleString.split(';').map(article => {
        const [quantity, name, size] = article.split(',');
        return {
          quantity: quantity?.trim() || '',
          name: name?.trim() || '',
          size: size?.trim() || ''
        };
      });
    } catch (error) {
      console.error('Erreur lors du parsing des articles:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      const API_TOKEN = import.meta.env.VITE_API_TOKEN;

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-TOKEN': API_TOKEN
      };

      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/orders', { method: 'GET', headers }),
          fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/product', { method: 'GET', headers })
        ]);

        if (!ordersResponse.ok || !productsResponse.ok)
          throw new Error('Erreur lors de la récupération des données');

        const [ordersData, productsData] = await Promise.all([
          ordersResponse.json(),
          productsResponse.json()
        ]);

        const filteredOrders = ordersData.filter(order => {
          const orderDate = new Date(order.date_commande);
          return orderDate >= dateRange.start && orderDate <= dateRange.end;
        });

        setOrders(filteredOrders);
        setProducts(productsData);
        calculateStats(filteredOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, user, navigate]);

  const calculateStats = (orderData) => {
    const total = orderData.reduce((sum, order) => sum + order.price, 0);
    const monthly = {};

    orderData.forEach(order => {
      const date = new Date(order.date_commande);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[monthKey]) monthly[monthKey] = 0;
      monthly[monthKey] += order.price;
    });

    const monthlyData = Object.entries(monthly).map(([month, revenue]) => ({
      month,
      revenue
    })).sort((a, b) => a.month.localeCompare(b.month));

    setStats({
      totalRevenue: total,
      totalOrders: orderData.length,
      averageOrderValue: total / orderData.length || 0,
      monthlyRevenue: monthlyData
    });
  };

  const DateRangeSelector = () => (
    <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow mb-6">
      <span className="text-gray-700">Période :</span>
      <input
        type="date"
        value={dateRange.start.toISOString().split('T')[0]}
        onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
        className="border rounded-lg px-3 py-2"
      />
      <span>à</span>
      <input
        type="date"
        value={dateRange.end.toISOString().split('T')[0]}
        onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
        className="border rounded-lg px-3 py-2"
      />
    </div>
  );

  const StockPieChart = () => {
    const stockData = products.map(product => ({
      name: product.name,
      value: product.stock || 0
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6">État des stocks</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={window.innerWidth < 768 ? 60 : 100}
                fill="#8884d8"
                label={false}
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} unités`, name]} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                formatter={(value, entry) => (
                  <span className="text-sm whitespace-nowrap">
                    {value.length > 15 ? value.substring(0, 15) + '...' : value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, trend, percentage, isCurrency }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-100 p-3 rounded-xl">
          <Icon className="text-gray-600" size={24} />
        </div>
        {trend && (
          <div className={`flex items-center ${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentage >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="ml-1">{Math.abs(percentage).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {isCurrency ? value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : value.toLocaleString('fr-FR')}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <AdminNavbar />
        <div className="container mx-auto px-4">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <AdminNavbar />
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <AdminNavbar />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <DateRangeSelector />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Chiffre d'affaires total" value={stats.totalRevenue} icon={DollarSign} trend percentage={12.5} isCurrency />
          <StatCard title="Nombre de commandes" value={stats.totalOrders} icon={ShoppingBag} trend percentage={8.2} />
          <StatCard title="Panier moyen" value={stats.averageOrderValue} icon={TrendingUp} trend percentage={-2.4} isCurrency />
          <StatCard title="Produits en stock" value={products.reduce((sum, p) => sum + (p.stock || 0), 0)} icon={Package} trend percentage={5.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">evolution du chiffre d'affaires</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={(val) => {
                    const [y, m] = val.split('-');
                    return `${m}/${y.slice(2)}`;
                  }} />
                  <YAxis />
                  <Tooltip formatter={(val) => [`${val.toFixed(2)} €`, "Revenu"]} labelFormatter={(val) => {
                    const [y, m] = val.split('-');
                    return `${m}/${y}`;
                  }} />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <StockPieChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
