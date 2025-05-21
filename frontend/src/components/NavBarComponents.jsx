import React, { useState, useContext, useEffect } from 'react';
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

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navigateToLogin = () => {
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const navigateToRegister = () => {
    navigate('/register');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const CartBadge = () => (
    <button 
      onClick={() => navigate('/panier')}
      className="relative p-2 hover:opacity-70 transition-opacity duration-300"
    >
      <ShoppingCart className={isScrolled ? "text-gray-800" : "text-white"} size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );

  const UserDropdown = () => (
    <div className="relative user-dropdown-container">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  onClick={() => {
                    navigate('/profile');
                    setIsDropdownOpen(false);
                  }}
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
                  onClick={() => {
                    navigate('/orders');
                    setIsDropdownOpen(false);
                  }}
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
                    onClick={() => {
                      navigate('/admin');
                      setIsDropdownOpen(false);
                    }}
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
                    onClick={handleLogout}
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
                onClick={navigateToLogin}
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
                onClick={navigateToRegister}
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
  );

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
            <CartBadge />
            <UserDropdown />
          </div>
          <div className="md:hidden flex items-center">
            <CartBadge />
            <UserDropdown />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              onClick={() => {
                navigate('/products');
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-800 hover:bg-gray-50' 
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              Produits
            </button>
            <button 
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
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
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
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
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
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