import React, { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check user session
  const fetchUser = async () => {
    try {
      setLoading(true);
      
      // Check with the server
      const res = await fetch("https://zidio-kiun.onrender.com/api/auth/user", {
        credentials: "include", // Ensure cookies/session are sent
      });

      const data = await res.json();

      if (data.success && data.user) {
        // If server confirms the user is valid, update state and localStorage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // If server says not authenticated, clear localStorage to stay in sync
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      
      // On network error, check localStorage as fallback
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open("https://zidio-kiun.onrender.com/api/auth/google", "_self");
  };

  const handleLogout = () => {
    // Clear localStorage first to prevent flashing stale data
    localStorage.removeItem("user");
    setUser(null);
    // Then logout from server
    window.open("https://zidio-kiun.onrender.com/api/auth/logout", "_self");
  };

  useEffect(() => {
    // Check if we have a loginSuccess query parameter (from OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const loginSuccess = params.get('loginSuccess') === 'true';
    
    if (loginSuccess) {
      // Clean up URL by removing the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch user immediately after successful login redirect
      fetchUser();
    } else {
      // Regular page load - check localStorage first for immediate UI
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      // Then verify with server
      fetchUser();
    }
  }, []);

  if (loading && !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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