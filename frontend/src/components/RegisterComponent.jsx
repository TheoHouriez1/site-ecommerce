'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { email, password, firstName, lastName } = formData;
    
    if (!email || !email.includes('@')) {
      toast.error('Veuillez saisir un email valide');
      return false;
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (!firstName.trim()) {
      toast.error('Veuillez saisir votre prénom');
      return false;
    }
    if (!lastName.trim()) {
      toast.error('Veuillez saisir votre nom');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Client-side validation
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData),
        }
      );

      // Récupérer le texte de la réponse pour débogage
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Essayez de parser le JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        toast.error('Erreur de réponse du serveur');
        setLoading(false);
        return;
      }

      if (response.ok) {
        // Display success toast
        toast.success('Inscription réussie');
        
        // Redirection vers la page de connexion
        navigate('/login');
      } else {
        // Handle specific error messages
        const errorMsg = data.error || data.errors?.join(', ') || 'Une erreur est survenue lors de l\'inscription';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMsg = 'Erreur de connexion au serveur';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Inscription
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name Input */}
            <div className="relative">
              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
                Prénom
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={19} color="#AFBACA" />
                </div>
              </div>
            </div>
            {/* Last Name Input */}
            <div className="relative">
              <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
                Nom
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Votre nom"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={19} color="#AFBACA" />
                </div>
              </div>
            </div>
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Votre email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-300"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={19} color="#AFBACA" />
                </div>
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
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={handleLoginClick}
                  className="text-blue-600 hover:underline transition duration-300 cursor-pointer bg-transparent border-none p-0"
                >
                  Connectez-vous
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};