import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Amit Verma",
    role: "Project Manager",
    text: "This task management tool has streamlined our workflow like never before!",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Software Engineer",
    text: "Collaboration has never been easier. The deadline tracking is spot on!",
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
  },
  {
    id: 3,
    name: "Rahul Singh",
    role: "UI/UX Designer",
    text: "A must-have for any team looking for better task organization!",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
  },
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("right");

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNextTestimonial = () => {
    setDirection("right");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const goToTestimonial = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-[#090e1a]  px-4">
      <div className="relative w-full max-w-2xl p-8 bg-[#090e1a]  rounded-xl shadow-lg border border-purple-800 transition-all duration-500 hover:shadow-purple-500/50">
        
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/10 to-transparent rounded-xl"></div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-6">What Our Users Say</h2>

        {/* Quote Icon */}
        <div className="absolute -top-8 left-6 text-purple-700 opacity-20">
          <Quote size={40} />
        </div>

        {/* Testimonial Content */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-300 transform ${
            isAnimating
              ? direction === "right"
                ? "-translate-x-8 opacity-0"
                : "translate-x-8 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <img
            src={testimonials[currentIndex].avatar}
            alt={testimonials[currentIndex].name}
            className="h-24 w-24 rounded-full border-2 border-purple-500 shadow-lg object-cover transition-all duration-500 hover:scale-110 hover:border-purple-300"
          />
          <p className="mt-6 text-lg italic text-gray-300">"{testimonials[currentIndex].text}"</p>
          <h3 className="mt-4 text-xl font-semibold text-white">{testimonials[currentIndex].name}</h3>
          <p className="text-sm text-purple-400">{testimonials[currentIndex].role}</p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-6 bg-purple-500 animate-pulse"
                  : "w-2 bg-gray-700 hover:bg-purple-700"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons
        <div className="absolute top-1/2 -translate-y-1/2 flex  w-full px-8">
          <button
            onClick={() => goToTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length)}
            className="text-purple-400 hover:text-purple-300 transition-all duration-300"
          >
            ◀
          </button>
          <button
            onClick={handleNextTestimonial}
            className="text-purple-400 hover:text-purple-300 transition-all duration-300"
          >
            ▶
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Testimonial;
