import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  ArrowRightIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import FloatingNav from '../components/Layout/NavBar';

function Landing() {
  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
            <FloatingNav/>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f6,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6366f1,transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <SparklesIcon className="w-12 h-12 mx-auto mb-8 text-blue-400" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Discover Your Perfect Career Path
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let AI analyze your academic strengths and guide you towards your ideal career journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 
                            bg-black text-white rounded-lg overflow-hidden transition-all
                            duration-300 ease-out hover:bg-gray-900 shadow-xl"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-900 
                                via-gray-800 to-black opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 ease-out" />
                  
                  {/* Button content */}
                  <span className="relative flex items-center gap-2 text-base font-medium tracking-wide">
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 
                                            transition-transform duration-300 ease-out" />
                  </span>
                  
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent 
                                via-white/10 to-transparent skew-x-30 -translate-x-full 
                                group-hover:translate-x-[400%] transition-transform duration-1000 
                                ease-out" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* <Link
                  to="/about"
                  className="group relative inline-flex items-center justify-center px-8 py-4 
                            bg-white text-gray-900 rounded-lg overflow-hidden transition-all
                            duration-300 ease-out border-2 border-gray-200 hover:border-gray-300"
                >
                  <span className="relative flex items-center gap-2 text-base font-medium tracking-wide">
                    Learn More
                  </span>
                </Link> */}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform uses advanced AI to analyze your academic performance and provide 
              tailored career recommendations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 
                              group-hover:opacity-100 transition-all duration-500 blur-lg" />
                <div className="relative p-8 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700
                              hover:border-gray-600 transition-all duration-500">
                  <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-gray-800/50 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-clip-text text-transparent 
                              bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  {stat.value}
                </div>
                <div className="text-xl text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f6,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Career?</h2>
            <p className="text-xl text-gray-400 mb-12">
              Join thousands of students who have discovered their ideal career path using 
              our AI-powered platform.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 
                         bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl
                         shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 
                         transition-all duration-300"
              >
                <span className="text-lg font-semibold">Get Started Now</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: CloudArrowUpIcon,
    title: "Easy Upload",
    description: "Simply upload your grade cards and certifications in any format. Our system handles the rest."
  },
  {
    icon: ChartBarIcon,
    title: "Smart Analysis",
    description: "Advanced AI analyzes your academic performance to identify your unique strengths and potential."
  },
  {
    icon: AcademicCapIcon,
    title: "Career Guidance",
    description: "Get personalized career recommendations and discover upskilling courses tailored to your goals."
  }
];

const stats = [
  {
    value: "10,000+",
    label: "Students Guided"
  },
  {
    value: "95%",
    label: "Satisfaction Rate"
  },
  {
    value: "500+",
    label: "Career Paths"
  }
];

export default Landing;