exports.isValidPassword = (str) => {
  return /^(?=.{6,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/.test(
    str
  );
};
