import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../components/CartContext';
import {
  Mail, Lock, EyeOff, Eye, AlertCircle,
  Check, X, Loader2, ArrowLeft
} from 'lucide-react';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const LoginComponent = ({ onClose, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const BLOCK_DURATION = 900;
  const MAX_ATTEMPTS = 5;

  const { login } = useAuth();
  const { setUserId, syncCartToServer } = useCart();
  const navigate = useNavigate();
  const modalRef = useRef();
  const emailInputRef = useRef();

  useEffect(() => {
    if (emailInputRef.current) {
      setTimeout(() => emailInputRef.current.focus(), 100);
    }
    const blockUntil = localStorage.getItem('login_block_until');
    if (blockUntil) {
      const now = Date.now();
      const remaining = Math.floor((blockUntil - now) / 1000);
      if (remaining > 0) {
        setIsBlocked(true);
        setBlockTimeLeft(remaining);
      } else {
        localStorage.removeItem('login_block_until');
      }
    }
  }, []);

  useEffect(() => {
    if (isBlocked) {
      const interval = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('login_block_until');
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isBlocked]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setErrorMessage(`Connexion bloquée. Réessayez dans ${blockTimeLeft} secondes.`);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-TOKEN': API_TOKEN
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data?.id) {
        const userData = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roles: data.roles,
          isAuthenticated: true
        };

        const loginSuccess = await login(userData, rememberMe);

        if (loginSuccess) {
          try {
            setUserId(data.id);
            await syncCartToServer();
            console.log('Panier synchronisé avec succès!');
          } catch (error) {
            console.error('Erreur lors de la synchronisation du panier:', error);
          }

          setSuccessMessage('Connexion réussie !');
          setTimeout(() => {
            onClose && onClose();
            navigate('/');
          }, 1000);
        } else {
          throw new Error('Échec de connexion');
        }
      } else {
        setLoginAttempts(prev => {
          const updated = prev + 1;
          if (updated >= MAX_ATTEMPTS) {
            const blockUntil = Date.now() + BLOCK_DURATION * 1000;
            localStorage.setItem('login_block_until', blockUntil.toString());
            setIsBlocked(true);
            setBlockTimeLeft(BLOCK_DURATION);
          }
          return updated;
        });

        setErrorMessage(data?.error || 'Identifiants incorrects.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    onRegisterClick ? onRegisterClick() : (onClose && onClose(), navigate('/register'));
  };

  const handleForgotPassword = () => {
    onClose && onClose();
    navigate('/reset-password');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="animate-fadeZoom bg-white rounded-lg shadow-lg max-w-md w-full relative overflow-hidden"
        aria-modal="true"
        role="dialog"
        aria-labelledby="login-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        <div className="bg-white py-6 px-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 id="login-title" className="text-2xl font-medium text-gray-800">Bon retour !</h2>
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          <p className="mt-2 text-gray-600">Connectez-vous pour accéder à votre compte</p>
        </div>

        <div className="p-8">
          {isBlocked && (
            <div className="mb-6 bg-yellow-100 text-yellow-800 p-4 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2" />
              Connexion temporairement désactivée. Réessayez dans {blockTimeLeft} secondes.
            </div>
          )}

          {successMessage && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
              <Check size={20} className="mr-2" />
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className={`relative rounded-lg overflow-hidden ${emailFocused ? 'ring-2 ring-black ring-opacity-50' : ''}`}>
                <input
                  type="email"
                  id="email"
                  ref={emailInputRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="nom@exemple.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className={emailFocused ? 'text-black' : 'text-gray-400'} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-black hover:underline font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className={`relative rounded-lg overflow-hidden ${passwordFocused ? 'ring-2 ring-black ring-opacity-50' : ''}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Votre mot de passe"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className={passwordFocused ? 'text-black' : 'text-gray-400'} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full py-3 px-4 text-white bg-black hover:bg-gray-800 transition rounded-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="text-black hover:underline font-medium"
              >
                Créez-en un maintenant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
