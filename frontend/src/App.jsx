import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import Landing from './pages/LandingPage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import FileUploadSection from './pages/UploadRecords';
import CareerRecommendationPage from './pages/CareerRecommendations';

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
          <Route path="/login" element={isLoggedIn ? <Navigate to="/career-recommendations" replace /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/career-recommendations" replace /> : <Register />} />

          {/* Protected Routes */}
          <Route path='/fileupload' element={ <FileUploadSection />} />
          <Route path='/career-recommendations' element={<CareerRecommendationPage /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;