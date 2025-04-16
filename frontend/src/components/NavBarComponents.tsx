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
  Boxes,
  Search
} from 'lucide-react';
import { CartContext } from './CartContext.tsx';
import { useAuth } from '../context/AuthContext.jsx';
import SeachComponent from './SeachComponent.tsx';
import LoginComponent from './LoginComponent'; 
import RegisterComponent from './RegisterComponent';

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Detect scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is loaded scrolled down
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Vérifier si on vient d'une inscription réussie
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setShowLoginModal(true);
    }
  }, [location]);
  
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
  
  // Fonctions pour gérer les modals
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    setIsDropdownOpen(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
    setIsDropdownOpen(false);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  // Fonction pour passer du login au register et vice versa
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
                {/* Menu Admin - visible uniquement pour les administrateurs */}
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
                <button 
                  onClick={() => {
                    navigate('/settings');
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-2 text-left transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-50' 
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <Settings size={18} className={isScrolled ? "text-gray-500" : "text-gray-400"} />
                  <span>Paramètres</span>
                </button>
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
                onClick={openLoginModal}
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
                onClick={openRegisterModal}
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
    <>
      <nav 
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo et Navigation principale */}
            <div className="flex items-center space-x-8">
              <div 
                onClick={() => navigate('/')}
                className={`text-xl font-bold cursor-pointer transition-colors duration-300 ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}
              >
                THEO VINTAGE
              </div>
              
              {/* Navigation desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={() => navigate('/products')}
                  className={`text-base font-medium transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-800 hover:text-gray-500' 
                      : 'text-white hover:text-gray-200'
                  }`}
                >
                  Produits
                </button>
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
            
            {/* Actions desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <button 
                  className={`p-2 hover:opacity-70 transition-opacity duration-300 ${
                    isScrolled ? 'text-gray-800' : 'text-white'
                  }`}
                  onClick={() => navigate('/search')}
                >
                  <Search size={24} />
                </button>
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
          {/* Menu mobile déroulant */}
          <div 
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            } overflow-hidden ${isScrolled ? 'bg-white' : 'bg-black bg-opacity-80'}`}
          >
            <div className="py-6 space-y-5">
              <div className="px-2 mb-4">
                <div className="relative">
                  <button 
                    className={`w-full px-4 py-3 flex items-center justify-center text-base ${
                      isScrolled ? 'text-gray-800 hover:bg-gray-50' : 'text-white hover:bg-gray-800'
                    } transition-colors duration-300`}
                    onClick={() => navigate('/search')}
                  >
                    <Search size={18} className="mr-2" />
                    <span>Rechercher</span>
                  </button>
                </div>
              </div>
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
              {/* Boutons de connexion et d'inscription dans le menu mobile */}
              {!user?.isAuthenticated && (
                <>
                  <button 
                    onClick={() => {
                      openLoginModal();
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
                      openRegisterModal();
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

      {/* Modals de connexion et d'inscription */}
      {showLoginModal && (
        <LoginComponent 
          onClose={closeLoginModal} 
          onRegisterClick={switchToRegister} 
        />
      )}
      
      {showRegisterModal && (
        <RegisterComponent 
          onClose={closeRegisterModal} 
          onLoginClick={switchToLogin}
        />
      )}
    </>
  );
};

export default NavbarComponent;