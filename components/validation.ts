import axios from "axios";

const PARIS_COORDS = { lat: 48.8566, lon: 2.3522 };

// Calculate distance between two coordinates in km using the Haversine formula
const haversineDistance = (
  coords1: { lat: number; lon: number },
  coords2: { lat: number; lon: number }
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Validate address
const validateAddress = async (address: string) => {
  try {
    const response = await axios.get(
      `https://api-adresse.data.gouv.fr/search/?q=${address}`
    );
    if (response.data.features.length > 0) {
      const coords = response.data.features[0].geometry.coordinates;
      const userCoords = { lat: coords[1], lon: coords[0] };
      const distance = haversineDistance(PARIS_COORDS, userCoords);
      return distance <= 50; // Check if distance is less than or equal to 50 km
    }
    return false;
  } catch (error) {
    console.error("Error validating address:", error);
    return false;
  }
};

// Validate date of birth
const validateBirthDate = (birthDate: string) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  birthDateObj.setHours(0, 0, 0, 0);


  if (birthDateObj > today) {
    return false; 
  }

  const minAgeDate = new Date();
  minAgeDate.setFullYear(today.getFullYear() - 10);


  if (birthDateObj > minAgeDate) {
    return false;
  }

  return true;
};

// Validate all fields
const validate = async (
  firstName: string,
  lastName: string,
  birthDate: string,
  phone: string | null,
  address: string
) => {
  const newErrors: { [key: string]: string } = {};

  // Error messages
  const requiredMessage = "is required";
  const invalidDOBMessage =
    "Invalid date of birth. You must be at least 10 years old, and the date cannot be in the future.";
  const invalidAddressMessage = "The address must be within 50 km of Paris.";

  // First and Last Name validation
  if (!firstName) newErrors.firstName = `First name ${requiredMessage}`;
  if (!lastName) newErrors.lastName = `Last name ${requiredMessage}`;

  // Date of birth validation
  if (!birthDate || !validateBirthDate(birthDate)) {
    newErrors.birthDate = invalidDOBMessage;
  }

  // Phone number validation (must not be null)
  if (phone === null || phone === "") {
    newErrors.phone = `Phone number ${requiredMessage}`;
  }

  // Address validation
  if (!address) {
    newErrors.address = `Address ${requiredMessage}`;
  } else {
    const isValidAddress = await validateAddress(address);
    if (!isValidAddress) {
      newErrors.address = invalidAddressMessage;
    }
  }

  return newErrors;
};

export { validate, validateAddress };
