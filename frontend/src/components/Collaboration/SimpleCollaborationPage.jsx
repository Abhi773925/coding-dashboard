import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../navigation/Navigation';
import EnhancedSessionManager from './EnhancedSessionManager';
import EnhancedCollaborativeEditor from './EnhancedCollaborativeEditor';

const SimpleCollaborationPage = ({ onMount }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, isLoggedIn } = useAuth();
  
  const [currentSession, setCurrentSession] = useState(null);
  const [userRole, setUserRole] = useState('viewer');
  const [showSessionManager, setShowSessionManager] = useState(!sessionId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);

  useEffect(() => {
    if (sessionId && !showSessionManager && isLoggedIn) {
      // Auto-join session if sessionId is provided
      handleJoinSession(sessionId, 'viewer');
    }
  }, [sessionId, showSessionManager, isLoggedIn]);

  const handleJoinSession = async (sessionIdToJoin, role = 'viewer') => {
    try {
      setIsLoading(true);
      
      // Simulate session data - in real app, fetch from API
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
      
      // Update URL if needed
      if (window.location.pathname !== `/collaborate/${sessionIdToJoin}`) {
        navigate(`/collaborate/${sessionIdToJoin}`);
      }
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      setIsLoading(true);
      
      setCurrentSession(sessionData);
      setUserRole('owner');
      setShowSessionManager(false);
      
      // Update URL
      navigate(`/collaborate/${sessionData.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveSession = () => {
    setCurrentSession(null);
    setShowSessionManager(true);
    setUserRole('viewer');
    navigate('/collaborate');
  };

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-zinc-900 text-slate-300' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <svg
              className={`w-20 h-20 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the Collaboration</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sign in to start coding together in real-time with your team
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium transition-colors"
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

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-zinc-900 text-slate-300' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading collaboration session...</p>
        </div>
      </div>
    );
  }

  // Show session manager if no active session
  if (showSessionManager || !currentSession) {
    return (
      <EnhancedSessionManager
        onJoinSession={handleJoinSession}
        onCreateSession={handleCreateSession}
      />
    );
  }

  // Show collaborative editor
  return (
    <div className="h-screen overflow-hidden">
      <EnhancedCollaborativeEditor
        sessionId={currentSession.id}
        userId={user?.id || 'anonymous'}
        userName={user?.name || 'Anonymous User'}
        initialRole={userRole}
        onLeaveSession={handleLeaveSession}
      />
    </div>
  );
};

export default SimpleCollaborationPage;
