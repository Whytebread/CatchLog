function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function validateTrip({ title, location, date }) {
  if (!title || title.trim() === '') return 'Trip title is required';
  if (!location || location.trim() === '') return 'Trip location is required';
  if (!date || isNaN(Date.parse(date))) return 'A valid date is required';
  return null;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateTrip
};