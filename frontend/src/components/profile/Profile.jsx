import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaTasks, FaClock, FaHourglassHalf, FaCheck } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchTasks = useCallback(async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/Zidio/tasks?email=${encodeURIComponent(email)}`);
      if (response.status === 200) {
        setTasks(response.data || []);
      } else {
        throw new Error(`Received status code ${response.status}`);
      }
    } catch (err) {
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.email) {
        setError("Invalid user data");
        setLoading(false);
        return;
      }

      setUser(parsedUser);
      setIsAdmin(parsedUser.email === "rockabhisheksingh778189@gmail.com");
      fetchTasks(parsedUser.email);
    } catch (err) {
      setError("Failed to load user data");
      setLoading(false);
    }
  }, [fetchTasks]);

  const filterTasks = () => {
    if (!Array.isArray(tasks)) return [];
    if (filter === 'all') return tasks;
    return tasks.filter(task => task?.status?.toLowerCase() === filter);
  };

  const countTasksByStatus = (status) => tasks.filter(task => task?.status === status).length;

  const viewTaskDetails = (taskId) => {
    navigate(`/taskdetail`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#090e1a] ">
        {/* <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#090e1a]  text-red-500 p-4 border border-red-800 rounded-md mb-4">
        <p>{error}</p>
        <button
          className="mt-2 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredTasks = filterTasks();
  
  const getStatusStyles = (status) => {
    switch(status) {
      case 'Done':
        return 'border-green-800 text-green-500';
      case 'In Progress':
        return 'border-blue-800 text-blue-500';
      default:
        return 'border-yellow-800 text-yellow-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-25 bg-[#090e1a]  text-gray-300 ">
      {/* Profile Header */}
      <div className="border border-blue-900 bg-[#090e1a]  shadow-lg rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <div className="bg-blue-900 p-3 rounded-full mb-4 sm:mb-0 sm:mr-4 shadow-lg">
            <FaUser className="text-white text-xl" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate max-w-full">{user?.name || 'User Profile'}</h1>
            <p className="text-gray-400 text-sm sm:text-base truncate max-w-full">{user?.email || 'No email available'}</p>
            {isAdmin && (
              <span className="bg-[#090e1a]  border border-purple-800 text-purple-400 px-2 py-1 rounded-md text-sm mt-1 inline-block">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          {[
            { icon: <FaTasks className="text-blue-500" />, label: "Total Tasks", count: tasks.length, 
              classes: "bg-[#090e1a]  border-blue-800" },
            { icon: <FaHourglassHalf className="text-yellow-500" />, label: "Pending", count: countTasksByStatus('Pending'), 
              classes: "bg-[#090e1a]  border-yellow-800" },
            { icon: <FaClock className="text-blue-500" />, label: "In Progress", count: countTasksByStatus('In Progress'), 
              classes: "bg-[#090e1a]  border-blue-800" },
            { icon: <FaCheck className="text-green-500" />, label: "Completed", count: countTasksByStatus('Done'), 
              classes: "bg-[#090e1a]  border-green-800" },
          ].map(({ icon, label, count, classes }, index) => (
            <div key={index} className={`p-4 rounded-md border ${classes} shadow-lg hover:shadow-xl transition duration-300`}>
              <div className="flex items-center">
                <div className="mr-3 text-xl">{icon}</div>
                <div>
                  <div className="text-sm text-gray-400">{label}</div>
                  <div className="text-xl font-bold">{count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task History */}
      <div className="border border-gray-800 bg-[#090e1a]  shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">
            {isAdmin ? 'All Users Task History' : 'Your Task History'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'inProgress', label: 'In Progress' },
              { id: 'done', label: 'Done' }
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setFilter(status.id)}
                className={`px-3 py-1 text-sm border rounded-md transition ${
                  filter === status.id 
                    ? 'bg-blue-800 border-blue-700 text-white' 
                    : 'bg-[#090e1a]  border-gray-800 text-gray-400 hover:bg-gray-900'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-[#090e1a]  border border-gray-800 rounded-md">
            No tasks found with the selected filter.
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li key={task.id} className="p-4 border border-gray-800 bg-[#090e1a]  hover:bg-gray-900 rounded-md transition duration-200 shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{task.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md border ml-2 ${getStatusStyles(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md"
                    onClick={() => viewTaskDetails()}
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;