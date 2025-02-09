import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ChevronRight, BookOpen, Target } from 'lucide-react';

const CareerButton = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/career-recommendations')}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl p-1"
      >
        <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800/80 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Compass className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">
                  Explore Career Paths
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  View personalized career recommendations
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          {/* Features */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Target className="h-4 w-4 text-blue-400" />
              <span>Tailored Paths</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <BookOpen className="h-4 w-4 text-green-400" />
              <span>Learning Resources</span>
            </div>
          </div>

          {/* Gradient Line */}
          <div className="mt-4 h-1 w-full bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50 rounded-full" />
        </div>
      </motion.button>
    </motion.div>
  );
};

export default CareerButton; 