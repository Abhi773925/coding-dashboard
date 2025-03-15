// import React, { useEffect, useState } from "react";

// const Login = () => {
//   const [user, setUser] = useState(null);

//   // Function to check user session - first check localStorage, then verify with server
//   const fetchUser = async () => {
//     try {
//       // Check if user exists in localStorage first
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
      
//       // Then verify with server
//       const res = await fetch("https://zidio-kiun.onrender.com/api/auth/user", {
//         credentials: "include", // Ensure cookies/session are sent
//       });
//       const data = await res.json();
      
//       if (data.success) {
//         // Store complete user data in localStorage and state
//         console.log("djd");
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//       } else {
//         localStorage.removeItem("user");
//         setUser(null);
//       }
//     } catch (err) {
//       console.error("Error fetching user:", err);
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.open("https://zidio-kiun.onrender.com/api/auth/google", "_self");
//   };

//   const handleLogout = () => {
//     window.open("https://zidio-kiun.onrender.com/api/auth/logout", "_self");
//     localStorage.removeItem("user"); // Remove from localStorage
//     setUser(null);
//   };

//   useEffect(() => {
//     fetchUser(); // Check session on load
//   }, []);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       {user ? (
//         <div className="text-center">
//           <h2 className="text-lg font-bold mb-2">Welcome, {user.name}</h2>
//           {user.profilePicture && (
//             <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mx-auto mb-2" />
//           )}
//           <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-md">
//             Logout
//           </button>
//         </div>
//       ) : (
//         <button onClick={handleGoogleLogin} className="bg-blue-500 text-white px-6 py-2 rounded-md">
//           Login with Google
//         </button>
//       )}
//     </div>
//   );
// };

// export default Login;