import React from 'react';
import ContributionCard from './ContributionCard';

const ContributionList = () => {
  const contributions = [
    {
      id: 1,
      projectName: "E-Commerce Platform",
      description: "Looking for developers to build a modern e-commerce platform with React and Node.js. Need expertise in payment integration and user authentication.",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      date: "2024-01-15",
      interestedCount: 23
    },
    {
      id: 2,
      projectName: "Mobile App Development",
      description: "Seeking React Native developers for a social media mobile application. Experience with real-time messaging and push notifications required.",
      email: "sarah@example.com",
      phone: "+1 987-654-3210",
      date: "2024-01-10",
      interestedCount: 45
    }
  ];

  const handleJoin = (projectId) => {
    console.log(`Joined project ${projectId}`);
    // Handle join logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Open Collaborations
      </h2>
      
      <div className="space-y-4">
        {contributions.map((contribution) => (
          <ContributionCard
            key={contribution.id}
            projectName={contribution.projectName}
            description={contribution.description}
            email={contribution.email}
            phone={contribution.phone}
            date={contribution.date}
            interestedCount={contribution.interestedCount}
            onJoin={() => handleJoin(contribution.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContributionList;