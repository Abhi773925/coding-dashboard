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
  BookOpen,
  ExternalLink,
  FileText,
  Code,
  Bookmark,
  Share2,
  ChevronRight,
  Star,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
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
  const [activeTab, setActiveTab] = useState('videos') // 'videos' or 'articles'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const playlistId = "PLDzeHZWIZsTo0wSBcg4-NMIbC0L8evLrD"

  // Sample technical articles data
  const [articles] = useState([
    {
      id: 1,
      title: "Complete Guide to React Hooks: useState, useEffect, and Custom Hooks",
      description: "Master React Hooks with practical examples and best practices. Learn how to build reusable logic with custom hooks.",
      author: "Sarah Chen",
      publishedAt: "2024-01-15",
      readTime: "12 min read",
      category: "React",
      tags: ["React", "Hooks", "JavaScript", "Frontend"],
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
      url: "https://dev.to/react-hooks-guide",
      featured: true,
      difficulty: "Intermediate",
      rating: 4.8
    },
    {
      id: 2,
      title: "Building RESTful APIs with Node.js and Express: Best Practices",
      description: "Learn how to design and implement scalable REST APIs using Node.js, Express, and MongoDB with proper error handling.",
      author: "Michael Rodriguez",
      publishedAt: "2024-01-10",
      readTime: "18 min read",
      category: "Backend",
      tags: ["Node.js", "Express", "API", "Backend"],
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop",
      url: "https://medium.com/nodejs-api-guide",
      featured: false,
      difficulty: "Advanced",
      rating: 4.6
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use Which Layout System",
      description: "Comprehensive comparison of CSS Grid and Flexbox with real-world examples and decision-making framework.",
      author: "Emma Thompson",
      publishedAt: "2024-01-08",
      readTime: "8 min read",
      category: "CSS",
      tags: ["CSS", "Grid", "Flexbox", "Layout"],
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      url: "https://css-tricks.com/grid-vs-flexbox",
      featured: true,
      difficulty: "Beginner",
      rating: 4.9
    },
    {
      id: 4,
      title: "JavaScript ES6+ Features Every Developer Should Know",
      description: "Explore modern JavaScript features including destructuring, arrow functions, async/await, and modules.",
      author: "Alex Kumar",
      publishedAt: "2024-01-05",
      readTime: "15 min read",
      category: "JavaScript",
      tags: ["JavaScript", "ES6", "Modern JS", "Features"],
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop",
      url: "https://javascript.info/es6-features",
      featured: false,
      difficulty: "Intermediate",
      rating: 4.7
    },
    {
      id: 5,
      title: "Database Design Principles: From Normalization to Performance",
      description: "Master database design concepts, normalization rules, indexing strategies, and query optimization techniques.",
      author: "David Park",
      publishedAt: "2024-01-03",
      readTime: "22 min read",
      category: "Database",
      tags: ["Database", "SQL", "Design", "Performance"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      url: "https://database-design-guide.com",
      featured: false,
      difficulty: "Advanced",
      rating: 4.5
    },
    {
      id: 6,
      title: "Modern Authentication: JWT, OAuth, and Security Best Practices",
      description: "Implement secure authentication systems using JWT tokens, OAuth 2.0, and modern security practices.",
      author: "Lisa Wang",
      publishedAt: "2024-01-01",
      readTime: "16 min read",
      category: "Security",
      tags: ["Authentication", "JWT", "OAuth", "Security"],
      thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop",
      url: "https://auth0.com/blog/modern-auth",
      featured: true,
      difficulty: "Advanced",
      rating: 4.8
    }
  ])

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
        className={`min-h-screen flex items-center justify-center transition-all duration-300 ${isDarkMode ? "bg-zinc-900" : "bg-white"} grid-background`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className={`text-xl ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Loading your playlist...</p>
        </div>
       
      </div>
    )
  }

  

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDarkMode ? "bg-zinc-900" : "bg-white"} grid-background`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-neutral-800 text-slate-300 hover:bg-neutral-700" : "bg-white text-slate-700 hover:bg-neutral-100"} shadow-md`}
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
            className={`text-sm sm:text-base md:text-lg lg:text-xl pt-2 md:pt-8 mb-2 md:mb-4 px-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
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
              className={`text-center p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 hover:scale-105 ${isDarkMode ? "bg-neutral-800 border-neutral-700" : "bg-white border-neutral-200"}`}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl mb-2 md:mb-3 ${isDarkMode ? "bg-neutral-900" : "bg-neutral-100"}`}
              >
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <div className={`text-lg md:text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className={`text-xs md:text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
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
                className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border transition-all duration-300 ${isDarkMode ? "bg-neutral-800 border-neutral-700" : "bg-white border-neutral-200"}`}
              >
                <div className="mb-4 md:mb-6">
                  <h2
                    className={`text-lg md:text-2xl font-bold mb-2 line-clamp-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {currentVideo?.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                    <span className={`flex items-center gap-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      <Eye size={14} />
                      {currentVideoIndex + 1}/{videos.length}
                    </span>
                    <span className={`flex items-center gap-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
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
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "bg-neutral-900 text-slate-300 hover:bg-neutral-700" : "bg-neutral-100 text-slate-700 hover:bg-neutral-200"}`}
                  >
                    <SkipBack size={18} />
                    Previous
                  </button>

                  <div
                    className={`hidden sm:flex items-center gap-4 md:gap-6 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl ${isDarkMode ? "bg-neutral-900 text-slate-300" : "bg-neutral-100 text-slate-700"}`}
                  >
                    <Volume2 size={18} />
                    <span className="font-semibold text-sm md:text-base">Playing</span>
                  </div>

                  <button
                    onClick={nextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "bg-neutral-900 text-slate-300 hover:bg-neutral-700" : "bg-neutral-100 text-slate-700 hover:bg-neutral-200"}`}
                  >
                    Next
                    <SkipForward size={18} />
                  </button>
                </div>
              </div>

              {/* Video Description */}
              <div
                className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border ${isDarkMode ? "bg-neutral-800 border-neutral-700" : "bg-white border-neutral-200"}`}
              >
                <h3
                  className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  About this video
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {currentVideo?.description?.substring(0, 300)}
                  {currentVideo?.description?.length > 300 && "..."}
                </p>
              </div>
              {/* Disclaimer Section */}
             
            </div>

            {/* Playlist Section */}
            <div className="lg:col-span-1">
              <div
                className={`rounded-2xl md:rounded-3xl p-4 md:p-6 border ${isDarkMode ? "bg-neutral-800 border-neutral-700" : "bg-white border-neutral-200"}`}
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className={`text-lg md:text-xl font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Playlist
                  </h3>
                  <button
                    onClick={() => setShowSetup(true)}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? "text-slate-300 hover:text-slate-200 hover:bg-neutral-700" : "text-slate-700 hover:text-slate-600 hover:bg-neutral-100"}`}
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
                            ? "bg-indigo-600/30 border-2 border-indigo-400/50"
                            : "bg-indigo-100 border-2 border-indigo-400/50"
                          : isDarkMode
                            ? "bg-neutral-900 hover:bg-neutral-700"
                            : "bg-neutral-100 hover:bg-neutral-200"
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
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isDarkMode ? "bg-indigo-500/80" : "bg-indigo-600/80"}`}
                          >
                            <Play size={10} className="text-white ml-0.5 md:ml-1" />
                          </div>
                        </div>
                        <div
                          className={`absolute top-1 right-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-xs font-bold ${isDarkMode ? "bg-neutral-900/80 text-slate-300" : "bg-white/90 text-slate-700"}`}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold text-xs md:text-sm mb-1 md:mb-2 line-clamp-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                        >
                          {video.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
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
   
    </div>
  )
}

export default FullStack
