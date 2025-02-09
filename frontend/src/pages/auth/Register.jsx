import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await register(formData);
      if (response.success) {
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <div className="bg-[#111111]/80 p-8 rounded-2xl backdrop-blur-xl border border-[#2a2a2a]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Start Your Journey</h2>
              <p className="text-gray-400">Create your account to begin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                icon={<UserIcon className="w-5 h-5" />}
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />

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

              <FormInput
                icon={<LockClosedIcon className="w-5 h-5" />}
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white text-lg font-semibold
                         bg-blue-600 hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transform transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-400">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Left Panel - Info */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center order-1 lg:order-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              Discover Your
              <span className="text-purple-400"> Perfect Career</span>
            </h1>
            <p className="text-xl text-gray-300">
              Join us to unlock personalized career recommendations based on your unique profile.
            </p>
          </div>

          <div className="space-y-6">
            <Benefit 
              icon={<RocketLaunchIcon className="w-6 h-6" />}
              title="Career Discovery"
              description="Find the perfect career path aligned with your skills"
            />
            <Benefit 
              icon={<LightBulbIcon className="w-6 h-6" />}
              title="Personalized Insights"
              description="Get tailored recommendations for your growth"
            />
            <Benefit 
              icon={<UserGroupIcon className="w-6 h-6" />}
              title="Expert Guidance"
              description="Access curated resources and learning paths"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Benefit({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 p-3 bg-[#1a1a1a] rounded-lg">
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
        className="block w-full pl-10 pr-4 py-3 
                   border border-[#2a2a2a] rounded-lg
                   bg-[#1a1a1a] text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-all duration-300"
        {...props}
      />
    </div>
  );
}

export default Register; 