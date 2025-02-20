'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock } from 'lucide-react';

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

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
          navigate('/');
        }
      } else {
        console.error('❌ Erreur de connexion:', data?.error || 'Réponse invalide');
        setErrorMessage(data?.error || 'Une erreur est survenue lors de la connexion');
      }
    } catch (error) {
      console.error('⚠️ Erreur réseau ou serveur:', error);
      setErrorMessage('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={19} color="#AFBACA" />
                </div>
              </div>
            </div>
            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={19} color="#AFBACA" />
                </div>
              </div>
            </div>
            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
            </div>
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                <p>{errorMessage}</p>
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas de compte ?{' '}
                <button
                  onClick={handleRegisterClick}
                  className="text-blue-600 hover:underline transition duration-300 cursor-pointer bg-transparent border-none p-0"
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};