import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authApi.getAccount(token);
          setUser(response.user);
        } catch {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient" style={{ backgroundColor: '#0d6efd' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-5" to="/" onClick={() => setIsOpen(false)}>
          👤 User Accounts
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-expanded={isOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-3 d-lg-inline d-none">
                  Welcome, <strong>{user.first_name}!</strong>
                </span>
                <Link 
                  className="nav-link" 
                  to="/account"
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  className="nav-link" 
                  to="/register"
                  onClick={() => setIsOpen(false)}
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
