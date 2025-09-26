// Project Management MCQ imports
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/context/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import './App.css';
import './accessibility.css';
import HeroSection from "./components/navigation/HeroSection";
import axios from "axios";
import Navigation from "./components/navigation/Navigation";
import Toast from './components/notification/Toast';
import Dsacard from "./components/Card/Dsacard";
import CourseProgress from "./components/Course/CourseProgress";
import Profile from "./components/Dashboard/Profile";
import Default from "./components/Card/Default";
import Testimonials from "./components/Dashboard/Testimonials";
import Features from "./components/Dashboard/Features";
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
import JavaScriptLearning from "./components/learning/JavaScriptLearning";
import Collab from "./components/Collaboration/Collab";
import Compiler from "./components/Collaboration/Compiler";
import ThemeDemo from "./components/ThemeDemo";
import ThemeShowcase from "./pages/ThemeShowcase";
import { Analytics } from "@vercel/analytics/react"
import { 
  OOPArticle, 
  ComputerNetworksArticle, 
  OperatingSystemsArticle,
  ArticlesOverview 
} from "./components/articles";
import { config } from "./config/config";

// SEO Components
import SEO from "./components/SEO/SEO";
import PerformanceOptimizer from "./components/Performance/PerformanceOptimizer";
import Breadcrumb from "./components/SEO/Breadcrumb";
import { withTracking } from './components/hoc/withTracking';
// SEO Analytics and Testing
import seoAnalytics from './utils/seoAnalytics';
import { runSEOTest } from './utils/seoTester';
import faqStructuredData from './config/faqStructuredData';
import Lovebabbar from "./components/Course/Lovebabbar";
import ProjectManagement from "./components/coursera/ProjectManagement";

// Wrap components with tracking
const TrackedNotesOverview = withTracking(NotesOverview);
const TrackedSql = withTracking(Sql);
const TrackedJavaScriptLearning = withTracking(JavaScriptLearning);
const TrackedFullStack = withTracking(FullStack);
const TrackedContestTracker = withTracking(ContestTracker);
const TrackedKnowledgePathGame = withTracking(KnowledgePathGame);
const TrackedOOPArticle = withTracking(OOPArticle);
const TrackedComputerNetworksArticle = withTracking(ComputerNetworksArticle);
const TrackedOperatingSystemsArticle = withTracking(OperatingSystemsArticle);
const TrackedArticlesOverview = withTracking(ArticlesOverview);

