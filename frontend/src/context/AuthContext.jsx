import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    roles: [],
    isAuthenticated: false
  });

  const [loading, setLoading] = useState(true);

  // Vérifier l'état de l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/check-auth', {
          method: 'GET',
          credentials: 'include', // Crucial pour envoyer les cookies
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUser({
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            roles: data.user.roles,
            isAuthenticated: true
          });
        } else {
          // Réinitialiser si non authentifié
          setUser({
            id: null,
            firstName: null,
            lastName: null,
            email: null,
            roles: [],
            isAuthenticated: false
          });
        }
      } catch (error) {
        console.error('Erreur de vérification auth:', error);
        // Réinitialiser en cas d'erreur
        setUser({
          id: null,
          firstName: null,
          lastName: null,
          email: null,
          roles: [],
          isAuthenticated: false
        });
      } finally {
        setLoading(false);
      }
    };

    // Vérifier l'authentification au chargement
    checkAuth();
  }, []); // Tableau de dépendances vide pour n'exécuter qu'une seule fois

  const login = async (email, password) => {
    try {
      const response = await fetch('http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/login', {
        method: 'POST',
        credentials: 'include', // Important pour les cookies de session
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser({
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          roles: data.user.roles,
          isAuthenticated: true
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/logout', {
        method: 'POST',
        credentials: 'include', // Crucial pour la déconnexion
        headers: {
          'Accept': 'application/json'
        }
      });

      // Réinitialisation complète de l'état utilisateur
      setUser({
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        roles: [],
        isAuthenticated: false
      });

      return true;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};