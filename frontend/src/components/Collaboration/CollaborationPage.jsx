import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Share2, 
  MessageSquare, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Monitor,
  Eye,
  EyeOff,
  Crown,
  Shield,
  Edit3
} from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';
import SessionManager from './SessionManager';
import FileManager from './FileManager';
import CollaborativeTerminal from './CollaborativeTerminal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../navigation/Navigation';

const CollaborationPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, isLoggedIn } = useAuth();
  
  const [currentSession, setCurrentSession] = useState(null);
  const [userRole, setUserRole] = useState('viewer');
  const [showSessionManager, setShowSessionManager] = useState(!sessionId);
  const [layout, setLayout] = useState('default'); // default, terminal, fullscreen
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Mock session data - replace with actual API calls
  useEffect(() => {
    if (sessionId && !showSessionManager) {
      // Simulate fetching session data
      setCurrentSession({
        id: sessionId,
        name: 'React Interview Practice',
        description: 'Mock interview session for React developers',
        owner: 'John Doe',
        ownerId: 'user-1',
        language: 'javascript',
        users: [
          { id: 'user-1', name: 'John Doe', role: 'owner', avatar: null },
          { id: user?.id || 'user-2', name: user?.name || 'You', role: 'editor', avatar: user?.avatar }
        ]
      });
      setUserRole('editor');
    }
  }, [sessionId, showSessionManager, user]);

  const handleJoinSession = (sessionIdToJoin, role = 'viewer') => {
    setShowSessionManager(false);
    setUserRole(role);
    navigate(`/collaborate/${sessionIdToJoin}`);
  };

  const handleCreateSession = (sessionData) => {
    setShowSessionManager(false);
    setCurrentSession(sessionData);
    setUserRole('owner');
    navigate(`/collaborate/${sessionData.id}`);
  };

  const handleLeaveSession = () => {
    setCurrentSession(null);
    setShowSessionManager(true);
    navigate('/collaborate');
  };

  const shareSession = () => {
    const link = `${window.location.origin}/collaborate/${sessionId}`;
    navigator.clipboard.writeText(link);
    addNotification('Session link copied to clipboard!', 'success');
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        addNotification('Screen sharing started', 'success');
        
        // Handle screen share end
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          addNotification('Screen sharing stopped', 'info');
        };
      } else {
        setIsScreenSharing(false);
        addNotification('Screen sharing stopped', 'info');
      }
    } catch (error) {
      addNotification('Failed to start screen sharing', 'error');
    }
  };

  const toggleMicrophone = async () => {
    try {
      if (!isMicOn) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicOn(true);
        addNotification('Microphone enabled', 'success');
      } else {
        setIsMicOn(false);
        addNotification('Microphone disabled', 'info');
      }
    } catch (error) {
      addNotification('Failed to access microphone', 'error');
    }
  };

  const toggleCamera = async () => {
    try {
      if (!isCameraOn) {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraOn(true);
        addNotification('Camera enabled', 'success');
      } else {
        setIsCameraOn(false);
        addNotification('Camera disabled', 'info');
      }
    } catch (error) {
      addNotification('Failed to access camera', 'error');
    }
  };

  const layouts = {
    default: 'Default Layout',
    terminal: 'Terminal Focus',
    fullscreen: 'Fullscreen Editor'
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <Users className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
            Login Required
          </h2>
          <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please log in to access collaborative coding sessions
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (showSessionManager) {
    return (
      <SessionManager
        onJoinSession={handleJoinSession}
        onCreateSession={handleCreateSession}
      />
    );
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`h-14 border-b flex items-center justify-between px-4 ${
        isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLeaveSession}
            className={`px-3 py-1 rounded text-sm ${
              isDarkMode ? 'hover:bg-zinc-900 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            ← Back to Sessions
          </button>
          
          <div className="h-6 border-l border-gray-300" />
          
          <div>
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              {currentSession?.name || 'Collaborative Session'}
            </h1>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentSession?.users?.length || 0} participants
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center space-x-1">
                {userRole === 'owner' && <Crown className="w-3 h-3 text-yellow-500" />}
                {userRole === 'editor' && <Edit3 className="w-3 h-3 text-blue-500" />}
                {userRole === 'viewer' && <Eye className="w-3 h-3 text-gray-500" />}
                <span className={`capitalize ${
                  userRole === 'owner' ? 'text-yellow-500' :
                  userRole === 'editor' ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Media Controls */}
          <div className="flex items-center space-x-1 mr-4">
            <button
              onClick={toggleMicrophone}
              className={`p-2 rounded ${
                isMicOn 
                  ? 'bg-green-600 hover:bg-green-700 text-slate-300' 
                  : isDarkMode ? 'hover:bg-zinc-900 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`}
              title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleCamera}
              className={`p-2 rounded ${
                isCameraOn 
                  ? 'bg-green-600 hover:bg-green-700 text-slate-300' 
                  : isDarkMode ? 'hover:bg-zinc-900 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-2 rounded ${
                isScreenSharing 
                  ? 'bg-blue-600 hover:bg-blue-700 text-slate-300' 
                  : isDarkMode ? 'hover:bg-zinc-900 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`}
              title={isScreenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Layout Selector */}
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            className={`px-3 py-1 rounded text-sm border ${
              isDarkMode 
                ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {Object.entries(layouts).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded ${
              showChat 
                ? 'bg-blue-600 text-slate-300' 
                : isDarkMode ? 'hover:bg-zinc-900 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={shareSession}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-zinc-900 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded ${
              showSettings 
                ? 'bg-gray-600 text-slate-300' 
                : isDarkMode ? 'hover:bg-zinc-900 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {layout === 'fullscreen' ? (
          <CollaborativeEditor
            sessionId={sessionId}
            userId={user?.id}
            userName={user?.name}
            initialRole={userRole}
          />
        ) : (
          <>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${
              isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <FileManager
                files={[
                  { name: 'main.js', type: 'file', path: '/main.js', content: 'console.log("Hello World");', language: 'javascript' },
                  { name: 'style.css', type: 'file', path: '/style.css', content: 'body { margin: 0; }', language: 'css' },
                  { name: 'package.json', type: 'file', path: '/package.json', content: '{}', language: 'json' }
                ]}
                onFileSelect={(file) => console.log('File selected:', file)}
                onFileCreate={(name, content, path) => console.log('File created:', name)}
                onFileDelete={(file) => console.log('File deleted:', file)}
                onFileRename={(file, newName) => console.log('File renamed:', file, newName)}
                canEdit={userRole === 'owner' || userRole === 'editor'}
              />
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col">
              {layout === 'terminal' ? (
                <div className="flex-1 grid grid-rows-2">
                  <CollaborativeEditor
                    sessionId={sessionId}
                    userId={user?.id}
                    userName={user?.name}
                    initialRole={userRole}
                  />
                  <CollaborativeTerminal
                    sessionId={sessionId}
                    socket={null} // Will be connected via CollaborativeEditor
                    canExecute={userRole === 'owner' || userRole === 'editor'}
                  />
                </div>
              ) : (
                <CollaborativeEditor
                  sessionId={sessionId}
                  userId={user?.id}
                  userName={user?.name}
                  initialRole={userRole}
                />
              )}
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className={`w-80 border-l flex flex-col ${
                isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                    Chat
                  </h3>
                </div>
                <div className="flex-1 p-4">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Chat functionality coming soon...
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl p-6 w-full max-w-md ${
            isDarkMode ? 'bg-zinc-900' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              Session Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Session Name
                </label>
                <input
                  type="text"
                  value={currentSession?.name || ''}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  disabled={userRole !== 'owner'}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Max Participants
                </label>
                <input
                  type="number"
                  defaultValue="10"
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  disabled={userRole !== 'owner'}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowEdit"
                  defaultChecked
                  disabled={userRole !== 'owner'}
                />
                <label htmlFor="allowEdit" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Allow participants to edit
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className={`flex-1 px-4 py-2 rounded ${
                  isDarkMode 
                    ? 'bg-zinc-900 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Close
              </button>
              {userRole === 'owner' && (
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-40">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-600 text-slate-300' :
              notification.type === 'error' ? 'bg-red-600 text-slate-300' :
              isDarkMode ? 'bg-zinc-900 text-slate-300 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationPage;
