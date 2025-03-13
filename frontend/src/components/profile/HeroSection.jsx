import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const adminEmail = "rockabhisheksingh778189@gmail.com";
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    // Get user email from localStorage on component mount
    const fetchUserFromStorage = () => {
      try {
        const savedUser = localStorage.getItem("user");
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUserEmail(userData.email || "");
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Error fetching user from localStorage:", err);
        setUserEmail("");
        setIsLoggedIn(false);
      }
    };
    
    fetchUserFromStorage();
  }, []);
  
  const handleAdminClick = () => {
    if (userEmail !== adminEmail) {
      setShowPopup(true);
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  const isAdmin = userEmail === adminEmail;

  return (
    <div className="bg-[#090e1a] min-h-screen flex flex-col justify-start pt-12 md:pt-24 lg:pt-32 px-4 md:px-8 lg:px-16 relative">
      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Manage Your Tasks with <span className="text-blue-400">Zidio</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          className="mt-4 text-lg md:text-xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Stay on top of your workflow, boost productivity, and never miss a deadline with 
          <span className="font-semibold"> Zidio Task Management</span>.
        </motion.p>
        
        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          {/* Show My Tasks */}
          <Link to="/tasks">
            <motion.button
              className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
            >
              Show My Tasks
            </motion.button>
          </Link>
          
          {/* Dashboard Button */}
          {isAdmin ? (
            <Link to="/dashboard">
              <motion.button
                className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
              >
                Go to Dashboard
              </motion.button>
            </Link>
          ) : (
            <motion.button
              className="px-6 py-3 rounded-lg font-medium bg-gray-600 text-gray-400 cursor-not-allowed"
              onClick={handleAdminClick}
              disabled
            >
              Dashboard (Restricted)
            </motion.button>
          )}
          
          {/* Admin Button */}
          {isAdmin ? (
            <Link to="/tasks">
              <motion.button
                className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-teal-600 text-white hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
              >
                Admin Panel
              </motion.button>
            </Link>
          ) : (
            <motion.button
              className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-teal-600 text-white hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              onClick={handleAdminClick}
            >
              Be an Admin
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Floating Elements for Aesthetic Appeal */}
      <motion.div
        className="absolute top-10 right-10 w-14 h-14 bg-blue-400 opacity-30 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 left-16 w-10 h-10 bg-purple-500 opacity-30 rounded-full"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      
      {/* Admin Access Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={closePopup}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <motion.div 
            className="bg-[#111827] p-6 rounded-lg max-w-md w-full border border-purple-500 shadow-lg z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-3">Admin Access Restricted</h3>
            <p className="text-gray-300 mb-4">
              To request admin access, please contact the organization administrator at:
            </p>
            <p className="text-blue-400 font-medium mb-4">{adminEmail}</p>
            <div className="flex justify-end">
              <motion.button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                onClick={closePopup}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;