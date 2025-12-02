import { useState } from 'react';

export const useAsync = (callback) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (...args) => {
    setLoading(true);
    setError('');
    try {
      const result = await callback(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');
  const reset = () => {
    setLoading(false);
    setError('');
  };

  return { loading, error, execute, clearError, reset };
};
