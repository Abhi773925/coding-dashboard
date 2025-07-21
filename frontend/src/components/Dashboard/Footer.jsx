"use client"
import { Linkedin, Instagram, X } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { motion } from "framer-motion" // Import motion for animations

const Footer = () => {
  const { isDarkMode } = useTheme()

  return (
    <footer
       className={`
        max-h-fit py-6 px-2 sm:px-6 lg:px-8
        ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-gray-50 text-gray-900"}
        transition-colors duration-300
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Navigation Links */}
          <nav className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {["FAQ", "Support", "Privacy", "Timeline", "Terms"].map((link) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  text-base font-medium transition-all duration-300
                  ${isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"}
                `}
              >
                {link}
              </motion.a>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-6 mb-8">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`
                p-3 rounded-full flex items-center justify-center
                ${isDarkMode ? "bg-slate-800/70 text-blue-400 hover:bg-blue-900/50" : "bg-blue-50/70 text-blue-600 hover:bg-blue-100/70"}
                transition-all duration-300 shadow-md hover:shadow-lg
              `}
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className={`
                p-3 rounded-full flex items-center justify-center
                ${isDarkMode ? "bg-slate-800/70 text-gray-200 hover:bg-gray-700/50" : "bg-gray-100/70 text-gray-800 hover:bg-gray-200/70"}
                transition-all duration-300 shadow-md hover:shadow-lg
              `}
              aria-label="X (Twitter)"
            >
              <X size={24} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`
                p-3 rounded-full flex items-center justify-center
                ${isDarkMode ? "bg-slate-800/70 text-pink-400 hover:bg-pink-900/50" : "bg-pink-50/70 text-pink-600 hover:bg-pink-100/70"}
                transition-all duration-300 shadow-md hover:shadow-lg
              `}
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </motion.a>
          </div>

          {/* Copyright with Gradient Text */}
          <div className="text-center">
            <p
              className={`
                text-sm sm:text-base font-medium
                bg-clip-text text-transparent
                ${isDarkMode ? "bg-gradient-to-r from-indigo-400 to-blue-400" : "bg-gradient-to-r from-indigo-600 to-blue-600"}
              `}
            >
              © {new Date().getFullYear()} PrepMate, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
