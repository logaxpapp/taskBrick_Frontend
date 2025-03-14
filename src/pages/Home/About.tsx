import React from 'react';
import { motion, Variants } from 'framer-motion';

// Example images (replace with your actual imports)
import heroImage from '../../assets/images/hero.png';
import team1 from '../../assets/images/image6.png';
import team2 from '../../assets/images/image1.png';
import team3 from '../../assets/images/image2.png';
import team4 from '../../assets/images/image3.png';

// Fade-up variants
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const About: React.FC = () => {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="w-full bg-white"
    >
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden bg-gray-50 flex items-center">
        <img
          src={heroImage}
          alt="About Hero"
          className="absolute w-full h-full object-cover object-center"
        />
        <div className="absolute w-full h-full bg-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg"
          >
            About Our Company
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white mt-4 max-w-2xl mx-auto"
          >
            We create world-class task management and collaboration solutions 
            to help teams achieve more together.
          </motion.p>
        </div>
      </div>

      {/* Our Story Section */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Founded in a small co-working space in 2018, our company started with 
          a passionate team of three who believed in simplifying the way people 
          coordinate tasks and projects. What began as a simple to-do app soon 
          evolved into a robust platform used by organizations around the globe.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Over the years, we&rsquo;ve embraced the latest technologies, expanded 
          our product line, and grown our team to 50+ talented individuals. We 
          believe that empowering teams with intuitive tools can spark new 
          levels of creativity and productivity.
        </p>
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Mission &amp; Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower individuals and teams to work more efficiently by providing 
              intuitive, powerful, and unified solutions for every aspect of project 
              management. We aim to connect people, tasks, and communication under 
              one seamlessly integrated platform.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where collaboration is effortless, creativity thrives, 
              and remote work becomes as natural as working side-by-side. Our platform 
              constantly evolves to adapt to new challenges, ensuring teams can focus 
              on what truly matters: delivering great results together.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Core Values Section */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Core Values</h2>
        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li><strong>Collaboration:</strong> We believe the best ideas come from shared perspectives.</li>
          <li><strong>Innovation:</strong> We&rsquo;re always looking for new ways to solve problems.</li>
          <li><strong>Integrity:</strong> We act with honesty and transparency in all we do.</li>
          <li><strong>Excellence:</strong> We set high standards and hold ourselves accountable.</li>
          <li><strong>Customer-Centric:</strong> We build products that truly serve people&rsquo;s needs.</li>
        </ul>
      </motion.div>

      {/* Achievements / Timeline Section */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Milestones &amp; Achievements</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-700">2018</h4>
              <p className="text-gray-600">Launched the first version of our task management app, acquired 1,000 users in the first month.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-700">2019</h4>
              <p className="text-gray-600">Raised our first seed round, expanded to 10 team members, introduced our mobile app.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-700">2020</h4>
              <p className="text-gray-600">Surpassed 100,000 users worldwide, launched real-time collaboration features.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-700">2022</h4>
              <p className="text-gray-600">Won “Best SaaS for Productivity” award. Reached 1 million users, expanded into Europe & Asia.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Extended Team Section */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <div className="flex items-center space-x-4">
            <img
              src={team1}
              alt="Team Member 1"
              className="w-24 h-24 object-cover rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">Alice Johnson</h3>
              <p className="text-gray-500">CEO & Founder</p>
              <p className="text-gray-600 text-sm mt-2">
                Alice founded the company with a passion for productivity 
                and a vision to unify project management under one roof.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="flex items-center space-x-4">
            <img
              src={team2}
              alt="Team Member 2"
              className="w-24 h-24 object-cover rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">Mark Williams</h3>
              <p className="text-gray-500">CTO</p>
              <p className="text-gray-600 text-sm mt-2">
                Mark leads the engineering team, ensuring our platform is 
                fast, secure, and constantly evolving.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="flex items-center space-x-4">
            <img
              src={team3}
              alt="Team Member 3"
              className="w-24 h-24 object-cover rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">Samantha Lee</h3>
              <p className="text-gray-500">VP of Product</p>
              <p className="text-gray-600 text-sm mt-2">
                Samantha oversees product strategy, ensuring every feature 
                aligns with users’ real-world needs.
              </p>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="flex items-center space-x-4">
            <img
              src={team4}
              alt="Team Member 4"
              className="w-24 h-24 object-cover rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">Luke Roberts</h3>
              <p className="text-gray-500">Head of Marketing</p>
              <p className="text-gray-600 text-sm mt-2">
                Luke drives our brand and messaging, sharing our story 
                with teams and organizations worldwide.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default About;
