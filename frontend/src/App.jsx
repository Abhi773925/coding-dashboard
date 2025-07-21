import React from "react";
import { ThemeProvider } from "./components/context/ThemeContext";
import HeroSection from "./components/navigation/HeroSection";
import Navigation from "./components/navigation/Navigation";
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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
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
            <Route path="/terminal" element={<CodeCompiler />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
