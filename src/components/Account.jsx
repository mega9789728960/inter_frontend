import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAsync } from '../hooks/useAsync';
import { FormInput } from './FormInput';
import { validateName } from '../utils/validators';

const validators = {
  firstName: validateName,
  lastName: validateName,
};

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [initialFormData, setInitialFormData] = useState({ ...formData });

  const { loading: fetchLoading, error: fetchError, execute: executeFetch, clearError: clearFetchError } = useAsync(authApi.getAccount);
  const { loading: updateLoading, error: updateError, execute: executeUpdate, clearError: clearUpdateError } = useAsync(authApi.updateAccount);
  const { touched, handleBlur, getFieldError, getFieldStatus, isFieldValid, resetTouched } = useFormValidation(validators);

  const loading = fetchLoading;
  const isSaving = updateLoading;
  const error = fetchError || updateError;

  const clearAllErrors = () => {
    clearFetchError();
    clearUpdateError();
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await executeFetch(token);
        if (isMounted) {
          const userData = response.user;
          setUser(userData);
          const newFormData = {
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            phone: userData.phone || '',
            dob: userData.dob || '',
            address: userData.address || '',
          };
          setFormData(newFormData);
          setInitialFormData(newFormData);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };
    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await executeUpdate(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dob: formData.dob,
          address: formData.address,
        },
        token
      );
      setUser(response.user);
      setIsEditing(false);
      resetTouched();
    } catch {
      return;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    resetTouched();
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isFirstNameValid = isFieldValid('firstName', formData.firstName);
  const isLastNameValid = isFieldValid('lastName', formData.lastName);
  const allFieldsValid = isFirstNameValid && isLastNameValid;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="alert alert-danger">Failed to load user data</div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.5rem' }}>👤</span>
              <h3 className="card-title mb-0">My Account</h3>
            </div>
          </div>
          <div className="card-body p-4">
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
            {isEditing ? (
              <form>
                <FormInput
                  id="firstName"
                  type="text"
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="Enter your first name"
                  error={getFieldError('firstName', formData.firstName)}
                  status={getFieldStatus('firstName', formData.firstName)}
                />

                <FormInput
                  id="lastName"
                  type="text"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Enter your last name"
                  error={getFieldError('lastName', formData.lastName)}
                  status={getFieldStatus('lastName', formData.lastName)}
                />

                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={user.email}
                  disabled
                  placeholder="Email cannot be changed"
                />

                <FormInput
                  id="phone"
                  type="tel"
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />

                <FormInput
                  id="dob"
                  type="date"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                />

                <FormInput
                  id="address"
                  type="text"
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Enter your address"
                />

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-success btn-lg flex-fill fw-bold"
                    onClick={handleSave}
                    disabled={!allFieldsValid || isSaving}
                  >
                    {isSaving ? 'Saving...' : '✓ Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="row g-4 mb-5">
                  <div className="col-12">
                    <div className="p-3 bg-light rounded-2">
                      <small className="text-muted d-block mb-2">Full Name</small>
                      <span className="h5 fw-bold">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 bg-light rounded-2">
                      <small className="text-muted d-block mb-2">Email Address</small>
                      <span className="h5 fw-bold">{user.email}</span>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded-2">
                        <small className="text-muted d-block mb-2">Phone</small>
                        <span className="h5 fw-bold">{user.phone}</span>
                      </div>
                    </div>
                  )}
                  {user.dob && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded-2">
                        <small className="text-muted d-block mb-2">Date of Birth</small>
                        <span className="h5 fw-bold">{user.dob}</span>
                      </div>
                    </div>
                  )}
                  {user.address && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded-2">
                        <small className="text-muted d-block mb-2">Address</small>
                        <span className="h5 fw-bold">{user.address}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2 flex-column flex-sm-row">
                  <button
                    className="btn btn-primary btn-lg fw-bold"
                    onClick={() => setIsEditing(true)}
                    style={{ minWidth: '150px' }}
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    className="btn btn-outline-danger btn-lg fw-bold"
                    onClick={handleLogout}
                    style={{ minWidth: '120px' }}
                  >
                    ➜ Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
