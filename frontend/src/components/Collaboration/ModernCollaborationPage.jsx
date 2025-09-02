import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../navigation/Navigation';
import ModernSessionManager from './ModernSessionManager';
import ModernCollaborativeEditor from './ModernCollaborativeEditor';
import LoadingScreen from './LoadingScreen';

const ModernCollaborationPage = ({ onMount }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, isLoggedIn } = useAuth();
  
  const [currentSession, setCurrentSession] = useState(null);
  const [userRole, setUserRole] = useState('viewer');
  const [showSessionManager, setShowSessionManager] = useState(!sessionId);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);

  useEffect(() => {
    if (sessionId && !showSessionManager && isLoggedIn) {
      handleJoinSession(sessionId, 'viewer');
    }
  }, [sessionId, showSessionManager, isLoggedIn]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleJoinSession = async (sessionIdToJoin, role = 'viewer') => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sessionData = {
        id: sessionIdToJoin,
        name: 'Collaborative Session',
        description: 'Real-time coding collaboration',
        owner: 'Session Owner',
        ownerId: 'owner-id',
        language: 'javascript',
        users: [],
        files: [
          {
            name: 'main.js',
            content: '// Welcome to collaborative coding!\nconsole.log("Hello, World!");',
            type: 'javascript'
          }
        ],
        createdAt: new Date(),
        lastActivity: new Date()
      };

      setCurrentSession(sessionData);
      setUserRole(role);
      setShowSessionManager(false);
      
      if (window.location.pathname !== `/collaborate/${sessionIdToJoin}`) {
        navigate(`/collaborate/${sessionIdToJoin}`);
      }
      
      addNotification('Successfully joined session!', 'success');
    } catch (error) {
      console.error('Failed to join session:', error);
      addNotification('Failed to join session. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentSession(sessionData);
      setUserRole('owner');
      setShowSessionManager(false);
      
      navigate(`/collaborate/${sessionData.id}`);
      addNotification('Session created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create session:', error);
      addNotification('Failed to create session. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveSession = () => {
    setCurrentSession(null);
    setShowSessionManager(true);
    setUserRole('viewer');
    navigate('/collaborate');
    addNotification('Left session successfully', 'info');
  };

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        isDarkMode ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className={`relative z-10 text-center max-w-lg mx-auto p-8 rounded-2xl backdrop-blur-sm ${
          isDarkMode ? 'bg-zinc-900/80 border border-zinc-700' : 'bg-white/80 border border-gray-200'
        }`}>
          <div className="mb-8">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join the Collaboration
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sign in to start coding together in real-time with your team
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign In to Continue
            </button>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account? Sign up to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen message="Setting up collaboration session..." />;
  }

  // Show session manager if no active session
  if (showSessionManager || !currentSession) {
    return (
      <ModernSessionManager
        onJoinSession={handleJoinSession}
        onCreateSession={handleCreateSession}
      />
    );
  }

  // Show collaborative editor
  return (
    <div className="h-screen overflow-hidden relative">
      <ModernCollaborativeEditor
        sessionId={currentSession.id}
        userId={user?.id || 'anonymous'}
        userName={user?.name || 'Anonymous User'}
        initialRole={userRole}
        onLeaveSession={handleLeaveSession}
      />
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernCollaborationPage;
