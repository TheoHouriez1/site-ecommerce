import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour connecter l'utilisateur
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));  // Enregistrer dans le stockage local
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Vérifier si un utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
