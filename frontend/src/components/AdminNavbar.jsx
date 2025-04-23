// src/components/AdminNavbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
Menu, 
X, 
Home,
Package,
ShoppingBag,
ChevronDown,
Settings,
LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
const navigate = useNavigate();
const { user } = useAuth();
const [isMenuOpen, setIsMenuOpen] = useState(false);

// Vérification du rôle admin
if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
  navigate('/');
  return null;
}

return (
  <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo et Navigation principale */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => navigate('/admin')}
            className="text-xl font-bold cursor-pointer"
          >
            Administration
          </div>
          
          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Home size={18} />
              <span>Retour au site</span>
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <Package size={18} />
              <span>Produits</span>
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <ShoppingBag size={18} />
              <span>Commandes</span>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="text-gray-600" size={24} />
            ) : (
              <Menu className="text-gray-600" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="py-4 space-y-4">
          <button 
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
          >
            <Home size={18} />
            <span>Retour au site</span>
          </button>
          <button 
            onClick={() => {
              navigate('/admin/dashboard');
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => {
              navigate('/admin/products');
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
          >
            <Package size={18} />
            <span>Produits</span>
          </button>
          <button 
            onClick={() => {
              navigate('/admin/orders');
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
          >
            <ShoppingBag size={18} />
            <span>Commandes</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);
};

export default AdminNavbar; 