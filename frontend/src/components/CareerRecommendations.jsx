import React, { useEffect, useState } from 'react';

const CareerRecommendations = ({ careerAdvice }) => {
  const [parsedRecommendations, setParsedRecommendations] = useState([]);

  useEffect(() => {
    if (careerAdvice) {
      const parseCareerAdvice = (advice) => {
        const recommendations = [];
        const sections = advice.split('Career Recommendation');
        
        // Skip the first empty section
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

      setParsedRecommendations(parseCareerAdvice(careerAdvice));
    }
  }, [careerAdvice]);

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {parsedRecommendations.map((recommendation, index) => (
        <div 
          key={index}
          className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-4">
            {recommendation.title}
          </h3>

          <div className="space-y-4">
            <Section 
              title="Why It's a Match" 
              items={recommendation.match}
            />
            
            <Section 
              title="Skills to Develop" 
              items={recommendation.skills}
            />

            <div className="space-y-2">
              <h4 className="text-gray-300 font-semibold">Timeline</h4>
              <p className="text-gray-400">
                {recommendation.timeline}
              </p>
            </div>

            <Section 
              title="Growth Path" 
              items={recommendation.growth}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const Section = ({ title, items }) => (
  <div className="space-y-2">
    <h4 className="text-gray-300 font-semibold">{title}</h4>
    {items && items.length > 0 ? (
      <ul className="list-disc list-inside text-gray-400 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">Not specified</p>
    )}
  </div>
);

export default CareerRecommendations;