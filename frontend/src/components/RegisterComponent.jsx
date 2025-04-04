'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, EyeOff, Eye, AlertCircle, ArrowRight, Check, UserCircle } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
            'Accept': 'application/json',
            'X-API-TOKEN': 'uVx2!h@8Nf4$TqzZ3Kd9#rW1Lg7bY0Vm'
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
        
        // Redirection vers la page de connexion avec paramètre
        navigate('/login?registered=true');
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

  // Vérification de force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    const labels = ['Faible', 'Moyen', 'Fort', 'Excellent'];
    return { 
      strength, 
      label: strength > 0 ? labels[Math.min(strength - 1, 3)] : '' 
    };
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  const getStrengthColor = (strength) => {
    const colors = ['red-500', 'orange-500', 'yellow-500', 'green-500'];
    return strength > 0 ? colors[Math.min(strength - 1, 3)] : 'gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header avec dégradé */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8 px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Créer un compte
            </h2>
            <p className="mt-2 text-gray-300">
              Rejoignez-nous et profitez de nos services
            </p>
          </div>

          <div className="p-8">
            {/* Message d'erreur */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center">
                <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom et prénom côte à côte sur desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name Input */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'firstName' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Votre prénom"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition duration-300"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={20} className={`transition-colors duration-300 ${focusedField === 'firstName' ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>

                {/* Last Name Input */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'lastName' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Votre nom"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition duration-300"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserCircle size={20} className={`transition-colors duration-300 ${focusedField === 'lastName' ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition duration-300"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none transition duration-300"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Indicateur de force du mot de passe */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex space-x-1 h-1 w-full rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map((segment) => (
                          <div 
                            key={segment}
                            className={`h-full w-1/4 transition-colors duration-300 bg-${
                              passwordStrength.strength >= segment 
                                ? getStrengthColor(passwordStrength.strength) 
                                : 'gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`ml-2 text-xs font-medium text-${getStrengthColor(passwordStrength.strength)}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Utilisez au moins 8 caractères avec des lettres majuscules, des chiffres et des symboles.
                    </p>
                  </div>
                )}
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
                    Inscription en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Créer mon compte
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="font-medium text-blue-600 hover:text-blue-500 transition"
                  >
                    Connectez-vous
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