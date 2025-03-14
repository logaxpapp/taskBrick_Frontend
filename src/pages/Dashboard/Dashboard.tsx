// File: src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Link } from 'react-router-dom';
import Board from '../../assets/images/board4.png';
import Board2 from '../../assets/images/board2.png';
import Board3 from '../../assets/images/board3.png';

// --- Animation variants ---
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.0 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.0 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 2.6 } },
};

const Dashboard: React.FC = () => {
  // For the "Learn More" accordion
  const [showMore, setShowMore] = useState(false);

  // Grab the logged-in user from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Valued User';

  return (
    <div className="w-full dark:bg-gray-700 dark:text-gray-50">
     
      {/* HERO SECTION with wave background */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative w-full pb-12"
      >
        
        {/* Wave/Shape background (SVG) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 -z-10 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 w-full h-auto"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,64L30,74.7C60,85,120,107,180,149.3C240,192,300,256,360,272C420,288,480,256,540,240C600,224,660,224,720,234.7C780,245,840,267,900,240C960,213,1020,139,1080,90.7C1140,43,1200,21,1260,16C1320,11,1380,21,1410,26.7L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-8 py-12 px-4 md:px-8">
          {/* Left Text */}
          <motion.div
            variants={fadeLeft}
            className="w-full lg:w-1/2 mb-8 lg:mb-0 space-y-6"
          >
            {/* Show a greeting if user is present */}
            <p className="text-sm font-medium text-gray-500 dark:text-gray-50">
              Hello, {fullName}!
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight dark:text-gray-50">
              Experience TaskBrick:
              <br />
              The Ultimate Project Management &amp; Task App
            </h2>
            <p className="text-gray-600 leading-relaxed dark:text-gray-50">
              Say goodbye to scattered tasks, missed deadlines, and never-ending
              email threads. TaskBrick helps teams plan, collaborate, and deliver
              projects with confidence. Manage tasks, track progress, and stay on
              top of every detail—all in one powerful platform.
            </p>
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-[#192bc2] text-white font-semibold rounded shadow hover:bg-blue-700 transition-colors"
          >
            <Link to="/dashboard/get-started">
              Get Started
            </Link>
          </motion.button>
          </motion.div>

          {/* Right "Card" Preview */}
          <motion.div
            variants={fadeRight}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <div className="relative p-4 bg-white dark:bg-gray-800 dark:text-gray-50 rounded shadow-md w-80 hover:shadow-lg transition-shadow">
              <p className="text-xs text-gray-500 dark:text-gray-50 uppercase font-bold mb-2">
                Card Launch
              </p>
              <div className="flex items-center mb-2">
                {/* Avatar group */}
                <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-white text-xs font-semibold mr-[-8px] z-10 ring-2 ring-white">
                  A
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white text-xs font-semibold mr-[-8px] z-10 ring-2 ring-white">
                  R
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white">
                  K
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  {/* Show the user’s name if wanted, or keep a placeholder */}
                  <p className="font-medium text-gray-700">{fullName}</p>
                  <p className="text-xs text-gray-400">Reporter</p>
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-semibold">
                  ON TRACK 0.7
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">●</span>
                  Some risk or blocker
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">●</span>
                  Another potential issue
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  Positive progress
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3-Column Info Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-7xl mx-auto py-12 px-4 md:px-8 space-y-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Column 1 */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-50">
              Create a goal once and use it everywhere
            </h3>
            <div className="bg-gray-100 rounded-md p-4 mb-3">
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                <img
                  src={Board}
                  alt="Board"
                  className="h-32 w-full object-cover rounded-md transition-transform hover:scale-105"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-40 border-2 border-gray-200 p-2 rounded-md dark:text-gray-50">
              Create a goal once and use it everywhere. You can create a goal for
              your team, your department, or your entire organization. Then, use
              that goal to share updates, track progress, and celebrate success.
            </p>
          </motion.div>

          {/* Column 2 */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-50">
              Share monthly updates with your team
            </h3>
            <div className="bg-gray-100 rounded-md p-4 mb-3">
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                <img
                  src={Board3}
                  alt="Board"
                  className="h-32 w-full object-cover rounded-md transition-transform hover:scale-105"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-40 border-2 border-gray-200 p-2 rounded-md dark:text-gray-50">
              Keep everyone aligned by sharing clear, concise updates every month.
              This helps track progress and celebrate success together.
            </p>
          </motion.div>

          {/* Column 3 */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-50">
              Get the flexibility you need to succeed
            </h3>
            <div className="bg-gray-100 rounded-md p-4 mb-3">
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm overflow-hidden">
                <img
                  src={Board2}
                  alt="Board"
                  className="h-32 w-full object-cover rounded-md transition-transform hover:scale-105"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-40 border-2 border-gray-200 p-2 rounded-md dark:text-gray-50">
              TaskBrick is built for teams of any size. It’s easy to set up, use,
              and scale. Whether you’re a small startup or a large enterprise,
              TaskBrick can help you achieve your goals.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* "Learn More" Section - an animated accordion */}
      <section className="max-w-7xl mx-auto pb-12 px-4 md:px-8">
        <div className="border-t pt-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-50">
            Want to learn more?
          </h4>
          <p className="text-sm text-gray-600 mb-4 dark:text-gray-50">
            Learn more about TaskBrick—our unique blend of flexibility, scalability,
            and customizability.
            <br />
            <span className="text-gray-500 dark:text-gray-50">
              Click below to read our full documentation.
            </span>
          </p>
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-5 py-2 bg-[#192bc2] text-white rounded hover:bg-indigo-700 transition-colors"
          >
            {showMore ? 'Show Less' : 'Show More'}
          </button>

          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 bg-white p-8 rounded shadow-sm dark:bg-gray-800 dark:text-gray-50 ">
                  <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-50">
                    TaskBrick offers advanced analytics, integrations with Jira and
                    Slack, customizable dashboards, and so much more. Our flexible
                    goal framework helps you highlight blockers, keep stakeholders
                    informed, and minimize endless meetings. Ready to discover all
                    the features?
                  </p>
                  <ul className="mt-3 list-disc list-inside text-sm text-gray-700 space-y-1 dark:text-gray-50">
                    <li>Set up OKRs, KPIs, or custom metrics</li>
                    <li>Sync tasks automatically with Jira epics</li>
                    <li>Real-time notifications for team updates</li>
                    <li>Detailed progress analytics &amp; custom reports</li>
                  </ul>
                  <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    Read Full Documentation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
