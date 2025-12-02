import { useState } from 'react';

export const useFormValidation = (validators = {}) => {
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field, value) => {
    if (!touched[field]) return null;
    return validators[field]?.(value) || null;
  };

  const isFieldValid = (field, value) => {
    return !getFieldError(field, value);
  };

  const getFieldStatus = (field, value) => {
    if (!touched[field]) return '';
    return isFieldValid(field, value) ? 'is-valid' : 'is-invalid';
  };

  const resetTouched = () => setTouched({});

  return {
    touched,
    handleBlur,
    getFieldError,
    isFieldValid,
    getFieldStatus,
    resetTouched,
  };
};