const AppContent = () => {
  const location = useLocation();
  const hideNavigationRoutes = ['/interview', '/coding-advanced'];
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
        const response = await axios.post(`${config.API_BASE_URL}/api/analytics/track`, analyticsData, {
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
            await axios.post(`${config.API_BASE_URL}/api/analytics/track/batch`, JSON.parse(offlineAnalytics), {
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
     
      {/* Performance Optimizer - loads once */}
      <PerformanceOptimizer />
      
      {!isCollaborationRoute && <Navigation />}
     
      
      <main role="main" id="main-content" className="pt-16">
        <Routes>
        <Route path="/" element={
          <>
            <SEO page="home" />
            {/* <ProjectManagement/> */}
            <HeroSection />
            <Analytics />
            
            <Dsacard />
            <Features />
            <Footer />
          </>
        } />
        
        <Route path="/allcourse" element={
          <>
            <SEO page="courses" />
            <Dsacard />
          </>
        } />
        
        <Route path="/profile" element={
          <>
            <SEO page="dashboard" title="My Profile - Multi-Platform Coding Profile" />
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
            
            <CourseProgress />
          </>
        } />
         <Route path="/courses/lovebabbar" element={
          <>
            <SEO 
              page="courses" 
              title="Data Structures Course - Master the Fundamentals"
              description="Learn essential data structures including arrays, linked lists, trees, graphs, and more. Perfect for coding interview preparation."
              keywords="data structures, arrays, linked lists, trees, graphs, coding interview, computer science"
            />
            
            <Lovebabbar/>
          </>
        } />
        <Route path="/contest" element={
          <>
            <SEO page="contests" />
            {/* <Breadcrumb items={[{ name: 'Contests', href: '/contest' }]} /> */}
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
           
            <TrackedNotesOverview onMount={() => trackComponentView('interviewPrep')} />
          </>
        } />
        
        <Route path="/interview-series" element={
          <>
            <SEO 
              title="Technical Articles - Computer Science Fundamentals"
              description="Comprehensive technical articles covering computer networks, operating systems, object-oriented programming, and more."
              keywords="technical articles, computer science fundamentals, networking, operating systems, programming concepts"
            />
            <Navigation />
            <TrackedArticlesOverview onMount={() => trackComponentView('articles')} />
          </>
        } />
        
        <Route path="/interview-series/computer-networks" element={
          <>
            <SEO 
              title="Computer Networks - Technical Article"
              description="Learn computer networking concepts including OSI model, TCP/IP, routing, switching, and network security in an easy-to-read format."
              keywords="computer networks, networking, OSI model, TCP/IP, routing protocols, network security, technical article"
            />
            <Breadcrumb items={[
              { name: 'Technical Articles', href: '/interview-series' },
              { name: 'Computer Networks', href: '/interview-series/computer-networks' }
            ]} />
            <TrackedComputerNetworksArticle onMount={() => trackComponentView('computerNetworksArticle')} />
          </>
        } />

        <Route path="/interview-series/oops" element={
          <>
            <SEO 
              title="Object-Oriented Programming - Technical Article"
              description="Master OOP concepts including classes, objects, inheritance, polymorphism, abstraction, and encapsulation with clear explanations."
              keywords="OOPS, object-oriented programming, inheritance, polymorphism, abstraction, encapsulation, classes, objects, technical article"
            />
            <Breadcrumb items={[
              { name: 'Technical Articles', href: '/interview-series' },
              { name: 'OOP', href: '/interview-series/oops' }
            ]} />
            <TrackedOOPArticle onMount={() => trackComponentView('oopArticle')} />
          </>
        } />

        <Route path="/interview-series/operating-systems" element={
          <>
            <SEO 
              title="Operating Systems - Technical Article"
              description="Understand operating system concepts including processes, threads, memory management, scheduling, synchronization, and file systems."
              keywords="operating systems, OS, processes, threads, memory management, CPU scheduling, synchronization, file systems, technical article"
            />
            <Breadcrumb items={[
              { name: 'Technical Articles', href: '/interview-series' },
              { name: 'Operating Systems', href: '/interview-series/operating-systems' }
            ]} />
            <TrackedOperatingSystemsArticle onMount={() => trackComponentView('operatingSystemsArticle')} />
          </>
        } />

        {/* New article routes with cleaner URLs */}
        <Route path="/articles/computer-networks" element={
          <>
            <SEO 
              title="Computer Networks - Technical Article"
              description="Learn computer networking concepts including OSI model, TCP/IP, routing, switching, and network security in an easy-to-read format."
              keywords="computer networks, networking, OSI model, TCP/IP, routing protocols, network security, technical article"
            />
            <TrackedComputerNetworksArticle onMount={() => trackComponentView('computerNetworksArticle')} />
          </>
        } />

        <Route path="/articles/oops" element={
          <>
            <SEO 
              title="Object-Oriented Programming - Technical Article"
              description="Master OOP concepts including classes, objects, inheritance, polymorphism, abstraction, and encapsulation with clear explanations."
              keywords="OOPS, object-oriented programming, inheritance, polymorphism, abstraction, encapsulation, classes, objects, technical article"
            />
            <TrackedOOPArticle onMount={() => trackComponentView('oopArticle')} />
          </>
        } />

        <Route path="/articles/operating-systems" element={
          <>
            <SEO 
              title="Operating Systems - Technical Article"
              description="Understand operating system concepts including processes, threads, memory management, scheduling, synchronization, and file systems."
              keywords="operating systems, OS, processes, threads, memory management, CPU scheduling, synchronization, file systems, technical article"
            />
            <TrackedOperatingSystemsArticle onMount={() => trackComponentView('operatingSystemsArticle')} />
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
           
            <TrackedJavaScriptLearning onMount={() => trackComponentView('javascript')} />
          </>
        } />
        
        <Route path="/terminal" element={
          <>
            <SEO page="compiler" />
            <Compiler />
          </>
        } />

        <Route path="/collaborate" element={
          <>
            <SEO 
              page="collaboration" 
              title="Live Code Collaboration - Code Together in Real-time"
              description="Collaborate on code in real-time with multiple developers. Features live editing, chat, video calls, and code execution in 40+ languages."
              keywords="live collaboration, real-time coding, pair programming, code sharing, remote development"
            />
            <Collab />
          </>
        } />

        <Route path="/compiler" element={
          <>
            <SEO 
              page="compiler"
              title="Online Code Compiler - Execute Code in 40+ Languages"
              description="Powerful online code compiler supporting JavaScript, Python, Java, C++, and 40+ programming languages. Real-time collaboration, instant execution, and comprehensive debugging tools."
              keywords="online compiler, code execution, programming languages, javascript compiler, python compiler, real-time collaboration"
            />
            <Compiler />
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
        
        {/* Project Management MCQ Route */}
        <Route path="/courses/project-management-mcqs" element={
          <>
            <SEO 
              title="Project Management MCQs"
              description="Practice project management multiple-choice questions."
              keywords="project management, mcq, quiz, practice"
            />
            
          </>
        } />

        <Route path="/theme-showcase" element={
          <>
            <SEO 
              title="New Theme Showcase - Codeconnecto Inspired Design"
              description="Experience our new codeconnecto-inspired color theme with modern glassmorphism effects and vibrant cyan accents."
              keywords="theme showcase, codeconnecto, color scheme, modern design, glassmorphism"
            />
            <ThemeShowcase />
          </>
        } />

        <Route path="/features" element={
          <>
            <SEO 
              title="Platform Features - Interactive Coding Tools & Learning Resources"
              description="Explore our comprehensive coding platform features including interactive compiler, real-time collaboration, and advanced learning resources."
              keywords="coding features, interactive compiler, real-time collaboration, programming tools, learning platform"
            />
            <Features />
            <Footer />
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
    <div className="min-h-screen">
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;