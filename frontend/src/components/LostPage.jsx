import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LostPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#090e1a]  text-gray-300 relative overflow-hidden">
      {/* Animated Floating Elements */}
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 10 }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-10 h-10 bg-yellow-400 rounded-full shadow-lg opacity-70"
      ></motion.div>

      {/* Illustration */}
      <div className="relative w-80 md:w-96">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          fill="none"
          className="w-full"
        >
          <circle cx="250" cy="250" r="200" fill="#FDE68A" />
          <rect x="150" y="300" width="200" height="100" fill="#1E40AF" />
          <circle cx="200" cy="350" r="15" fill="#F43F5E" />
          <circle cx="300" cy="350" r="15" fill="#F43F5E" />
          <path d="M250 150 Q230 100 200 150" stroke="#000" strokeWidth="5" fill="none" />
        </svg>
      </div>

      {/* Text */}
      <p className="mt-6 text-lg text-gray-400 text-center">
        Sorry, this page is on holiday and you should be too.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="px-5 py-2 border-2 border-blue-500 text-blue-500 font-medium rounded-md hover:bg-blue-500 hover:text-white transition-all">
          REPORT
        </button>
        <Link
          to="/"
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-md hover:scale-105 transition-all"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LostPage;
