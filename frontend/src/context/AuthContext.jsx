import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const defaultUserState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  roles: [],
  isAuthenticated: false
};

// Constantes pour la gestion du temps
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      const savedTimestamp = localStorage.getItem('auth_timestamp');
      const rememberMe = localStorage.getItem('auth_remember_me') === 'true';

      if (savedUser && savedTimestamp) {
        const parsedUser = JSON.parse(savedUser);
        const timestamp = parseInt(savedTimestamp);
        const now = new Date().getTime();
        const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;

        // Vérifier si la session n'a pas expiré
        if (now - timestamp <= duration) {
          console.log('✅ Session valide, données chargées');
          return parsedUser;
        } else {
          console.log('⏰ Session expirée');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_timestamp');
          localStorage.removeItem('auth_remember_me');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du localStorage:', error);
    }
    return defaultUserState;
  });

  const [loading, setLoading] = useState(true);

  // Vérifier la validité de la session périodiquement
  useEffect(() => {
    const checkSessionValidity = () => {
      const timestamp = localStorage.getItem('auth_timestamp');
      const rememberMe = localStorage.getItem('auth_remember_me') === 'true';
      
      if (timestamp && user.isAuthenticated) {
        const now = new Date().getTime();
        const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;

        if (now - parseInt(timestamp) > duration) {
          console.log('⏰ Session expirée, déconnexion automatique');
          logout();
        }
      }
    };

    const intervalId = setInterval(checkSessionValidity, 60000); // Vérifier chaque minute
    return () => clearInterval(intervalId);
  }, [user.isAuthenticated]);

  // Mettre à jour le timestamp à chaque action de l'utilisateur
  useEffect(() => {
    const updateTimestamp = () => {
      if (user.isAuthenticated) {
        localStorage.setItem('auth_timestamp', new Date().getTime().toString());
      }
    };

    window.addEventListener('mousemove', updateTimestamp);
    window.addEventListener('keypress', updateTimestamp);
    window.addEventListener('click', updateTimestamp);

    return () => {
      window.removeEventListener('mousemove', updateTimestamp);
      window.removeEventListener('keypress', updateTimestamp);
      window.removeEventListener('click', updateTimestamp);
    };
  }, [user.isAuthenticated]);

  // Login avec option "Remember me"
  const login = async (userData, rememberMe = false) => {
    try {
      const newUserData = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roles: userData.roles,
        isAuthenticated: true
      };
      setUser(newUserData);
      localStorage.setItem('auth_user', JSON.stringify(newUserData));
      localStorage.setItem('auth_timestamp', new Date().getTime().toString());
      localStorage.setItem('auth_remember_me', rememberMe.toString());
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('http://silumnia.ddns.net/theo/html/site-ecommerce/backend/public/index.php/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    } finally {
      setUser(defaultUserState);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_timestamp');
      localStorage.removeItem('auth_remember_me');
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