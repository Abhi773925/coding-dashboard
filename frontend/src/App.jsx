import React from 'react';
import { ThemeProvider } from './components/context/ThemeContext';
import HeroSection from './components/navigation/HeroSection';
import Navigation from './components/navigation/Navigation';
import Dsacard from './components/Card/Dsacard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/navigation/Navigation';
import CourseProgress from './components/Course/CourseProgress';
import Profile from './components/Dashboard/Profile';
import Default from './components/Card/Default';
import Testimonials from './components/Dashboard/Testimonials';
import Footer from './components/Dashboard/Footer';
import ContestTracker from "./components/Contest/ContestTracker";
import Learning from './components/Card/Learning';
import KnowledgePathGame from './components/Card/KnowledgePathGame';
import { Import } from 'lucide-react';
import IdeaStormGame from './components/Card/IdeaStorm';
import UserProfile from "./components/Dashboard/UserProfile";
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navigation /> {/* Always show the Navbar */}
          <Routes>
          <Route
          path="/"
          element={
            <>
              <HeroSection/>
              <Dsacard/>
             <Testimonials/>
          
             <Footer/>
            </>
          }
        />
            <Route path="/allcourse" element={<Dsacard />} /> {/* Show Dsacard on /allcourse route */}
            <Route path="/profile" element={<><UserProfile/><Profile /></>} /> {/* Profile page */}
            <Route path="/courses/data-structures" element={<CourseProgress />} /> {/* Specific course progress */}
            <Route path='/contest' element={<ContestTracker/>}/>
            {/* Default route to catch undefined paths */}
            <Route path="*" element={<Default/>} />
            <Route path='/explore/challenges' element={
  <>
    <KnowledgePathGame />
    <IdeaStormGame />
  </>
} />

            <Route path='/explore/learning-paths' element={<Learning/>}/>
          </Routes>
        </Router>
      
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
