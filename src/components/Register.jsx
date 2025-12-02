import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAsync } from '../hooks/useAsync';
import { FormInput } from './FormInput';
import { authValidators } from '../utils/validators';

function Register() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    address: '',
  });

  const navigate = useNavigate();
  const { loading: sendCodeLoading, error: sendCodeError, execute: executeSendCode, clearError: clearSendCodeError } = useAsync(authApi.sendCode);
  const { loading: verifyLoading, error: verifyError, execute: executeVerify, clearError: clearVerifyError } = useAsync(authApi.verifyEmail);
  const { loading: registerLoading, error: registerError, execute: executeRegister, clearError: clearRegisterError } = useAsync(authApi.register);

  const { touched, handleBlur, getFieldError, getFieldStatus, isFieldValid, resetTouched } = useFormValidation(authValidators);

  const isLoading = sendCodeLoading || verifyLoading || registerLoading;
  const error = sendCodeError || verifyError || registerError;

  const clearAllErrors = () => {
    clearSendCodeError();
    clearVerifyError();
    clearRegisterError();
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await executeSendCode(email);
      setVerificationToken(response.token);
      setStep('verify');
      resetTouched();
    } catch {
      return;
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await executeVerify(email, code, verificationToken);
      setVerificationToken(response.token);
      setStep('details');
      resetTouched();
    } catch {
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      clearAllErrors();
      return;
    }
    try {
      const response = await executeRegister({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
      }, verificationToken);
      localStorage.setItem('authToken', response.token);
      navigate('/account');
    } catch {
      return;
    }
  };

  const isEmailValid = isFieldValid('email', email);
  const isCodeValid = isFieldValid('code', code);
  const isFirstNameValid = isFieldValid('firstName', formData.firstName);
  const isLastNameValid = isFieldValid('lastName', formData.lastName);
  const isPasswordValid = isFieldValid('password', formData.password);
  const isConfirmPasswordValid = formData.password === formData.confirmPassword && isPasswordValid;
  const allDetailsValid = isFirstNameValid && isLastNameValid && isPasswordValid && isConfirmPasswordValid;

  const stepTitles = {
    email: 'Verify Email',
    verify: 'Confirm Code',
    details: 'Complete Profile',
  };

  const stepDescriptions = {
    email: 'Enter your email to get started',
    verify: 'Enter the verification code sent to your email',
    details: 'Fill in your profile information',
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h1 className="display-5 mb-2">✨</h1>
              <h2 className="card-title mb-1">{stepTitles[step]}</h2>
              <p className="text-muted small">{stepDescriptions[step]}</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={clearAllErrors}
                />
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendCode}>
                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearAllErrors();
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="Enter your email"
                  error={getFieldError('email', email)}
                  status={getFieldStatus('email', email)}
                  required
                />

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  disabled={!isEmailValid || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyEmail}>
                <p className="text-muted small mb-3">A 6-digit code has been sent to {email}</p>

                <FormInput
                  id="code"
                  type="text"
                  label="Verification Code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    clearAllErrors();
                  }}
                  onBlur={() => handleBlur('code')}
                  placeholder="Enter 6-digit code"
                  error={getFieldError('code', code)}
                  status={getFieldStatus('code', code)}
                  maxLength="6"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  disabled={!isCodeValid || isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    clearAllErrors();
                    resetTouched();
                  }}
                >
                  Change Email
                </button>
              </form>
            )}

            {step === 'details' && (
              <form onSubmit={handleSubmit}>
                <FormInput
                  id="firstName"
                  type="text"
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    clearAllErrors();
                  }}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="Enter your first name"
                  error={getFieldError('firstName', formData.firstName)}
                  status={getFieldStatus('firstName', formData.firstName)}
                  required
                />

                <FormInput
                  id="lastName"
                  type="text"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    clearAllErrors();
                  }}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Enter your last name"
                  error={getFieldError('lastName', formData.lastName)}
                  status={getFieldStatus('lastName', formData.lastName)}
                  required
                />

                <FormInput
                  id="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    clearAllErrors();
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="Create a password"
                  error={getFieldError('password', formData.password)}
                  status={getFieldStatus('password', formData.password)}
                  required
                />

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-bold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`form-control form-control-lg ${
                      touched.confirmPassword && !isConfirmPasswordValid ? 'is-invalid' : ''
                    } ${touched.confirmPassword && isConfirmPasswordValid ? 'is-valid' : ''}`}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      clearAllErrors();
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Confirm your password"
                    required
                  />
                  {touched.confirmPassword && !isConfirmPasswordValid && (
                    <div className="invalid-feedback d-block">
                      {formData.password !== formData.confirmPassword
                        ? 'Passwords do not match'
                        : 'Please confirm your password'}
                    </div>
                  )}
                </div>

                <FormInput
                  id="phone"
                  type="tel"
                  label="Phone (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />

                <FormInput
                  id="dob"
                  type="date"
                  label="Date of Birth (Optional)"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />

                <FormInput
                  id="address"
                  type="text"
                  label="Address (Optional)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your address"
                />

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 mb-3 fw-bold"
                  disabled={!allDetailsValid || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account ✓'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg w-100"
                  onClick={() => {
                    setStep('verify');
                    setFormData({
                      firstName: '',
                      lastName: '',
                      password: '',
                      confirmPassword: '',
                      phone: '',
                      dob: '',
                      address: '',
                    });
                    clearAllErrors();
                    resetTouched();
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
