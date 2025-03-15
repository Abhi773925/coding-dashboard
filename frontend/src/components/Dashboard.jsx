import { useState, useEffect } from "react";
import { BarChart, Users, DollarSign, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        console.log("Retrieved user from localStorage:", storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed user:", parsedUser);
          setUser(parsedUser);
        } else {
          console.log("No user found in localStorage, redirecting");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Check user's role and redirect unauthorized users
  useEffect(() => {
    if (!loading && user) {
      console.log("Checking user role:", user.role);
      if (!["admin", "subadmin"].includes(user.role)) {
        console.log("Unauthorized role, redirecting");
        navigate("/");
      }
    }
  }, [user, navigate, loading]);

  // Show loading state
  if (loading) {
    return <div className="bg-[#090e1a] text-gray-300 p-6 flex justify-center">Loading...</div>;
  }

  // Return null if user is not found or unauthorized
  if (!user || !["admin", "subadmin"].includes(user.role)) {
    return null;
  }

  // Only render the dashboard for authorized users (admin or subadmin)
  return (
    <div className="bg-[#090e1a] text-gray-300">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-[#090e1a] px-4 sm:px-6">
        <div className="flex overflow-x-auto">
          <button
            className={`flex items-center px-3 sm:px-4 py-3 text-sm font-medium ${
              activeTab === "analytics" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart className="mr-2" size={16} />
            <span>Analytics</span>
          </button>

          <button
            className={`flex items-center px-3 sm:px-4 py-3 text-sm font-medium ${
              activeTab === "users" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2" size={16} />
            <span>Users</span>
          </button>

          <button
            className={`flex items-center px-3 sm:px-4 py-3 text-sm font-medium ${
              activeTab === "revenue" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            <DollarSign className="mr-2" size={16} />
            <span>Revenue</span>
          </button>
        </div>
      </div>

      {/* Role Display Banner - Enhanced for visibility */}
      <div className="bg-gray-800/30 px-6 py-3 text-sm">
        <div className="flex items-center">
          <span className="font-medium mr-2">Role: </span>
          <span 
            className={`px-2 py-1 rounded ${
              user.role === "admin" 
                ? "bg-purple-900/50 text-purple-300" 
                : "bg-blue-900/50 text-blue-300"
            }`}
          >
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}
          </span>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a] p-4 sm:p-6 shadow-lg">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-900/20 p-3 text-purple-400">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-white">12,304</p>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a] p-4 sm:p-6 shadow-lg">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-900/20 p-3 text-purple-400">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-white">$54,120</p>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a] p-4 sm:p-6 shadow-lg">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-900/20 p-3 text-purple-400">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sessions</p>
                <p className="text-xl sm:text-2xl font-bold text-white">8,720</p>
              </div>
            </div>
          </div>

          {/* Add Task */}
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a] p-4 sm:p-6 shadow-lg">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-900/20 p-3 text-purple-400">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">New Task</p>
                <button
                  className="mt-2 rounded-lg bg-purple-900 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white hover:bg-purple-800"
                  onClick={() => navigate("/taskform")}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-900 p-4 mt-4 rounded-lg mx-4 sm:mx-6 mb-4">
          <h3 className="text-white font-medium mb-2">Debug Info</h3>
          <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">
            {JSON.stringify({
              user: user,
              role: user?.role,
              isAuthorized: ["admin", "subadmin"].includes(user?.role)
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;