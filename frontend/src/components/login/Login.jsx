import React, { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState(null);

  // Function to check user session - first check localStorage, then verify with server
  const fetchUser = async () => {
    try {
      // Check if user exists in localStorage first
      const storedUser = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");
      
      if (storedUser && authToken) {
        setUser(JSON.parse(storedUser));
      }
      
      // Then verify with server using Authorization header instead of credentials
      const res = await fetch("https://zidio-kiun.onrender.com/api/auth/user", {
        headers: {
          "Authorization": `Bearer ${authToken || ""}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Store complete user data in localStorage and state
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleGoogleLogin = () => {
    // Open in a new window and handle the token return
    const googleWindow = window.open("https://zidio-kiun.onrender.com/api/auth/google", "_blank", "width=500,height=600");
    
    // Listen for messages from the popup window
    window.addEventListener("message", (event) => {
      if (event.origin === "https://zidio-kiun.onrender.com" && event.data.authToken) {
        localStorage.setItem("authToken", event.data.authToken);
        if (event.data.user) {
          localStorage.setItem("user", JSON.stringify(event.data.user));
          setUser(event.data.user);
        }
        googleWindow.close();
        fetchUser();
      }
    });
  };

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      
      await fetch("https://zidio-kiun.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken || ""}`
        }
      });
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setUser(null);
    }
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
            <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mx-auto mb-2" />
          )}
          <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-md">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin} className="bg-blue-500 text-white px-6 py-2 rounded-md">
          Login with Google
        </button>
      )}
    </div>
  );
};

export default Login;