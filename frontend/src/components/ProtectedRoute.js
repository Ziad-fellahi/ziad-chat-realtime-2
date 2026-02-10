import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoading, isAuthenticated, role } = useAuth();

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles sont requis, vérification stricte
  if (allowedRoles.length > 0) {
    // Vérifier si le rôle de l'utilisateur est autorisé
    if (!allowedRoles.includes(role)) {
      // Redirection stricte vers la page du rôle de l'utilisateur
      const rolePages = {
        admin: '/dashboard',
        moniteur: '/moniteur',
        secretaire: '/secretaire',
        eleve: '/eleve',
        user: '/eleve', // Alias pour élève
      };
      
      const userDefaultPage = rolePages[role] || '/';
      console.warn(`Accès refusé : ${role} a tenté d'accéder à une page nécessitant ${allowedRoles.join(' ou ')}`);
      return <Navigate to={userDefaultPage} replace />;
    }
  }

  // Accès autorisé
  return children;
};

export default ProtectedRoute;
