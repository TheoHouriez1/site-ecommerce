import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, EyeOff, Eye, AlertCircle, ArrowRight, UserCircle, X, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const RegisterComponent = ({ onClose, onLoginClick }) => {
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
  
  const modalRef = useRef();
  const firstNameInputRef = useRef();

  // Focus automatiquement sur le premier champ lors de l'ouverture du modal
  useEffect(() => {
    if (firstNameInputRef.current) {
      setTimeout(() => {
        firstNameInputRef.current.focus();
      }, 100);
    }
  }, []);

  // Ferme si on clique en dehors ou presse la touche Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose && onClose();
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

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
            'X-API-TOKEN': API_TOKEN
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
        
        // Si en mode modal et qu'on a onLoginClick, basculer vers le login
        if (onClose && onLoginClick) {
          // Basculer vers le modal de login avec message de succès
          onLoginClick();
        } else {
          // Fallback: Redirection vers la page de connexion avec paramètre
          onClose && onClose();
          navigate('/login?registered=true');
        }
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

  // Fonction pour basculer vers le modal de connexion
  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onLoginClick) {
      // Utiliser la prop onLoginClick pour basculer vers le modal de connexion
      onLoginClick();
    } else {
      // Fallback : rediriger vers la page de connexion
      onClose && onClose();
      navigate('/login');
    }
  };

  // Fonction pour retourner à la page précédente
  const goBack = () => {
    window.history.back();
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="animate-fadeZoom bg-white rounded-lg shadow-lg max-w-md w-full relative overflow-hidden"
        aria-modal="true"
        role="dialog"
        aria-labelledby="register-title"
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {/* En-tête */}
        <div className="bg-white py-6 px-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 id="register-title" className="text-2xl font-medium text-gray-800">
              Créer un compte
            </h2>
            <button
              onClick={goBack}
              className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          <p className="mt-2 text-gray-600">
            Rejoignez-nous et profitez de nos services
          </p>
        </div>

        <div className="p-8">
          {/* Message d'erreur */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
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
                <div className={`relative transition-all duration-200 ${focusedField === 'firstName' ? 'ring-2 ring-black ring-opacity-50' : ''}`}>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    ref={firstNameInputRef}
                    placeholder="Votre prénom"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} className={`transition-colors ${focusedField === 'firstName' ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              {/* Last Name Input */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className={`relative transition-all duration-200 ${focusedField === 'lastName' ? 'ring-2 ring-black ring-opacity-50' : ''}`}>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Votre nom"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCircle size={20} className={`transition-colors ${focusedField === 'lastName' ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'ring-2 ring-black ring-opacity-50' : ''}`}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className={`transition-colors ${focusedField === 'email' ? 'text-black' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'ring-2 ring-black ring-opacity-50' : ''}`}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 caractères"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none transition"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className={`transition-colors ${focusedField === 'password' ? 'text-black' : 'text-gray-400'}`} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full py-3 px-4 text-white bg-black hover:bg-gray-800 transition rounded-lg flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Inscription en cours...
                </span>
              ) : (
                <span className="flex items-center">
                  Créer mon compte
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                  className="font-medium text-black hover:underline transition"
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

export default RegisterComponent;