import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

// Replace with actual images
import servicesHero from '../../assets/images/projext.svg';
import iconTask from '../../assets/images/task.svg';
import iconProject from '../../assets/images/reports.svg';
import iconReport from '../../assets/images/sprint.svg';

// Additional dummy icons for features/testimonials
import iconTeams from '../../assets/images/image1.png';
import iconAutomation from '../../assets/images/image2.png';
import iconIntegrations from '../../assets/images/image3.png';
import iconAnalytics from '../../assets/images/image4.png';

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
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

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Simple FAQ data
const faqData = [
  {
    question: 'How do I get started with your platform?',
    answer:
      'Simply sign up for a free account, create your first project, and begin adding tasks or inviting team members right away.',
  },
  {
    question: 'Is there a limit to the number of tasks or projects?',
    answer:
      'Our free plan allows up to 3 projects with 50 tasks. Upgrading removes these limits and adds premium features.',
  },
  {
    question: 'Can I integrate with third-party services?',
    answer:
      'Absolutely. Our platform supports integrations with popular services like Slack, Google Drive, and GitHub.',
  },
];

const Services: React.FC = () => {
  // Track which FAQ item is active
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full bg-gray-50"
    >
      {/* ===========================
          HERO
      ============================ */}
      <div className="relative h-[400px] overflow-hidden flex items-center bg-gray-200">
        <img
          src={servicesHero}
          alt="Services Hero"
          className="absolute w-full h-full object-cover object-center"
        />
        <div className="absolute w-full h-full bg-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Our Services
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white mt-4 max-w-xl mx-auto"
          >
            Explore how our platform can transform your task management and collaboration experience.
          </motion.p>
        </div>
      </div>

      {/* ===========================
          SERVICE CARDS
      ============================ */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Core Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
          >
            <img src={iconTask} alt="Tasks" className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Task Management</h3>
            <p className="text-gray-600 mb-4">
              Organize, prioritize, and track tasks with ease. Keep your team aligned and always on track.
            </p>
            <button className="bg-[#192bc2] text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Learn More
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
          >
            <img src={iconProject} alt="Projects" className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Project Oversight</h3>
            <p className="text-gray-600 mb-4">
              Get a bird&#39;s-eye view of all your projects. Manage milestones, sprints, and deadlines in one place.
            </p>
            <button className="bg-[#192bc2] text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Learn More
            </button>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
          >
            <img src={iconReport} alt="Reports" className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics &amp; Reporting</h3>
            <p className="text-gray-600 mb-4">
              Gain insights into productivity and progress through powerful reporting and analytics tools.
            </p>
            <button className="bg-[#192bc2] text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Learn More
            </button>
          </motion.div>

          {/* Card 4 (Extra) */}
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
          >
            <img src={iconAutomation} alt="Automation" className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Workflow Automation</h3>
            <p className="text-gray-600 mb-4">
              Automate repetitive tasks and free up your team&#39;s time for the work that matters most.
            </p>
            <button className="bg-[#192bc2] text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ===========================
          KEY FEATURES
      ============================ */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div variants={fadeLeft} className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
            <p className="text-gray-600 mb-6">
              Discover the powerful features that help teams collaborate, stay productive, and deliver projects on time.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <img src={iconTeams} alt="Teams" className="w-8 h-8" />
                <span className="text-gray-700 font-medium">Real-time Team Collaboration</span>
              </li>
              <li className="flex items-center gap-3">
                <img src={iconAnalytics} alt="Analytics" className="w-8 h-8" />
                <span className="text-gray-700 font-medium">Deep Analytics and Insights</span>
              </li>
              <li className="flex items-center gap-3">
                <img src={iconIntegrations} alt="Integrations" className="w-8 h-8" />
                <span className="text-gray-700 font-medium">Integration with Your Favorite Tools</span>
              </li>
              <li className="flex items-center gap-3">
                <img src={iconAutomation} alt="Automation" className="w-8 h-8" />
                <span className="text-gray-700 font-medium">Automation and Custom Workflows</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeRight} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center">
            <img
              src={iconProject}
              alt="Feature illustration"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Why Choose Us?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              We&#39;re not just another project management tool—we&#39;re your partner in productivity.
            </p>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-600">✓</span>
                <span>24/7 Support from real humans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-600">✓</span>
                <span>Robust security for all data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-600">✓</span>
                <span>Scalable for teams of any size</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-600">✓</span>
                <span>Regular feature updates</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===========================
          STATISTICS / ACHIEVEMENTS
      ============================ */}
      <div className="bg-white py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          <motion.div variants={fadeUp} className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-purple-600">1M+</h3>
            <p className="text-gray-600 mt-2">Tasks Managed</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-purple-600">500K+</h3>
            <p className="text-gray-600 mt-2">Projects Completed</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-purple-600">99.9%</h3>
            <p className="text-gray-600 mt-2">Uptime Guarantee</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col items-center">
            <h3 className="text-4xl font-bold text-purple-600">150K+</h3>
            <p className="text-gray-600 mt-2">Happy Teams Worldwide</p>
          </motion.div>
        </motion.div>
      </div>

      {/* ===========================
          TESTIMONIALS
      ============================ */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-semibold mb-8 text-center">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            variants={fadeUp}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 italic">
              &quot;This tool has completely transformed how our team collaborates. We&#39;re delivering projects
              faster than ever before.&quot;
            </p>
            <div className="flex items-center mt-4">
              <img
                src={iconTeams}
                alt="Client 1"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <span className="block font-semibold text-gray-800">Jane Doe</span>
                <span className="text-sm text-gray-500">Project Manager</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 italic">
              &quot;The analytics feature helped us pinpoint bottlenecks. It&#39;s a must-have for any data-driven
              team.&quot;
            </p>
            <div className="flex items-center mt-4">
              <img
                src={iconIntegrations}
                alt="Client 2"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <span className="block font-semibold text-gray-800">John Smith</span>
                <span className="text-sm text-gray-500">CTO</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 italic">
              &quot;Love the integration capabilities. We got Slack, GitHub, and Google Drive connected with zero
              hassle.&quot;
            </p>
            <div className="flex items-center mt-4">
              <img
                src={iconAutomation}
                alt="Client 3"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <span className="block font-semibold text-gray-800">Sarah Lee</span>
                <span className="text-sm text-gray-500">Product Owner</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ===========================
          FAQ
      ============================ */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">FAQs</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-2"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center py-2 text-left"
              >
                <span className="font-medium text-gray-700">{faq.question}</span>
                <span className="text-gray-500">{activeFaq === index ? '-' : '+'}</span>
              </button>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden text-gray-600 pl-4"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ===========================
          CALL TO ACTION (CTA)
      ============================ */}
      <motion.div
        variants={fadeUp}
        className="bg-[#192bc2] py-12 text-center text-white"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-semibold"
          >
            Ready to Supercharge Your Productivity?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-white/90 max-w-2xl mx-auto"
          >
            Join thousands of teams who trust us to manage their projects, tasks, and workflows. Get started in minutes and experience the difference.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex justify-center">
            <button className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition">
              Start Free Trial
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Services;
