import React from 'react';
import { motion, Variants } from 'framer-motion';

// Replace with your images if needed
import contactHero from '../../assets/images/contactus.png';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
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

const ContactUs: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle contact form submission
    alert('Contact form submitted!');
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full bg-gray-50"
    >
      {/* Hero */}
      <div className="relative h-[400px] overflow-hidden flex items-center bg-gray-200">
        <img
          src={contactHero}
          alt="Contact Hero"
          className="absolute w-full h-full object-cover object-center"
        />
        <div className="absolute w-full h-full bg-black/30" />
        <motion.div
          variants={fadeUp}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact Us
          </h1>
          <p className="text-white mt-4 max-w-xl mx-auto">
            We’d love to hear from you. Fill out the form below or drop us an email.
          </p>
        </motion.div>
      </div>

      {/* Contact Form Section */}
      <motion.div
        variants={fadeUp}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-8">
          Please fill out the form and our team will get back to you shortly.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              className="
                w-full px-4 py-2
                border border-gray-300 rounded-md
                focus:outline-none
                focus:ring-2 focus:ring-blue-400
              "
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              className="
                w-full px-4 py-2
                border border-gray-300 rounded-md
                focus:outline-none
                focus:ring-2 focus:ring-blue-400
              "
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Message
            </label>
            <textarea
              rows={5}
              className="
                w-full px-4 py-2
                border border-gray-300 rounded-md
                focus:outline-none
                focus:ring-2 focus:ring-blue-400
              "
              placeholder="How can we help you?"
            />
          </div>
          <button
            type="submit"
            className="
              bg-blue-600 text-white py-2 px-6
              rounded-md font-medium
              hover:bg-blue-700 transition
            "
          >
            Submit
          </button>
        </form>
      </motion.div>
    </motion.section>
  );
};

export default ContactUs;
