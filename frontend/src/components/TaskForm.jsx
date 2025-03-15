import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://zidio-kiun.onrender.com/api/Zidio/tasks/create";
const CHECK_USER_API = "https://zidio-kiun.onrender.com/api/Zidio/users/check";

const TaskForm = ({ onTaskCreated = () => {} }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: [], // Changed to array for multiple users
    priority: "Medium",
    role: "Viewer",
    deadline: "",
    comments: "",
    file: null,
    filePreview: "",
  });
  const [currentEmail, setCurrentEmail] = useState(""); // For handling the current email input
  const [isValidEmail, setIsValidEmail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailDebounce, setEmailDebounce] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formExpanded, setFormExpanded] = useState(true);
  const [stats, setStats] = useState({
    pendingTasks: 12,
    completedToday: 8,
    teamMembers: 5,
    highPriority: 3
  });
  const [recentActivities] = useState([
    { user: "Elena Kim", action: "completed", task: "Update user dashboard", time: "10 min ago" },
    { user: "David Chen", action: "created", task: "Fix navigation bug", time: "32 min ago" },
    { user: "Sarah Johnson", action: "assigned", task: "Create API endpoints", time: "1 hour ago" },
    { user: "Michael Davis", action: "commented on", task: "Database migration", time: "3 hours ago" }
  ]);

  // Reset error when form values change
  useEffect(() => {
    setError(null);
  }, [task]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Email input is handled separately
    if (name === "assignedTo") {
      setCurrentEmail(value);
      
      // Debounce email validation if it looks like an email
      if (value.includes("@")) {
        clearTimeout(emailDebounce);
        setEmailDebounce(setTimeout(() => validateEmail(value), 500));
      }
    } else {
      setTask({ ...task, [name]: value });
    }
  };

  // File upload preview with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      
      setTask({
        ...task,
        file: file,
        filePreview: URL.createObjectURL(file),
      });
    }
  };

  // Validate Email
  const validateEmail = async (email = currentEmail) => {
    if (!email || !email.includes("@")) {
      setIsValidEmail(null);
      return;
    }
    
    try {
      const response = await axios.post(CHECK_USER_API, { email });
      setIsValidEmail(response.data.exists);
    } catch (error) {
      console.error("Error validating email:", error);
      setIsValidEmail(false);
    }
  };

  // Add email to the assignedTo array
  const addAssignee = () => {
    if (!currentEmail || !currentEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (task.assignedTo.includes(currentEmail)) {
      setError("This user is already assigned to the task");
      return;
    }
    
    if (isValidEmail) {
      setTask({
        ...task,
        assignedTo: [...task.assignedTo, currentEmail]
      });
      setCurrentEmail("");
      setIsValidEmail(null);
    } else {
      // If not already validated, try to validate first
      validateEmail(currentEmail).then(() => {
        if (isValidEmail) {
          setTask({
            ...task,
            assignedTo: [...task.assignedTo, currentEmail]
          });
          setCurrentEmail("");
          setIsValidEmail(null);
        } else {
          setError("Please assign the task to a registered user");
        }
      });
    }
  };

  // Remove assignee from the list
  const removeAssignee = (email) => {
    setTask({
      ...task,
      assignedTo: task.assignedTo.filter(e => e !== email)
    });
  };

  // Submit form
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (isSubmitting) return;
    
  //   // Final validation before submission
  //   if (task.assignedTo.length === 0) {
  //     setError("Please assign the task to at least one team member");
  //     return;
  //   }
    
  //   setIsSubmitting(true);
  //   setError(null);
    
  //   const formData = new FormData();
    
  //   // Append all normal fields
  //   Object.keys(task).forEach((key) => {
  //     if (key !== "assignedTo" && task[key] !== null) {
  //       formData.append(key, task[key]);
  //     }
  //   });
    
  //   // Append assignedTo as a JSON string
  //   formData.append("assignedTo", JSON.stringify(task.assignedTo));

  //   try {
  //     const response = await axios.post(API_URL, formData, {
  //       headers: { "Content-Type": "multipart/form-data" }
  //     });
    
  //     // Safely call onTaskCreated if it's a function
  //     if (typeof onTaskCreated === 'function') {
  //       onTaskCreated(response.data.task);
  //     }
      
  //     resetForm();
      
  //     // Update stats
  //     setStats({
  //       ...stats,
  //       pendingTasks: stats.pendingTasks + 1
  //     });
      
  //     // Show success message
  //     setShowSuccessMessage(true);
  //     setTimeout(() => setShowSuccessMessage(false), 3000);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Error creating task. Please try again.");
  //     console.error("Error adding task:", err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // In the TaskForm component, modify the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  // Final validation before submission
  if (task.assignedTo.length === 0) {
    setError("Please assign the task to at least one team member");
    return;
  }
  
  setIsSubmitting(true);
  setError(null);
  
  const formData = new FormData();
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userEmail = currentUser?.email;
  
  if (!userEmail) {
    setError("User session not found. Please log in again.");
    setIsSubmitting(false);
    return;
  }
  
  // Append all normal fields
  Object.keys(task).forEach((key) => {
    if (key !== "assignedTo" && task[key] !== null) {
      formData.append(key, task[key]);
    }
  });
  
  // Append the current user's email (the assigner)
  formData.append("email", userEmail);
  
  // Append assignedTo as a JSON string
  formData.append("assignedTo", JSON.stringify(task.assignedTo));

  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  
    // Safely call onTaskCreated if it's a function
    if (typeof onTaskCreated === 'function') {
      onTaskCreated(response.data.task);
    }
    
    resetForm();
    
    // Update stats
    setStats({
      ...stats,
      pendingTasks: stats.pendingTasks + 1
    });
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  } catch (err) {
    setError(err.response?.data?.message || "Error creating task. Please try again.");
    console.error("Error adding task:", err);
  } finally {
    setIsSubmitting(false);
  }
};
  // Reset form
  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      assignedTo: [],
      priority: "Medium",
      role: "Viewer",
      deadline: "",
      comments: "",
      file: null,
      filePreview: "",
    });
    setCurrentEmail("");
    setIsValidEmail(null);
    setError(null);
  };

  // Toggle form expanded/collapsed state
  const toggleFormExpanded = () => {
    setFormExpanded(!formExpanded);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#090e1a]  rounded-xl shadow-2xl overflow-hidden border border-gray-900">
        {/* Left Panel - Team Dashboard */}
        <div className="md:w-2/5 bg-[#090e1a]  p-6 border-r border-gray-900">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Team Dashboard</h2>
              <p className="text-gray-400">Manage your team's tasks and track progress</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#090e1a]  p-4 rounded-lg border border-gray-900 backdrop-blur-sm hover:bg-gray-900/20 transition-all transform hover:scale-105">
                <h3 className="text-indigo-400 text-sm uppercase font-semibold">Pending</h3>
                <p className="text-white text-2x  l font-bold flex items-center">
                  <span className="mr-2">{stats.pendingTasks}</span>
                  <span className="text-yellow-500">⌛</span>
                </p>
              </div>
              
              <div className="bg-[#090e1a]  p-4 rounded-lg border border-gray-900 backdrop-blur-sm hover:bg-gray-900/20 transition-all transform hover:scale-105">
                <h3 className="text-indigo-400 text-sm uppercase font-semibold">Completed Today</h3>
                <p className="text-white text-2xl font-bold flex items-center">
                  <span className="mr-2">{stats.completedToday}</span>
                  <span className="text-green-500">✓</span>
                </p>
              </div>
              
              <div className="bg-[#090e1a]  p-4 rounded-lg border border-gray-900 backdrop-blur-sm hover:bg-gray-900/20 transition-all transform hover:scale-105">
                <h3 className="text-indigo-400 text-sm uppercase font-semibold">Team Members</h3>
                <p className="text-white text-2xl font-bold flex items-center">
                  <span className="mr-2">{stats.teamMembers}</span>
                  <span className="text-blue-500">👥</span>
                </p>
              </div>
              
              <div className="bg-[#090e1a]  p-4 rounded-lg border border-gray-900 backdrop-blur-sm hover:bg-gray-900/20 transition-all transform hover:scale-105">
                <h3 className="text-indigo-400 text-sm uppercase font-semibold">High Priority</h3>
                <p className="text-white text-2xl font-bold flex items-center">
                  <span className="mr-2">{stats.highPriority}</span>
                  <span className="text-red-500">🔥</span>
                </p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <span className="mr-2">⚡</span> Recent Activity
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="bg-[#090e1a]  p-3 rounded-lg border border-gray-900 hover:border-indigo-900 transition-all"
                  >
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-[#090e1a]  border border-indigo-900 flex items-center justify-center mr-3 text-white">
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 text-sm">
                          <span className="font-semibold text-indigo-400">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium">{activity.task}</span>
                        </p>
                        <span className="text-gray-500 text-xs">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="mt-6 bg-[#090e1a]  p-4 rounded-lg border border-indigo-900">
              <h3 className="text-indigo-400 font-semibold flex items-center">
                <span className="mr-2">💡</span> Pro Tip
              </h3>
              <p className="text-gray-300 text-sm">Assign high priority tasks to multiple team members to speed up completion and encourage collaboration.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Task Form */}
        <div className="md:w-3/5 bg-[#090e1a] ">
          <div 
            className="bg-[#090e1a]  border-b border-indigo-900 p-4 flex justify-between items-center cursor-pointer"
            onClick={toggleFormExpanded}
          >
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="text-2xl mr-2">📝</span> Create a New Team Task
            </h2>
            <span className="text-white text-xl">
              {formExpanded ? '▼' : '▲'}
            </span>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-900/20 border-l-4 border-green-500 p-4 text-green-300 animate-pulse">
              <p className="flex items-center">
                <span className="mr-2">✅</span> Task created successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 text-red-300">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </p>
            </div>
          )}

          {/* Collapsible Form */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${formExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Task Title */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                  className="mt-1 block w-full bg-[#090e1a]  text-white border border-gray-900 p-3 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20"
                  required
                />
              </div>

              {/* Task Description */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Task details..."
                  rows="3"
                  className="mt-1 block w-full bg-[#090e1a]  text-white border border-gray-900 p-3 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20"
                />
              </div>

              {/* Assign Task (Email Verification) */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-1">Assign To Team Members</label>
                <div className="relative flex">
                  <input
                    type="email"
                    name="assignedTo"
                    value={currentEmail}
                    onChange={handleChange}
                    onBlur={() => validateEmail()}
                    placeholder="Enter team member's email..."
                    className={`flex-1 mt-1 bg-[#090e1a]  text-white border ${
                      isValidEmail === false ? "border-red-700" : "border-gray-900"
                    } p-3 rounded-l-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20`}
                  />
                  <button
                    type="button"
                    onClick={addAssignee}
                    className="bg-[#090e1a]  border border-indigo-800 hover:bg-indigo-900/30 text-white p-3 rounded-r-md transition-all transform hover:scale-x-105 hover:shadow-lg hover:shadow-indigo-900/20 flex items-center justify-center"
                  >
                    <span>Add</span>
                  </button>
                </div>
                {isValidEmail === false && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">❌</span> User not found in system
                  </p>
                )}
                {isValidEmail === true && (
                  <p className="text-green-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">✅</span> User verified successfully
                  </p>
                )}
                
                {/* Assigned Team Members Display */}
                {task.assignedTo.length > 0 && (
                  <div className="mt-3">
                    <label className="block text-gray-300 text-sm mb-2">Team Members Assigned:</label>
                    <div className="flex flex-wrap gap-2">
                      {task.assignedTo.map((email, index) => (
                        <div 
                          key={index} 
                          className="bg-[#090e1a]  border border-indigo-800 rounded-full px-3 py-1 text-sm text-white flex items-center group"
                        >
                          <span className="mr-1">👤</span>
                          <span className="truncate max-w-xs">{email}</span>
                          <button
                            type="button"
                            onClick={() => removeAssignee(email)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Priority & Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-gray-300 font-medium mb-1">Priority</label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full bg-[#090e1a]  text-white border border-gray-900 p-3 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20"
                  >
                    <option value="High">🔥 High</option>
                    <option value="Medium">⚡ Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-gray-300 font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={task.role}
                    onChange={handleChange}
                    className="w-full bg-[#090e1a]  text-white border border-gray-900 p-3 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20"
                  >
                    <option value="Admin">👑 Admin</option>
                    <option value="Editor">✍️ Editor</option>
                    <option value="Viewer">👀 Viewer</option>
                  </select>
                </div>
              </div>

              {/* Deadline */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={task.deadline}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-[#090e1a]  text-white border border-gray-900 p-3 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20"
                  required
                />
              </div>

              {/* Comments */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-1">Comments</label>
                <textarea
                  name="comments"
                  value={task.comments}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows="2"
                  className="mt-1 block w-full bg-[#090e1a]  text-white border border-gray-900 p-3 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all transform group-hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-900/20"
                />
              </div>

              {/* File Upload */}
              <div className="group">
                <label className="block text-gray-300 font-medium mb-1">Attach File</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-800 hover:border-indigo-600 rounded-lg transition-all duration-200 cursor-pointer bg-[#090e1a]  hover:bg-gray-900 transform hover:scale-[1.01]">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-300">
                        {task.file ? task.file.name : "Attach a file (10MB max)"}
                      </p>
                    </div>
                    <input type="file" className="opacity-0" name="file" onChange={handleFileChange} />
                  </label>
                </div>
                {task.filePreview && (
                  <div className="mt-3 flex items-center space-x-2 bg-[#090e1a]  p-2 rounded-lg border border-gray-900">
                    <img src={task.filePreview} alt="Preview" className="w-16 h-16 object-cover rounded transition-transform hover:scale-110" />
                    <div>
                      <p className="text-sm text-gray-300 truncate">{task.file.name}</p>
                      <p className="text-xs text-gray-500">{(task.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setTask({...task, file: null, filePreview: ""})}
                      className="ml-auto text-red-500 hover:text-red-400 transition-colors hover:scale-110 transform"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-[#090e1a]  text-gray-200 py-3 px-4 rounded-md border border-gray-800 hover:bg-gray-900 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 ${
                    isSubmitting ? "bg-indigo-900" : "bg-[#090e1a]  border border-indigo-800"
                  } text-white py-3 px-4 rounded-md hover:bg-indigo-900/50 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-900/30 active:scale-95 flex justify-center items-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>🚀 Create Team Task</>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* When collapsed, show quick add button */}
          {!formExpanded && (
            <div className="p-4 flex justify-center">
              <button
                onClick={toggleFormExpanded}
                className="bg-[#090e1a]  border border-indigo-800 hover:bg-gray-900 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center"
              >
                <span className="mr-2">+</span> Create New Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;