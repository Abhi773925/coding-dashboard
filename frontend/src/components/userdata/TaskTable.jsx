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
  const [userRole, setUserRole] = useState("editor");
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const theme = {
    gradientBg: "from-violet-600 to-fuchsia-600",
    gradientText: "from-violet-400 to-fuchsia-400",
    accentBg: "bg-violet-600",
    accentText: "text-violet-500",
    accentBorder: "border-violet-600",
    accentShadow: "shadow-purple-900/20",
  };
  // Function to check window size
  const checkWindowSize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Function to check if user is admin and set state accordingly
  const checkAdminStatus = (email) => {
    const adminEmail = "rockabhisheksingh778189@gmail.com";
    console.log("Checking admin status for:", email, "Admin email:", adminEmail); 
    return email === adminEmail;
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
      console.log("Is admin:", isAdmin);
      
      // Send email as query parameter
      const response = await axios.get(`http://localhost:5000/api/Zidio/tasks?email=${encodeURIComponent(userEmail)}`);
      
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
      const response = await axios.get(`http://localhost:5000/api/Zidio/tasks/${taskId}?email=${encodeURIComponent(userEmail)}`);
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

  // Load user data and set admin status
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
      
      if (email) {
        console.log("Setting user email to:", email);
        setUserEmail(email);
        
        // Check if user is admin
        const adminStatus = checkAdminStatus(email);
        console.log("Admin status:", adminStatus);
        setIsAdmin(adminStatus);
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

  // Second useEffect to fetch tasks when userEmail or isAdmin changes
  useEffect(() => {
    if (userEmail) {
      console.log("User email set, fetching tasks...");
      fetchTasks();
    }
  }, [userEmail, isAdmin]);

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
        `http://localhost:5000/api/Zidio/tasks/${selectedTask._id}/comment?email=${encodeURIComponent(userEmail)}`, 
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
    // Add email to form data
    formData.append("email", userEmail);

    try {
      setError(null);
      const response = await axios.post(
        `http://localhost:5000/api/Zidio/tasks/${selectedTask._id}/upload?email=${encodeURIComponent(userEmail)}`, 
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

  const updateTaskStatus = async () => {
    if (!userEmail) return;
    
    try {
      setError(null);
      const response = await axios.patch(
        `http://localhost:5000/api/Zidio/tasks/${selectedTask._id}?email=${encodeURIComponent(userEmail)}`, 
        { status }
      );
      
      setSelectedTask(response.data.task);
      showNotification(`Status updated to ${status}`);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  // Render task cards for mobile view
  const renderTaskCards = () => {
    return tasks.map((task) => (
      <div 
        key={task._id}
        onClick={() => openTaskModal(task)}
        className="mb-4 p-4 bg-[#090e1a]  rounded-xl border border-[#502173] transition-all duration-300 hover:border-blue-400 relative group"
      >
        <div className="absolute inset-0 border border-gray-700 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
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
        
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            task.priority === "High" ? "bg-[#090e1a]  text-red-500 border border-red-500" : 
            task.priority === "Medium" ? "bg-[#090e1a]  text-yellow-500 border border-yellow-500" : 
            "bg-[#090e1a]  text-green-500 border border-green-500"
          }`}>
            {task.priority}
          </span>
          
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            task.status === "Done" ? "bg-[#090e1a]  text-green-500 border border-green-500" : 
            task.status === "In Progress" ? "bg-[#090e1a]  text-yellow-500 border border-yellow-500" :
            "bg-[#090e1a]  text-blue-500 border border-blue-500"
          }`}>
            {task.status || "Pending"}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-4 md:p-6 bg-[#090e1a]  text-white">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 relative">
  <span className="relative z-10 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
    {isAdmin ? "All Tasks" : "My Tasks"}
  </span>
  <span className="absolute -bottom-1 left-0 w-16 md:w-24 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full z-0"></span>
</h2>





      
      {error && (
        <div className="bg-[#090e1a]  text-red-500 p-4 rounded-md mb-6 border border-red-500 relative overflow-hidden">
          <div className="absolute inset-0 border border-red-500 animate-[ping_2s_ease-in-out_infinite]"></div>
          <div className="relative flex items-start z-10">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
            <span className="break-words">{error}</span>
          </div>
        </div>
      )}
      
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg transition-all duration-300 transform translate-y-0 ${
          notification.type === 'success' ? 'bg-[#090e1a]  text-green-500 border border-green-500' : 
          'bg-[#090e1a]  text-red-500 border border-red-500'
        } animate-[pulse_2s_infinite] max-w-xs sm:max-w-md`}>
          <p className="break-words">{notification.message}</p>
        </div>
      )}

      {userEmail && isAdmin && (
        <div className="mb-4 bg-[#090e1a]  text-blue-400 p-4 rounded-md border border-blue-400 relative overflow-hidden">
          <div className="absolute inset-0 border border-blue-400 opacity-20"></div>
          <div className="relative flex items-start z-10">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
            <p className="break-words">
              Admin view: Showing all tasks from all users 
              <span className="block mt-1">(Admin Email: {userEmail})</span>
            </p>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        </div>
      ) : !userEmail ? (
        <div className="text-center py-16 bg-[#090e1a]  rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-700">
          <p className="text-white text-lg">User information not available</p>
          <p className="text-gray-400 mt-2">
            Please make sure you are logged in properly.
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-[#090e1a]  rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-700">
          <p className="text-white text-lg">No tasks available.</p>
          <p className="text-gray-400 mt-2">
            {isAdmin ? 
              "You're logged in as admin but no tasks found in the system." : 
              "No tasks have been assigned to you yet."}
          </p>
          <p className="text-gray-500 mt-1 px-4 break-words">{userEmail || "Unknown"}, Admin: {isAdmin ? "Yes" : "No"}</p>
        </div>
      ) : isMobile ? (
        // Mobile view - cards
        <div className="space-y-4">
          {renderTaskCards()}
        </div>
      ) : (
        // Desktop view - table
        <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-[#502173] transition-all duration-300 relative">
          <div className="absolute inset-0 bg-transparent rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent absolute -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
          <div className="relative z-10 min-w-full">
            <table className="w-full">
              <thead>
                <tr className="bg-[#090e1a]  border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#090e1a] ">
                {tasks.map((task) => (
                  <tr 
                    key={task._id} 
                    className="hover:bg-gray-900 transition-all duration-200 cursor-pointer relative group"
                    onClick={() => openTaskModal(task)}
                  >
                    <td className="absolute inset-0 border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></td>
                    <td className="px-6 py-4 relative z-10 break-words max-w-xs">{task.title}</td>
                    <td className="px-6 py-4 relative z-10 break-words max-w-xs">{task.assignedTo}</td>
                    <td className="px-6 py-4 relative z-10">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.priority === "High" ? "bg-[#090e1a]  text-red-500 border border-red-500" : 
                        task.priority === "Medium" ? "bg-[#090e1a]  text-yellow-500 border border-yellow-500" : 
                        "bg-[#090e1a]  text-green-500 border border-green-500"
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative z-10">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 relative z-10">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === "Done" ? "bg-[#090e1a]  text-green-500 border border-green-500" : 
                        task.status === "In Progress" ? "bg-[#090e1a]  text-yellow-500 border border-yellow-500" :
                        "bg-[#090e1a]  text-blue-500 border border-blue-500"
                      }`}>
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

      {/* Task Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-[#090e1a] /90 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-[#090e1a]  rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            style={{
              backgroundImage: 'linear-gradient(to right, black, black), linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'transparent'
            }}
          >
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-start">
                <span className="mr-2 bg-white/10 p-2 rounded-lg flex-shrink-0">
                  <Edit size={18} className="text-white" />
                </span>
                <span className="break-words">{selectedTask.title}</span>
              </h3>
              <button 
                onClick={closeModal}
                className="text-white bg-[#090e1a]  p-2 rounded-full transition-all duration-200 hover:bg-gray-900 border border-gray-800 flex-shrink-0 ml-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              {error && (
                <div className="bg-[#090e1a]  text-red-500 p-4 rounded-md mb-4 border border-red-500 relative overflow-hidden">
                  <div className="absolute inset-0 border border-red-500 animate-[ping_2s_ease-in-out_infinite]"></div>
                  <div className="relative flex items-start z-10">
                    <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-1" />
                    <span className="break-words">{error}</span>
                  </div>
                </div>
              )}
              
              {/* Task Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-[#090e1a]  p-4 rounded-xl border border-gray-800 relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white rounded-tl"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white rounded-br"></div>
                
                {/* Content */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Assigned To</p>
                  <p className="text-white font-medium break-words">{selectedTask.assignedTo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Priority</p>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedTask.priority === "High" ? "bg-[#090e1a]  text-red-500 border border-red-500" : 
                    selectedTask.priority === "Medium" ? "bg-[#090e1a]  text-yellow-500 border border-yellow-500" : 
                    "bg-[#090e1a]  text-green-500 border border-green-500"
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Deadline</p>
                  <p className="text-white font-medium">{new Date(selectedTask.deadline).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-white break-words">{selectedTask.description || "No description provided"}</p>
                </div>
              </div>
              
              {/* Status Update */}
              {userRole === "editor" && (
                <div className="border-t border-gray-800 pt-5">
                  <p className="text-sm text-gray-400 mb-3">Update Status</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-[#090e1a]  border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 w-full sm:w-auto"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <button 
                      onClick={updateTaskStatus}
                      className="bg-[#090e1a]  hover:bg-gray-900 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 border border-white w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Update Status
                    </button>
                  </div>
                </div>
              )}
              
              {/* File Upload */}
              {userRole === "editor" && (
                <div className="border-t border-gray-800 pt-5">
                  <p className="text-sm text-gray-400 mb-3">Upload File</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="bg-[#090e1a]  border border-gray-800 rounded-md px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <button 
                      onClick={uploadFile}
                      disabled={!file}
                      className={`${
                        file ? 'bg-[#090e1a]  border border-white hover:bg-gray-900' : 'bg-[#090e1a]  border border-gray-700 cursor-not-allowed'
                      } text-white px-4 py-2 rounded-md flex items-center whitespace-nowrap transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start`}
                    >
                      <Upload size={16} className="mr-2" />
                      Upload
                    </button>
                  </div>
                </div>
              )}
              
              {/* Comments */}
              <div className="border-t border-gray-800 pt-5">
                <p className="text-sm text-gray-400 mb-3">Comments</p>
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4 bg-[#090e1a]  p-4 rounded-xl border border-gray-800">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((comment, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-[#090e1a]  rounded-lg border border-gray-800 transition-all duration-200 hover:border-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                          <p className="text-sm font-medium text-white break-words">{comment.user || "User"}</p>
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
                
                {userRole === "editor" && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-[#090e1a]  border border-gray-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                    />
                    <button 
                      onClick={submitComment}
                      disabled={!comment.trim()}
                      className={`${
                        comment.trim() ? 'bg-[#090e1a]  border border-white hover:bg-gray-900' : 'bg-[#090e1a]  border border-gray-700 cursor-not-allowed'
                      } text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start`}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;