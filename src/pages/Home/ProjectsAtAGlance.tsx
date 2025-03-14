import React from 'react';
import { motion, Variants } from 'framer-motion';

// Example interface for a project card
interface Project {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  bgColor: string;  // Tailwind color classes
}

// Sample data
const projectData: Project[] = [
  {
    title: 'Design Systems & Components',
    description: 'Create design systems and components for website and mobile',
    priority: 'Medium',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'User Flow Diagram',
    description: 'Create and analyze user flow for both mobile and website.',
    priority: 'Low',
    bgColor: 'bg-green-50',
  },
  {
    title: 'NFT Illustrations',
    description: 'Create NFT illustrations based on the mood board given.',
    priority: 'High',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Branding for Meta',
    description: 'Create full presentation for career coach app.',
    priority: 'Low',
    bgColor: 'bg-green-50',
  },
];

// Container variants for staggering
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

// Fade-up for each card
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const ProjectsAtAGlance: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          All your <span className="text-gray-500">projects</span> at a glance
        </h2>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {projectData.map((proj, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className={`
                rounded-lg p-6 shadow-sm flex flex-col h-full min-h-[220px] 
                transform transition hover:shadow-md hover:scale-105 
                ${proj.bgColor}
              `}
            >
              {/* Priority Badge */}
              <span className={`inline-block px-3 py-1 mb-3 rounded-md text-sm font-medium ${
                proj.priority === 'High'
                  ? 'bg-red-100 text-red-600'
                  : proj.priority === 'Medium'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-green-100 text-green-600'
              }`}
              >
                {proj.priority}
              </span>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {proj.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {proj.description}
              </p>

              {/* The bottom line: place it at the bottom using margin-top auto */}
              <div className="mt-auto w-full h-[2px] bg-gray-300" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsAtAGlance;
