import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User,
  LogIn,
  UserPlus,
  Package,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';
import { CartContext } from '../components/CartContext';
import { useAuth } from '../context/AuthContext';
import SeachComponent from './SeachComponent.tsx';

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const CartBadge = () => (
    <button 
      onClick={() => navigate('/pannier')}
      className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
    >
      <ShoppingCart className="text-gray-600" size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );

  const UserDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
      >
        <User className="text-gray-600" size={24} />
        <ChevronDown 
          className={`text-gray-600 transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
          size={18} 
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
          {user && user.isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                >
                  <User size={18} />
                  <span>Mon profil</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/orders');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                >
                  <Package size={18} />
                  <span>Mes commandes</span>
                </button>
                <button 
                  onClick={() => {
                    navigate('/settings');
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                >
                  <Settings size={18} />
                  <span>Paramètres</span>
                </button>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600"
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-2">
              <button 
                onClick={() => {
                  navigate('/login');
                  setIsDropdownOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
              >
                <LogIn size={18} />
                <span>Connexion</span>
              </button>
              <button 
                onClick={() => {
                  navigate('/register');
                  setIsDropdownOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
              >
                <UserPlus size={18} />
                <span>Inscription</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Navigation principale */}
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => navigate('/')}
              className="text-xl font-bold cursor-pointer"
            >
              Shop Théo
            </div>
            
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/products')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                Produits
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <SeachComponent />
            </div>
            <CartBadge />
            <UserDropdown />
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <CartBadge />
            <UserDropdown />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 ml-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
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
            <div className="px-2 mb-4">
              <SeachComponent />
            </div>
            <button 
              onClick={() => {
                navigate('/products');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
            >
              Produits
            </button>
            <button 
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-300"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;