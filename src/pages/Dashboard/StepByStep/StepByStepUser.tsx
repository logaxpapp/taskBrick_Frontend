/********************************************
 * File: src/pages/StepByStepUser.tsx
 ********************************************/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

type Step = {
  title: string;
  content: React.ReactNode;
};

const steps: Step[] = [
  {
    title: 'Step 1: User Details',
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Enter User Details</h2>
        <p className="mb-2">Provide the basic information for the new user:</p>
        <ul className="list-disc ml-6">
          <li>Name</li>
          <li>Email</li>
          <li>Password</li>
        </ul>
        {/* You can add form inputs here */}
      </div>
    )
  },
  {
    title: 'Step 2: User Settings',
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Configure User Settings</h2>
        <p className="mb-2">Select roles, permissions, and additional preferences:</p>
        <ul className="list-disc ml-6">
          <li>Assign Role</li>
          <li>Set Preferences</li>
          <li>Enable Notifications</li>
        </ul>
        {/* Additional settings options can be placed here */}
      </div>
    )
  },
  {
    title: 'Step 3: Review & Create',
    content: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Review Information</h2>
        <p className="mb-2">Check all the details before creating the user.</p>
        {/* A summary or review section can be added here */}
      </div>
    )
  },
];

const StepByStepUser: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Define Framer Motion variants for the animated transitions.
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New User</h1>

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content with Motion */}
      <AnimatePresence >
        <motion.div
          key={currentStep}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {steps[currentStep].title}
            </h2>
            {steps[currentStep].content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center px-4 py-2 rounded ${
            currentStep === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Previous
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={() => console.log('User Created!')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create User
            <CheckCircleIcon className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StepByStepUser;
