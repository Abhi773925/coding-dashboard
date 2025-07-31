import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/context/ThemeContext";
import './App.css';
import './accessibility.css';
import HeroSection from "./components/navigation/HeroSection";
import axios from "axios";
import Navigation from "./components/navigation/Navigation";
import Toast from './components/notification/Toast';
import Dsacard from "./components/Card/Dsacard";
import { AuthProvider } from "./components/navigation/Navigation";
import CourseProgress from "./components/Course/CourseProgress";
import Profile from "./components/Dashboard/Profile";
import Default from "./components/Card/Default";
import Testimonials from "./components/Dashboard/Testimonials";
import Footer from "./components/Dashboard/Footer";
import ContestTracker from "./components/Contest/ContestTracker";
import Learning from "./components/Card/Learning";
import KnowledgePathGame from "./components/Card/KnowledgePathGame";
import IdeaStormGame from "./components/Card/IdeaStorm";
import UserProfile from "./components/Dashboard/UserProfile";
import Dashboard from "./components/Dashboard/Dashboard";
import FullStack from "./components/fullstack/FullStack";
import Sql from "./components/interview/Sql";
import NotesOverview from "./components/interview/NotesOverview";
import CodeCompiler from "./components/Compiler/CodeCompiler";
import CollaborativeCodeCompilerPage from "./components/Compiler/CollaborativeCodeCompilerPage";
import JavaScriptLearning from "./components/learning/JavaScriptLearning";
import Analytics from "./components/Dashboard/Analytics";
import InterviewMode from "./components/Collaboration/InterviewMode";
import ThemeDemo from "./components/ThemeDemo";

// SEO Components
import SEO from "./components/SEO/SEO";
import PerformanceOptimizer from "./components/Performance/PerformanceOptimizer";
import Breadcrumb from "./components/SEO/Breadcrumb";
import { withTracking } from './components/hoc/withTracking';

// SEO Analytics and Testing
import seoAnalytics from './utils/seoAnalytics';
import { runSEOTest } from './utils/seoTester';
import faqStructuredData from './config/faqStructuredData';

// Wrap components with tracking
const TrackedCodeCompiler = withTracking(CodeCompiler);
const TrackedCollaborativeCodeCompilerPage = withTracking(CollaborativeCodeCompilerPage);
const TrackedNotesOverview = withTracking(NotesOverview);
const TrackedSql = withTracking(Sql);
const TrackedJavaScriptLearning = withTracking(JavaScriptLearning);
const TrackedFullStack = withTracking(FullStack);
const TrackedContestTracker = withTracking(ContestTracker);
const TrackedKnowledgePathGame = withTracking(KnowledgePathGame);

