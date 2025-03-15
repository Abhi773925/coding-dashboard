import { useState, useEffect, useRef } from "react";

const Schedule = () => {
  // Function to open email client with pre-filled subject & body
  const openEmailClient = (subject, body) => {
    const email = "rockabhisheksingh778189@gmail.com";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink; // Redirects to email client
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
    },
    {
      name: "Michael Chen",
      role: "UX Designer",
      comment: "Excellent communication and very knowledgeable. Would definitely recommend to anyone looking for guidance.",
    },
    {
      name: "Priya Patel",
      role: "Data Scientist",
      comment: "The personalized approach helped me overcome challenges I was facing with my project.",
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
    }
  ];

  // State for active FAQ item
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-blue-900/20 text-white min-h-screen flex flex-col items-center px-6 py-10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" 
          style={{ 
            top: '10%', 
            left: '5%', 
            transform: `translateY(${calculateParallax(0)}px)` 
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" 
          style={{ 
            top: '60%', 
            right: '10%', 
            transform: `translateY(${calculateParallax(-50)}px)` 
          }}
        ></div>
      </div>

      <h2 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-12 relative">
        Book a One-on-One Session
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </h2>
      
      {/* Calendly Widget with Glossy Effect */}
      <div 
        ref={calendlyContainerRef}
        className="w-full max-w-5xl mb-16 relative z-10 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01]"
        style={{ 
          height: '680px',
          boxShadow: '0 20px 80px rgba(56,114,224,0.4)',
          transform: `translateY(${floatY * 0.3}px)`,
          transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Glossy overlay effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 opacity-70 transition-opacity duration-300"
          style={{ 
            background: calculateGlossGradient(),
            borderRadius: '12px',
          }}
        ></div>
        
        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-xl border border-blue-500/30 backdrop-blur-sm"></div>
        
        {/* Animated corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-400 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-400 rounded-br-lg"></div>
        
        {/* Actual Calendly widget */}
        <div 
          className="calendly-inline-widget w-full h-full"
          data-url="https://calendly.com/rockabhisheksingh778189/30min"
          style={{ minWidth: '320px' }}
        ></div>
      </div>
      
      {/* Main Content Grid with new layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 relative z-10">
        {/* Contact Card Section */}
        <div 
          className="flex flex-col items-center bg-gradient-to-r from-gray-800/90 to-gray-700/90 p-8 rounded-xl shadow-[0_10px_50px_rgba(56,114,224,0.3)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_80px_rgba(56,114,224,0.5)] border border-blue-500/30"
          style={{ 
            transform: `translateY(${floatY}px)`,
            transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="absolute -top-5 -left-5 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg rotate-12 opacity-80"></div>
          <h3 className="text-2xl font-semibold text-blue-300 mb-6 relative z-10">Contact Us</h3>
          <p className="text-white text-lg mb-4">Email: rockabhisheksingh778189@gmail.com</p>
          <p className="text-white text-lg mb-4">Phone: 7739254874</p>
          <button 
            onClick={() => openEmailClient("Question about booking", "Hello,\n\nI'm interested in booking a session but have some questions first.\n\nBest regards,")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            Email Us Now
          </button>
        </div>
        
        {/* Notification Card Section */}
        <div 
          className="lg:col-span-2 w-full bg-gradient-to-r from-gray-800/90 to-gray-700/90 p-8 rounded-xl shadow-[0_10px_50px_rgba(139,92,246,0.3)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_80px_rgba(139,92,246,0.5)] border border-purple-500/30"
          style={{ 
            transform: `translateY(${-floatY}px)`,
            transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full rotate-45 opacity-70"></div>
          <h3 className="text-2xl font-semibold text-center text-blue-300 mb-6 relative z-10">Booking Information</h3>
          <div className="space-y-4">
            <div className="flex items-start group transition-all duration-300">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Choose from 30-minute or 60-minute sessions with our industry experts
              </p>
            </div>
            <div className="flex items-start group transition-all duration-300">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Flexible scheduling with slots available 7 days a week
              </p>
            </div>
            <div className="flex items-start group transition-all duration-300">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Personalized attention to address your specific questions and challenges
              </p>
            </div>
            <div className="flex items-start group transition-all duration-300">
              <div className="w-2 h-2 mt-2 rounded-full bg-yellow-400 mr-3 group-hover:scale-150 transition-all"></div>
              <p className="text-lg text-white group-hover:translate-x-2 transition-all">
                Video conferencing details sent automatically after booking confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
      
    
   

 {/* FAQ Section with accordion effect */}
 <div ref={faqRef} className="w-full max-w-7xl mb-16 relative z-10">
   <h3 className="text-2xl font-semibold text-center text-white mb-10 relative">
     Frequently Asked Questions
     <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
   </h3>
   <div className="space-y-4">
     {faqItems.map((item, index) => (
       <div 
         key={index} 
         className={`bg-gray-800/50 rounded-xl border transition-all duration-500 ${
           activeFaq === index ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'border-gray-700'
         } backdrop-blur-sm`}
       >
         <div 
           className="p-6 cursor-pointer flex justify-between items-center"
           onClick={() => setActiveFaq(activeFaq === index ? null : index)}
         >
           <h4 className="text-xl text-blue-300 font-medium">{item.question}</h4>
           <div className={`text-white transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}>
             ▼
           </div>
         </div>
         <div 
           className={`overflow-hidden transition-all duration-500 ease-in-out ${
             activeFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
           }`}
         >
           <p className="text-gray-300 px-6 pb-6">{item.answer}</p>
         </div>
       </div>
     ))}
   </div>
 </div>
 
 {/* Timeline Feature */}
 <div className="w-full max-w-7xl mb-16 relative z-10">
   <h3 className="text-2xl font-semibold text-center text-white mb-10 relative">
     Development Timeline
     <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
   </h3>
   
   <div className="relative">
     {/* Timeline line */}
     <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
     
     {/* Timeline items */}
     <div className="space-y-16">
       {/* Item 1 */}
       <div className="relative">
         <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 z-10"></div>
         <div className="ml-auto mr-8 w-5/12 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
           <h4 className="text-xl text-blue-300 font-medium mb-2">Phase 1: Community Platform</h4>
           <p className="text-gray-300">Building the foundation of our user community with forums and resource sharing.</p>
         </div>
       </div>
       
       {/* Item 2 */}
       <div className="relative">
         <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 z-10"></div>
         <div className="mr-auto ml-8 w-5/12 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
           <h4 className="text-xl text-blue-300 font-medium mb-2">Phase 2: One-on-One Sessions</h4>
           <p className="text-gray-300">Launching personalized mentoring sessions with our expert team members.</p>
         </div>
       </div>
       
       {/* Item 3 */}
       <div className="relative">
         <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 z-10"></div>
         <div className="ml-auto mr-8 w-5/12 p-6 bg-gray-800/70 rounded-xl border border-gray-700 shadow-lg transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
           <h4 className="text-xl text-blue-300 font-medium mb-2">Phase 3: Interactive Workshops</h4>
           <p className="text-gray-300">Group learning experiences with hands-on projects and collaborative problem-solving.</p>
         </div>
       </div>
     </div>
   </div>
 </div>
 
 {/* Statistics with animated counters */}
 <div className="w-full max-w-7xl mb-16 relative">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
     <div className="p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
       <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">50+</div>
       <p className="text-lg text-gray-300">Active Members</p>
     </div>
     
     <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
       <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">10+</div>
       <p className="text-lg text-gray-300">Expert Mentors</p>
     </div>
     
     <div className="p-6 bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl border border-indigo-500/20 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
       <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent mb-2">78%</div>
       <p className="text-lg text-gray-300">Satisfaction Rate</p>
     </div>
   </div>
 </div>
 
 {/* Animated CTA */}
 <div className="w-full max-w-7xl mb-16 relative overflow-hidden">
   <div className="relative p-10 rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 group shadow-2xl">
     {/* Animated background circles */}
     <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700"></div>
     <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
     
     <div className="relative z-10 text-center">
       <h3 className="text-3xl font-bold text-white mb-4">Ready to Book Your Session?</h3>
       <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Schedule a one-on-one session with our experts and take your skills to the next level.</p>
       <button 
         onClick={() => {
           // Scroll to top where calendly widget is
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }}
         className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/50 text-lg"
       >
         Book Now
       </button>
     </div>
   </div>
 </div>
 
 {/* Footer with parallax effect */}
 <div className="w-full max-w-7xl border-t border-gray-800 pt-8 text-center relative">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
     <div className="text-left">
       <h4 className="text-xl font-semibold text-blue-300 mb-4">Quick Links</h4>
       <ul className="space-y-2">
         <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
         <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
         <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Services</Link></li>
         <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
       </ul>
     </div>
     
     <div className="text-left">
       <h4 className="text-xl font-semibold text-blue-300 mb-4">Contact</h4>
       <ul className="space-y-2">
         <li className="text-gray-400">Email: rockabhisheksingh778189@gmail.com</li>
         <li className="text-gray-400">Phone: 7739254874</li>
         <li className="text-gray-400">Address: Tech Hub, Innovation Street</li>
       </ul>
     </div>
     
     <div className="text-left">
       <h4 className="text-xl font-semibold text-blue-300 mb-4">Follow Us</h4>
       <div className="flex space-x-4">
         <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors">
           <span className="text-blue-400">FB</span>
        </Link>
         <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors">
           <span className="text-blue-400">TW</span>
        </Link>
         <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors">
           <span className="text-blue-400">IN</span>
        </Link>
         <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors">
                <span className="text-blue-400">IN</span>
             </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-900 transition-colors">
                <span className="text-blue-400">IG</span>
             </Link>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400">© 2025 All rights reserved</p>
        <div className="flex justify-center space-x-6 mt-4">
          <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link>
          <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link>
          <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Support</Link>
        </div>
      </div>
    </div>
  );
};

export default Schedule;