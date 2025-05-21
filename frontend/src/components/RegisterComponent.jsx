import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  UserCircle, 
  Loader2, 
  ArrowLeft 
} from 'lucide-react';
import { toast } from 'sonner';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const RegisterComponent = () => {
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
  const firstNameInputRef = useRef();

  useEffect(() => {
    if (firstNameInputRef.current) {
      setTimeout(() => {
        firstNameInputRef.current.focus();
      }, 100);
    }
  }, []);

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

      let data;
      try {
        const responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (parseError) {
        toast.error('Erreur de réponse du serveur');
        setLoading(false);
        return;
      }

      if (response.ok) {
        toast.success('Inscription réussie');
        navigate('/login?registered=true');
      } else {
        const errorMsg = data.error || data.errors?.join(', ') || 'Une erreur est survenue lors de l\'inscription';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Erreur de connexion au serveur';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Créer un compte</h1>
            <p className="text-gray-600">Rejoignez-nous et profitez de nos services</p>
          </div>
          
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
                <Link
                  to="/login"
                  className="font-medium text-black hover:underline transition"
                >
                  Connectez-vous
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterComponent;