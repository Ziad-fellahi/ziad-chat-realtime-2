import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import de la barre
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Navbar /> {/* Elle est placée ici pour être visible partout */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;