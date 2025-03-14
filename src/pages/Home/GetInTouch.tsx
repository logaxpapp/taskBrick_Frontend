import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';

import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaPaperPlane } from 'react-icons/fa';




const GetInTouch: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className="w-full bg-100 py-8 md:py-12 flex flex-col items-center justify-center">
      {/* Heading & Subtext */}
      <div className="max-w-6xl mx-auto text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4"
        >
          Get in touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-sm md:text-xl max-w-2xl mx-auto mb-12"
        >
          Need assistance? Reach out to us via email or phone, or visit our office. We're here to help you with any questions or support you need.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 rounded-lg p-6 bg-white/90 backdrop-blur-md border border-white/20">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md rounded-xl shadow  p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <FaEnvelope className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-700">support@taskbricks.com</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <FaPhone className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-700">615-554-3592</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-700">1108 Berry Street, Old Hickory, Tennessee</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 bg-white/90 backdrop-blur-md rounded-xl shadow  p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tell us something</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 peer"
                  value={formData.name}
                  onChange={handleChange}
                />
                <label className="absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm bg-white px-1">
                  Your Name
                </label>
                <FaUser className="absolute right-4 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 peer"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label className="absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm bg-white px-1">
                  Your Email
                </label>
                <FaEnvelope className="absolute right-4 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <textarea
                  name="message"
                  placeholder=" "
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 peer"
                  value={formData.message}
                  onChange={handleChange}
                />
                <label className="absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-600 peer-focus:text-sm bg-white px-1">
                  Your Message
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#192bc2] text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <FaPaperPlane className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </form>
          </motion.div>
        </div>

       
      </div>
    </section>
  );
};

export default GetInTouch;