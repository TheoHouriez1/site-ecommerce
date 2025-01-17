'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Envelope, Lock } from 'phosphor-react';
import { Button, InputIcon, Input, Label } from 'keep-react';
import MyModal from './Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeProvider } from "./Theme-provider.tsx";

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        'http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Inclure les cookies pour synchroniser les sessions
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Connexion réussie React:', result);

        // Enregistrer les informations utilisateur dans le contexte
        login({
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          roles: result.roles, // Tableau des rôles
        });

        // Ouvrir le modal de succès
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/'); // Rediriger vers l'accueil
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Identifiants invalides.');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      setErrorMessage('Impossible de se connecter. Veuillez réessayer.');
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex min-h-screen items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg"
          >
            <fieldset className="space-y-1">
              <Label htmlFor="InputEmail">Email</Label> {/* ID mis à jour */}
              <div className="relative">
                <Input
                  id="InputEmail"
                  placeholder="Entrez votre email"
                  className="ps-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <InputIcon>
                  <Envelope size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>
            <fieldset className="space-y-1">
              <Label htmlFor="InputPassword">Mot de passe</Label> {/* ID mis à jour */}
              <div className="relative">
                <Input
                  id="InputPassword"
                  placeholder="Entrez votre mot de passe"
                  type="password"
                  className="ps-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <InputIcon>
                  <Lock size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Button
              size="sm"
              color="secondary"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </Button>
          </form>
        </div>

        {/* Modal de succès */}
        {isModalOpen && (
          <MyModal
            auth="Connexion réussie"
            home="Bienvenue dans votre espace utilisateur !"
            button="Aller à l'accueil"
          />
        )}
      </ThemeProvider>
    </>
  );
};
