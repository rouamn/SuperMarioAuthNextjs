import React, { useState, useEffect } from "react";
import { validate } from "./validation";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface User {
  name?: string | null;
  email?: string | null;
  birthDate?: string | null;
  address?: string | null;
  phone?: string | null;
  countryCode?: string | null;
}

interface UserProfileFormProps {
  user: User | undefined;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ user }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+216");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedUserProfile = localStorage.getItem("userProfile");
    if (storedUserProfile) {
      const parsedProfile = JSON.parse(storedUserProfile);
      setFirstName(parsedProfile.firstName || "");
      setLastName(parsedProfile.lastName || "");
      setEmail(parsedProfile.email || "");
      setBirthDate(parsedProfile.birthDate || "");
      setAddress(parsedProfile.address || "");
      setPhone(parsedProfile.phone || "");
      setCountryCode(parsedProfile.countryCode || "+216");
    } else if (user) {
      const nameParts = user.name?.split(" ") || ["", ""];
      setFirstName(nameParts[0]);
      setLastName(nameParts.slice(1).join(" "));
      setEmail(user.email || "");
      setBirthDate("");
      setAddress("");
      setPhone("");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = await validate(
      firstName,
      lastName,
      birthDate,
      phone,
      address
    );
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const userInfo = {
      firstName,
      lastName,
      email,
      birthDate,
      address,
      phone: phone.trim(),
      countryCode,
    };

    localStorage.setItem("userProfile", JSON.stringify(userInfo));

    console.log("Profile Saved to localStorage:", userInfo);

    await Swal.fire({
      title: "Profile Updated!",
      text: "Your profile has been updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm">{errors.firstName}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full mt-1 border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full mt-1 border rounded-lg p-2"
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm">{errors.birthDate}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-1 border rounded-lg p-2"
        />
        {errors.address && (
          <p className="text-red-600 text-sm">{errors.address}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="flex">
          <PhoneInput
            country={"tn"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputClass="border rounded-lg p-2 mt-1 flex-1"
          />
        </div>
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Save Profile
      </button>
    </form>
  );
};

export default UserProfileForm;
