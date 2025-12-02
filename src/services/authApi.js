const BASE_URL = 'http://inter-backend-pi.vercel.app';

export const authApi = {
  async sendCode(email) {
    const response = await fetch(`${BASE_URL}/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send code');
    return data;
  },

  async verifyEmail(email, code, token) {
    const response = await fetch(`${BASE_URL}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, token }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to verify email');
    return data;
  },

  async register(userData, token) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, token }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to register');
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to login');
    return data;
  },

  async getAccount(token) {
    const response = await fetch(`${BASE_URL}/account`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch account');
    return data;
  },

  async updateAccount(userData, token) {
    const response = await fetch(`${BASE_URL}/account`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update account');
    return data;
  },
};
