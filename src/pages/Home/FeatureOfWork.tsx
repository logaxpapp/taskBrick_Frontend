import React from 'react';
import { motion } from 'framer-motion';
import FeaturesOfWork from '../../assets/images/featureOfWork.png';

const features = [
  'Projects Management',
  'Task Management',
  'Project Timesheet',
  'Tickets Detail',
  'Attendance Detail',
  'Employees View',
  'Leave Request',
  'Clients List',
  'Calendar Events',
  'Chat List',
];

const FeatureOfWork: React.FC = () => {
  return (
    <section className="py-16 md:py-28 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
            Streamline Your Workflow, Unleash Your Potential
          </h2>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            Empower your team with the tools they need to collaborate seamlessly, manage projects effectively, and achieve extraordinary results.
          </p>
        </div>

        {/* Main content: two columns, responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-4 items-center max-w-5xl mx-auto">
          {/* Left Side: Numbered List */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ul className="space-y-1 text-gray-700 text-xs md:text-sm lg:text-sm">
              {features.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 font-semibold text-purple-600 flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 border border-purple-100 text-center">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end"
          >
            <img
              src={FeaturesOfWork}
              alt="Feature of Work"
              className="w-full max-w-2xl rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureOfWork;
