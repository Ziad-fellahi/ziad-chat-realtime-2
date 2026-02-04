function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  let username = 'Invité';
  let isAdmin = false;
  let isLoggedIn = !!token;

  if (isLoggedIn) {
    try {
      // ÉTAPE 1 : On décode le Token (C'est la source la plus sûre)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // ÉTAPE 2 : On récupère les infos du Token
      username = payload.username || 'User';
      isAdmin = payload.role === 'admin';

      // ÉTAPE 3 : Si le localStorage 'user' est vide (null), on le répare
      if (!storedUser) {
        localStorage.setItem('user', JSON.stringify({ 
          username: username, 
          role: payload.role 
        }));
      }
    } catch (e) {
      console.error("Erreur de décodage du token");
      isLoggedIn = false;
    }
  }

  // Pour vérifier dans ta console (F12)
  console.log("Nom:", username, " | Admin:", isAdmin);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Logo size={32} />
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/git" className="nav-link">Git Info</Link>
          <Link to="/admin-docs" className="nav-link">Admin Docs</Link>

          {isLoggedIn && (
            <>
              <Link to="/chat" className="nav-link">Chat</Link>
              {/* Le bouton apparaît enfin si le Token dit 'admin' */}
              {isAdmin && (
                <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
              )}
            </>
          )}

          <div className="nav-divider"></div>

          {!isLoggedIn ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn-text">Connexion</Link>
              <Link to="/register" className="btn-primary-sm">S'inscrire</Link>
            </div>
          ) : (
            <div className="user-profile">
              <div className="user-info-pill">
                <div className="avatar-circle">{username.charAt(0).toUpperCase()}</div>
                <span className="username-text">{username}</span>
                {isAdmin && <span className="admin-tag-nav">ADMIN</span>}
              </div>
              <button onClick={handleLogout} className="btn-logout-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}