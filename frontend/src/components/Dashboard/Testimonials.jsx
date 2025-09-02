"use client"

import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { ChevronLeft, ChevronRight, Trophy, Sparkles, ArrowRight, Quote, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    achievement: "Algorithm Mastery",
    quote:
      "PrepMate's deep-dive algorithm courses helped me ace my FAANG interviews. Truly a game-changer for competitive programming!",
    details: "Solved 700+ LeetCode problems",
    program: "Competitive Programming Track",
    skills: ["C++", "Algorithms", "Data Structures", "Dynamic Programming"],
    profileImage: "/placeholder.svg?height=150&width=150",
    color: "indigo",
  },
  {
    id: 2,
    name: "David Lee",
    achievement: "Launched My Startup",
    quote:
      "From idea to deployment, PrepMate provided the practical skills and mentorship I needed to build and launch my first SaaS product.",
    details: "Secured seed funding",
    program: "Startup Founder's Bootcamp",
    skills: ["TypeScript", "Next.js", "AWS", "PostgreSQL"],
    profileImage: "/placeholder.svg?height=150&width=150",
    color: "indigo",
  },
  {
    id: 3,
    name: "Emily White",
    achievement: "Career Transition",
    quote:
      "Switching careers felt daunting, but PrepMate's comprehensive curriculum and career support made it achievable. Highly recommend!",
    details: "Transitioned from Marketing to Software Engineering",
    program: "Software Engineering Immersion",
    skills: ["Java", "Spring Boot", "Microservices", "DevOps"],
    profileImage: "/placeholder.svg?height=150&width=150",
    color: "indigo",
  },
  {
    id: 4,
    name: "Michael Brown",
    achievement: "Open Source Impact",
    quote: "Contributing to open source became a reality with PrepMate's guidance. My code is now used by thousands!",
    details: "Maintained a popular library",
    program: "Open Source Contributor Program",
    skills: ["Python", "Machine Learning", "TensorFlow", "Docker"],
    profileImage: "/placeholder.svg?height=150&width=150",
    color: "indigo",
  },
]

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { isDarkMode } = useTheme()
  const [direction, setDirection] = useState(0) // 0 for initial, 1 for next, -1 for prev

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  // Framer Motion Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const testimonialCardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        rotateY: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        rotateY: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
      },
    }),
  }

  const itemStaggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const childItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const currentTestimonial = testimonials[currentIndex]

  const getColorClasses = (color, type) => {
    const colors = {
      indigo: {
        bg: isDarkMode ? "bg-indigo-900/40" : "bg-indigo-100",
        text: isDarkMode ? "text-indigo-300" : "text-indigo-700",
        border: isDarkMode ? "border-indigo-800" : "border-indigo-200",
        gradient: "from-indigo-600 to-blue-600",
      },
      blue: {
        bg: isDarkMode ? "bg-blue-900/40" : "bg-blue-100",
        text: isDarkMode ? "text-blue-300" : "text-blue-700",
        border: isDarkMode ? "border-blue-800" : "border-blue-200",
        gradient: "from-blue-600 to-indigo-600",
      },
    }
    return colors[color]?.[type] || ""
  }

  return (
    <motion.div
      className={`
        relative min-h-screen flex flex-col items-center justify-center
        px-4 py-16 transition-colors duration-300 overflow-hidden
        ${isDarkMode ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900"}
      `}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke={isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"}
                strokeWidth="1"
              />
            </pattern>
            <radialGradient id="radial-gradient-bg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={isDarkMode ? "rgba(0, 255, 255, 0.05)" : "rgba(0, 150, 255, 0.05)"} />
              <stop offset="100%" stopColor={isDarkMode ? "rgba(0, 255, 0, 0.03)" : "rgba(0, 200, 0, 0.03)"} />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          <rect width="100%" height="100%" fill="url(#radial-gradient-bg)" opacity="0.6" />
        </svg>
        <style jsx>{`
          @keyframes grid-pan {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 100%;
            }
          }
          .animated-grid-bg {
            animation: grid-pan 120s linear infinite;
          }
        `}</style>
        <div
          className="absolute inset-0 animated-grid-bg"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="${encodeURIComponent(isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)")}" strokeWidth="1"/></svg>')`,
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-center">
        {/* Title section */}
        <motion.div variants={itemStaggerVariants} className="text-center mb-16 relative">
          <motion.h2
            variants={childItemVariants}
            className={`
              text-4xl sm:text-5xl font-extrabold mb-4
              bg-clip-text text-transparent
              ${isDarkMode ? "bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400" : "bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600"}
            `}
          >
            Our Success Stories
          </motion.h2>
          <motion.p
            variants={childItemVariants}
            className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
          >
            Discover how developers like you achieved their goals with CodingKaro.
          </motion.p>
          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute top-1/2 left-1/4 w-10 h-10 rounded-full bg-green-500/10"
          ></motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-0 right-1/3 w-8 h-8 rounded-full bg-cyan-500/10"
          ></motion.div>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative w-full max-w-4xl h-[550px] sm:h-[500px] md:h-[450px] lg:h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex} // Key changes to trigger re-render and animation
              custom={direction}
              variants={testimonialCardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`
                absolute w-full h-full rounded-3xl overflow-hidden
                transform-gpu transition-all duration-500 ease-in-out
                border-2 group
                ${isDarkMode ? `bg-slate-800/70 bg-zinc-900` : `bg-white/80 border-gray-200/50`}
                shadow-xl hover:shadow-2xl
              `}
              style={{
                boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)",
              }}
            >
              {/* Background gradient */}
              <div
                className={`
                  absolute inset-0 opacity-10 group-hover:opacity-20
                  bg-gradient-to-br ${getColorClasses(currentTestimonial.color, "gradient")}
                  transition-all duration-500
                `}
              />
              <div className="p-8 relative z-20 flex flex-col md:flex-row items-center md:items-start gap-8 h-full">
                {/* Profile Image & Info */}
                <div className="flex flex-col items-center text-center md:w-1/3 flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`
                      w-28 h-28 rounded-full flex items-center justify-center relative overflow-hidden
                      ${getColorClasses(currentTestimonial.color, "bg")}
                      shadow-lg group-hover:shadow-xl
                      transition-transform duration-500 group-hover:scale-105
                      border-2 ${getColorClasses(currentTestimonial.color, "border")}
                    `}
                  >
                    <img
                      src={currentTestimonial.profileImage || "/placeholder.svg"}
                      alt={currentTestimonial.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`
                      text-2xl font-bold mt-4 mb-1
                      ${isDarkMode ? "text-slate-300" : "text-gray-900"}
                    `}
                  >
                    {currentTestimonial.name}
                  </motion.h3>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
                      ${getColorClasses(currentTestimonial.color, "bg")}
                    `}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {currentTestimonial.achievement}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`
                      mt-2 px-3 py-1 rounded-full text-sm inline-flex items-center
                      ${isDarkMode ? "bg-zinc-900/30 text-slate-400 border border-slate-800" : "bg-gray-100 text-gray-600 border border-gray-200"}
                    `}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {currentTestimonial.details}
                  </motion.span>
                </div>

                {/* Quote & Skills */}
                <div className="md:w-2/3 flex flex-col justify-between h-full">
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`
                      text-xl italic mb-6 p-6 relative
                      ${isDarkMode ? "text-slate-300 bg-zinc-900/50 rounded-xl border border-slate-800" : "text-gray-700 bg-gray-50 rounded-xl border border-gray-200"}
                    `}
                  >
                    <Quote
                      className={`absolute top-4 left-4 transform -translate-x-1/2 -translate-y-1/2 text-5xl opacity-20
                        ${isDarkMode ? "text-slate-600" : "text-gray-300"}`}
                    />
                    <Quote
                      className={`absolute bottom-4 right-4 transform translate-x-1/2 translate-y-1/2 text-5xl opacity-20 rotate-180
                        ${isDarkMode ? "text-slate-600" : "text-gray-300"}`}
                    />
                    <p className="relative z-10">{currentTestimonial.quote}</p>
                  </motion.blockquote>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className={`text-sm mb-2 ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                      Program:{" "}
                      <span className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
                        {currentTestimonial.program}
                      </span>
                    </div>
                    <div className={`text-sm mb-2 ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                      Tech Skills:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentTestimonial.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium
                            ${getColorClasses(currentTestimonial.color, "bg")}
                          `}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 z-30">
          <motion.button
            onClick={handlePrev}
            className={`
              p-3 rounded-full flex items-center transition-all duration-300
              ${isDarkMode ? "bg-zinc-900/70 text-slate-300 hover:bg-zinc-900" : "bg-white/70 text-gray-700 hover:bg-white/90"}
              backdrop-blur-sm shadow-lg
            `}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
          <motion.button
            onClick={handleNext}
            className={`
              p-3 rounded-full flex items-center transition-all duration-300
              ${isDarkMode ? "bg-zinc-900/70 text-slate-300 hover:bg-zinc-900" : "bg-white/70 text-gray-700 hover:bg-white/90"}
              backdrop-blur-sm shadow-lg
            `}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next Testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (index > currentIndex) setDirection(1)
                else if (index < currentIndex) setDirection(-1)
                setCurrentIndex(index)
              }}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${currentIndex === index ? "w-8 bg-blue-500" : "bg-gray-400"}
                ${isDarkMode ? "hover:bg-blue-400" : "hover:bg-blue-600"}
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div variants={itemStaggerVariants} className="mt-20 text-center">
          <motion.h3
            variants={childItemVariants}
            className={`
              text-3xl font-bold mb-6
              ${isDarkMode ? "text-slate-300" : "text-gray-900"}
            `}
          >
            Ready to write your own success story?
          </motion.h3>
          <motion.button
            variants={childItemVariants}
            className={`
              inline-flex items-center justify-center px-8 py-4 rounded-xl group
              ${isDarkMode ? "bg-gradient-to-r from-green-600 to-cyan-600 text-slate-300 hover:from-green-500 hover:to-cyan-500" : "bg-gradient-to-r from-green-600 to-cyan-600 text-slate-300 hover:from-green-700 hover:to-cyan-700"}
              transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
            `}
          >
            <Lightbulb className="mr-3 h-6 w-6" />
            <span className="text-xl font-semibold">Start Your Journey Today</span>
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.div>
  )
}

export default TestimonialSection
