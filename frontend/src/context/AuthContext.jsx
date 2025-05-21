import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const defaultUser = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  roles: [],
  isAuthenticated: false
};

const SESSION_DURATION = 2 * 60 * 60 * 1000;
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const timestamp = localStorage.getItem('timestamp');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedUser && timestamp) {
      const parsedUser = JSON.parse(savedUser);
      const now = new Date().getTime();
      const loginTime = parseInt(timestamp);
      const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
      
      if (now - loginTime <= duration) {
        return parsedUser;
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('timestamp');
        localStorage.removeItem('rememberMe');
      }
    }
    return defaultUser;
  });

  const API_TOKEN = import.meta.env.VITE_API_TOKEN;

  const login = (userData, rememberMe = false) => {
    const newUser = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      roles: userData.roles || [],
      isAuthenticated: true
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('timestamp', new Date().getTime().toString());
    localStorage.setItem('rememberMe', rememberMe.toString());
    
    return true;
  };

  const logout = async () => {
    try {
      await fetch('http://51.159.28.149/theo/site-ecommerce/backend/public/index.php/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-TOKEN': API_TOKEN
        }
      });
    } catch (error) {
    }
    
    setUser(defaultUser);
    localStorage.removeItem('user');
    localStorage.removeItem('timestamp');
    localStorage.removeItem('rememberMe');
  };

  useEffect(() => {
    const checkSession = () => {
      if (!user.isAuthenticated) return;
      
      const timestamp = localStorage.getItem('timestamp');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      if (timestamp) {
        const now = new Date().getTime();
        const loginTime = parseInt(timestamp);
        const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
        
        if (now - loginTime > duration) {
          logout();
        }
      }
    };
    
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};