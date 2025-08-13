// User Validation
function validateEmail(email) {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return 'A valid email address is required';
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}

function validateUser({ email, password }) {
  const emailError = validateEmail(email);
  if (emailError) return emailError;

  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;

  return null;
}

// Trip Validation
function validateTrip({ title, location, date }) {
  if (!title || title.trim() === '') {
    return 'Trip title is required';
  }
  if (!location || location.trim() === '') {
    return 'Trip location is required';
  }
  if (!date || isNaN(Date.parse(date))) {
    return 'A valid trip date is required';
  }
  return null;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateTrip
};