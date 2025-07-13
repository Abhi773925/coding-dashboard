"use client"
import { useTheme } from "../context/ThemeContext"
import { motion } from "framer-motion"
import { Filter, ChevronDown, CheckSquare, Square, Sliders, X, RotateCcw } from "lucide-react"

const FilterForm = ({ filter, setFilter, onClose }) => {
  const { isDarkMode } = useTheme() // Use isDarkMode from your theme context

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleResetFilters = () => {
    setFilter({
      difficulty: "All",
      status: "All",
      revision: false,
      showNotes: false, // Ensure this is reset too
    })
  }

  // Define colors based on theme for consistency
  const difficultyColors = {
    All: isDarkMode ? "bg-slate-600" : "bg-gray-400",
    Easy: isDarkMode ? "bg-emerald-600" : "bg-green-600",
    Medium: isDarkMode ? "bg-yellow-600" : "bg-yellow-600",
    Hard: isDarkMode ? "bg-red-600" : "bg-red-600",
  }
  const statusColors = {
    All: isDarkMode ? "bg-slate-600" : "bg-gray-400",
    Completed: isDarkMode ? "bg-emerald-600" : "bg-green-600",
    Pending: isDarkMode ? "bg-orange-600" : "bg-orange-600",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black bg-opacity-40 backdrop-blur-sm
        p-4 md:p-0
      `}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`
          relative w-full max-w-lg
          ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"}
          rounded-3xl shadow-2xl border
          ${isDarkMode ? "border-slate-700/50" : "border-gray-200/50"}
          overflow-hidden
        `}
        style={{
          boxShadow: isDarkMode ? "0 25px 50px rgba(0,0,0,0.6)" : "0 25px 50px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          className={`
            flex items-center justify-between p-5
            ${isDarkMode ? "bg-gradient-to-r from-purple-700 to-blue-700" : "bg-gradient-to-r from-purple-600 to-blue-600"}
            text-white
          `}
        >
          <div className="flex items-center space-x-3">
            <Filter className="w-7 h-7" />
            <h3 className="text-2xl font-bold">Filter Options</h3>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-8">
          {/* Difficulty Filter Section */}
          <div
            className={`
              p-5 rounded-xl border
              ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-gray-50/80 border-gray-200/50"}
              shadow-md
            `}
          >
            <label
              className={`flex items-center mb-3 font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              <Sliders className="mr-3 w-6 h-6 text-purple-500" />
              Difficulty Level
            </label>
            <div className="relative">
              <select
                name="difficulty"
                value={filter.difficulty}
                onChange={handleChange}
                className={`
                  w-full p-3 pl-10 rounded-lg appearance-none cursor-pointer
                  ${isDarkMode ? "bg-slate-700 text-white border-slate-600" : "bg-gray-100 text-gray-900 border-gray-300"}
                  transition-all duration-300
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                `}
              >
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={20}
              />
              <div
                className={`
                  absolute left-3 top-1/2 -translate-y-1/2
                  w-4 h-4 rounded-full
                  ${difficultyColors[filter.difficulty]}
                `}
              />
            </div>
          </div>

          {/* Status Filter Section */}
          <div
            className={`
              p-5 rounded-xl border
              ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-gray-50/80 border-gray-200/50"}
              shadow-md
            `}
          >
            <label
              className={`flex items-center mb-3 font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              <CheckSquare className="mr-3 w-6 h-6 text-emerald-500" />
              Completion Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={filter.status}
                onChange={handleChange}
                className={`
                  w-full p-3 pl-10 rounded-lg appearance-none cursor-pointer
                  ${isDarkMode ? "bg-slate-700 text-white border-slate-600" : "bg-gray-100 text-gray-900 border-gray-300"}
                  transition-all duration-300
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                `}
              >
                {["All", "Completed", "Pending"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={20}
              />
              <div
                className={`
                  absolute left-3 top-1/2 -translate-y-1/2
                  w-4 h-4 rounded-full
                  ${statusColors[filter.status]}
                `}
              />
            </div>
          </div>

          {/* Checkbox Filters */}
          <div
            className={`
              grid grid-cols-1 sm:grid-cols-2 gap-4
              p-5 rounded-xl border
              ${isDarkMode ? "bg-slate-800/70 border-slate-700/50" : "bg-gray-50/80 border-gray-200/50"}
              shadow-md
            `}
          >
            {[
              { name: "revision", label: "Marked for Revision", iconColor: "text-yellow-500" },
              { name: "showNotes", label: "Has Notes", iconColor: "text-indigo-500" },
            ].map((item) => (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter((prev) => ({ ...prev, [item.name]: !prev[item.name] }))}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                  ${isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-100/50"}
                  transition-colors duration-200
                `}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: filter[item.name] ? 1 : 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {filter[item.name] ? (
                    <CheckSquare className={`w-6 h-6 ${item.iconColor}`} />
                  ) : (
                    <Square className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  )}
                </motion.div>
                <label className={`select-none text-base ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {item.label}
                </label>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetFilters}
              className={`
                flex-1 p-4 rounded-xl
                flex items-center justify-center
                font-bold uppercase tracking-wide text-base
                transition-all duration-300
                ${isDarkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                shadow-md hover:shadow-lg
              `}
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Reset Filters
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className={`
                flex-1 p-4 rounded-xl
                flex items-center justify-center
                font-bold uppercase tracking-wide text-base
                transition-all duration-300
                ${isDarkMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500" : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"}
                shadow-lg hover:shadow-xl
              `}
            >
              Apply Filters
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FilterForm