const AppContent = () => {
  const location = useLocation();
  const hideNavigationRoutes = ['/collaborate', '/interview','/terminal', '/coding-advanced'];
  const isCollaborationRoute = hideNavigationRoutes.some(route => location.pathname.startsWith(route));

  const MAX_RETRY_COUNT = 3;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Store analytics data locally when server is unavailable
  const storeOfflineAnalytics = (data) => {
    try {
      const offlineAnalytics = JSON.parse(localStorage.getItem('offlineAnalytics') || '[]');
      offlineAnalytics.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      // Limit storage to prevent overflow
      if (offlineAnalytics.length > 100) offlineAnalytics.shift();
      localStorage.setItem('offlineAnalytics', JSON.stringify(offlineAnalytics));
    } catch (err) {
      console.error('Failed to store offline analytics', err);
    }
  };

  const trackComponentView = async (component = null) => {
    const analyticsData = {
      component,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    const attemptTrack = async (attempt = 0) => {
      try {
        const response = await axios.post(`${config.API_URL}/analytics/track`, analyticsData, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // If successful and we have stored offline analytics, try to send them
        const offlineAnalytics = localStorage.getItem('offlineAnalytics');
        if (offlineAnalytics && offlineAnalytics !== '[]') {
          try {
            await axios.post(`${config.API_URL}/analytics/batch`, JSON.parse(offlineAnalytics), {
              timeout: 5000
            });
            localStorage.removeItem('offlineAnalytics');
          } catch (e) {
            // Silently fail - we'll try again next time
          }
        }
        
        return response.data;
      } catch (error) {
        // Store analytics locally for later transmission
        storeOfflineAnalytics(analyticsData);
        
        // Use exponential backoff for retries
        if (attempt < MAX_RETRY_COUNT) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempt), 10000);
          await sleep(backoffTime);
          return attemptTrack(attempt + 1);
        }
        console.warn(`Analytics tracking failed after ${MAX_RETRY_COUNT} attempts:`, error.response?.status || 'Network Error');
        return null;
      }
    };
    
    // Make tracking non-blocking
    attemptTrack().catch(error => console.warn('Failed to track component view:', error));
  };

  useEffect(() => {
    // Always initialize SEO analytics
    seoAnalytics.init();
    
    // Make SEO testing functions globally available for manual testing
    if (typeof window !== 'undefined') {
      window.runSEOTest = runSEOTest;
      window.seoAnalytics = seoAnalytics;
    }
    
    // Add FAQ structured data for better search results
    const addFAQStructuredData = () => {
      const scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(faqStructuredData);
      document.head.appendChild(scriptTag);
    };
    
    addFAQStructuredData();
    
    if (process.env.NODE_ENV === 'production') {
      trackComponentView();
    }
    
    // Run SEO test automatically in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        runSEOTest();
      }, 2000); // Wait for page to fully load
    }
  }, []);

  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Performance Optimizer - loads once */}
      <PerformanceOptimizer />
      
      {!isCollaborationRoute && <Navigation />}
      <Toast />
      
      <main role="main" id="main-content">
        <Routes>
        <Route path="/" element={
          <>
            <SEO page="home" />
            <HeroSection />
            <Dsacard />
            <Footer />
          </>
        } />
        
        <Route path="/allcourse" element={
          <>
            <SEO page="courses" />
            <Breadcrumb items={[{ name: 'Courses', href: '/allcourse' }]} className="container mx-auto px-4 py-2" />
            <Dsacard />
          </>
        } />
        
        <Route path="/profile" element={
          <>
            <SEO page="dashboard" title="My Profile - Track Your Progress" />
            <Breadcrumb items={[{ name: 'Profile', href: '/profile' }]} className="container mx-auto px-4 py-2" />
            <UserProfile />
            <Profile />
          </>
        } />
        
        <Route path="/courses/data-structures" element={
          <>
            <SEO 
              page="courses" 
              title="Data Structures Course - Master the Fundamentals"
              description="Learn essential data structures including arrays, linked lists, trees, graphs, and more. Perfect for coding interview preparation."
              keywords="data structures, arrays, linked lists, trees, graphs, coding interview, computer science"
            />
            <Breadcrumb items={[
              { name: 'Courses', href: '/allcourse' },
              { name: 'Data Structures', href: '/courses/data-structures' }
            ]} className="container mx-auto px-4 py-2" />
            <CourseProgress />
          </>
        } />
        
        <Route path="/contest" element={
          <>
            <SEO page="contests" />
            <Breadcrumb items={[{ name: 'Contests', href: '/contest' }]} className="container mx-auto px-4 py-2" />
            <TrackedContestTracker onMount={() => trackComponentView('contests')} />
          </>
        } />
        
        <Route path="/explore/challenges" element={
          <>
            <SEO 
              page="dashboard" 
              title="Coding Challenges - Practice Problem Solving"
              description="Solve coding challenges and improve your problem-solving skills. Practice with interactive games and puzzles."
              keywords="coding challenges, problem solving, programming puzzles, algorithm practice"
            />
            <Breadcrumb items={[
              { name: 'Explore', href: '/explore' },
              { name: 'Challenges', href: '/explore/challenges' }
            ]} className="container mx-auto px-4 py-2" />
            <TrackedKnowledgePathGame onMount={() => trackComponentView('challenges')} />
            <IdeaStormGame />
          </>
        } />
        
        <Route path="/explore/learning-paths" element={
          <>
            <SEO 
              page="courses" 
              title="Learning Paths - Structured Programming Education"
              description="Follow structured learning paths designed for different skill levels and career goals. From beginner to advanced programming concepts."
              keywords="learning paths, programming education, skill development, career growth"
            />
            <Breadcrumb items={[
              { name: 'Explore', href: '/explore' },
              { name: 'Learning Paths', href: '/explore/learning-paths' }
            ]} className="container mx-auto px-4 py-2" />
            <Learning />
          </>
        } />
        
        <Route path="/courses/fullstack" element={
          <>
            <SEO 
              page="courses" 
              title="Full Stack Development - Complete Web Development Course"
              description="Master full stack web development with React, Node.js, databases, and deployment. Build real-world applications."
              keywords="full stack development, web development, react, nodejs, javascript, database"
            />
            <Breadcrumb items={[
              { name: 'Courses', href: '/allcourse' },
              { name: 'Full Stack', href: '/courses/fullstack' }
            ]} className="container mx-auto px-4 py-2" />
            <TrackedFullStack onMount={() => trackComponentView('fullstack')} />
          </>
        } />
        
        <Route path="/sql-notes" element={
          <>
            <SEO 
              title="SQL Notes - Database Query Reference"
              description="Comprehensive SQL notes and examples. Learn database queries, joins, optimization, and advanced SQL concepts."
              keywords="sql, database, queries, mysql, postgresql, sql tutorial, database design"
            />
            <Breadcrumb items={[{ name: 'SQL Notes', href: '/sql-notes' }]} className="container mx-auto px-4 py-2" />
            <TrackedSql onMount={() => trackComponentView('sqlNotes')} />
          </>
        } />
        
        <Route path="/courses/interview-prep" element={
          <>
            <SEO 
              page="courses" 
              title="Interview Preparation - Ace Your Coding Interviews"
              description="Comprehensive interview preparation course covering algorithms, system design, behavioral questions, and mock interviews."
              keywords="interview preparation, coding interview, algorithm interview, system design, mock interview"
            />
            <Breadcrumb items={[
              { name: 'Courses', href: '/allcourse' },
              { name: 'Interview Prep', href: '/courses/interview-prep' }
            ]} className="container mx-auto px-4 py-2" />
            <TrackedNotesOverview onMount={() => trackComponentView('interviewPrep')} />
          </>
        } />
        
        <Route path="/learning/javascript" element={
          <>
            <SEO 
              page="courses" 
              title="JavaScript Learning - Master Modern JavaScript"
              description="Learn JavaScript from basics to advanced concepts. ES6+, async programming, DOM manipulation, and modern frameworks."
              keywords="javascript, programming, web development, ES6, async, DOM, frontend"
            />
            <Breadcrumb items={[
              { name: 'Learning', href: '/learning' },
              { name: 'JavaScript', href: '/learning/javascript' }
            ]} className="container mx-auto px-4 py-2" />
            <TrackedJavaScriptLearning onMount={() => trackComponentView('javascript')} />
          </>
        } />
        
        <Route path="/terminal" element={
          <>
            <SEO page="compiler" />
            <TrackedCodeCompiler onMount={() => trackComponentView('compiler')} />
          </>
        } />
        
        <Route path="/analytics" element={
          <>
            <SEO 
              page="dashboard" 
              title="Analytics Dashboard - Track Your Learning Progress"
              description="View detailed analytics of your learning progress, coding activity, and performance metrics."
              keywords="analytics, progress tracking, learning metrics, performance dashboard"
            />
            <Breadcrumb items={[{ name: 'Analytics', href: '/analytics' }]} className="container mx-auto px-4 py-2" />
            <Analytics />
          </>
        } />
        
        <Route path="/theme-demo" element={
          <>
            <SEO 
              title="Theme Demo - UI Components Showcase"
              description="Explore PrepMate's user interface components and theme customization options."
              keywords="ui components, theme, design system, user interface"
            />
            <ThemeDemo />
          </>
        } />
        
        <Route path="/collaborate" element={
          <>
            <SEO page="collaboration" />
            <TrackedCollaborativeCodeCompilerPage onMount={() => trackComponentView('collaborative-compiler')} />
          </>
        } />
        
        <Route path="/collaborate/:sessionId" element={
          <>
            <SEO 
              page="collaboration" 
              title="Live Collaboration Session - Real-time Code Sharing"
              description="Join a live coding collaboration session with video chat and real-time code editing."
            />
            <TrackedCollaborativeCodeCompilerPage onMount={() => trackComponentView('collaborative-compiler')} />
          </>
        } />
        
        <Route path="/interview" element={
          <>
            <SEO 
              title="Mock Interview - Practice Coding Interviews"
              description="Practice coding interviews in a realistic environment with timer, whiteboard, and interview questions."
              keywords="mock interview, coding interview practice, interview simulation, technical interview"
            />
            <InterviewMode onMount={() => trackComponentView('interview')} />
          </>
        } />
        
        <Route path="*" element={
          <>
            <SEO 
              title="Page Not Found - PrepMate"
              description="The page you're looking for doesn't exist. Explore our coding courses, challenges, and mentorship programs."
            />
            <Default />
          </>
        } />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
