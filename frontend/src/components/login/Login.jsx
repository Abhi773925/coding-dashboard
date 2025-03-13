import React, { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState(null);

  // Function to check user session
  const fetchUser = async () => {
    try {
      // First check if we have a user in localStorage
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        // If we have a user in localStorage, use it immediately
        setUser(JSON.parse(savedUser));
      }
      
      // Then check with the server
      const res = await fetch("http://localhost:5000/api/auth/user", {
        credentials: "include", // Ensure cookies/session are sent
      });
      
      const data = await res.json();
      
      if (data.success) {
        // If server confirms the user is valid, update state and localStorage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else if (res.status === 401) {
        // Only clear if we get a specific 401 Unauthorized
        // This prevents clearing on network errors
        setUser(null);
        localStorage.removeItem("user");
      }
      // For other errors, keep existing user data
      
    } catch (err) {
      console.error("Error fetching user:", err);
      // Don't clear localStorage on network errors
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const handleLogout = () => {
    window.open("http://localhost:5000/api/auth/logout", "_self"); // Logs out
    localStorage.removeItem("user"); // Remove from localStorage
    setUser(null);
  };

  useEffect(() => {
    fetchUser(); // Check session on load
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {user ? (
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">Welcome, {user.name}</h2>
          {user.profilePicture && (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mx-auto mb-2" 
            />
          )}
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-6 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={handleGoogleLogin} 
          className="bg-blue-500 text-white px-6 py-2 rounded-md"
        >
          Login with Google
        </button>
      )}
    </div>
  );
};

export default Login;