const BASE_URL = 'https://inter-backend-pi.vercel.app';

const makeRequest = async (endpoint, options = {}) => {
  const { method = 'GET', headers = {}, body, token, errorMessage } = options;

  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    fetchOptions.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || errorMessage || 'Request failed');
    }

    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network request failed');
  }
};

export const authApi = {
  sendCode(email) {
    return makeRequest('/send-code', {
      method: 'POST',
      body: { email },
      errorMessage: 'Failed to send verification code',
    });
  },

  verifyEmail(email, code, token) {
    return makeRequest('/verify-email', {
      method: 'POST',
      body: { email, code, token },
      errorMessage: 'Invalid verification code',
    });
  },

  register(userData, token) {
    return makeRequest('/register', {
      method: 'POST',
      body: { ...userData, token },
      errorMessage: 'Failed to create account',
    });
  },

  login(email, password) {
    return makeRequest('/login', {
      method: 'POST',
      body: { email, password },
      errorMessage: 'Invalid email or password',
    });
  },

  getAccount(token) {
    return makeRequest('/account', {
      method: 'GET',
      token,
      errorMessage: 'Failed to load account information',
    });
  },

  updateAccount(userData, token) {
    return makeRequest('/account', {
      method: 'PUT',
      body: userData,
      token,
      errorMessage: 'Failed to update account',
    });
  },
};
