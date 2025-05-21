import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Mail, Lock, EyeOff, Eye, AlertCircle,
  Check, Loader2, ArrowLeft
} from 'lucide-react';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailInputRef = useRef();
  
  useEffect(() => {
    if (emailInputRef.current) {
      setTimeout(() => emailInputRef.current.focus(), 100);
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
          setSuccessMessage('Connexion réussie !');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          throw new Error('Échec de connexion');
        }
      } else {
        setErrorMessage(data?.error || 'Identifiants incorrects.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-black">THEO VINTAGE</Link>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-black"
          >
            <ArrowLeft className="mr-1" size={18} />
            <span>Retour</span>
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          {/* En-tête du formulaire */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Connexion</h1>
            <p className="text-gray-600">Accédez à votre compte pour profiter de tous nos services</p>
          </div>
          
          {/* Messages */}
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
          
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ email */}
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
            
            {/* Champ mot de passe */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-black">
                  Mot de passe oublié?
                </Link>
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
            
            {/* Option "Se souvenir de moi" */}
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
            
            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
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
            
            {/* Lien vers l'inscription */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-black hover:underline font-medium">
                Créez-en un maintenant
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginComponent;