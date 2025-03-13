import { useState } from "react";

const Schedule = () => {
  // Function to open email client with pre-filled subject & body
  const openEmailClient = (subject, body) => {
    const email = "rockabhisheksingh778189@gmail.com";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink; // Redirects to email client
  };

  return (
    <div className="bg-[#090e1a] text-white min-h-screen flex flex-col items-center px-6 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
        Contact & Notifications
      </h2>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Card Section */}
        <div className="flex flex-col items-center bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 ">
          <h3 className="text-xl font-semibold text-blue-300 mb-4">Contact Us</h3>
          <p className="text-white text-lg mb-4">Email: rockabhisheksingh778189@gmail.com</p>
          <p className="text-white text-lg mb-4">Phone: 7739254874</p>
        </div>

        {/* Notification Card Section */}
        <div className="w-full bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 ">
          <h3 className="text-xl font-semibold text-center text-blue-300 mb-4">Upcoming Features</h3>
          <p className="text-lg text-white">
            One-One  sessions is coming up soon! Stay tuned for more details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
