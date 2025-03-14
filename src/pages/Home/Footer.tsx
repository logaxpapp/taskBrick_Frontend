// File: src/components/Footer.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Logo from "../../assets/images/logo-2.png";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#f6fff8] text-gray-800 py-12 px-4 md:px-12 border-t border-gray-200" // Light background, border
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Section 1: Logo & Description */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col items-start"
        >
          <img src={Logo} alt="TaskBricks Logo" className="h-10 w-auto mb-4" />
          <p className="text-sm text-gray-600">
            Your all-in-one solution for project management. Streamline your workflow, collaborate effectively, and deliver results.
          </p>
        </motion.div>

        {/* Section 2: Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h4 className="font-semibold text-lg mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600 transition duration-300">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600 transition duration-300">Services</a></li>
            <li><a href="#" className="hover:text-blue-600 transition duration-300">Careers</a></li>
            <li><a href="#" className="hover:text-blue-600 transition duration-300">Contact</a></li>
          </ul>
        </motion.div>

        {/* Section 3: Social Media */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="md:col-span-1 lg:col-span-1"
        >
            <h4 className="font-semibold text-lg mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition duration-300"><FaFacebook size={24} /></a>
              <a href="#" className="hover:text-twitter-500 transition duration-300"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-blue-600 transition duration-300"><FaLinkedin size={24} /></a>
              <a href="#" className="hover:text-red-500 transition duration-300"><FaInstagram size={24} /></a>
            </div>
        </motion.div>



        {/* Section 4: Subscription */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
           className="md:col-span-2 lg:col-span-1"
        >
          <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
            <div className="relative mb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
              />
              <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-300 w-full">
              Subscribe
            </button>
             <p className="text-xs text-gray-500 mt-2">
            By subscribing, you agree to our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>

        </motion.div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-8 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} logaXP. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;