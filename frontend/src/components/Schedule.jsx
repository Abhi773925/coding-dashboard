import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Schedule = () => {
  // Function to open email client with pre-filled subject & body
  const openEmailClient = (subject, body) => {
    const email = "rockabhisheksingh778189@gmail.com";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // Refs for scroll animations
  const testimonialsRef = useRef(null);
  const newsletterRef = useRef(null);
  const faqRef = useRef(null);
  const calendlyContainerRef = useRef(null);

  // State for floating animation
  const [floatY, setFloatY] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // State for glossy effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Floating animation effect
  useEffect(() => {
    const floatInterval = setInterval(() => {
      setFloatY(prev => (prev === 0 ? 10 : 0));
    }, 2000);
    
    // Scroll event listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(floatInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add custom scrollbar styles on mount
  useEffect(() => {
    // Insert custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      /* Custom Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
        border-radius: 10px;
        border: 2px solid rgba(15, 23, 42, 0.6);
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #2563eb, #7c3aed);
      }
      
      /* For Firefox */
      html {
        scrollbar-width: thin;
        scrollbar-color: #6366f1 rgba(15, 23, 42, 0.6);
      }
      
      /* Smooth scrolling for the entire page */
      html {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Calendly script loading
  useEffect(() => {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    head.appendChild(script);

    return () => {
      if (head && script) {
        head.removeChild(script);
      }
    };
  }, []);

  // Mouse move handler for glossy effect
  const handleMouseMove = (e) => {
    if (!calendlyContainerRef.current) return;
    
    const rect = calendlyContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  // Parallax effect calculation
  const calculateParallax = (baseValue) => {
    return baseValue - (scrollPosition * 0.1);
  };

  // Calculate glossy gradient position
  const calculateGlossGradient = () => {
    if (!isHovering) return 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)';
    
    const x = Math.max(0, Math.min(100, (mousePosition.x / (calendlyContainerRef.current?.offsetWidth || 1)) * 100));
    const y = Math.max(0, Math.min(100, (mousePosition.y / (calendlyContainerRef.current?.offsetHeight || 1)) * 100));
    
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`;
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      comment: "The one-on-one sessions were incredibly helpful. I learned so much in just one hour!",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Michael Chen",
      role: "UX Designer",
      comment: "Excellent communication and very knowledgeable. Would definitely recommend to anyone looking for guidance.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Priya Patel",
      role: "Data Scientist",
      comment: "The personalized approach helped me overcome challenges I was facing with my project.",
      avatar: "/api/placeholder/100/100"
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How do I schedule a one-on-one session?",
      answer: "Simply use our Calendly booking system above to choose a time that works for you. Pick a slot, fill in your details, and you're all set!"
    },
    {
      question: "What topics can be covered in the sessions?",
      answer: "Our mentors specialize in web development, data science, UI/UX design, and career guidance. You can specify your topic of interest when booking a session."
    },
    {
      question: "How long are the one-on-one sessions?",
      answer: "Standard sessions are 30 minutes long. Extended sessions of 60 minutes are also available for more complex topics."
    },
    {
      question: "How do I prepare for my session?",
      answer: "We recommend preparing specific questions or topics you'd like to cover. For technical sessions, having your code or project ready to share will help maximize our time together."
    },
    {
      question: "What if I need to reschedule?",
      answer: "You can reschedule directly through the Calendly system up to 24 hours before your appointment. For last-minute changes, please contact us via email."
    }
  ];

  // State for active FAQ item
  const [activeFaq, setActiveFaq] = useState(null);

  // Scroll to section function
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#090e1a] text-white min-h-screen flex flex-col items-center px-6 py-10 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
       
       
      </div>

      {/* Navigation Quick Links */}
      <div className="mb-12 h-auto w-auto ">
        <div className="bg-gray-800/30 backdrop-blur-md rounded-full p-4 flex flex-wrap justify-center gap-6 shadow-lg border border-gray-700/50">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
          >
            Booking
          </button>
          <button 
            onClick={() => scrollToSection(faqRef)}
            className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
          >
            FAQs
          </button>
          <button 
            className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
            onClick={() => {
              const timelineSection = document.querySelector('[data-section="timeline"]');
              if (timelineSection) {
                timelineSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Timeline
          </button>
          <button 
            onClick={() => {
              const contactSection = document.querySelector('[data-section="contact"]');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>
      </div>

      <h2 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 relative">
        Book a One-on-One Session
      </h2>
      <p className="text-lg text-center text-gray-300 max-w-2xl mb-12">
        Schedule personalized mentoring sessions with our expert team members to accelerate your learning and overcome technical challenges.
      </p>
      
      {/* Calendly Widget with Enhanced Glossy Effect */}
      <div
  ref={calendlyContainerRef}
  className="custom-calendly-container w-full max-w-5xl mb-24 relative z-10 rounded-xl overflow-x-hidden overflow-y-hidden transition-all duration-300 transform hover:scale-[1.0]"
  style={{
    height: '700px',
  }}
>
  {/* Enhanced border glow effect */}
  <div
    className="calendly-inline-widget w-full h-full"
    data-url="https://calendly.com/rockabhisheksingh778189/30min"
    style={{ minWidth: '320px' }}
  ></div>
</div>

<style>
 {` /* Custom scrollbar styling */
  .custom-calendly-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-calendly-container::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 10px;
  }
  
  .custom-calendly-container::-webkit-scrollbar-thumb {
    background-color: #4f46e5;
    border-radius: 10px;
    border: 2px solid #f3f4f6;
  }
  
  .custom-calendly-container::-webkit-scrollbar-thumb:hover {
    background-color: #3730a3;
  }
  
  /* For Firefox */
  .custom-calendly-container {
    scrollbar-width: thin;
    scrollbar-color: #4f46e5 #f3f4f6;
  }
    `}
</style>
      
      {/* Main Content Grid with improved layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 relative z-10">
        {/* Contact Card Section */}
        <div 
          data-section="contact"
          className="flex flex-col items-center bg-gradient-to-r from-gray-800/90 to-gray-700/90 p-8 rounded-xl shadow-[0_10px_20px_rgba(56,114,224,0.3)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_12px_15px_rgba(56,114,224,0.5)] border border-blue-500/30"
          
        >
          <div className="absolute -top-5 -left-5 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg rotate-12 opacity-80"></div>
          <h3 className="text-2xl font-semibold text-blue-300 mb-6 relative z-10">Contact Us</h3>
          <div className="flex items-center gap-3 text-white text-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>rockabhisheksingh778189@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-white text-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>7739254874</span>
          </div>
          <button 
            onClick={() => openEmailClient("Question about booking", "Hello,\n\nI'm interested in booking a session but have some questions first.\n\nBest regards,")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/50 group relative overflow-hidden"
          >
            <span className="relative z-10">Email Us Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
          
          {/* Social media icons */}
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-300 mb-3">Connect With Us</h4>
            <div className="flex space-x-3">
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors shadow-lg">
                <span className="text-blue-400">FB</span>
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors shadow-lg">
                <span className="text-blue-400">TW</span>
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors shadow-lg">
                <span className="text-blue-400">IN</span>
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors shadow-lg">
                <span className="text-blue-400">IG</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Notification Card Section */}
        <div 
          className="lg:col-span-2 w-full bg-gradient-to-r from-gray-800/90 to-gray-700/90 p-8 rounded-xl shadow-[0_10px_10px_rgba(139,92,246,0.3)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_12px_15px_rgba(139,92,246,0.5)] border border-purple-500/30"
          
        >
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full rotate-45 opacity-70"></div>
          <h3 className="text-2xl font-semibold text-center text-blue-300 mb-6 relative z-10">Booking Information</h3>
          <div className="space-y-4">
            <div className="flex items-start group transition-all duration-300 bg-gray-800/40 p-4 rounded-lg hover:bg-gray-800/60">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Choose from 30-minute or 60-minute sessions with our industry experts
              </p>
            </div>
            <div className="flex items-start group transition-all duration-300 bg-gray-800/40 p-4 rounded-lg hover:bg-gray-800/60">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Flexible scheduling with slots available 7 days a week
              </p>
            </div>
            <div className="flex items-start group transition-all duration-300 bg-gray-800/40 p-4 rounded-lg hover:bg-gray-800/60">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Personalized attention to address your specific questions and challenges
              </p>
            </div>
            <div className="flex items-start group transition-all duration-300 bg-gray-800/40 p-4 rounded-lg hover:bg-gray-800/60">
              <div className="w-2 h-2 mt-2 rounded-full bg-yellow-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Video conferencing details sent automatically after booking confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
      
     

      {/* FAQ Section with accordion effect */}
      <div ref={faqRef} className="w-full max-w-7xl mb-24 relative z-10">
        <h3 className="text-2xl font-semibold text-center text-white mb-10 relative">
          Frequently Asked Questions
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </h3>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`bg-gray-800/50 rounded-xl border transition-all duration-500 transform ${
                activeFaq === index ? 'border-blue-500/50 shadow-lg shadow-blue-500/20 scale-[1.01]' : 'border-gray-700'
              } backdrop-blur-sm`}
            >
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <h4 className="text-xl text-blue-300 font-medium">{item.question}</h4>
                <div 
                  className={`text-white transform transition-transform duration-300 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeFaq === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-300 px-6 pb-6">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Timeline Feature */}
      <div data-section="timeline" className="w-full max-w-7xl mb-24 relative z-10">
        <h3 className="text-2xl font-semibold text-center text-white mb-10 relative">
          Development Timeline
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500"></div>
          
          {/* Timeline items */}
          <div className="space-y-20">
            {/* Item 1 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 z-10 animate-pulse"></div>
              <div className="ml-auto mr-8 md:w-5/12 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-blue-500/20 rounded-full blur-xl"></div>
                <h4 className="text-xl text-blue-300 font-medium mb-2">Phase 1: Community Platform</h4>
                <p className="text-gray-300">Building the foundation of our user community with forums and resource sharing.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-blue-400 font-medium">January 2025</span>
                  <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">Completed</span>
                </div>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 z-10 animate-pulse"></div>
              <div className="mr-auto ml-8 md:w-5/12 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-purple-500/20 rounded-full blur-xl"></div>
                <h4 className="text-xl text-blue-300 font-medium mb-2">Phase 2: Mentorship Network</h4>
                <p className="text-gray-300">Expanding our one-on-one session capabilities with specialized mentors across various tech domains.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-blue-400 font-medium">March 2025</span>
                  <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">In Progress</span>
                </div>
              </div>
            </div>
            
            {/* Item 3 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 z-10 animate-pulse"></div>
              <div className="ml-auto mr-8 md:w-5/12 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-indigo-500/20 rounded-full blur-xl"></div>
                <h4 className="text-xl text-blue-300 font-medium mb-2">Phase 3: Advanced Learning Tools</h4>
                <p className="text-gray-300">Introducing interactive learning tools and customized learning paths for members.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-blue-400 font-medium">June 2025</span>
                  <span className="text-sm bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full">Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
     
    </div>
  );
};

export default Schedule;