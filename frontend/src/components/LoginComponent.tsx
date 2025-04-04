'use client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, EyeOff, Eye, AlertCircle, ArrowRight, Check } from 'lucide-react';

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur vient de s'inscrire (via URL param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🔹 Tentative de connexion avec:', { email, password, rememberMe });
      const response = await fetch(
        'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }
      );
      console.log('🔹 Statut de la réponse:', response.status);
      const data = await response.json().catch(() => {
        console.error("⚠️ La réponse de l'API n'est pas un JSON valide.");
        return null;
      });
      console.log('🔹 Données reçues après login:', data);

      if (response.ok && data?.id) {
        console.log('✅ Connexion réussie, stockage des infos utilisateur:', data);
        const loginSuccess = await login({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roles: data.roles,
          isAuthenticated: true
        }, rememberMe);
        if (loginSuccess) {
          console.log("✅ Utilisateur stocké dans le contexte:", data);
          setSuccessMessage('Connexion réussie !');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      } else {
        console.error('❌ Erreur de connexion:', data?.error || 'Réponse invalide');
        setErrorMessage(data?.error || 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
      }
    } catch (error) {
      console.error('⚠️ Erreur réseau ou serveur:', error);
      setErrorMessage('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header avec dégradé */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Bon retour!
            </h2>
            <p className="mt-2 text-gray-300">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>

          <div className="p-8">
            {/* Message de succès */}
            {successMessage && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center">
                <Check size={20} className="mr-2 flex-shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            {/* Message d'erreur */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center">
                <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className={`relative transition-all duration-300 ${emailFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="nom@exemple.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className={`transition-colors duration-300 ${emailFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 transition"
                  >
                    Mot de passe oublié?
                  </button>
                </div>
                <div className={`relative transition-all duration-300 ${passwordFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Votre mot de passe"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className={`transition-colors duration-300 ${passwordFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="rememberMe"
                    className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                      rememberMe ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
                        rememberMe ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>
                <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 focus:outline-none transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Se connecter 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Pas encore de compte?{' '}
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="font-medium text-blue-600 hover:text-blue-500 transition"
                  >
                    Créez-en un maintenant
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};