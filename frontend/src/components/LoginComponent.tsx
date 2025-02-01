'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Envelope, Lock } from 'phosphor-react';

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('🔹 Tentative de connexion avec:', { email, password, rememberMe });
      const response = await fetch(
        'http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/login',
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
        }, rememberMe); // Ajout de l'option rememberMe

        if (loginSuccess) {
          console.log("✅ Utilisateur stocké dans le contexte:", data);
          navigate('/');
        }
      } else {
        console.error('❌ Erreur de connexion:', data?.error || 'Réponse invalide');
      }
    } catch (error) {
      console.error('⚠️ Erreur réseau ou serveur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-100 hover:border-gray-200 transition-all duration-300"
        >
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Connexion
          </h2>
          <div className="space-y-4">
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
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Envelope size={19} color="#AFBACA" />
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
                  className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
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
              <div className="text-sm">
                <a href="/forgot-password" className="text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            {/* Register Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Pas de compte ?{' '}
                <a href="/register" className="text-blue-600 hover:underline transition duration-300">
                  Inscrivez-vous
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  
  );
};