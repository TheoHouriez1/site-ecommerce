'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Envelope, Lock, User } from 'phosphor-react';
import { Button, InputIcon, Input, Label } from 'keep-react';
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
        'http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/register',
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
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-8 shadow-lg"
        >
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Inscription
          </h2>

          <div className="space-y-4">
            {/* First Name Input */}
            <fieldset className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <div className="relative">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  className="ps-11 w-full"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <InputIcon>
                  <User size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>

            {/* Last Name Input */}
            <fieldset className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <div className="relative">
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Votre nom"
                  className="ps-11 w-full"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <InputIcon>
                  <User size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>

            {/* Email Input */}
            <fieldset className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Votre email"
                  className="ps-11 w-full"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputIcon>
                  <Envelope size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>

            {/* Password Input */}
            <fieldset className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  className="ps-11 w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <InputIcon>
                  <Lock size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a 
                href="/login" 
                className="text-blue-600 hover:underline"
              >
                Connectez-vous
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};