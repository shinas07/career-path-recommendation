import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Award, Target, Star, 
  Clock, BookOpen, Rocket, ArrowRight, CheckCircle, 
  Users, Brain, Trophy, Sparkles, ArrowUpRight
} from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Tooltip } from 'react-tooltip';

const CareerProgressGraph = ({ recommendations }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const stageIcons = {
    0: { icon: Target, color: 'from-blue-500 to-blue-600', label: 'Entry Level', theme: 'blue' },
    1: { icon: TrendingUp, color: 'from-purple-500 to-purple-600', label: 'Mid Level', theme: 'purple' },
    2: { icon: Star, color: 'from-orange-500 to-orange-600', label: 'Senior Level', theme: 'orange' }
  };

  const skillIcons = {
    'python': Brain,
    'data': BookOpen,
    'web': Rocket,
    'cloud': Users,
    'software': Trophy,
    'default': CheckCircle
  };

  const handleCardClick = (index) => {
    setSelectedCard(selectedCard === index ? null : index);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const getSkillIcon = (skill) => {
    const lowercaseSkill = skill.toLowerCase();
    return Object.entries(skillIcons).find(([key]) => 
      lowercaseSkill.includes(key))?.[1] || skillIcons.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg relative overflow-hidden"
    >
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <motion.div 
        className="text-center mb-10"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          Your Career Growth Journey
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-300">Based on your skills and potential, here's your path to success</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recommendations.map((career, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <motion.div
              className={`bg-gradient-to-br ${stageIcons[index].color} p-[2px] rounded-lg cursor-pointer
                transform transition-all duration-300 hover:scale-[1.02]`}
              whileHover={{ boxShadow: `0 0 20px ${stageIcons[index].theme === 'blue' ? '#3B82F6' : 
                stageIcons[index].theme === 'purple' ? '#8B5CF6' : '#F97316'}33` }}
              onClick={() => handleCardClick(index)}
            >
              <div className="bg-gray-900 rounded-lg p-6 h-full">
                {/* Stage Icon */}
                <motion.div
                  className="flex justify-between items-center mb-4"
                  initial={false}
                >
                  <div className="flex items-center gap-2">
                    {React.createElement(stageIcons[index].icon, { 
                      className: `w-5 h-5 text-${stageIcons[index].theme === 'blue' ? 'blue' : 
                        stageIcons[index].theme === 'purple' ? 'purple' : 'orange'}-400` 
                    })}
                    <span className="text-gray-400 text-sm">{stageIcons[index].label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </motion.div>

                <AnimatePresence>
                  <motion.div
                    initial={false}
                    animate={{ height: 'auto' }}
                  >
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      {career.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      {career.timeline}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-gray-300 font-semibold flex items-center gap-2">
                          Key Skills
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-800">
                            {career.skills.length}
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, idx) => {
                            const SkillIcon = getSkillIcon(skill);
                            return (
                              <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                                data-tooltip-id={`skill-${index}-${idx}`}
                                data-tooltip-content={skill}
                              >
                                <div className={`p-2 rounded-lg bg-gray-800 
                                  group-hover:bg-${stageIcons[index].theme === 'blue' ? 'blue' : 
                                  stageIcons[index].theme === 'purple' ? 'purple' : 'orange'}-500/10 
                                  transition-colors duration-300`}>
                                  <SkillIcon className={`w-4 h-4 text-${stageIcons[index].theme === 'blue' ? 'blue' : 
                                    stageIcons[index].theme === 'purple' ? 'purple' : 'orange'}-400`} />
                                </div>
                                <Tooltip id={`skill-${index}-${idx}`} />
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-gray-300 font-semibold">Growth Path</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.growth.map((position, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`text-xs px-2 py-1 rounded-full 
                                ${stageIcons[index].theme === 'blue' 
                                  ? 'bg-blue-500/10 text-blue-400' 
                                  : stageIcons[index].theme === 'purple'
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : 'bg-orange-500/10 text-orange-400'
                                }
                                hover:scale-105 transition-transform cursor-pointer`}
                            >
                              {position}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <motion.div
          className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 mb-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award className="w-10 h-10 text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">Your Path to Excellence</h3>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Remember, every expert was once a beginner. Your skills and dedication have already set you 
          on an exciting career path. Keep learning, stay curious, and embrace each opportunity to grow. 
          Your potential is limitless!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CareerProgressGraph; 