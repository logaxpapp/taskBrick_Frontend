import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

// Framer Motion variants for container & items
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Example of a floating animation for a decorative element
const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

const NotFound: React.FC = () => {
  return (
    <section
      className="
        min-h-screen 
        bg-gradient-to-br from-blue-50 via-white to-blue-100
        flex items-center justify-center 
        relative 
        overflow-hidden
      "
    >
      {/* Decorative element floating in the background */}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-70"
        variants={floatVariants}
        animate="animate"
      />

      <motion.div
        className="max-w-2xl mx-auto px-4 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="relative inline-block mb-4">
          {/* Big "404" text with a glitch effect */}
          <h1 className="text-7xl md:text-9xl font-extrabold text-gray-800 tracking-wider select-none relative">
            404
            {/* Glitch layer */}
            <span
              className="
                absolute inset-0 text-gray-800 
                animate-pulse
                -z-10
                blur-[2px]
              "
              aria-hidden="true"
            >
              404
            </span>
          </h1>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="text-2xl md:text-3xl font-bold text-gray-700 mb-4"
        >
          Page Not Found
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          Oops! The page you’re looking for doesn’t exist or has been moved. 
          Check the URL or click the button below to go back home.
        </motion.p>

        <motion.div variants={fadeUp}>
          <Link
            to="/"
            className="
              inline-block bg-blue-600 text-white 
              py-3 px-6 rounded-md 
              hover:bg-blue-700 
              transition
              shadow-lg
              font-medium
            "
          >
            Go to Homepage
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NotFound;
