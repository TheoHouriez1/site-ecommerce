import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Settings,
  Boxes
} from 'lucide-react';
import { useCart } from './CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CartBadge = React.memo(({ totalItems, isScrolled, onCartClick }) => (
  <button 
    onClick={onCartClick}
    className="relative p-2 hover:opacity-70 transition-opacity duration-300"
  >
    <ShoppingCart className={isScrolled ? "text-gray-800" : "text-white"} size={24} />
    {totalItems > 0 && (
      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {totalItems}
      </span>
    )}
  </button>
));

CartBadge.displayName = 'CartBadge';

// Composant UserDropdown mémorisé
const UserDropdown = React.memo(({ 
  user, 
  isScrolled, 
  isDropdownOpen, 
  onToggleDropdown, 
  onNavigate, 
  onLogout 
}) => (
  <div className="relative user-dropdown-container">
    <button
      onClick={onToggleDropdown}
      className="flex items-center space-x-1 p-2 hover:opacity-70 transition-opacity duration-300"
    >
      <User className={isScrolled ? "text-gray-800" : "text-white"} size={24} />
      <ChevronDown 
        className={`${isScrolled ? "text-gray-800" : "text-white"} transition-transform duration-300 ${
          isDropdownOpen ? 'rotate-180' : ''
        }`} 
        size={18} 
      />
    </button>
    {isDropdownOpen && (
      <div className={`absolute right-0 mt-2 w-64 rounded shadow-md py-2 border z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white border-gray-200' 
          : 'bg-black bg-opacity-90 border-gray-800'
      }`}>
        {user && user.isAuthenticated ? (
          <>
            <div className={`px-4 py-3 border-b ${isScrolled ? 'border-gray-200' : 'border-gray-700'}`}>
              <p className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                {user.firstName} {user.lastName}
              </p>
              <p className={`text-sm ${isScrolled ? 'text-gray-500' : 'text-gray-400'}`}>
                {user.email}
              </p>
            </div>
            <div className="py-2">
              <button 
                onClick={() => onNavigate('/profile')}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-50' 
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <User size={18} className={isScrolled ? "text-gray-500" : "text-gray-400"} />
                <span>Mon profil</span>
              </button>
              <button 
                onClick={() => onNavigate('/orders')}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-gray-50' 
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <Package size={18} className={isScrolled ? "text-gray-500" : "text-gray-400"} />
                <span>Mes commandes</span>
              </button>
              {user && user.roles && user.roles.includes('ROLE_ADMIN') && (
                <button 
                  onClick={() => onNavigate('/admin')}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-50' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <Boxes size={18} className={isScrolled ? "text-gray-500" : "text-gray-400"} />
                  <span>Administration</span>
                </button>
              )}
              <div className={`border-t mt-2 pt-2 ${isScrolled ? 'border-gray-200' : 'border-gray-700'}`}>
                <button 
                  onClick={onLogout}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                    isScrolled 
                      ? 'text-red-600 hover:bg-gray-50' 
                      : 'text-red-400 hover:bg-gray-800'
                  }`}
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
              onClick={() => onNavigate('/login')}
              className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-50' 
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <LogIn size={18} className={isScrolled ? "text-gray-500" : "text-gray-400"} />
              <span>Connexion</span>
            </button>
            <button 
              onClick={() => onNavigate('/register')}
              className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-50' 
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              <UserPlus size={18} className={isScrolled ? "text-gray-500" : "text-gray-400"} />
              <span>Inscription</span>
            </button>
          </div>
        )}
      </div>
    )}
  </div>
));

UserDropdown.displayName = 'UserDropdown';

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mémoriser le calcul du nombre total d'articles
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cart]);

  // Mémoriser le gestionnaire de scroll
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Vérifier l'état initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Callbacks mémorisés pour éviter les re-rendus
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, [logout, navigate]);

  const handleCartClick = useCallback(() => {
    navigate('/panier');
  }, [navigate]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleDropdownNavigate = useCallback((path) => {
    navigate(path);
    setIsDropdownOpen(false);
  }, [navigate]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMobileNavigate = useCallback((path) => {
    navigate(path);
    setIsMenuOpen(false);
  }, [navigate]);

  // Gestion des clics en dehors du dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => navigate('/')}
              className={`text-xl font-bold cursor-pointer transition-colors duration-300 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              THEO VINTAGE
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/contact')}
                className={`text-base font-medium transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-800 hover:text-gray-500' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                Contact
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <CartBadge 
              totalItems={totalItems}
              isScrolled={isScrolled}
              onCartClick={handleCartClick}
            />
            <UserDropdown 
              user={user}
              isScrolled={isScrolled}
              isDropdownOpen={isDropdownOpen}
              onToggleDropdown={handleDropdownToggle}
              onNavigate={handleDropdownNavigate}
              onLogout={handleLogout}
            />
          </div>
          
          <div className="md:hidden flex items-center">
            <CartBadge 
              totalItems={totalItems}
              isScrolled={isScrolled}
              onCartClick={handleCartClick}
            />
            <UserDropdown 
              user={user}
              isScrolled={isScrolled}
              isDropdownOpen={isDropdownOpen}
              onToggleDropdown={handleDropdownToggle}
              onNavigate={handleDropdownNavigate}
              onLogout={handleLogout}
            />
            <button
              onClick={handleMenuToggle}
              className="p-2 ml-2 hover:opacity-70 transition-opacity duration-300"
            >
              {isMenuOpen ? (
                <X className={isScrolled ? "text-gray-800" : "text-white"} size={24} />
              ) : (
                <Menu className={isScrolled ? "text-gray-800" : "text-white"} size={24} />
              )}
            </button>
          </div>
        </div>
        
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden ${isScrolled ? 'bg-white' : 'bg-black bg-opacity-80'}`}
        >
          <div className="py-6 space-y-5">
            <button 
              onClick={() => handleMobileNavigate('/contact')}
              className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-800 hover:bg-gray-50' 
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              Contact
            </button>
            {!user?.isAuthenticated && (
              <>
                <button 
                  onClick={() => handleMobileNavigate('/login')}
                  className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-800 hover:bg-gray-50' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <LogIn size={18} className="mr-2" />
                    <span>Connexion</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleMobileNavigate('/register')}
                  className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-800 hover:bg-gray-50' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <UserPlus size={18} className="mr-2" />
                    <span>Inscription</span>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;