import React, { useEffect } from "react";
import { ThemeProvider } from "./components/context/ThemeContext";
import HeroSection from "./components/navigation/HeroSection";
import axios from "axios";
import Navigation from "./components/navigation/Navigation";
import Header from "./components/navigation/Header";
import Toast from './components/notification/Toast';
import Dsacard from "./components/Card/Dsacard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/navigation/Navigation";
import CourseProgress from "./components/Course/CourseProgress";
import Profile from "./components/Dashboard/Profile";
import Default from "./components/Card/Default";
import Testimonials from "./components/Dashboard/Testimonials";
import Footer from "./components/Dashboard/Footer";
import ContestTracker from "./components/Contest/ContestTracker";
import Learning from "./components/Card/Learning";
import KnowledgePathGame from "./components/Card/KnowledgePathGame";
import { Import } from "lucide-react";
import IdeaStormGame from "./components/Card/IdeaStorm";
import UserProfile from "./components/Dashboard/UserProfile";
import Dashboard from "./components/Dashboard/Dashboard";
import FullStack from "./components/fullstack/FullStack";
import Sql from "./components/interview/Sql";
import NotesOverview from "./components/interview/NotesOverview";
import CodeCompiler from "./components/Compiler/CodeCompiler";
import JavaScriptLearning from "./components/learning/JavaScriptLearning";
import Analytics from "./components/Dashboard/Analytics";
import { withTracking } from './components/hoc/withTracking';

// Wrap components with tracking
const TrackedCodeCompiler = withTracking(CodeCompiler);
const TrackedNotesOverview = withTracking(NotesOverview);
const TrackedSql = withTracking(Sql);
const TrackedJavaScriptLearning = withTracking(JavaScriptLearning);
const TrackedFullStack = withTracking(FullStack);
const TrackedContestTracker = withTracking(ContestTracker);
const TrackedKnowledgePathGame = withTracking(KnowledgePathGame);
function App() {
  // Retry configuration
  const RETRY_COUNT = 3;
  const RETRY_DELAY = 1000; // 1 second

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const trackComponentView = async (component = null) => {
    let attempts = 0;
    
    const attemptTrack = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/analytics/track', 
          { 
            component,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          },
          {
            timeout: 5000, // 5 second timeout
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (error) {
        if (attempts < RETRY_COUNT) {
          attempts++;
          await sleep(RETRY_DELAY * attempts);
          return attemptTrack();
        }
        // If all retries failed, log error but don't throw
        console.warn(`Analytics tracking failed after ${RETRY_COUNT} attempts:`, 
          error.response?.status || 'Network Error');
        return null;
      }
    };

    // Make tracking non-blocking
    attemptTrack().catch(error => {
      console.warn('Failed to track component view:', error);
    });
  };

  useEffect(() => {
    // Only track if we're in production
    if (process.env.NODE_ENV === 'production') {
      trackComponentView(); // Track general page view
    }
  }, []);
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          {/* <Header /> */}
          <Navigation />
        
          {/* <CodeEditor/> */}
          {/* <UnifiedCodeEditor/> */}
          {/* <FrameworkEditor/> */}
          <Toast />
          <Routes>
            <Route 
              path="/"
              element={
                <>
                 {/* <CodeCompiler/> */}
                  <HeroSection />
                  {/* <Dashboard/> */}
                 
                  <Dsacard />
                  {/* <Testimonials/> */}

                  <Footer />
                </>
              }
            />
            <Route path="/allcourse" element={<Dsacard />} />{" "}
            {/* Show Dsacard on /allcourse route */}
            <Route
              path="/profile"
              element={
                <>
                  <UserProfile />
                  <Profile />
                </>
              }
            />{" "}
            {/* Profile page */}
            <Route
              path="/courses/data-structures"
              element={<CourseProgress />}
            />{" "}
            {/* Specific course progress */}
            <Route path="/contest" element={<ContestTracker />} />
            {/* Default route to catch undefined paths */}
            <Route path="*" element={<Default />} />
            <Route
              path="/explore/challenges"
              element={
                <>
                  <KnowledgePathGame />
                  <IdeaStormGame />
                </>
              }
            />
            <Route path="/explore/learning-paths" element={<Learning />} />
            <Route path="/courses/fullstack" element={<FullStack />} />
            <Route path="/sql-notes" element={<Sql/>}/>
            <Route path="/courses/interview-prep" element={<NotesOverview/>}/>
            <Route path="/learning/javascript" element={<JavaScriptLearning />} />
            <Route 
              path="/terminal" 
              element={<TrackedCodeCompiler onMount={() => trackComponentView('compiler')} />} 
            />
            <Route 
              path="/courses/interview-prep" 
              element={<TrackedNotesOverview onMount={() => trackComponentView('interviewPrep')} />} 
            />
            <Route 
              path="/sql-notes" 
              element={<TrackedSql onMount={() => trackComponentView('sqlNotes')} />} 
            />
            <Route 
              path="/learning/javascript" 
              element={<TrackedJavaScriptLearning onMount={() => trackComponentView('javascript')} />} 
            />
            <Route 
              path="/courses/fullstack" 
              element={<TrackedFullStack onMount={() => trackComponentView('fullstack')} />} 
            />
            <Route 
              path="/contest" 
              element={<TrackedContestTracker onMount={() => trackComponentView('contests')} />} 
            />
            <Route 
              path="/explore/challenges" 
              element={
                <>
                  <TrackedKnowledgePathGame onMount={() => trackComponentView('challenges')} />
                  <IdeaStormGame />
                </>
              } 
            />
            <Route path="/analytics" element={<Analytics />} />
           
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
