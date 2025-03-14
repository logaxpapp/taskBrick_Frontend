// File: src/pages/GetStarted.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// (Optional) If you want icons, e.g. from Heroicons or React Icons
import { BookOpenIcon, VideoCameraIcon, ChatBubbleLeftRightIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// --- Example animations ---
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const GetStarted: React.FC = () => {

  const navigate = useNavigate();
  return (
    <AnimatePresence>
      <motion.main
        className="relative min-h-screen flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
      >
        {/* 1) Top "Hero" Section with wave background */}
        <motion.section variants={fadeUp} className="relative pb-20">
          {/* Wave at the TOP (rotated 180) */}
          <div className="absolute top-0 left-0 w-full -z-10 transform rotate-180 overflow-hidden">
            <svg
              className="w-full h-auto"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="#f0f4f8"
                fillOpacity="1"
                d="M0,96L80,122.7C160,149,320,203,480,224C640,245,800,235,960,208C1120,181,1280,139,1360,117.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              ></path>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                Welcome to TaskBrick Resource Center
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Discover everything you need to supercharge your workflow in TaskBrick –
                from setup guides to advanced tutorials, best practices, and more!
              </p>
              <button className="bg-[#192bc2] text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition-colors shadow">
                Explore Docs
              </button>
            </div>
          </div>
        </motion.section>

        {/* 2) Key Resources / Tutorials Section */}
        <motion.section
          variants={fadeUp}
          className="max-w-7xl mx-auto px-6 md:px-8 py-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Quick Start Resources
            </h2>
            <p className="text-gray-500 mt-2">
              Pick a resource below to learn more and hit the ground running.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Step-by-step Guides */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <BookOpenIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Step-by-step Guides
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Walk through creating projects, setting tasks, and tracking progress.
              </p>
              
              <button
            onClick={() => navigate('/dashboard/step-by-step')}
            className="mt-4 text-sm text-blue-600 font-medium hover:underline"
          >
            Start Guides
                </button>
            </motion.div>

            {/* Card 2: Video Tutorials */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <VideoCameraIcon className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Video Tutorials
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                See TaskBrick in action with short, easy-to-follow videos.
              </p>
              <button className="mt-4 text-sm text-blue-600 font-medium hover:underline">
                Watch Videos
              </button>
            </motion.div>

            {/* Card 3: Community & Q&A */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Community & Q&A
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Connect with other users, share tips, and get support in our forum.
              </p>
              
                <button className="text-sm text-blue-600 font-medium hover:underline"
                
                onClick={() => navigate('/dashboard/public-qa')}   ///dashboard/public-qa
                >
                 
                
                Ask a Question
              </button>
            </motion.div>

            {/* Card 4: Developer Docs (API) */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <CodeBracketIcon className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">
                Developer Docs (API)
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Dive deeper into our API endpoints, webhooks, and integration best practices.
              </p>
              <button
            onClick={() => navigate('/dashboard/developer-api')}
            className="mt-4 text-sm text-blue-600 font-medium hover:underline"
          >
            View API Docs
          </button>
            </motion.div>
          </div>
        </motion.section>

        {/* 3) Extended Guides / More Help */}
        <motion.section
          variants={fadeUp}
          className="max-w-7xl mx-auto px-6 md:px-8 pb-16"
        >
          <div className="bg-gray-50 rounded-lg shadow px-6 py-8 md:py-12">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  More ways to master TaskBrick
                </h3>
                <p className="text-gray-500 mt-1">
                  In-depth articles, use-case examples, and troubleshooting tips.
                </p>
              </div>
              <button className="mt-4 md:mt-0 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                <Link to="/dashboard/knowledge-base"> Go to Knowledge Base</Link>
               
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example extended guide card */}
              <div className="p-4 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Best Practices for Remote Teams
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Collaborate seamlessly across time zones, using sprints,
                  stand-ups, and TaskBrick’s integrated chat features.
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Advanced Sprint Planning
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Learn how to plan, manage, and complete sprints using boards,
                  burndown charts, and retrospectives.
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Integrations with Jira & Slack
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Synchronize tasks with Jira epics and keep the team updated via
                  Slack notifications in real-time.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </AnimatePresence>
  );
};

export default GetStarted;
