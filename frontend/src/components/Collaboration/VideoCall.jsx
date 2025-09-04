import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
  Users
} from 'lucide-react';

const VideoCall = ({ socket, roomId, currentUser, connectedUsers }) => {
  const { isDarkMode } = useTheme();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [peers, setPeers] = useState(new Map());
  const [isMinimized, setIsMinimized] = useState(false);
  
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());

  // Initialize media stream
  useEffect(() => {
    if (isCallActive) {
      initializeMedia();
    } else {
      stopMedia();
    }

    return () => stopMedia();
  }, [isCallActive]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-video-call', handleIncomingCall);
    socket.on('video-call-answered', handleCallAnswered);
    socket.on('video-signal', handleVideoSignal);

    return () => {
      socket.off('incoming-video-call');
      socket.off('video-call-answered');
      socket.off('video-signal');
    };
  }, [socket]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    setPeers(new Map());
  };

  const handleIncomingCall = (data) => {
    setIncomingCall(data);
  };

  const handleCallAnswered = (data) => {
    if (data.accepted) {
      setIsCallActive(true);
    }
    setIncomingCall(null);
  };

  const handleVideoSignal = (data) => {
    // Handle WebRTC signaling
    console.log('Video signal received:', data);
  };

  const startCall = (targetUserId) => {
    if (socket) {
      socket.emit('video-call-request', {
        roomId,
        targetUserId
      });
    }
  };

  const acceptCall = () => {
    if (socket && incomingCall) {
      socket.emit('video-call-response', {
        accepted: true,
        targetUserId: incomingCall.from.socketId,
        roomId
      });
      setIsCallActive(true);
    }
    setIncomingCall(null);
  };

  const declineCall = () => {
    if (socket && incomingCall) {
      socket.emit('video-call-response', {
        accepted: false,
        targetUserId: incomingCall.from.socketId,
        roomId
      });
    }
    setIncomingCall(null);
  };

  const endCall = () => {
    setIsCallActive(false);
    stopMedia();
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track with screen share
        if (localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnectionsRef.current.get('screen-share');
          
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
        }
        
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        await initializeMedia();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  return (
    <>
      {/* Incoming Call Modal */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-xl shadow-2xl max-w-sm w-full ${
                isDarkMode ? 'bg-zinc-900 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full ${incomingCall.from.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-xl font-bold">
                    {incomingCall.from.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Incoming Call
                </h3>
                
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {incomingCall.from.name} is calling you
                </p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={declineCall}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={acceptCall}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Interface */}
      <AnimatePresence>
        {isCallActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed ${
              isMinimized 
                ? 'bottom-4 right-4 w-80 h-60' 
                : 'inset-4'
            } z-40 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
              isDarkMode ? 'bg-zinc-900 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-3 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <Video className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Video Call
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`p-1 rounded hover:bg-opacity-50 ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                
                <button
                  onClick={endCall}
                  className="p-1 rounded hover:bg-red-600 hover:text-white transition-colors"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 relative bg-gray-900">
              {/* Local Video */}
              <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden bg-gray-800 border-2 border-white">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className={`w-8 h-8 rounded-full ${currentUser?.color} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">
                        {currentUser?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Remote Videos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
                {Array.from(peers.entries()).map(([userId, peer]) => (
                  <div
                    key={userId}
                    className="relative bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                      User {userId.slice(-4)}
                    </div>
                  </div>
                ))}
              </div>

              {/* No Remote Users */}
              {peers.size === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p className="text-gray-500">
                      Waiting for others to join...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className={`flex items-center justify-center gap-4 p-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={toggleAudio}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isAudioOn 
                    ? (isDarkMode ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isVideoOn 
                    ? (isDarkMode ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isScreenSharing 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : (isDarkMode ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                }`}
              >
                {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </button>

              <button
                onClick={endCall}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Users Button (for testing) */}
      {!isCallActive && connectedUsers.length > 1 && (
        <div className="fixed bottom-4 right-4 z-30">
          <button
            onClick={() => setIsCallActive(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
              isDarkMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Start Call
          </button>
        </div>
      )}
    </>
  );
};

export default VideoCall;
