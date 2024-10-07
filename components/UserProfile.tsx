import { useSession } from "next-auth/react";
import UserProfileForm from "./UserProfileForm";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, []);

  return (
    <div className="mt-6 max-w-5xl mx-auto p-6 border border-gray-300 rounded-lg shadow-sm">
      {session ? (
        <>
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-gray-500" : "text-gray-700"
            }`}
          >
            Modify Your Information
          </h2>

          <UserProfileForm user={session.user} isDarkMode={isDarkMode} />
        </>
      ) : (
        <p className="text-red-500">
          You need to be logged in to modify your information.
        </p>
      )}
    </div>
  );
};

export default UserProfile;
