import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import UserProfile from "../components/UserProfile";

export default function Home() {
  const { data: session } = useSession();
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    const result = await signIn("google", { 
      redirect: false,
      prompt: "select_account", 
    });
    if (result?.error) {
      setError("Failed to sign in. Please try again.");
    } else if (result?.ok) {
      window.location.href = '/'; 
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false }); 
    setError(""); 
    window.location.href = '/'; 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-70"></div>
      <div className="absolute inset-0 animated-background"></div>
      
      <h1 className="text-5xl font-extrabold text-white mb-8 opacity-90 transition-opacity duration-500 hover:opacity-100">Welcome to SuperMarioAuth</h1>
      <p className="text-xl text-gray-200 mb-8 opacity-90 transition-opacity duration-500 hover:opacity-100">
        Your gateway to a seamless authentication experience.
      </p>
      
      {session ? (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl transition-shadow duration-300 ease-in-out hover:shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Hello, {session.user?.name}!</h2>
          <UserProfile />
          <button
            onClick={handleSignOut} // Use the updated sign out function
            className="w-full px-4 py-2 mt-4 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 shadow-md transform hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="px-6 py-3 mt-4 font-semibold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition duration-200 transform hover:scale-105"
        >
          Sign in with Google
        </button>
      )}
      {error && <div className="mt-4 text-red-400 text-lg font-semibold">{error}</div>}
      
      <footer className="mt-8 text-gray-200 text-sm">
        <p>© {new Date().getFullYear()} SuperMarioAuth. All rights reserved.</p>
      </footer>

      <style jsx>{`
        @keyframes background-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animated-background {
          animation: background-animation 8s ease infinite;
          background: linear-gradient(270deg, rgba(255, 0, 150, 0.1), rgba(0, 204, 255, 0.1), rgba(255, 0, 150, 0.1));
          background-size: 400% 400%;
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
