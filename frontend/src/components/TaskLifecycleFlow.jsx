import React, { useEffect, useState } from 'react';
import { ArrowRight, FileText, Users, Clock, AlertCircle, CheckCircle, Calendar, Tag, MessageSquare, X } from 'lucide-react';

const TaskLifecycleFlow = () => {
  const [showToast, setShowToast] = useState(false);
  
  // Check for user in localStorage - only on first render
  useEffect(() => {
    const user = localStorage.getItem('user');
    const toastShown = sessionStorage.getItem('authToastShown');
    
    if (!user && !toastShown) {
      setShowToast(true);
      // Mark toast as shown in session storage
      sessionStorage.setItem('authToastShown', 'true');
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
        window.location.href = '/';
      }, 5000);
    }
  }, []);

  // Function to handle button click
  const handleTryZidioClick = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setShowToast(true);
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
        window.location.href = '/';
      }, 5000);
    } else {
      // If user is logged in, redirect to dashboard or appropriate page
      window.location.href = '/dashboard';
    }
  };

  // Toast component
  const Toast = () => (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 bg-gradient-to-r from-red-600 to-red-400 text-white p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-xs w-11/12 sm:w-auto">
      <div className="flex-1 text-sm sm:text-base">Please login or signup to continue</div>
      <button 
        onClick={() => setShowToast(false)} 
        className="text-white flex-shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );

  // Define the flow steps
  const flowSteps = [
    {
      title: "Create",
      icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
      description: "Set title, priority & deadline",
      color: "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300"
    },
    {
      title: "Assign",
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />,
      description: "Delegate to team members",
      color: "bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300"
    },
    {
      title: "Track",
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
      description: "Monitor progress & updates",
      color: "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300"
    },
    {
      title: "Review",
      icon: <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />,
      description: "Quality check & feedback",
      color: "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300"
    },
    {
      title: "Complete",
      icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />,
      description: "Mark done & archive",
      color: "bg-gradient-to-br from-green-100 to-green-200 border-green-300"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 bg-[#090e1a] text-white custom-scrollbar">
      {showToast && <Toast />}
      
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">How Zidio Manages Your Tasks</h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
          Our streamlined workflow keeps your projects moving from creation to completion
        </p>
      </div>

      {/* Main Flow Visualization - Responsive Row/Column Format */}
      <div className="mb-12 sm:mb-16">
        {/* Mobile version - vertical stacking */}
        <div className="flex flex-col space-y-8 sm:hidden">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div className={`rounded-full p-4 ${step.color} border-2`}>
                {step.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </div>
              {index < flowSteps.length - 1 && (
                <div className="ml-auto text-gray-400">
                  <ArrowDown className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Desktop version - horizontal */}
        <div className="hidden sm:block custom-scrollbar-container overflow-x-auto">
          <div className="flex flex-row justify-between items-start min-w-max">
            {flowSteps.map((step, index) => (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-center px-4 md:px-6">
                  <div className={`rounded-full p-4 sm:p-6 ${step.color} border-2 mb-4 shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{step.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base max-w-xs">{step.description}</p>
                </div>
                
                {index < flowSteps.length - 1 && (
                  <div className="flex items-center text-gray-400 mt-8">
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Status Flow - Responsive Row Format */}
      <div className="bg-gradient-to-br from-[#131c2e] to-[#1a2439] rounded-lg p-4 sm:p-6 mb-8 sm:mb-12 custom-scrollbar-container overflow-x-auto shadow-lg">
        <h3 className="text-xl font-bold text-center mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">Task Status Flow</h3>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 min-w-max">
          <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-white text-xs sm:text-sm font-medium shadow-md">
            To Do
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-800 to-blue-600 text-white text-xs sm:text-sm font-medium shadow-md">
            In Progress
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-800 to-amber-600 text-white text-xs sm:text-sm font-medium shadow-md">
            On Hold
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-800 to-purple-600 text-white text-xs sm:text-sm font-medium shadow-md">
            In Review
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-green-800 to-green-600 text-white text-xs sm:text-sm font-medium shadow-md">
            Completed
          </div>
        </div>
      </div>

      {/* Features Row - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-gradient-to-br from-[#131c2e] to-[#1a2439] p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
          <div className="bg-gradient-to-br from-blue-500 to-blue-300 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">Deadline Tracking</h4>
          <p className="text-gray-300 text-sm sm:text-base">Never miss important deadlines with our smart reminders</p>
        </div>
        <div className="bg-gradient-to-br from-[#131c2e] to-[#1a2439] p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-300 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3 sm:mb-4">
            <Tag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-300">Custom Categories</h4>
          <p className="text-gray-300 text-sm sm:text-base">Organize tasks with custom tags to match your workflow</p>
        </div>
        <div className="bg-gradient-to-br from-[#131c2e] to-[#1a2439] p-4 sm:p-6 rounded-lg border border-gray-700 sm:col-span-2 lg:col-span-1 shadow-lg">
          <div className="bg-gradient-to-br from-purple-500 to-purple-300 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3 sm:mb-4">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-300">Team Collaboration</h4>
          <p className="text-gray-300 text-sm sm:text-base">Comment, share files, and collaborate in real-time</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button 
          onClick={handleTryZidioClick}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition-colors text-sm sm:text-base shadow-lg"
        >
          Try Zidio Today
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        /* Custom scrollbar styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #131c2e;
        }
        
        .custom-scrollbar::-webkit-scrollbar,
        .custom-scrollbar-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track,
        .custom-scrollbar-container::-webkit-scrollbar-track {
          background: #131c2e;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb,
        .custom-scrollbar-container::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover,
        .custom-scrollbar-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        /* Makes sure elements with horizontal scroll have proper padding */
        .custom-scrollbar-container {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #131c2e;
          padding-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

// Missing import for ArrowDown
const ArrowDown = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

export default TaskLifecycleFlow;