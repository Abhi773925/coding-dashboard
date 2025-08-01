import React, { useState, useEffect, useRef } from "react"
import { 
  User, 
  Mail, 
  Code, 
  Edit2, 
  Save, 
  X, 
  Check, 
  Calendar, 
  MapPin, 
  Settings, 
  ExternalLink, 
  Loader2,
  Github,
  BookOpen
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { safeToISOString, safeFormatDate } from "../../utils/dateUtils"
// Mock theme context for demonstration


const UserProfile = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  // const isDarkMode = useTheme()

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    leetcode: "",
    github: "",
    geeksforgeeks: "",
    bio: "",
    location: "",
    joinDate: "",
    avatar: null,
  })
  const [formData, setFormData] = useState(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const containerRef = useRef(null)

  // Fetch user profile data from backend
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      // Get user email from localStorage or other storage method
      const userEmail = localStorage.getItem("userEmail")
      
      if (!userEmail) {
        setError("No user email found. Please log in again.")
        setLoading(false)
        return
      }

      const response = await fetch(`https://prepmate-kvol.onrender.com/api/users/${userEmail}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile data: ${response.status}`)
      }
      
      const data = await response.json()
      
      const fetchedProfile = {
        name: data.name || "",
        email: data.email || userEmail,
        leetcode: data.leetcode || "",
        github: data.github || "",
        geeksforgeeks: data.geeksforgeeks || "",
        bio: data.bio || "",
        location: data.location || "",
        joinDate: data.createdAt || data.joinDate || safeToISOString(new Date()),
        avatar: data.avatar || null,
      }
      
      setProfile(fetchedProfile)
      setFormData(fetchedProfile)
      setError("")
      
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError(error.message || "Failed to load profile data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      const userEmail = localStorage.getItem("userEmail")
      
      if (!userEmail) {
        setError("No user email found. Please log in again.")
        setSaving(false)
        return
      }

      const response = await fetch(`https://prepmate-kvol.onrender.com/api/users/${userEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          leetcode: formData.leetcode,
          github: formData.github,
          geeksforgeeks: formData.geeksforgeeks,
          bio: formData.bio,
          location: formData.location,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`)
      }
      
      const updatedData = await response.json()
      
      // Update profile state with the response data
      setProfile(formData)
      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
      
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const platforms = [
    {
      name: "LeetCode",
      icon: Code,
      fieldName: "leetcode",
      color: "from-yellow-400 to-orange-500",
      baseUrl: "https://leetcode.com/",
      bgGradient: "from-yellow-50 to-orange-50",
      darkBgGradient: "from-yellow-900/10 to-orange-900/10",
    },
    {
      name: "GitHub",
      icon: Github,
      fieldName: "github",
      color: "from-gray-600 to-gray-800",
      baseUrl: "https://github.com/",
      bgGradient: "from-gray-50 to-slate-50",
      darkBgGradient: "from-gray-900/10 to-slate-900/10",
    },
    {
      name: "GeeksforGeeks",
      icon: BookOpen,
      fieldName: "geeksforgeeks",
      color: "from-green-400 to-emerald-500",
      baseUrl: "https://auth.geeksforgeeks.org/user/",
      bgGradient: "from-green-50 to-emerald-50",
      darkBgGradient: "from-green-900/10 to-emerald-900/10",
    },
  ]

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "platforms", label: "Platforms", icon: Code },
  ]

  const TabButton = ({ tab, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`
        relative flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300
        ${
          isActive
            ? isDarkMode
              ? "text-white bg-gradient-to-r from-purple-600 to-blue-600"
              : "text-white bg-gradient-to-r from-purple-600 to-blue-600"
            : isDarkMode
              ? "text-slate-400 hover:text-white hover:bg-slate-700/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }
      `}
    >
      <tab.icon className="w-4 h-4 mr-2" />
      {tab.label}
    </button>
  )

  const ProfileField = ({
    label,
    name,
    value,
    onChange,
    disabled,
    placeholder,
    icon: Icon,
    type = "text",
  }) => (
    <div className="space-y-2">
      <label className={`block text-sm font-semibold ${isDarkMode ? "text-slate-200" : "text-gray-700"}`}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        {type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className={`
              w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300 resize-none
              ${
                isDarkMode
                  ? "bg-slate-800/50 text-slate-100 border border-slate-700/50 focus:border-purple-500/50"
                  : "bg-white border border-gray-200 text-gray-900 focus:border-purple-500/50"
              }
              ${disabled ? "cursor-not-allowed opacity-70" : "focus:ring-2 focus:ring-purple-500/20"}
            `}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300
              ${
                isDarkMode
                  ? "bg-slate-800/50 text-slate-100 border border-slate-700/50 focus:border-purple-500/50"
                  : "bg-white border border-gray-200 text-gray-900 focus:border-purple-500/50"
              }
              ${disabled ? "cursor-not-allowed opacity-70" : "focus:ring-2 focus:ring-purple-500/20"}
            `}
          />
        )}
      </div>
    </div>
  )

  const PlatformCard = ({ platform, profileValue, isEditing, onChange }) => (
    <div
      className={`
        relative group rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-105
        ${
          isDarkMode
            ? `bg-gradient-to-br ${platform.darkBgGradient} border border-slate-700/50`
            : `bg-gradient-to-br ${platform.bgGradient} border border-gray-200`
        }
      `}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${platform.color} shadow-lg`}>
              <platform.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{platform.name}</h3>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Connect your profile</p>
            </div>
          </div>
          {profileValue && (
            <a
              href={`${platform.baseUrl}${profileValue}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-purple-500" />
            </a>
          )}
        </div>
        <div className="space-y-3">
          {isEditing ? (
            <input
              type="text"
              name={platform.fieldName}
              value={profileValue || ""}
              onChange={onChange}
              placeholder={`${platform.name} username`}
              className={`
                w-full py-2 px-3 rounded-lg text-sm transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-slate-800/50 text-slate-100 border border-slate-700/50 focus:border-purple-500/50"
                    : "bg-white border border-gray-200 text-gray-900 focus:border-purple-500/50"
                }
              `}
            />
          ) : (
            <div
              className={`
                flex items-center justify-between p-3 rounded-lg text-sm
                ${isDarkMode ? "bg-slate-800/30" : "bg-white/50"}
              `}
            >
              <span className={`font-medium ${isDarkMode ? "text-slate-200" : "text-gray-700"}`}>
                {profileValue || "Not connected"}
              </span>
              {profileValue ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-400" />}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const NotificationBanner = ({ type, message, onClose }) => (
    message && (
      <div
        className={`
          fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300
          ${type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}
        `}
      >
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button 
            onClick={onClose} 
            className="ml-4 hover:opacity-70"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  )

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
          <span className={`text-lg ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>Loading profile...</span>
          <span className={`text-sm mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            Fetching your data from the server
          </span>
        </div>
      )
    }

    if (error && !profile.email) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <X className="w-12 h-12 text-red-500 mb-4" />
          <span className={`text-lg font-semibold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
            Failed to load profile
          </span>
          <span className={`text-sm mt-2 text-center ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            {error}
          </span>
          <button
            onClick={fetchUserProfile}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProfileField
                label="Full Name"
                name="name"
                value={isEditing ? formData.name : profile.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
                icon={User}
              />
              <ProfileField
                label="Email Address"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={true}
                placeholder="Your email"
                icon={Mail}
              />
              <ProfileField
                label="Location"
                name="location"
                value={isEditing ? formData.location : profile.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Your location"
                icon={MapPin}
              />
            </div>
            <ProfileField
              label="Bio"
              name="bio"
              value={isEditing ? formData.bio : profile.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself"
              icon={User}
              type="textarea"
            />
            {profile.joinDate && (
              <div className={`flex items-center text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                <Calendar className="w-4 h-4 mr-2" />
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )
      
      case "platforms":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.fieldName}
                platform={platform}
                profileValue={isEditing ? formData[platform.fieldName] : profile[platform.fieldName]}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
            ))}
          </div>
        )
      
      case "settings":
        return (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-gray-200"}`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className={`font-medium ${isDarkMode ? "text-slate-200" : "text-gray-700"}`}>Dark Mode</span>
                    <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-300
                      ${isDarkMode ? "bg-purple-600" : "bg-gray-300"}
                    `}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-300
                        ${isDarkMode ? "translate-x-6" : "translate-x-0.5"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className={`
        min-h-screen transition-all duration-700
        ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-50"
        }
      `}
    >
      {/* Notification Banners */}
      <NotificationBanner type="error" message={error} onClose={() => setError("")} />
      <NotificationBanner type="success" message={success} onClose={() => setSuccess("")} />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${isDarkMode ? "bg-purple-500/20" : "bg-purple-500/10"}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 mx-auto shadow-2xl hover:scale-110 transition-transform">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "👤"}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {profile.name || "Your Name"}
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
            {profile.bio || "Add a bio to tell others about yourself"}
          </p>
          {profile.email && (
            <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>
              {profile.email}
            </p>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div
            className={`
              flex space-x-1 p-1 rounded-2xl backdrop-blur-sm
              ${isDarkMode ? "bg-slate-800/50 border border-slate-700/50" : "bg-white/50 border border-gray-200"}
            `}
          >
            {tabs.map((tab) => (
              <TabButton 
                key={tab.id} 
                tab={tab} 
                isActive={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)} 
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`
            rounded-3xl p-8 backdrop-blur-sm border transition-all duration-300
            ${isDarkMode ? "bg-slate-800/30 border-slate-700/50" : "bg-white/50 border-gray-200"}
          `}
        >
          <div key={activeTab} className="transition-all duration-300">
            {renderTabContent()}
          </div>

          {/* Action Buttons */}
          {(activeTab === "profile" || activeTab === "platforms") && !loading && (
            <div className="flex justify-center mt-8 space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setFormData(profile)
                  }}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData(profile)
                    }}
                    disabled={saving}
                    className={`
                      flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105
                      ${
                        isDarkMode
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                      ${saving ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className={`
                      flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
                      ${saving ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile