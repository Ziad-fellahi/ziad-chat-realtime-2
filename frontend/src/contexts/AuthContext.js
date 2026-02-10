import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
  });

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null,
          role: null,
        });
        return;
      }

      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        
        // Vérifier l'expiration du token
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > currentTime) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: {
              username: payload.username,
              role: payload.role,
              id: payload.sub,
            },
            token,
            role: payload.role,
          });
        } else {
          // Token expiré
          localStorage.clear();
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
            role: null,
          });
        }
      } catch (e) {
        // Token invalide
        console.error('Erreur lors du décodage du token:', e);
        localStorage.clear();
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null,
          role: null,
        });
      }
    };

    loadUser();
  }, []);

  // Fonction de login
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role) {
      localStorage.setItem('role', userData.role);
    }
    
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          username: payload.username || userData.username,
          role: payload.role || userData.role,
          id: payload.sub,
        },
        token,
        role: payload.role || userData.role,
      });
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e);
    }
  };

  // Fonction de logout
  const logout = () => {
    localStorage.clear();
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: null,
      token: null,
      role: null,
    });
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (requiredRole) => {
    if (!authState.isAuthenticated || !authState.role) return false;
    if (authState.role === 'admin') return true; // Admin a accès à tout
    return authState.role === requiredRole;
  };

  // Vérifier si l'utilisateur a l'un des rôles requis
  const hasAnyRole = (requiredRoles) => {
    if (!authState.isAuthenticated || !authState.role) return false;
    if (authState.role === 'admin') return true; // Admin a accès à tout
    return requiredRoles.includes(authState.role);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      hasRole,
      hasAnyRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export default AuthContext;
