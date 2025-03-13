import { useState, useEffect } from "react";
import { BarChart, Users, DollarSign, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to TaskTable if no user is found
      navigate("/");
    }
  }, [navigate]);

  // Check user's email and redirect unauthorized users
  useEffect(() => {
    if (user && user.email !== "rockabhisheksingh778189@gmail.com") {
      navigate("/");
    }
  }, [user, navigate]);

  // Return null during the initial check to prevent flash of content
  if (!user || user.email !== "rockabhisheksingh778189@gmail.com") {
    return null;
  }

  // Only render the dashboard for the authorized user
  return (
    <div className="bg-[#090e1a]  text-gray-300 ">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-[#090e1a]  px-4 sm:px-6">
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

      {/* Analytics Cards */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a]  p-4 sm:p-6 shadow-lg">
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
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a]  p-4 sm:p-6 shadow-lg">
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
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a]  p-4 sm:p-6 shadow-lg">
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
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#090e1a]  p-4 sm:p-6 shadow-lg">
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
    </div>
  );
};

export default Dashboard;