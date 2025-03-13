import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  Zap,
  Settings,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  CheckSquare,
  Calendar,
  List,
} from "lucide-react";
import Notification from "./profile/Notification";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("purple");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Function to check user session
  const fetchUser = async () => {
    try {
      // First check localStorage
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        // Use localStorage data first
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      }
      
      // Then verify with server
      const res = await fetch("http://localhost:5000/api/auth/user", {
        credentials: "include",
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else if (res.status === 401) {
        // Only clear if we get a specific unauthorized response
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
      // For network errors or other statuses, keep existing user
      
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
    setIsLoggedIn(false);
    setActiveDropdown(null);
  };

  useEffect(() => {
    fetchUser(); // Check session on load
  }, []);
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen || activeDropdown) {
        const isOutsideClick = !event.target.closest('.dropdown-container');
        if (isOutsideClick) {
          setNotificationsOpen(false);
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen, activeDropdown]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // Close other menus when sidebar opens
    if (!isOpen) {
      setNotificationsOpen(false);
      setActiveDropdown(null);
    }
  };

  // Toggle dropdown
  const toggleDropdown = (name) => {
    // Close notifications when dropdown opens
    if (name && name !== activeDropdown) {
      setNotificationsOpen(false);
    }
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    // Close dropdowns when notifications open
    if (!notificationsOpen) {
      setActiveDropdown(null);
    }
  };

  // Get theme gradient classes
  const getThemeClasses = () => {
    switch (currentTheme) {
      case "blue":
        return {
          gradientBg: "from-blue-600 to-cyan-500",
          gradientText: "from-blue-400 to-cyan-300",
          accentBg: "bg-blue-600",
          accentText: "text-blue-500",
          accentBorder: "border-blue-600",
          accentShadow: "shadow-blue-900/20",
        };
      case "green":
        return {
          gradientBg: "from-emerald-600 to-teal-500",
          gradientText: "from-emerald-400 to-teal-300",
          accentBg: "bg-emerald-600",
          accentText: "text-emerald-500",
          accentBorder: "border-emerald-600",
          accentShadow: "shadow-emerald-900/20",
        };
      default: // purple
        return {
          gradientBg: "from-violet-600 to-fuchsia-600",
          gradientText: "from-violet-400 to-fuchsia-400",
          accentBg: "bg-violet-600",
          accentText: "text-violet-500",
          accentBorder: "border-violet-600",
          accentShadow: "shadow-purple-900/20",
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div>
      {/* Navbar */}
      <nav
        className={`fixed w-full  top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#090e1a]  py-2 shadow-lg"
            : "bg-[#090e1a] /90 backdrop-blur-md py-4"
        } text-gray-300`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className={`h-8 w-8 bg-gradient-to-r ${theme.gradientBg} rounded-lg mr-2`}
            ></div>
            <h1
              className={`text-xl font-bold bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}
            >
             <a href="/"> Zidio</a>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative group dropdown-container">
              <button
                onClick={() => toggleDropdown("features")}
                className={`px-3 py-2 rounded-md flex items-center text-gray-400 hover:text-white hover:bg-gray-900 ${
                  activeDropdown === "features" ? "bg-gray-900 text-white" : ""
                }`}
              >
                <Zap size={16} className="mr-1" />
                Features
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === "features" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "features" && (
                <div className="absolute left-0 mt-2 w-64 bg-[#090e1a]  rounded-md shadow-lg p-2 space-y-1 border border-gray-900 transform transition-all duration-200 origin-top-left">
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-sm rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <div
                      className={`p-1 rounded-md ${theme.accentBg} bg-opacity-20`}
                    >
                      <Settings size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Dashboard</div>
                      <div className="text-xs text-gray-500">
                        View your analytics
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 text-sm rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <div
                      className={`p-1 rounded-md ${theme.accentBg} bg-opacity-20`}
                    >
                      <List size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Analytics</div>
                      <div className="text-xs text-gray-500">
                        Track your performance
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 text-sm rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <div
                      className={`p-1 rounded-md ${theme.accentBg} bg-opacity-20`}
                    >
                      <Heart size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Reports</div>
                      <div className="text-xs text-gray-500">
                        Download your data
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>
            <a
              href="/tasks"
              className="px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 flex items-center"
            >
              <CheckSquare size={16} className="mr-1" />
              Tasks
            </a>
            <a
              href="/schedule"
              className="px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 flex items-center"
            >
              <Calendar size={16} className="mr-1" />
              Schedule
            </a>
            <a
              href="/pricing"
              className="px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 flex items-center"
            >
              <Settings size={16} className="mr-1" />
              Pricing
            </a>
          </div>

          {/* Right Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search */}
            <div
              className={`relative mr-2 transition-all duration-300 ${
                searchFocused ? "w-64" : "w-36"
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                className={`w-full transition-all duration-300 bg-gray-900 rounded-full py-1 pl-8 pr-4 text-sm focus:outline-none border border-gray-800 ${
                  searchFocused ? theme.accentBorder : ""
                } text-gray-300`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Search
                size={16}
                className={`absolute left-2.5 top-1.5 transition-colors duration-300 ${
                  searchFocused ? "text-white" : "text-gray-500"
                }`}
              />
            </div>

            {/* Notifications */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleNotifications}
                className={`p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-900 ${
                  notificationsOpen ? "bg-gray-900 text-white" : ""
                } relative`}
              >
                <Bell size={20} />
                <span
                  className={`absolute top-0 right-0 h-4 w-4 ${theme.accentBg} rounded-full text-xs flex items-center justify-center text-white animate-pulse`}
                >
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2  bg-[#090e1a]  border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <Notification />
                </div>
              )}
            </div>

            {/* Profile/Login */}
            <div className="relative dropdown-container">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => toggleDropdown("profile")}
                    className={`p-1 rounded-full bg-gradient-to-r ${theme.gradientBg} hover:opacity-90`}
                  >
                    <div className="bg-[#090e1a]  rounded-full p-1">
                      <User size={18} className="text-gray-300" />
                    </div>
                  </button>

                  {activeDropdown === "profile" && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#090e1a]  rounded-md shadow-lg p-3 border border-gray-900 z-50">
                      <div className="flex flex-col items-center mb-3 pb-3 border-b border-gray-800">
                        <div
                          className={`p-2 rounded-full bg-gradient-to-r ${theme.gradientBg} mb-2`}
                        >
                          <div className="bg-[#090e1a]  rounded-full p-1">
                            <User size={24} className="text-white" />
                          </div>
                        </div>
                        <h4 className="font-medium text-white">
                          {user?.name || user?.displayName || "User"}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <a
                          href="/profile"
                          className="flex items-center gap-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                        >
                          <User size={16} />
                          <span>Your Profile</span>
                        </a>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                        >
                          <LogOut size={16} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
              <button
                    onClick={() => toggleDropdown("login")}
                    className={`px-3 py-2 rounded-md flex items-center text-gray-400 hover:text-white hover:bg-gray-900 ${
                      activeDropdown === "login" ? "bg-gray-900 text-white" : ""
                    }`}
                  >
                    <User size={16} className="mr-1" />
                    Login
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform duration-200 ${
                        activeDropdown === "login" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "login" && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#090e1a]  rounded-md shadow-lg p-4 border border-gray-900 z-50">
                      <h4 className="font-medium text-white mb-3">
                        Welcome to Zidio
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={handleGoogleLogin}
                          className={`w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gradient-to-r ${theme.gradientBg} text-white hover:opacity-90 transition-opacity`}
                        >
                          <LogIn size={16} />
                          <span>Login with Google</span>
                        </button>

                        <div className="flex items-center my-2">
                          <div className="flex-grow h-px bg-gray-800"></div>
                          <span className="mx-2 text-xs text-gray-500">OR</span>
                          <div className="flex-grow h-px bg-gray-800"></div>
                        </div>

                        <button
                          onClick={() => (window.location.href = "/signup")}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                        >
                          <UserPlus size={16} />
                          <span>Create an account</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Profile button for mobile */}
            {isLoggedIn && (
              <button
                onClick={() => toggleDropdown("mobileProfile")}
                className={`p-1 rounded-full bg-gradient-to-r ${theme.gradientBg} hover:opacity-90`}
              >
                <div className="bg-[#090e1a]  rounded-full p-1">
                  <User size={16} className="text-gray-300" />
                </div>
              </button>
            )}
            
            {/* Notifications */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-900 relative"
              >
                <Bell size={18} />
                <span
                  className={`absolute -top-1 -right-1 h-4 w-4 ${theme.accentBg} rounded-full text-[10px] flex items-center justify-center text-white animate-pulse`}
                >
                  2
                </span>
              </button>

              {/* Mobile Notifications Dropdown - IMPROVED */}
              {notificationsOpen && (
                <div className="fixed inset-x-0 top-16 mx-2 sm:absolute sm:inset-auto sm:top-auto sm:right-0  rounded-lg shadow-lg z-50  overflow-y-auto">
                  <Notification />
                </div>
              )}
            </div>

            {/* Mobile dropdown for profile */}
            {activeDropdown === "mobileProfile" && (
              <div className="absolute top-16 right-4 w-64 bg-[#090e1a]  rounded-md shadow-lg p-3 border border-gray-900 z-50">
                <div className="flex flex-col items-center mb-3 pb-3 border-b border-gray-800">
                  <div
                    className={`p-2 rounded-full bg-gradient-to-r ${theme.gradientBg} mb-2`}
                  >
                    <div className="bg-[#090e1a]  rounded-full p-1">
                      <User size={24} className="text-white" />
                    </div>
                  </div>
                  <h4 className="font-medium text-white">
                    {user?.name || user?.displayName || "User"}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <div className="space-y-1">
                  <a
                    href="/profile"
                    className="flex items-center gap-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <User size={16} />
                    <span>Your Profile</span>
                  </a>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-900"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
        </div>
      </nav>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-[#090e1a]  shadow-xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <div className="p-5 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div
                className={`h-8 w-8 bg-gradient-to-r ${theme.gradientBg} rounded-lg mr-2`}
              ></div>
              <h1
                className={`text-xl font-bold bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}
              >
                Zidio
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile in Mobile Menu (if logged in) */}
          {isLoggedIn && (
            <div className="mb-6 p-4 bg-gray-900 rounded-lg flex items-center">
              <div
                className={`p-1 rounded-full bg-gradient-to-r ${theme.gradientBg} mr-3`}
              >
                <div className="bg-[#090e1a]  rounded-full p-1">
                  <User size={18} className="text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white">
                  {user?.name || user?.displayName || "User"}
                </h4>
                <p className="text-xs text-gray-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          <nav className="space-y-1">
            <div>
              <button
                onClick={() => toggleDropdown("mobileFeatures")}
                className={`w-full flex justify-between items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 ${
                  activeDropdown === "mobileFeatures"
                    ? "bg-gray-900 text-white"
                    : ""
                }`}
              >
                <span className="flex items-center">
                  <Zap size={16} className="mr-2" />
                  Features
                </span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${
                    activeDropdown === "mobileFeatures" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobileFeatures" && (
                <div className="pl-4 mt-1 space-y-1">
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <div
                      className={`p-1 rounded-md ${theme.accentBg} bg-opacity-20`}
                    >
                      <Settings size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white"><a href="/dashboard">Dashboard</a></div>
                      <div className="text-xs text-gray-500">
                        View your analytics
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <div
                      className={`p-1 rounded-md ${theme.accentBg} bg-opacity-20`}
                    >
                      <List size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Analytics</div>
                      <div className="text-xs text-gray-500">
                        Track your performance
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <div
                      className={`p-1 rounded-md ${theme.accentBg} bg-opacity-20`}
                    >
                      <Heart size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Reports</div>
                      <div className="text-xs text-gray-500">
                        Download your data
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>
            <a
              href="/tasks"
              className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <CheckSquare size={16} className="mr-2" />
              Tasks
            </a>
            <a
              href="/schedule"
              className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <Calendar size={16} className="mr-2" />
              Schedule
            </a>
            <a
              href="/pricing"
              className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <Settings size={16} className="mr-2" />
              Pricing
            </a>
          </nav>

          {/* Mobile Login/Logout */}
          <div className="absolute bottom-0 left-0 w-full p-5 border-t border-gray-900">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleGoogleLogin}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gradient-to-r ${theme.gradientBg} text-white hover:opacity-90 transition-opacity`}
                >
                  <LogIn size={16} />
                  <span>Login with Google</span>
                </button>
                <button
                  onClick={() => (window.location.href = "/signup")}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Create an account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay when notifications or dropdowns are open on mobile */}
      {(notificationsOpen || activeDropdown) && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
          onClick={() => {
            setNotificationsOpen(false);
            setActiveDropdown(null);
          }}
        ></div>
      )}
    </div>
  );
};

export default Navbar;