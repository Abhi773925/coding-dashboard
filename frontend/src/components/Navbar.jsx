// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Zidio Manager</Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user.profilePicture && (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="hidden lg:inline">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
              </svg>
              Login with Google
            </button>
          )}
        </div>
        
        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 right-4 bg-gray-800 p-4 rounded shadow-lg z-10">
            <div className="flex flex-col gap-4">
              <Link to="/" className="hover:text-gray-300" onClick={toggleMenu}>Home</Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="hover:text-gray-300" onClick={toggleMenu}>Dashboard</Link>
              )}
              
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {user.profilePicture && (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                  </svg>
                  Login with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;