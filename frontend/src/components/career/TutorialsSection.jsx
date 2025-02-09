import React from 'react';
import { BookOpen, Play, ExternalLink, ChevronRight } from 'lucide-react';

const TutorialsSection = ({ tutorials }) => {
  if (!tutorials.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <BookOpen className="h-8 w-8 text-green-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">Learning Resources</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutorials.map((tutorial, index) => (
          <a
            key={index}
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/50 transition-all"
          >
            <div className="flex space-x-4">
              <div className="relative w-32 h-20 flex-shrink-0">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="rounded object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all rounded flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                  {tutorial.title}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mt-2">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Watch Tutorial
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TutorialsSection; 