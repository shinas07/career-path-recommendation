import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  CloudArrowUpIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';
import FloatingNav from '../components/Layout/NavBar';
import { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Parallax effect for features
  const [featureRef, featureInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const renderParticles = () => {
    return Array.from({ length: 50 }).map((_, index) => (
      <motion.div
        key={index}
        className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
        animate={{
          x: ["0vw", `${Math.random() * 100}vw`],
          y: ["0vh", `${Math.random() * 100}vh`],
        }}
        transition={{
          duration: Math.random() * 10 + 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ));
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      <FloatingNav/>
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {renderParticles()}
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f6,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6366f1,transparent_50%)]" />
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="w-12 h-12 mx-auto mb-8 text-blue-400" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Discover Your Perfect Career Path
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Let AI analyze your academic strengths and guide you towards your ideal career journey.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center px-8 py-4 
                            bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
                            overflow-hidden transition-all duration-300 ease-out shadow-lg 
                            shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <span className="relative flex items-center gap-2 text-base font-medium tracking-wide">
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 
                                            transition-transform duration-300 ease-out" />
                  </span>
                  
                  <motion.div
                    className="absolute inset-0 w-1/4 h-full bg-white/20"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                    }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        ref={featureRef}
        className="py-24 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featureInView ? { opacity: 1, y: 0 } : {}}
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
                <motion.div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ opacity: 0 }}
                
                  transition={{ duration: 0.3 }}
                />
                <div className="relative p-8 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700
                              hover:border-gray-600 transition-all duration-500">
                  <motion.div
                 
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section with Counter Animation */}
      <StatsSection stats={stats} />

      {/* Enhanced CTA Section */}
      <CTASection />
    </div>
  );
}

// Separate Stats Section Component with Counter Animation
const StatsSection = ({ stats }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-gray-800/50 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="text-center group"
            >
              <motion.div
                className="text-5xl font-bold bg-clip-text text-transparent 
                          bg-gradient-to-r from-blue-400 to-purple-400 mb-4"
                initial={{ scale: 0.5 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.2, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <motion.div 
                className="text-xl text-gray-400 group-hover:text-gray-300 transition-colors"
                initial={{ y: 20 }}
                animate={inView ? { y: 0 } : {}}
                transition={{ delay: index * 0.3 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced CTA Section Component
const CTASection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="py-24 relative">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f6,transparent_50%)]" />
      </motion.div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
  );
};

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