import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

const NAVBAR_STYLE = { backgroundColor: '#0d6efd' };

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await authApi.getAccount(token);
        setUser(response.user);
      } catch {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
    closeMenu();
  };

  const closeMenu = () => setIsMenuOpen(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={NAVBAR_STYLE}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-5" to="/" onClick={closeMenu}>
          👤 User Accounts
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-3 d-lg-inline d-none">
                  Welcome, <strong>{user.first_name}!</strong>
                </span>
                <Link
                  className="nav-link"
                  to="/account"
                  onClick={closeMenu}
                >
                  Account
                </Link>
                <button
                  className="btn btn-outline-light ms-lg-2 mt-2 mt-lg-0 w-100 w-lg-auto"
                  onClick={handleLogout}
                  style={{ minWidth: '100px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="nav-link"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  className="nav-link"
                  to="/register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
