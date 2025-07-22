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
  const trackComponentView = async (component = null) => {
    try {
      await axios.post('https://coding-dashboard-ngwi.onrender.com/api/analytics/track', { component });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  useEffect(() => {
    trackComponentView(); // Track general page view
  }, []);
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          {/* <Header /> */}
          <Navigation />
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
