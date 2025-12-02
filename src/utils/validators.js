export const validateEmail = (val) => {
  if (!val.includes('@') || !val.includes('.')) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (val) => {
  if (val.length < 3) {
    return 'Password must be at least 3 characters';
  }
  return null;
};

export const validateName = (val) => {
  if (val.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
};

export const validateVerificationCode = (val) => {
  if (val.length !== 6) {
    return 'Code must be 6 digits';
  }
  return null;
};

export const authValidators = {
  email: validateEmail,
  password: validatePassword,
  firstName: validateName,
  lastName: validateName,
  code: validateVerificationCode,
};
