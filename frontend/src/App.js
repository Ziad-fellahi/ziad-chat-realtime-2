import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import de la barre
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <Navbar /> {/* Elle est placée ici pour être visible partout */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;