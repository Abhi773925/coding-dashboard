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
import { ProfileDashboard } from "./components/Profile";
import DebugProfile from "./components/Profile/DebugProfile";
import Sql from "./components/interview/Sql";
import NotesOverview from "./components/interview/NotesOverview";
import CodeCompiler from "./components/Compiler/CodeCompiler";
import CollaborativeCodeCompilerPage from "./components/Compiler/CollaborativeCodeCompilerPage";
import JavaScriptLearning from "./components/learning/JavaScriptLearning";
import InterviewMode from "./components/Collaboration/InterviewMode";
import ThemeDemo from "./components/ThemeDemo";
import { Analytics } from "@vercel/analytics/react"// Interview Series Components
import InterviewSeriesOverview from "./components/interview-series/InterviewSeriesOverview";
import ComputerNetworks from "./components/interview-series/ComputerNetworks";
import OperatingSystems from "./components/interview-series/OperatingSystems";
import ObjectOrientedProgramming from "./components/interview-series/ObjectOrientedProgramming";

// SEO Components
import SEO from "./components/SEO/SEO";
import PerformanceOptimizer from "./components/Performance/PerformanceOptimizer";
import Breadcrumb from "./components/SEO/Breadcrumb";
import { withTracking } from './components/hoc/withTracking';
import { Analytics } from "@vercel/analytics/next"
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
const TrackedInterviewSeriesOverview = withTracking(InterviewSeriesOverview);
const TrackedComputerNetworks = withTracking(ComputerNetworks);
const TrackedOperatingSystems = withTracking(OperatingSystems);
const TrackedObjectOrientedProgramming = withTracking(ObjectOrientedProgramming);
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
        const response = await axios.post(`${config.BACKEND_URL}/api/analytics/track`, analyticsData, {
          timeout: 10000, // Increased timeout
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        // If successful and we have stored offline analytics, try to send them
        const offlineAnalytics = localStorage.getItem('offlineAnalytics');
        if (offlineAnalytics && offlineAnalytics !== '[]') {
          try {
            await axios.post(`${config.BACKEND_URL}/api/analytics/batch`, JSON.parse(offlineAnalytics), {
              timeout: 10000,
              withCredentials: true
            });
            localStorage.removeItem('offlineAnalytics');
          } catch (e) {
            // Silently fail - we'll try again next time
            console.warn('Failed to send offline analytics:', e.message);
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
        // Log with more details but don't spam console
        if (attempt === 0) {
          console.warn(`Analytics tracking failed after ${MAX_RETRY_COUNT} attempts:`, {
            status: error.response?.status || 'Network Error',
            message: error.message,
            url: error.config?.url
          });
        }
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
            <Analytics />
            <Dsacard />
            <Footer />
          </>
        } />
        
        <Route path="/allcourse" element={
          <>
            <SEO page="courses" />
            <Breadcrumb items={[{ name: 'Courses', href: '/allcourse' }]} />
            <Dsacard />
          </>
        } />
        
        <Route path="/profile" element={
          <>
            <SEO page="dashboard" title="My Profile - Multi-Platform Coding Profile" />
            <Breadcrumb items={[{ name: 'Profile', href: '/profile' }]} />
            <ProfileDashboard />
          </>
        } />
        
        <Route path="/profile-debug" element={
          <>
            <SEO page="dashboard" title="Profile Debug" />
            <DebugProfile />
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
            ]} />
            <CourseProgress />
          </>
        } />
        
        <Route path="/contest" element={
          <>
            <SEO page="contests" />
            <Breadcrumb items={[{ name: 'Contests', href: '/contest' }]} />
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
            ]} />
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
            ]} />
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
            ]} />
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
            <Breadcrumb items={[{ name: 'SQL Notes', href: '/sql-notes' }]} />
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
            ]} />
            <TrackedNotesOverview onMount={() => trackComponentView('interviewPrep')} />
          </>
        } />
        
        <Route path="/interview-series" element={
          <>
            <SEO 
              title="Interview Series - Technical Interview Preparation"
              description="Comprehensive technical interview preparation series covering computer networks, operating systems, databases, and more."
              keywords="technical interview, computer science fundamentals, networking, operating systems, database systems, system design"
            />
            <Breadcrumb items={[{ name: 'Interview Series', href: '/interview-series' }]} />
            <TrackedInterviewSeriesOverview onMount={() => trackComponentView('interviewSeries')} />
          </>
        } />
        
        <Route path="/interview-series/computer-networks" element={
          <>
            <SEO 
              title="Computer Networks - Interview Preparation Guide"
              description="Master computer networking concepts for technical interviews. Learn OSI model, TCP/IP, routing, switching, and network security."
              keywords="computer networks, networking interview, OSI model, TCP/IP, routing protocols, network security, technical interview"
            />
            <Breadcrumb items={[
              { name: 'Interview Series', href: '/interview-series' },
              { name: 'Computer Networks', href: '/interview-series/computer-networks' }
            ]} />
            <TrackedComputerNetworks onMount={() => trackComponentView('computerNetworks')} />
          </>
        } />

        <Route path="/interview-series/oops" element={
          <>
            <SEO 
              title="OOPS - Interview Preparation Guide"
              description="Master object-oriented programming concepts for technical interviews. Learn inheritance, polymorphism, abstraction, encapsulation, and design patterns."
              keywords="OOPS, object-oriented programming, inheritance, polymorphism, abstraction, encapsulation, design patterns, technical interview"
            />
            <Breadcrumb items={[
              { name: 'Interview Series', href: '/interview-series' },
              { name: 'OOPS', href: '/interview-series/oops' }
            ]} />
            <TrackedObjectOrientedProgramming onMount={() => trackComponentView('oops')} />
          </>
        } />

        <Route path="/interview-series/operating-systems" element={
          <>
            <SEO 
              title="Operating Systems - Interview Preparation Guide"
              description="Master operating system concepts for technical interviews. Learn processes, threads, memory management, scheduling, synchronization, and deadlocks."
              keywords="operating systems, OS interview, processes, threads, memory management, CPU scheduling, synchronization, deadlocks, technical interview"
            />
            <Breadcrumb items={[
              { name: 'Interview Series', href: '/interview-series' },
              { name: 'Operating Systems', href: '/interview-series/operating-systems' }
            ]} />
            <TrackedOperatingSystems onMount={() => trackComponentView('operatingSystems')} />
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
            ]} />
            <TrackedJavaScriptLearning onMount={() => trackComponentView('javascript')} />
          </>
        } />
        
        <Route path="/terminal" element={
          <>
            <SEO page="compiler" />
            <TrackedCodeCompiler onMount={() => trackComponentView('compiler')} />
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