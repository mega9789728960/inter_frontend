import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('authToken', response.token);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 3;

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h1 className="display-5 mb-2">👋</h1>
              <h2 className="card-title mb-1">Welcome Back</h2>
              <p className="text-muted small">Sign in to your account</p>
            </div>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                <input
                  type="email"
                  className={`form-control form-control-lg ${touched.email && !isEmailValid ? 'is-invalid' : ''} ${touched.email && isEmailValid ? 'is-valid' : ''}`}
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="Enter your email"
                  required
                />
                {touched.email && !isEmailValid && (
                  <div className="invalid-feedback d-block">Please enter a valid email address</div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${touched.password && !isPasswordValid ? 'is-invalid' : ''} ${touched.password && isPasswordValid ? 'is-valid' : ''}`}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  required
                />
                {touched.password && !isPasswordValid && (
                  <div className="invalid-feedback d-block">Password must be at least 3 characters</div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 mb-3 fw-bold"
                disabled={!email || !password || !isEmailValid || !isPasswordValid || loading}
              >
                {loading ? 'Signing In...' : 'Sign In →'}
              </button>
            </form>
            
            <hr className="my-4" />
            
            <div className="text-center">
              <p className="text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="fw-bold text-decoration-none">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
