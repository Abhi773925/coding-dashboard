import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/context/ThemeContext";
import './App.css';
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
import { withTracking } from './components/hoc/withTracking';

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
  const hideNavigationRoutes = ['/collaborate', '/interview','/terminal'];
  const isCollaborationRoute = hideNavigationRoutes.some(route => location.pathname.startsWith(route));

  const RETRY_COUNT = 3;
  const RETRY_DELAY = 1000;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const trackComponentView = async (component = null) => {
    let attempts = 0;
    const attemptTrack = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/analytics/track', {
          component,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        if (attempts < RETRY_COUNT) {
          attempts++;
          await sleep(RETRY_DELAY * attempts);
          return attemptTrack();
        }
        console.warn(`Analytics tracking failed after ${RETRY_COUNT} attempts:`, error.response?.status || 'Network Error');
        return null;
      }
    };
    attemptTrack().catch(error => console.warn('Failed to track component view:', error));
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      trackComponentView();
    }
  }, []);

  return (
    <>
      {!isCollaborationRoute && <Navigation />}
      <Toast />
      <Routes>
        <Route path="/" element={<><HeroSection /><Dsacard /><Footer /></>} />
        <Route path="/allcourse" element={<Dsacard />} />
        <Route path="/profile" element={<><UserProfile /><Profile /></>} />
        <Route path="/courses/data-structures" element={<CourseProgress />} />
        <Route path="/contest" element={<TrackedContestTracker onMount={() => trackComponentView('contests')} />} />
        <Route path="*" element={<Default />} />
        <Route path="/explore/challenges" element={<><TrackedKnowledgePathGame onMount={() => trackComponentView('challenges')} /><IdeaStormGame /></>} />
        <Route path="/explore/learning-paths" element={<Learning />} />
        <Route path="/courses/fullstack" element={<TrackedFullStack onMount={() => trackComponentView('fullstack')} />} />
        <Route path="/sql-notes" element={<TrackedSql onMount={() => trackComponentView('sqlNotes')} />} />
        <Route path="/courses/interview-prep" element={<TrackedNotesOverview onMount={() => trackComponentView('interviewPrep')} />} />
        <Route path="/learning/javascript" element={<TrackedJavaScriptLearning onMount={() => trackComponentView('javascript')} />} />
        <Route path="/terminal" element={<TrackedCodeCompiler onMount={() => trackComponentView('compiler')} />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/theme-demo" element={<ThemeDemo />} />
        <Route path="/collaborate" element={<TrackedCollaborativeCodeCompilerPage onMount={() => trackComponentView('collaborative-compiler')} />} />
        <Route path="/collaborate/:sessionId" element={<TrackedCollaborativeCodeCompilerPage onMount={() => trackComponentView('collaborative-compiler')} />} />
        <Route path="/interview" element={<InterviewMode onMount={() => trackComponentView('interview')} />} />
      </Routes>
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
