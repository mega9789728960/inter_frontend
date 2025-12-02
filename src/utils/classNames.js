export const buildInputClassName = (size, status) => {
  const classes = ['form-control', `form-control-${size}`];
  if (status) {
    classes.push(status);
  }
  return classes.join(' ');
};

export const buildValidationClassName = (isTouched, isValid) => {
  if (!isTouched) return '';
  return isValid ? 'is-valid' : 'is-invalid';
};
