import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
  });

  // Charger l'utilisateur depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
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

        // Décoder le JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        
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
          await AsyncStorage.clear();
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
        await AsyncStorage.clear();
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
  const login = async (token, userData) => {
    try {
      console.log('💾 Stockage du token dans AsyncStorage...');
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (userData.role) {
        await AsyncStorage.setItem('role', userData.role);
      }
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔓 Token décodé:', { username: payload.username, role: payload.role });
      
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
      
      console.log('✅ Authentification réussie!');
    } catch (e) {
      console.error('❌ Erreur lors du stockage du token:', e);
      throw e;
    }
  };

  // Fonction de logout
  const logout = async () => {
    await AsyncStorage.clear();
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
