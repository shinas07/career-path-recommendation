import React from 'react';
import { Lightbulb, BookOpen, Clock } from 'lucide-react';

const CareerAdvice = ({ advice }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Lightbulb className="h-6 w-6 text-yellow-400 mr-2" />
        AI Career Recommendations
      </h2>
      <div className="prose prose-invert">
        {advice.split('\n').map((line, index) => (
          <p key={index} className="text-gray-300">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CareerAdvice; 