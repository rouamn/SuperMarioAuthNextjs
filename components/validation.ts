import axios from 'axios';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
const PARIS_COORDS = { lat: 48.8566, lon: 2.3522 };

// Calculate distance between two coordinates in km using the Haversine formula
const haversineDistance = (coords1: { lat: number; lon: number }, coords2: { lat: number; lon: number }) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
};

// Validate address
const validateAddress = async (address: string) => {
    try {
        const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${address}`);
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
    
    // Ensure the birth date doesn't have a time portion
    birthDateObj.setHours(0, 0, 0, 0);

    // Check if the birth date is in the future
    if (birthDateObj > today) {
        return false; // Invalid if the birth date is in the future
    }

    // Calculate minimum birth date for a 10-year-old
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 10);

    // Check if the user is younger than 10 years
    if (birthDateObj > minAgeDate) {
        return false; // Invalid if user is less than 10 years old
    }

    return true; // Birth date is valid
};

// Validate all fields
const validate = async (firstName: string, lastName: string, birthDate: string, phone: string, address: string) => {
    const newErrors: { [key: string]: string } = {};

    // Error messages
    const requiredMessage = "is required";
    const invalidDOBMessage = "Invalid date of birth. You must be at least 10 years old, and the date cannot be in the future.";
    const invalidPhoneMessage = "Invalid phone number. It should match the format for +216 or +33.";
    const invalidAddressMessage = "The address must be within 50 km of Paris.";

    // First and Last Name validation
    if (!firstName) newErrors.firstName = `First name ${requiredMessage}`;
    if (!lastName) newErrors.lastName = `Last name ${requiredMessage}`;

    // Date of birth validation
    if (!birthDate || !validateBirthDate(birthDate)) {
        newErrors.birthDate = invalidDOBMessage;
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
