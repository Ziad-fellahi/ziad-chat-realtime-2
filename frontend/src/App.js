import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Hours from './pages/Hours';
import Skills from './pages/Skills';
import Instructor from './pages/Instructor';
import Secretary from './pages/Secretary';
import Eleve from './pages/Eleve';
import GitResources from './components/GitResources';
import AdminDocs from './pages/AdminDocs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées simples */}
          <Route
            path="/hours"
            element={
              <ProtectedRoute>
                <Hours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Skills />
              </ProtectedRoute>
            }
          />
          
          {/* Routes protégées avec rôles spécifiques */}
          <Route
            path="/moniteur"
            element={
              <ProtectedRoute allowedRoles={['admin', 'moniteur']}>
                <Instructor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretaire"
            element={
              <ProtectedRoute allowedRoles={['admin', 'secretaire']}>
                <Secretary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eleve"
            element={
              <ProtectedRoute allowedRoles={['admin', 'eleve', 'user', 'secretaire']}>
                <Eleve />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/git"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <GitResources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-docs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDocs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;