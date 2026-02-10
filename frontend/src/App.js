import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import de la barre
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Hours from './pages/Hours';
import Skills from './pages/Skills';
import Instructor from './pages/Instructor';
import Secretary from './pages/Secretary';
import GitResources from './components/GitResources';
import AdminDocs from './pages/AdminDocs'; // Import de la nouvelle page

// Sur ton PC local
const SOCKET_URL = "https://stage.govo.fr"; 
// Ou ton nouveau nom de domaine

function App() {
  const token = localStorage.getItem('token');
  let isAdmin = false;
  let isMoniteur = false;
  let isSecretaire = false;

  if (token) {
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      isAdmin = payload?.role === 'admin';
      isMoniteur = payload?.role === 'moniteur';
      isSecretaire = payload?.role === 'secretaire';
    } catch (e) {
      isAdmin = false;
      isMoniteur = false;
      isSecretaire = false;
    }
  }

  return (
    <Router>
      <Navbar /> {/* Elle est placée ici pour être visible partout */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/hours"
          element={token ? <Hours /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/skills"
          element={token ? <Skills /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/moniteur"
          element={isAdmin || isMoniteur ? <Instructor /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/secretaire"
          element={isAdmin || isSecretaire ? <Secretary /> : <Navigate to="/login" replace />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/git"
          element={isAdmin ? <GitResources /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin-docs"
          element={isAdmin ? <AdminDocs /> : <Navigate to="/login" replace />}
        /> 
        
      </Routes>
    </Router>
  );
}


export default App;