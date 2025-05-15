export const checkPassword = (password = '') => {
  password = password.trim();

  const result = {
    hasUppercase: !!password.match(/[A-Z]/),
    hasLowercase: !!password.match(/[a-z]/),
    hasNumber: !!password.match(/[0-9]/),
    hasSymbol: !!password.match(/[^A-Za-z0-9]/), // Match any non-alphanumeric symbol
    isLong: password.length >= 8,
    isValid: false,
  };

  result.isValid =
    result.hasUppercase &&
    result.hasLowercase &&
    result.hasNumber &&
    result.hasSymbol &&
    result.isLong;

  return result;
};
