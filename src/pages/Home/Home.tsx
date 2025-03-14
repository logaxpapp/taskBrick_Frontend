import React from 'react';
import TrustedCompanies from './TrustedCompanies';
import FeaturesSection from './FeaturesSection';
import Hero from './Hero';
import ProjectsPage from './ProjectsPage'; 
import ProjectsAtAGlance from './ProjectsAtAGlance';
import GetInTouch from './GetInTouch';
import FeatureOfWork from './FeatureOfWork';


const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <FeaturesSection />
      <FeatureOfWork />
     
      <ProjectsAtAGlance />
      <ProjectsPage />
      <GetInTouch />
    </>
  );
};

export default Home;
