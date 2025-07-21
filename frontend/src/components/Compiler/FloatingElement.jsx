"use client"

const FloatingElement = ({ delay, duration, children, className }) => (
  <div
    className={`absolute opacity-30 ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      animation: `float ${duration}s ease-in-out infinite`,
    }}
  >
    {children}
  </div>
)

export default FloatingElement
