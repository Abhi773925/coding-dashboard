import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Upload, MessageSquare, CheckCircle, X, AlertCircle } from "lucide-react";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false); 
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Enhanced color theme
  const theme = {
    primaryGradient: "from-indigo-500 to-purple-600",
    primaryText: "text-indigo-400",
    primaryBg: "bg-indigo-600",
    primaryBorder: "border-indigo-600",
    secondaryBg: "bg-slate-800",
    accentBg: "bg-violet-500",
    accentHover: "hover:bg-violet-600",
    darkBg: "bg-slate-900",
    darkCard: "bg-slate-800/40",
    tableHeaderBg: "bg-slate-800/70",
    tableBorder: "border-slate-700",
    hoverBg: "hover:bg-slate-700/50",
    errorBg: "bg-red-900/20",
    errorBorder: "border-red-800",
    errorText: "text-red-400",
    successBg: "bg-green-900/20",
    successBorder: "border-green-800", 
    successText: "text-green-400",
  };

  // Function to check window size
  const checkWindowSize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Updated function to check user role
  const checkUserRole = (email, role) => {
    // Admin emails list - could be moved to a configuration
    const adminEmails = ["rockabhisheksingh778189@gmail.com"];
    const isAdminUser = adminEmails.includes(email);
    
    // Role-based checks
    const isAdminRole = role === "admin";
    const isSubAdminRole = role === "subadmin";
    
    // Set both email-based and role-based admin flags
    return {
      isAdmin: isAdminUser || isAdminRole,
      isSubAdmin: isSubAdminRole
    };
  };

  // Function to fetch all tasks
  const fetchTasks = async () => {
    if (!userEmail) {
      console.error("Cannot fetch tasks: No user email available");
      setError("User information not available. Please try logging in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching tasks for user:", userEmail);
      console.log("User role:", userRole);
      console.log("Is admin:", isAdmin);
      console.log("Is subadmin:", isSubAdmin);
      
      // Send email and role as query parameters
      const response = await axios.get(`https://zidio-kiun.onrender.com/api/Zidio/tasks?email=${encodeURIComponent(userEmail)}&role=${userRole}`);
      
      console.log("Tasks received:", response.data.length);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(`Failed to load tasks: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch a single task
  const fetchTask = async (taskId) => {
    if (!userEmail) {
      console.error("Cannot fetch task: No user email available");
      setError("User information not available. Please try logging in again.");
      return null;
    }

    try {
      const response = await axios.get(`https://zidio-kiun.onrender.com/api/Zidio/tasks/${taskId}?email=${encodeURIComponent(userEmail)}&role=${userRole}`);
      setSelectedTask(response.data);
      setStatus(response.data.status || "Pending");
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error fetching task:", err);
      setError(`Failed to load task details: ${err.response?.data?.message || err.message}`);
      return null;
    }
  };

  // Load user data and set role and admin status
  const loadUserData = () => {
    try {
      // Get user from localStorage
      const userJson = localStorage.getItem("user");
      console.log("User data from localStorage:", userJson);
      
      if (!userJson) {
        console.error("No user data found in localStorage");
        setError("User information not available. Please try logging in again.");
        return false;
      }
      
      const user = JSON.parse(userJson);
      console.log("Parsed user data:", user);
      
      // Try to get email from multiple possible locations in user object
      let email = null;
      if (user.email) {
        email = user.email;
      } else if (user.name && user.name.includes('@')) {
        email = user.name;
      } else if (user.username && user.username.includes('@')) {
        email = user.username;
      }
      
      // Get role from user object
      let role = user.role || "user"; // Default to "user" if no role found
      console.log("User role from localStorage:", role);
      setUserRole(role);
      
      if (email) {
        console.log("Setting user email to:", email);
        setUserEmail(email);
        
        // Check user role and admin status
        const { isAdmin: adminStatus, isSubAdmin: subAdminStatus } = checkUserRole(email, role);
        console.log("Admin status:", adminStatus);
        console.log("SubAdmin status:", subAdminStatus);
        
        setIsAdmin(adminStatus);
        setIsSubAdmin(subAdminStatus);
        return true;
      } else {
        console.error("Could not find email in user data");
        setError("Email information not found. Please update your profile.");
        return false;
      }
    } catch (err) {
      console.error("Error accessing user data from localStorage:", err);
      setError("Error loading user data. Please try logging in again.");
      return false;
    }
  };

  useEffect(() => {
    // Load user data first
    const userLoaded = loadUserData();
    console.log("User loaded:", userLoaded);
    
    // Add responsive handling
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  // Second useEffect to fetch tasks when userEmail or role changes
  useEffect(() => {
    if (userEmail) {
      console.log("User email set, fetching tasks...");
      fetchTasks();
    }
  }, [userEmail, isAdmin, isSubAdmin, userRole]);

  const openTaskModal = async (task) => {
    // Fetch the latest task data to ensure we have the most up-to-date information
    const updatedTask = await fetchTask(task._id);
    if (updatedTask) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setComment("");
    setFile(null);
    setError(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const submitComment = async () => {
    if (!comment.trim() || !userEmail) return;
    
    try {
      setError(null);
      const response = await axios.post(
        `https://zidio-kiun.onrender.com/api/Zidio/tasks/${selectedTask._id}/comment?email=${encodeURIComponent(userEmail)}&role=${userRole}`, 
        { 
          comment: comment.trim(),
          userEmail: userEmail
        }
      );
      
      setSelectedTask(response.data.task);
      setComment("");
      showNotification("Comment added successfully");
      fetchTasks();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(`Failed to add comment: ${err.response?.data?.message || err.message}`);
    }
  };

  const uploadFile = async () => {
    if (!file || !userEmail) return;

    const formData = new FormData();
    formData.append("file", file);
    // Add email and role to form data
    formData.append("email", userEmail);
    formData.append("role", userRole);

    try {
      setError(null);
      const response = await axios.post(
        `https://zidio-kiun.onrender.com/api/Zidio/tasks/${selectedTask._id}/upload?email=${encodeURIComponent(userEmail)}&role=${userRole}`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );
      
      setSelectedTask(response.data.task);
      setFile(null);
      showNotification("File uploaded successfully");
      fetchTasks();
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(`Failed to upload file: ${err.response?.data?.message || err.message}`);
    }
  };
  const updateTaskStatus = async (retryCount = 0) => {
    if (!userEmail) return;
    
    try {
      setError(null);
      console.log("Updating task status:", selectedTask._id, status);
      
      const response = await axios.patch(
        `https://zidio-kiun.onrender.com/api/Zidio/tasks/${selectedTask._id}?email=${encodeURIComponent(userEmail)}&role=${userRole}`, 
        { status: status }
      );
      
      setSelectedTask(response.data.task);
      showNotification(`Status updated to ${status}`);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task status:", err);
      
      if (err.message === "Network Error" && retryCount < 3) {
        setError(`Network error, retrying... (${retryCount + 1}/3)`);
        setTimeout(() => updateTaskStatus(retryCount + 1), 2000);
        return;
      }
      
      setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };
  // const updateTaskStatus = async () => {
  //   if (!userEmail) return;
    
  //   try {
  //     setError(null);
  //     const response = await axios.patch(
  //       `https://zidio-kiun.onrender.com/api/Zidio/tasks/${selectedTask._id}?email=${encodeURIComponent(userEmail)}&role=${userRole}`, 
  //       { status }
  //     );
      
  //     setSelectedTask(response.data.task);
  //     showNotification(`Status updated to ${status}`);
  //     fetchTasks();
  //   } catch (err) {
  //     console.error("Error updating task status:", err);
  //     setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
  //   }
  // };

  // Get title based on user role
  const getPageTitle = () => {
    if (isAdmin) {
      return "All Tasks (Admin View)";
    } else if (isSubAdmin) {
      return "Department Tasks (SubAdmin View)";
    } else {
      return "My Assigned Tasks";
    }
  };

  // Get priority styling
  const getPriorityStyle = (priority) => {
    switch(priority) {
      case "High":
        return "border-red-500 text-red-400 bg-red-900/20 hover:bg-red-900/30";
      case "Medium":
        return "border-yellow-500 text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/30";
      default:
        return "border-green-500 text-green-400 bg-green-900/20 hover:bg-green-900/30";
    }
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch(status) {
      case "Done":
        return "border-green-500 text-green-400 bg-green-900/20 hover:bg-green-900/30";
      case "In Progress":
        return "border-yellow-500 text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/30";
      default:
        return "border-blue-500 text-blue-400 bg-blue-900/20 hover:bg-blue-900/30";
    }
  };

  // Function to check if user can edit task (admin, subadmin, or assigned user)
  const canEditTask = (task) => {
    if (isAdmin || isSubAdmin) return true;
    return task.assignedTo === userEmail;
  };

  // Render task cards for mobile view
  const renderTaskCards = () => {
    return tasks.map((task) => (
      <div 
        key={task._id}
        onClick={() => openTaskModal(task)}
        className={`mb-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer shadow-lg relative group ${theme.darkCard} ${theme.tableBorder} hover:shadow-indigo-900/20`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <h3 className="text-lg font-semibold mb-2 text-white break-words">{task.title}</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-400">Assigned To</p>
            <p className="text-sm text-white break-words overflow-hidden">{task.assignedTo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Deadline</p>
            <p className="text-sm text-white">{new Date(task.deadline).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-2 mt-3">
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-all duration-200 ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>
          
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-all duration-200 ${getStatusStyle(task.status)}`}>
            {task.status || "Pending"}
          </span>
        </div>

        {(isAdmin || isSubAdmin) && (
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-xs text-gray-400">Created By</p>
            <p className="text-sm text-white break-words overflow-hidden">{task.createdBy || "Unknown"}</p>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-4 md:p-6 bg-[#090e1a] text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 relative">
        <span className={`relative z-10 bg-gradient-to-r ${theme.primaryGradient} bg-clip-text text-transparent`}>
          {getPageTitle()}
        </span>
        <span className={`absolute -bottom-1 left-0 w-16 md:w-24 h-1 bg-gradient-to-r ${theme.primaryGradient} rounded-full z-0`}></span>
      </h2>
      
      {error && (
        <div className={`${theme.errorBg} ${theme.errorText} p-4 rounded-lg mb-6 border ${theme.errorBorder} relative overflow-hidden shadow-lg`}>
          <div className="relative flex items-start z-10">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
            <span className="break-words">{error}</span>
          </div>
        </div>
      )}
      
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl transition-all duration-300 transform ${
          notification.type === 'success' 
            ? `${theme.successBg} ${theme.successText} border ${theme.successBorder}` 
            : `${theme.errorBg} ${theme.errorText} border ${theme.errorBorder}`
        } max-w-xs sm:max-w-md`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle size={18} className="mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            )}
            <p className="break-words">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Role-based information banner */}
      {userEmail && (isAdmin || isSubAdmin) && (
        <div className={`mb-6 p-4 rounded-lg border relative overflow-hidden shadow-lg ${
          isAdmin 
            ? "bg-purple-900/20 text-purple-400 border-purple-800" 
            : "bg-blue-900/20 text-blue-400 border-blue-800"
        }`}>
          <div className="relative flex items-start z-10">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
            <div>
              <p className="break-words">
                {isAdmin 
                  ? "Admin view: Showing all tasks from all users" 
                  : "SubAdmin view: Showing tasks from your department"}
                <span className="block mt-1 opacity-80">
                  (Email: {userEmail}, Role: {userRole})
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-400">Loading your tasks...</p>
          </div>
        </div>
      ) : !userEmail ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-white text-lg">User information not available</p>
          <p className="text-gray-400 mt-2">
            Please make sure you are logged in properly.
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-white text-lg">No tasks available.</p>
          <p className="text-gray-400 mt-2">
            {isAdmin 
              ? "You're logged in as admin but no tasks found in the system." 
              : isSubAdmin 
                ? "No tasks found for your department." 
                : "No tasks have been assigned to you yet."}
          </p>
          <p className="text-gray-500 mt-1 px-4 break-words">
            {userEmail || "Unknown"}, Role: {userRole}, 
            {isAdmin ? " (Admin)" : isSubAdmin ? " (SubAdmin)" : " (Regular User)"}
          </p>
        </div>
      ) : isMobile ? (
        // Mobile view - cards
        <div className="space-y-4">
          {renderTaskCards()}
        </div>
      ) : (
        // Desktop view - table with improved alignment and interaction
        <div className="overflow-hidden rounded-xl border border-slate-700 transition-all duration-300 shadow-lg">
          <div className="min-w-full bg-slate-900">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/70 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Assigned To</th>
                  {(isAdmin || isSubAdmin) && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Created By</th>
                  )}
                  <th className="px-6 py-4 text-center text-xs font-medium text-indigo-300 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-indigo-300 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {tasks.map((task) => (
                  <tr 
                    key={task._id} 
                    className={`transition-all duration-200 cursor-pointer ${hoveredRow === task._id ? 'bg-indigo-900/10' : 'hover:bg-slate-800/30'}`}
                    onClick={() => openTaskModal(task)}
                    onMouseEnter={() => setHoveredRow(task._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 text-white break-words max-w-xs">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          task.priority === "High" ? "bg-red-500" : 
                          task.priority === "Medium" ? "bg-yellow-500" : 
                          "bg-green-500"
                        }`}></span>
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 break-words max-w-xs">{task.assignedTo}</td>
                    {(isAdmin || isSubAdmin) && (
                      <td className="px-6 py-4 text-gray-300 break-words max-w-xs">{task.createdBy || "Unknown"}</td>
                    )}
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-all duration-200 ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-all duration-200 ${getStatusStyle(task.status)}`}>
                        {task.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Modal with role-based permissions */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-slate-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-6 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-start">
                <span className="mr-2 bg-white/20 p-2 rounded-lg flex-shrink-0">
                  <Edit size={18} className="text-white" />
                </span>
                <span className="break-words">{selectedTask.title}</span>
              </h3>
              <button 
                onClick={closeModal}
                className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200 flex-shrink-0 ml-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              {error && (
                <div className={`${theme.errorBg} ${theme.errorText} p-4 rounded-lg mb-4 border ${theme.errorBorder} shadow-lg`}>
                  <div className="flex items-start">
                    <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <span className="break-words">{error}</span>
                  </div>
                </div>
              )}
              
              {/* Task Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-slate-800/40 p-4 rounded-xl border border-slate-700 shadow-inner">
                <div className="space-y-1">
                  <p className="text-sm text-indigo-300">Assigned To</p>
                  <p className="text-white font-medium break-words">{selectedTask.assignedTo}</p>
                </div>
                {(isAdmin || isSubAdmin) && (
                  <div className="space-y-1">
                    <p className="text-sm text-indigo-300">Created By</p>
                    <p className="text-white font-medium break-words">{selectedTask.createdBy || "Unknown"}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-indigo-300">Priority</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-all duration-200 ${getPriorityStyle(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-indigo-300">Deadline</p>
                  <p className="text-white font-medium">{new Date(selectedTask.deadline).toLocaleDateString()}</p>
                </div>
                {(isAdmin || isSubAdmin) && selectedTask.department && (
                  <div className="space-y-1">
                    <p className="text-sm text-indigo-300">Department</p>
                    <p className="text-white font-medium">{selectedTask.department}</p>
                  </div>
                )}
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-indigo-300">Description</p>
                  <p className="text-white break-words bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                    {selectedTask.description || "No description provided"}
                  </p>
                </div>
              </div>
              
              {/* Status Update - only visible to people who can edit */}
              {canEditTask(selectedTask) && (
                <div className="border-t border-slate-800 pt-5">
                  <p className="text-sm text-indigo-300 mb-3">Update Status</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 w-full sm:w-auto"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <button 
                      onClick={updateTaskStatus}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-lg shadow-indigo-900/30 w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Update Status
                    </button>
                  </div>
                </div>
              )}
              
              {/* File Upload - only visible to people who can edit */}
              {canEditTask(selectedTask) && (
                <div className="border-t border-slate-800 pt-5">
                  <p className="text-sm text-indigo-300 mb-3">Upload File</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                      />
                    </div>
                    <button 
                      onClick={uploadFile}
                      disabled={!file}
                      className={`${
                        file ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/30' : 'bg-slate-700 cursor-not-allowed'
                      } text-white px-4 py-2 rounded-md flex items-center whitespace-nowrap transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start`}
                    >
                      <Upload size={16} className="mr-2" />
                      Upload
                    </button>
                  </div>
                </div>
              )}
              
              {/* Comments section - always visible but comment entry is role-based */}
              <div className="border-t border-slate-800 pt-5">
                <p className="text-sm text-indigo-300 mb-3">Comments</p>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700 shadow-inner">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((comment, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-slate-800 rounded-lg border border-slate-700 transition-all duration-200 hover:border-indigo-500/30 hover:bg-slate-800/70"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                          <p className="text-sm font-medium text-indigo-300 break-words">{comment.user || "User"}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.date).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-white break-words">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">No comments yet</p>
                  )}
                </div>
                
                {/* Allow comments for anyone who can view the task */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <button 
                    onClick={submitComment}
                    disabled={!comment.trim()}
                    className={`${
                      comment.trim() ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/30' : 'bg-slate-700 cursor-not-allowed'
                    } text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start`}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Comment
                  </button>
                </div>
              </div>
              
              {/* Additional admin actions - only visible to admins */}
              {isAdmin && (
                <div className="border-t border-slate-800 pt-5">
                  <p className="text-sm text-indigo-300 mb-3">Admin Actions</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-lg shadow-red-900/30"
                    >
                      <X size={16} className="mr-2" />
                      Delete Task
                    </button>
                    <button 
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-lg shadow-yellow-900/30"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Task
                    </button>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-lg shadow-blue-900/30"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Send Notification
                    </button>
                  </div>
                </div>
              )}
              
              {/* Subadmin actions - only visible to subadmins */}
              {isSubAdmin && !isAdmin && (
                <div className="border-t border-slate-800 pt-5">
                  <p className="text-sm text-indigo-300 mb-3">SubAdmin Actions</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-lg shadow-yellow-900/30"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Task
                    </button>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 shadow-lg shadow-blue-900/30"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Send Reminder
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;