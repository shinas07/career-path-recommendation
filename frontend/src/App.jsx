import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Landing from './pages/LandingPage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import FileUploadSection from './pages/UploadRecords';
// import CareerRecommendationPage from './pages/CareerRecommendations';
import CareerRecommendations from './pages/CareerRecommendationsPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  return accessToken ? children : null;
};

// Public Route component (for login/register)
const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (accessToken) {
      navigate('/');  // Redirect to home/dashboard if already logged in
    }
  }, [accessToken, navigate]);

  return !accessToken ? children : null;
};

function App() {
  const isLoggedIn = !!localStorage.getItem('access_token'); // Check if the access token exists

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position='top-right' expand={true} richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Redirect logged-in users away from login and register pages */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path='/fileupload' element={ <FileUploadSection />} />
          <Route path='/career-recommendations' element={<CareerRecommendations /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;