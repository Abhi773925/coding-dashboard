import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthCallback from './components/AuthCallback';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TaskForm from './components/TaskForm';
import Testimonial from './components/Testimonial';
import TaskTable from './components/userdata/TaskTable';
import Profile from './components/profile/Profile';
import Notification from './components/profile/Notification';
import Pricing from './components/Pricing';
import ZudioFAQBot from './components/bot/ZudioFAQBot';
import Footer from './components/Footer';
import LostPage from './components/LostPage';
import HeroSection from './components/profile/HeroSection';
import Schedule from './components/Schedule';
import TaskLifecycleFlow from './components/TaskLifecycleFlow';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main app component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#090e1a] overflow-x-hidden">
          <Navbar />
          <div className="pt-16 w-full">
            <Routes>
              {/* Home/Landing Page */}
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
              
              {/* Auth Routes */}
              <Route path="/auth-callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <TaskTable />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/taskdetail" 
                element={
                  <ProtectedRoute>
                    <TaskTable />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/taskform" 
                element={
                  <ProtectedRoute>
                    <TaskForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes */}
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faqbot" element={<ZudioFAQBot />} />
              
              {/* 404 Route */}
              <Route path="*" element={<LostPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;