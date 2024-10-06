// components/UserProfile.tsx
import { useSession } from "next-auth/react";
import UserProfileForm from "./UserProfileForm";

const UserProfile = () => {
  const { data: session } = useSession();

  return (
    <div className="mt-6 max-w-5xl mx-auto p-6 border border-gray-300 rounded-lg shadow-sm">
        {session ? (
            <>
                <h2 className="text-xl font-semibold">Modify Your Information</h2>
                <UserProfileForm user={session.user} />
            </>
        ) : (
            <p className="text-red-500">You need to be logged in to modify your information.</p>
        )}
    </div>
);



};

export default UserProfile;
