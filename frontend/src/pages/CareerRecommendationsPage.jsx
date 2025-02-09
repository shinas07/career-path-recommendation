import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FloatingNav from '../components/Layout/NavBar';
import SkillsSection from '../components/career/SkillsSection';
import CareerSection from '../components/career/CareerSection';
import TutorialsSection from '../components/career/TutorialsSection';
import CareerProgressGraph from '../components/career/CareerProgressGraph';
import { Link } from 'react-router-dom';

const parseCareerAdvice = (advice) => {
  if (!advice) return [];
  // Move the parsing logic here from CareerSection
  const recommendations = [];
  const sections = advice.split('**Career Recommendation');
  
  sections.slice(1).forEach(section => {
    const recommendation = {
      title: '',
      match: [],
      skills: [],
      timeline: '',
      growth: []
    };

    // Parse title
    const titleMatch = section.match(/\*\*Job Title:\*\* (.*?)(?=\n)/);
    if (titleMatch) recommendation.title = titleMatch[1].trim();

    // Parse why it's a good match
    const matchSection = section.match(/\*\*Why it's a good match:\*\*\n(.*?)(?=\*\*Additional skills)/s);
    if (matchSection) {
      recommendation.match = matchSection[1]
        .split('\n')
        .map(item => item.replace(/^\s*\* /, '').trim())
        .filter(item => item);
    }

    // Parse skills to develop
    const skillsSection = section.match(/\*\*Additional skills to develop:\*\*\n(.*?)(?=\*\*Estimated)/s);
    if (skillsSection) {
      recommendation.skills = skillsSection[1]
        .split('\n')
        .map(item => item.replace(/^\s*\* /, '').trim())
        .filter(item => item);
    }

    // Parse timeline
    const timelineMatch = section.match(/\*\*Estimated timeline for preparation:\*\* (.*?)(?=\n)/);
    if (timelineMatch) recommendation.timeline = timelineMatch[1].trim();

    // Parse growth opportunities
    const growthMatch = section.match(/\*\*Growth opportunities:\*\* (.*?)(?=\n|$)/);
    if (growthMatch) {
      recommendation.growth = growthMatch[1].split(', ').map(item => item.trim());
    }

    if (recommendation.title) {
      recommendations.push(recommendation);
    }
  });

  return recommendations;
};

const ErrorDisplay = ({ error }) => {
  const is404 = error?.response?.status === 404;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#111111]/80 p-8 rounded-xl border border-[#2a2a2a] text-center max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {is404 ? "No Data Found" : "Error"}
        </h2>
        
        <p className="text-gray-400 mb-6">
          {is404 
            ? "Please upload your documents to get career recommendations."
            : error?.message || "Something went wrong. Please try again."}
        </p>

        {is404 && (
          <Link 
            to="/fileupload" 
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 
                     rounded-lg text-white font-medium transition-colors"
          >
            Upload Documents
          </Link>
        )}
      </div>
    </div>
  );
};

const CareerRecommendationPage = () => {
  const [userData, setUserData] = useState(null);
  const [parsedRecommendations, setParsedRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareerRecommendations = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/career-recommendations/", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        setUserData(response.data);
        if (response.data?.career_recommendations) {
          setParsedRecommendations(response.data.career_recommendations);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerRecommendations();
  }, []); // Only run once on mount

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-white text-xl">Analyzing your profile...</div>
      </div>
    </div>
  );

  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <FloatingNav />
      <div className="max-w-6xl mx-auto space-y-12 mt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Career Compass
          </h1>
          <p className="text-gray-300 text-lg">
            Personalized career paths and learning resources
          </p>
        </motion.div>

        <SkillsSection skills={userData?.topics_found || []} />
        <CareerSection 
          recommendations={userData?.career_recommendations || []} 
          loading={loading} 
        />
        <TutorialsSection tutorials={userData?.tutorials || []} />
        
        {/* Career Progress Graph at the bottom */}
        <CareerProgressGraph 
          recommendations={userData?.career_recommendations || []}
        />
      </div>
    </div>
  );
};

export default CareerRecommendationPage;