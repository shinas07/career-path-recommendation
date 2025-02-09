import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Play,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Clock,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle,
  Star,
  AlertCircle
} from 'lucide-react';
import FloatingNav from '../components/Layout/NavBar';
import axios from 'axios';

// First, install framer-motion:
// npm install framer-motion

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

const SkillsOverview = ({ skills }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {skills.map((skill, index) => (
          <SkillCard key={index} skill={skill} index={index} />
        ))}
      </div>

      <motion.div
        layout
        className="bg-gray-700/50 rounded-lg p-4 mt-4"
      >
        <div className="flex items-center justify-between">
          <div className="text-white">
            <span className="text-sm text-gray-400">Skill Strength</span>
            <div className="flex items-center space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`}
                  fill={i < 4 ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const parseCareerAdvice = (advice) => {
  if (!advice) return [];
  
  const recommendations = [];
  const sections = advice.split('**Career Recommendation');
  
  // Skip the first empty section if it exists
  sections.slice(1).forEach(section => {
    const recommendation = {
      title: '',
      match: [],
      skills: [],
      timeline: '',
      growth: []
    };

    // Parse title
    const titleMatch = section.match(/\*\*Job Title:\*\* (.*?)\n/);
    recommendation.title = titleMatch ? titleMatch[1].trim() : 'Not specified';

    // Parse why it's a good match
    const matchSection = section.match(/\*\*Why it's a Good Match:\*\*(.*?)\*\*Additional Skills/s);
    if (matchSection) {
      recommendation.match = matchSection[1]
        .split('*')
        .map(item => item.trim())
        .filter(item => item && item !== '\n');
    }

    // Parse additional skills
    const skillsSection = section.match(/\*\*Additional Skills to Develop:\*\*(.*?)\*\*Estimated Timeline/s);
    if (skillsSection) {
      recommendation.skills = skillsSection[1]
        .split('*')
        .map(item => item.trim())
        .filter(item => item && item !== '\n');
    }

    // Parse timeline
    const timelineMatch = section.match(/\*\*Estimated Timeline for Preparation:\*\*(.*?)\n/);
    recommendation.timeline = timelineMatch ? timelineMatch[1].trim() : 'Not specified';

    // Parse growth opportunities
    const growthSection = section.match(/\*\*Growth Opportunities:\*\*(.*?)(?=\n\n|$)/s);
    if (growthSection) {
      recommendation.growth = growthSection[1]
        .split('*')
        .map(item => item.trim())
        .filter(item => item && item !== '\n');
    }

    recommendations.push(recommendation);
  });

  return recommendations;
};

const CareerPathCard = ({ recommendation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Briefcase className="h-6 w-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white">{recommendation.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-green-400 text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-2" />
            Why It's a Match
          </div>
          <ul className="text-gray-300 pl-6 space-y-1">
            {recommendation.match.length > 0 ? (
              recommendation.match.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li>Not specified</li>
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-blue-400 text-sm font-medium">
            <Target className="h-4 w-4 mr-2" />
            Skills to Develop
          </div>
          <ul className="text-gray-300 pl-6 space-y-1">
            {recommendation.skills.length > 0 ? (
              recommendation.skills.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li>Not specified</li>
            )}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-purple-400 text-sm font-medium">
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </div>
          <p className="text-gray-300 pl-6">{recommendation.timeline || 'Not specified'}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-orange-400 text-sm font-medium">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth Path
          </div>
          <ul className="text-gray-300 pl-6 space-y-1">
            {recommendation.growth.length > 0 ? (
              recommendation.growth.map((item, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-4 w-4 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))
            ) : (
              <li>Not specified</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const NoDataMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center max-w-2xl mx-auto"
  >
    <div className="bg-yellow-500/10 rounded-full p-3 w-fit mx-auto mb-4">
      <AlertCircle className="h-8 w-8 text-yellow-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Unable to Process Your Documents
    </h3>
    <p className="text-gray-400 mb-6">
      We couldn't read your uploaded documents properly. This might be because:
    </p>
    <ul className="text-gray-400 text-left space-y-2 mb-6 max-w-md mx-auto">
      <li className="flex items-start">
        <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
        <span>The file format might not be correct (Please use JSON for certifications)</span>
      </li>
      <li className="flex items-start">
        <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
        <span>The file content might not match the expected structure</span>
      </li>
      <li className="flex items-start">
        <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
        <span>The files might be empty or corrupted</span>
      </li>
    </ul>
    <button
      onClick={() => window.location.href = '/fileupload'}
      className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6 py-2 rounded-lg transition-colors"
    >
      Upload New Documents
    </button>
  </motion.div>
);

const CareerRecommendationPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareerRecommendations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/career-recommendations/", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        console.log(response.data)
        setUserData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerRecommendations();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-white text-xl">Analyzing your profile...</div>
        <div className="text-gray-400 mt-2">Building personalized recommendations</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <div className="text-red-500 text-xl mb-2">Error: {error.message}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Check if we have valid data
  const hasValidData = userData?.topics_found?.length > 0 && 
                      userData?.career_advice && 
                      !userData.career_advice.includes("Since the profile information is not provided");

  if (!hasValidData) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <FloatingNav />
        <div className="max-w-6xl mx-auto mt-24">
          <NoDataMessage />
        </div>
      </div>
    );
  }

  // Parse career recommendations correctly
  const careerRecommendations = parseCareerAdvice(userData?.career_advice);

  // Group tutorials by topic
  const groupedTutorials = userData?.tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.topic]) {
      acc[tutorial.topic] = [];
    }
    acc[tutorial.topic].push(tutorial);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <FloatingNav />
      <div className="max-w-6xl mx-auto space-y-8 mt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Career Compass
          </h1>
          <p className="text-gray-300 text-lg">
            Personalized career paths and learning resources based on your profile
          </p>
        </motion.div>

        {/* Skills Overview */}
        {userData?.topics_found && (
          <SkillsOverview skills={userData.topics_found} />
        )}

        {/* Career Paths */}
        {careerRecommendations && careerRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-purple-400 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Recommended Career Paths</h2>
                  <p className="text-gray-400">Personalized career recommendations based on your profile</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {careerRecommendations.map((recommendation, index) => (
                <CareerPathCard 
                  key={index} 
                  recommendation={recommendation} 
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning Resources */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="h-6 w-6 text-green-400 mr-2" />
            Learning Resources
          </h2>
          {Object.entries(groupedTutorials || {}).map(([topic, tutorials]) => (
            <div key={topic} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">
                {topic} Tutorials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <a
                    key={index}
                    href={tutorial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gray-700/50 rounded-lg p-4 hover:bg-gray-600/50 transition-all"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendationPage;