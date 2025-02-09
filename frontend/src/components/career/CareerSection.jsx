import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, Target, TrendingUp, Loader, ChevronRight } from 'lucide-react';

const CareerSection = ({ recommendations, loading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Briefcase className="h-8 w-8 text-purple-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">
          {loading ? "Analyzing Career Paths" : "Recommended Career Paths"}
        </h2>
      </div>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 rounded-xl p-8"
        >
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Loader className="h-12 w-12 text-blue-400" />
            </motion.div>
            <p className="text-gray-400 text-center">
              Analyzing your profile and generating personalized career recommendations...
            </p>
          </div>
        </motion.div>
      ) : recommendations?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <CareerCard 
              key={index} 
              recommendation={recommendation}
              delay={index * 0.2}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No career recommendations available at the moment.
        </div>
      )}
    </div>
  );
};

const CareerCard = ({ recommendation, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="relative overflow-hidden bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg transition-all hover:shadow-blue-500/50"
  >
    <div className="absolute inset-0 rounded-xl border border-transparent hover:border-blue-500 transition-all"></div>

    <div className="flex items-center space-x-3 mb-4">
      <div className="p-3 bg-blue-500/20 rounded-lg">
        <Briefcase className="h-6 w-6 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white">{recommendation.title}</h3>
    </div>

    <div className="space-y-4">
      <InfoSection 
        icon={<CheckCircle />} 
        title="Why It's a Match" 
        content={recommendation.match} 
        isList={true}
      />
      <InfoSection 
        icon={<Target />} 
        title="Skills to Develop" 
        content={recommendation.skills} 
        isList={true}
      />
      <InfoSection 
        icon={<Clock />} 
        title="Timeline" 
        content={recommendation.timeline} 
      />
      <InfoSection 
        icon={<TrendingUp />} 
        title="Growth Path" 
        content={recommendation.growth} 
        isList={true}
      />
    </div>
  </motion.div>
);

const InfoSection = ({ icon, title, content, isList = false }) => (
  <div className="space-y-2">
    <div className="flex items-center text-blue-400 text-sm font-medium">
      {React.cloneElement(icon, { className: "h-4 w-4 mr-2" })}
      {title}
    </div>
    {isList ? (
      <ul className="text-gray-300 pl-6 space-y-1">
        {Array.isArray(content) && content.length > 0 ? (
          content.map((item, index) => (
            <li key={index} className="flex items-start">
              <ChevronRight className="h-4 w-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
              {item}
            </li>
          ))
        ) : (
          <li>Not specified</li>
        )}
      </ul>
    ) : (
      <p className="text-gray-300 pl-6">{content || 'Not specified'}</p>
    )}
  </div>
);

export default CareerSection;
