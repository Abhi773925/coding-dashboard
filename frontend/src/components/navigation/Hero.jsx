import React from 'react';

const Hero = () => {
  const platforms = [
    { logo: '/api/placeholder/80/80', color: 'bg-green-100' },
    { logo: '/api/placeholder/80/80', color: 'bg-blue-100' },
    { logo: '/api/placeholder/80/80', color: 'bg-red-100' },
    { logo: '/api/placeholder/80/80', color: 'bg-indigo-100' },
    { logo: '/api/placeholder/80/80', color: 'bg-yellow-100' },
    { logo: '/api/placeholder/80/80', color: 'bg-teal-100' },
    { logo: '/api/placeholder/80/80', color: 'bg-purple-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          Coding Platforms
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover a seamless integration of your favorite coding tools and platforms
        </p>
      </div>
      
      <div className="relative w-full max-w-4xl">
        {/* Platform Logos */}
        <div className="flex justify-center space-x-6 relative z-10">
          {platforms.map((platform, index) => (
            <div 
              key={index} 
              className={`
                ${platform.color} 
                w-24 h-24 rounded-2xl shadow-lg 
                transform transition-all duration-300 
                hover:scale-110 hover:shadow-2xl 
                flex items-center justify-center
              `}
            >
              <img 
                src={platform.logo} 
                alt={`Platform ${index + 1}`} 
                className="w-16 h-16 object-contain"
              />
            </div>
          ))}
        </div>
        
        {/* Stylized Owl */}
        <div className="absolute -right-12 -top-24 z-0">
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 250 250" 
              className="w-64 h-64 transform rotate-12"
            >
              <path 
                d="M125 25 C75 75, 75 175, 125 225 C175 175, 175 75, 125 25" 
                fill="#FFA500" 
                className="animate-pulse"
              />
              <circle cx="90" cy="100" r="15" fill="white" className="animate-bounce" />
              <circle cx="160" cy="100" r="15" fill="white" className="animate-bounce" />
              <path 
                d="M90 150 Q125 180, 160 150" 
                stroke="black" 
                strokeWidth="5"
                fill="none" 
                className="animate-pulse"
              />
              <path 
                d="M100 50 L125 75 L150 50" 
                stroke="maroon" 
                strokeWidth="5" 
                fill="none"
                className="animate-wiggle"
              />
              <circle 
                cx="125" 
                cy="125" 
                r="180" 
                fill="rgba(255,165,0,0.1)" 
                className="animate-spin-slow"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;