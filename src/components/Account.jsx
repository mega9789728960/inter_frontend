import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

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
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await authApi.getAccount(token);
        const userData = response.user;
        setUser(userData);
        setFormData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          phone: userData.phone || '',
          dob: userData.dob || '',
          address: userData.address || '',
        });
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('authToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    setSaveLoading(true);
    setError('');
    try {
      const response = await authApi.updateAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
      }, token);
      setUser(response.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const isFirstNameValid = formData.firstName.trim().length >= 2;
  const isLastNameValid = formData.lastName.trim().length >= 2;
  const allFieldsValid = isFirstNameValid && isLastNameValid;

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!user) return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
      <div className="alert alert-danger">Failed to load user data</div>
    </div>
  );

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white" style={{ backgroundColor: '#0d6efd' }}>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.5rem' }}>👤</span>
              <h3 className="card-title mb-0">My Account</h3>
            </div>
          </div>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            {isEditing ? (
              <form>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label fw-bold">First Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${touched.firstName && !isFirstNameValid ? 'is-invalid' : ''} ${touched.firstName && isFirstNameValid ? 'is-valid' : ''}`}
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Enter your first name"
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
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Enter your last name"
                  />
                  {touched.lastName && !isLastNameValid && (
                    <div className="invalid-feedback d-block">Name must be at least 2 characters</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    value={user.email}
                    disabled
                    placeholder="Email cannot be changed"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-bold">Phone</label>
                  <input
                    type="tel"
                    className="form-control form-control-lg"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dob" className="form-label fw-bold">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    id="dob"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="form-label fw-bold">Address</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-success btn-lg flex-fill fw-bold" 
                    onClick={handleSave}
                    disabled={!allFieldsValid || saveLoading}
                  >
                    {saveLoading ? 'Saving...' : '✓ Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-lg" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.first_name || '',
                        lastName: user.last_name || '',
                        phone: user.phone || '',
                        dob: user.dob || '',
                        address: user.address || '',
                      });
                      setTouched({});
                    }}
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
                      <span className="h5 fw-bold">{user.first_name} {user.last_name}</span>
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
