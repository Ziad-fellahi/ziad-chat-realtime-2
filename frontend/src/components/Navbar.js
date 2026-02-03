import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setName(payload.username);
      } catch (e) { localStorage.removeItem('token'); }
    }
  }, []);

  return (
    <nav style={{ padding: '10px', background: '#1e2124', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>GovoStage</Link>
      <div>
        {name ? <span>Salut, {name}</span> : <Link to="/login" style={{ color: 'white' }}>Connexion</Link>}
      </div>
    </nav>
  );
}
export default Navbar;