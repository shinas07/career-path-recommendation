import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  AcademicCapIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex">
      {/* Left Panel - Career Guidance Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-black p-12 flex-col justify-between relative">
        <div className="relative z-10 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4">
              Welcome Back to Your
              <span className="text-blue-400 "> Career Journey</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Continue exploring personalized career recommendations and insights 
              tailored just for you.
            </p>
          </motion.div>

          <div className="space-y-6 ">
            <Feature 
              icon={<AcademicCapIcon className="w-6 h-6" />}
              title="Smart Analysis"
              description="AI-powered analysis of your academic strengths"
            />
            <Feature 
              icon={<ChartBarIcon className="w-6 h-6" />}
              title="Career Matching"
              description="Discover careers that match your profile"
            />
            <Feature 
              icon={<SparklesIcon className="w-6 h-6" />}
              title="Personalized Path"
              description="Get a customized roadmap to your dream career"
            />
          </div>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <div className="bg-gray-900/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">
                Sign in to continue your career exploration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                icon={<EnvelopeIcon className="w-5 h-5" />}
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />

              <FormInput
                icon={<LockClosedIcon className="w-5 h-5" />}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" />
                  <span className="ml-2 text-gray-400">Remember me</span>
                </label>
                <Link to="" className="text-blue-400 hover:text-blue-300">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white text-lg font-semibold
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transform hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-500/30"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign in
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 p-3 bg-blue-500/10 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function FormInput({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        className="block w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg
                   bg-gray-800/50 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-all duration-300"
        {...props}
      />
    </div>
  );
}

export default Login;
