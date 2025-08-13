export const validateUser = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required.";
  }

  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return "Invalid email format.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null; 
};

export const validateTrip = ({ title, date, location }) => {
  if (!title || !title.trim()) {
    return "Trip title is required.";
  }

  if (!date) {
    return "Trip date is required.";
  }

  // Check if date is valid
  const parsedDate = Date.parse(date);
  if (isNaN(parsedDate)) {
    return "Invalid date format.";
  }

  if (!location || !location.trim()) {
    return "Trip location is required.";
  }

  return null;
};
