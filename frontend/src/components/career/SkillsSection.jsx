import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Star } from 'lucide-react';

const SkillCard = ({ skill, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative bg-gray-800 rounded-lg p-4 hover:bg-gray-700/90 transition-all">
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-white font-medium">{skill}</span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: index * 0.2, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded"
        />
      </div>
    </motion.div>
  );
};

const SkillsSection = ({ skills }) => {
  if (!skills.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Award className="h-8 w-8 text-blue-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Professional Skills Profile</h2>
            <p className="text-gray-400">Your verified skills and certifications</p>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full flex items-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{skills.length} Skills Verified</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <SkillCard key={index} skill={skill} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection; 