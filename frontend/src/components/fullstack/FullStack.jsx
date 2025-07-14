"use client"

import { useState, useEffect } from "react"
import {
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Sun,
  Moon,
  AlertCircle,
  Mail,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const FullStack = () => {
  const { isDarkMode, toggleTheme } = useTheme() // Destructure toggleTheme
  const [videos, setVideos] = useState([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState("AIzaSyCln_2q7Z_-yOr43DxVilnD8lQf7u5eALI")
  const [showSetup, setShowSetup] = useState(false)
  const playlistId = "PLDzeHZWIZsTo0wSBcg4-NMIbC0L8evLrD"

  useEffect(() => {
    // Auto-load playlist on component mount
    if (apiKey && !showSetup) {
      fetchPlaylistVideos(apiKey)
    }
  }, [apiKey, showSetup])

  const fetchPlaylistVideos = async (key) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${key}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch playlist. Please check your API key.")
      }

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const videoList = data.items.map((item, index) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          index: index,
        }))

        setVideos(videoList)
        setShowSetup(false)
      } else {
        setError("No videos found in this playlist.")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSetup = () => {
    if (apiKey.trim()) {
      fetchPlaylistVideos(apiKey)
    } else {
      setError("Please enter a valid YouTube API key.")
    }
  }

  const playVideo = (index) => {
    setCurrentVideoIndex(index)
  }

  const nextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const currentVideo = videos[currentVideoIndex]

  // Enhanced YouTube embed URL with proper parameters to ensure original audio
  const getYouTubeEmbedUrl = (videoId) => {
    const params = new URLSearchParams({
      rel: "0", // Don't show related videos
      autoplay: "0", // Don't autoplay
      modestbranding: "1", // Minimal YouTube branding
      iv_load_policy: "3", // Don't show video annotations
      cc_load_policy: "0", // Don't show captions by default
      hl: "en", // Set interface language to English
      cc_lang_pref: "en", // Prefer English captions if available
      disablekb: "0", // Enable keyboard controls
      fs: "1", // Allow fullscreen
      playsinline: "1", // Play inline on mobile
      origin: window.location.origin, // Set origin for security
      widget_referrer: window.location.origin,
      enablejsapi: "1", // Enable JS API
      start: "0", // Start from beginning
    })
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-all duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} grid-background`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>Loading your playlist...</p>
        </div>
        <style jsx>{`
          .grid-background {
            background-image: radial-gradient(circle, ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"} 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
      </div>
    )
  }

  

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} grid-background`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"} shadow-md`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-3 md:p-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 pt-4 md:pt-8">
          <p
            className={`text-sm sm:text-base md:text-lg lg:text-xl pt-2 md:pt-8 mb-2 md:mb-4 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {videos.length} videos • Interactive Learning • Original Audio
          </p>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12 px-4">
          {[
            {
              icon: Play,
              value: videos.length,
              label: "Videos",
              color: isDarkMode ? "text-blue-400" : "text-blue-600",
            },
            {
              icon: Clock,
              value: `${currentVideoIndex + 1}/${videos.length}`,
              label: "Progress",
              color: isDarkMode ? "text-purple-400" : "text-purple-600",
            },
            {
              icon: TrendingUp,
              value: "Original",
              label: "Audio",
              color: isDarkMode ? "text-emerald-400" : "text-emerald-600",
            },
            { icon: Heart, value: "Free", label: "Access", color: isDarkMode ? "text-pink-400" : "text-pink-600" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`text-center p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 hover:scale-105 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl mb-2 md:mb-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <div className={`text-lg md:text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className={`text-xs md:text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        {/* Main Player Layout */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Video Player Section */}
            <div className="lg:col-span-3 space-y-4 md:space-y-6">
              <div
                className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border transition-all duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="mb-4 md:mb-6">
                  <h2
                    className={`text-lg md:text-2xl font-bold mb-2 line-clamp-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {currentVideo?.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                    <span className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Eye size={14} />
                      {currentVideoIndex + 1}/{videos.length}
                    </span>
                    <span className={`flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Clock size={14} />
                      <span className="hidden sm:inline">
                        {new Date(currentVideo?.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="sm:hidden">
                        {new Date(currentVideo?.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <span className={`flex items-center gap-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                      <Volume2 size={14} />
                      Original Audio
                    </span>
                  </div>
                </div>

                <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <iframe
                      key={currentVideo?.id}
                      width="100%"
                      height="100%"
                      src={getYouTubeEmbedUrl(currentVideo?.id)}
                      title={currentVideo?.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full rounded-xl md:rounded-2xl"
                    ></iframe>
                  </div>
                </div>

                {/* Mobile-friendly Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 md:mt-8">
                  <button
                    onClick={prevVideo}
                    disabled={currentVideoIndex === 0}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
                  >
                    <SkipBack size={18} />
                    Previous
                  </button>

                  <div
                    className={`hidden sm:flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    <Volume2 size={18} />
                    <span className="font-semibold text-sm md:text-base">Playing</span>
                  </div>

                  <button
                    onClick={nextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
                  >
                    Next
                    <SkipForward size={18} />
                  </button>
                </div>
              </div>

              {/* Video Description */}
              <div
                className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <h3
                  className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  About this video
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {currentVideo?.description?.substring(0, 300)}
                  {currentVideo?.description?.length > 300 && "..."}
                </p>
              </div>
              {/* Disclaimer Section */}
             
            </div>

            {/* Playlist Section */}
            <div className="lg:col-span-1">
              <div
                className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className={`text-lg md:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Playlist
                  </h3>
                  <button
                    onClick={() => setShowSetup(true)}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                  >
                    <Settings size={18} />
                  </button>
                </div>

                <div className="space-y-2 md:space-y-3 max-h-64 md:max-h-96 overflow-y-auto custom-scrollbar">
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => playVideo(index)}
                      className={`flex items-start gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        index === currentVideoIndex
                          ? isDarkMode
                            ? "bg-purple-600/30 border-2 border-purple-400/50"
                            : "bg-purple-100 border-2 border-purple-400/50"
                          : isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="relative flex-shrink-0 group">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-16 h-12 md:w-20 md:h-14 rounded-lg md:rounded-xl object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isDarkMode ? "bg-purple-500/80" : "bg-purple-600/80"}`}
                          >
                            <Play size={10} className="text-white ml-0.5 md:ml-1" />
                          </div>
                        </div>
                        <div
                          className={`absolute top-1 right-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-xs font-bold ${isDarkMode ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold text-xs md:text-sm mb-1 md:mb-2 line-clamp-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {video.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="hidden sm:inline">{new Date(video.publishedAt).toLocaleDateString()}</span>
                          <span className="sm:hidden">
                            {new Date(video.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Custom CSS */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${isDarkMode ? "rgba(55, 65, 81, 0.5)" : "rgba(229, 231, 235, 0.5)"}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? "rgba(156, 163, 175, 0.5)" : "rgba(107, 114, 128, 0.5)"}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? "rgba(156, 163, 175, 0.7)" : "rgba(107, 114, 128, 0.7)"}; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .grid-background {
          background-image: radial-gradient(circle, ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"} 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}

export default FullStack
