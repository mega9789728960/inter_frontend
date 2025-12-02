import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';

function Register() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.sendCode(email);
      setVerificationToken(response.token);
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.verifyEmail(email, code, verificationToken);
      setVerificationToken(response.token);
      setStep('details');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        dob,
        address,
      }, verificationToken);
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
  const isCodeValid = code.length === 6;
  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;
  const isPasswordValid = password.length >= 3;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length >= 3;
  const allDetailsValid = isFirstNameValid && isLastNameValid && isPasswordValid && isConfirmPasswordValid;

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h1 className="display-5 mb-2">✨</h1>
              <h2 className="card-title mb-1">
                {step === 'email' && 'Verify Email'}
                {step === 'verify' && 'Confirm Code'}
                {step === 'details' && 'Complete Profile'}
              </h2>
              <p className="text-muted small">
                {step === 'email' && 'Enter your email to get started'}
                {step === 'verify' && 'Enter the verification code sent to your email'}
                {step === 'details' && 'Fill in your profile information'}
              </p>
            </div>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            
            {step === 'email' && (
              <form onSubmit={handleSendCode}>
                <div className="mb-4">
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
                
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  disabled={!isEmailValid || loading}
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyEmail}>
                <div className="mb-3">
                  <p className="text-muted small mb-3">A 6-digit code has been sent to {email}</p>
                  <label htmlFor="code" className="form-label fw-bold">Verification Code</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${touched.code && !isCodeValid ? 'is-invalid' : ''} ${touched.code && isCodeValid ? 'is-valid' : ''}`}
                    id="code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError('');
                    }}
                    onBlur={() => handleBlur('code')}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                  {touched.code && !isCodeValid && (
                    <div className="invalid-feedback d-block">Code must be 6 digits</div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  disabled={!isCodeValid || loading}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setError('');
                  }}
                >
                  Change Email
                </button>
              </form>
            )}

            {step === 'details' && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label fw-bold">First Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${touched.firstName && !isFirstNameValid ? 'is-invalid' : ''} ${touched.firstName && isFirstNameValid ? 'is-valid' : ''}`}
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setError('');
                    }}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Enter your first name"
                    required
                  />
                  {touched.firstName && !isFirstNameValid && (
                    <div className="invalid-feedback d-block">Name must be at least 2 characters</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label fw-bold">Last Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${touched.lastName && !isLastNameValid ? 'is-invalid' : ''} ${touched.lastName && isLastNameValid ? 'is-valid' : ''}`}
                    id="lastName"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setError('');
                    }}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Enter your last name"
                    required
                  />
                  {touched.lastName && !isLastNameValid && (
                    <div className="invalid-feedback d-block">Name must be at least 2 characters</div>
                  )}
                </div>

                <div className="mb-3">
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
                    placeholder="Create a password"
                    required
                  />
                  {touched.password && !isPasswordValid && (
                    <div className="invalid-feedback d-block">Password must be at least 3 characters</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control form-control-lg ${touched.confirmPassword && !isConfirmPasswordValid ? 'is-invalid' : ''} ${touched.confirmPassword && isConfirmPasswordValid ? 'is-valid' : ''}`}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Confirm your password"
                    required
                  />
                  {touched.confirmPassword && !isConfirmPasswordValid && (
                    <div className="invalid-feedback d-block">
                      {password !== confirmPassword ? 'Passwords do not match' : 'Please confirm your password'}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-bold">Phone (Optional)</label>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="dob" className="form-label fw-bold">Date of Birth (Optional)</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="form-label fw-bold">Address (Optional)</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  disabled={!allDetailsValid || loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account ✓'}
                </button>

                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => {
                    setStep('verify');
                    setFirstName('');
                    setLastName('');
                    setPassword('');
                    setConfirmPassword('');
                    setPhone('');
                    setDob('');
                    setAddress('');
                    setError('');
                  }}
                >
                  Back
                </button>
              </form>
            )}
            
            <hr className="my-4" />
            
            <div className="text-center">
              <p className="text-muted mb-0">
                Already have an account?{' '}
                <Link to="/login" className="fw-bold text-decoration-none">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
