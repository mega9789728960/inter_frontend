import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAsync } from '../hooks/useAsync';
import { FormInput } from './FormInput';
import { authValidators } from '../utils/validators';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { loading, error, execute, clearError } = useAsync(authApi.login);
  const { touched, handleBlur, getFieldError, getFieldStatus, isFieldValid } = useFormValidation(authValidators);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await execute(email, password);
      localStorage.setItem('authToken', response.token);
      navigate('/account');
    } catch {
      return;
    }
  };

  const isEmailValid = isFieldValid('email', email);
  const isPasswordValid = isFieldValid('password', password);
  const isFormValid = email && password && isEmailValid && isPasswordValid;

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
                <button
                  type="button"
                  className="btn-close"
                  onClick={clearError}
                />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <FormInput
                id="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                error={getFieldError('email', email)}
                status={getFieldStatus('email', email)}
                required
              />

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold">Password</label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${getFieldStatus('password', password)}`}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  required
                />
                {getFieldError('password', password) && (
                  <div className="invalid-feedback d-block">
                    {getFieldError('password', password)}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mb-3 fw-bold"
                disabled={!isFormValid || loading}
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
