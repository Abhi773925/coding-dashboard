import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import Testimonial from "./components/Testimonial";
//  import Login from './components/login/Login';
import TaskTable from "./components/userdata/TaskTable";
import Profile from "./components/profile/Profile";
import Notification from "./components/profile/Notification";
import Pricing from "./components/Pricing";
import ZudioFAQBot from "./components/bot/ZudioFAQBot";
import Footer from "./components/Footer";
import LostPage from "./components/LostPage"; // Import LostPage
import HeroSection from "./components/profile/HeroSection";
import Schedule from "./components/Schedule";
import TaskLifecycleFlow from "./components/TaskLifecycleFlow";
function App() {
  return (
    <Router>
      <div className="bg-[#090e1a]  min-h-screen w-full overflow-x-hidden">
        <Navbar />
        {/* <Login/> */}
        <div className="pt-16 w-full">
          <Routes>
            <Route path="/taskform" element={<TaskForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskTable />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faqbot" element={<ZudioFAQBot />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route
              path="/"
              element={
                <div className="p-6 flex flex-col gap-6">
                  <HeroSection />
                  <TaskLifecycleFlow />
                  <Testimonial />
                  <ZudioFAQBot />
                  <Footer />
                </div>
              }
            />
            <Route path="/taskdetail" element={<TaskTable />} />

            {/* Catch-All Route for 404 Page */}
            <Route path="*" element={<LostPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
