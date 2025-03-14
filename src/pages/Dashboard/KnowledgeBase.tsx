// File: src/pages/KnowledgeBase.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaBookOpen, FaCogs, FaTasks, FaChartLine, FaBug } from 'react-icons/fa'; // Import icons

// Example images (replace with your actual image paths):
import ProjectsImage from '../../assets/images/image1.png'; // Example image
import IssuesManagementImage from '../../assets/images/image2.png';
import TaskManagementImage from '../../assets/images/image3.png'; // Example image
import SprintImage from '../../assets/images/image6.png'; // Example image
import ReportsImage from '../../assets/images/reports.png'; // Example image
import IssueTypes from  '../../assets/images/undraw_online-collaboration_xon8.png';
import Watcher from  '../../assets/images/task.png';
import CommentMangement from  '../../assets/images/image4.png';

interface KbItem {
    title: string;
    description: string;
    imgSrc: string;
    link: string;
    icon: React.ComponentType; // Add icon property
}

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        }
    },
};

const KnowledgeBase: React.FC = () => {
    const navigate = useNavigate();

    const kbItems: KbItem[] = [
        {
            title: 'Projects',
            description: 'Learn how to create, organize, and manage your projects to keep the team on track.',
            imgSrc: ProjectsImage, // Use the imported image
            link: '/docs/projects', // Example link
            icon: FaBookOpen, // Example Icon
        },
        {
            title: 'Issues Management',
            description: 'Track bugs and tasks effectively, from creation to resolution, with best practices.',
            imgSrc: IssuesManagementImage,
            link: '/docs/issues',
            icon: FaBug,
        },
        {
            title: 'Task Management',
            description: 'Stay on top of daily tasks, assign responsibilities, and ensure timely completion.',
            imgSrc: TaskManagementImage,
            link: '/docs/tasks',
            icon: FaTasks,
        },
        {
            title: 'Sprint Planning',
            description: 'Master sprint creation, backlog refinement, and agile workflows for iterative success.',
            imgSrc: SprintImage,
            link: '/docs/sprints',
            icon: FaCogs,
        },
        {
            title: 'Reports & Analytics',
            description: 'Visualize progress, generate custom reports, and gather insights on team performance.',
            imgSrc: ReportsImage,
            link: '/docs/reports',
            icon: FaChartLine
        },
        {
            title: 'Issue Types',
            description: 'Understand different issue types and how to utilize them effectively in your projects.',
            imgSrc: IssueTypes,
            link: '/docs/issue-types',
            icon: FaBug
        },
        {
            title: 'Watcher Management',
            description: 'Learn how to manage watchers on issues to keep stakeholders informed.',
            imgSrc: Watcher,
            link: '/docs/watchers',
            icon: FaTasks
        },
        {
            title: 'Comment Management',
            description: 'Best practices for managing comments on issues to enhance collaboration.',
            imgSrc: CommentMangement,
            link: '/docs/comments',
            icon: FaBookOpen
        }
    ];


    return (
        <AnimatePresence>
            <motion.main
                className="bg-gray-100 min-h-screen flex flex-col"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
            >
                {/* Hero Section */}
                <motion.section
                    variants={itemVariants}
                    className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20 md:py-32 overflow-hidden"
                >
                    <div className="absolute inset-0 z-0">
                        {/* You can replace this with a subtle background image or pattern if desired */}
                        <div className="absolute inset-0 bg-black opacity-20"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                            TaskBrick Knowledge Base
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Explore in-depth articles and resources to master every aspect of
                            TaskBrick. From project creation to advanced reports—dive in and
                            discover more!
                        </p>
                        <motion.button
                            onClick={() => navigate('/docs')} // Replace with your main docs route
                            className="px-8 py-3 rounded-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Go to Main Docs
                        </motion.button>
                    </div>
                </motion.section>

                {/* Featured Guides Section */}
                <motion.section
                    variants={itemVariants}
                    className="max-w-7xl mx-auto px-6 md:px-8 py-16"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Explore Our Guides
                        </h2>
                        <p className="text-lg text-gray-600 mt-4">
                            Browse essential categories to get the help you need quickly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                       <AnimatePresence>
                        {kbItems.map((item, idx) => {
                            const Icon = item.icon; // Get the icon component
                            return (
                            <motion.div
                                key={item.link}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all"
                            >
                                <a href={item.link} className="block h-full">
                                    <div className="relative h-56 overflow-hidden">  {/* Increased image height */}
                                         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors duration-300"></div>
                                        <img
                                            src={item.imgSrc}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />

                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center mb-2">
                                            <Icon />  
                                            <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 line-clamp-3 mb-4">
                                            {item.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-end text-blue-600">
                                             <span className="font-medium group-hover:underline">Read More</span>
                                            <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        )})}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Additional Articles Section */}
                <motion.section
                    variants={itemVariants}
                    className="max-w-7xl mx-auto px-6 md:px-8 py-16 bg-gray-100"  // Added background
                >
                    <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
                        <div className="md:flex md:items-center md:justify-between mb-8">  {/* Increased bottom margin */}
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Additional Articles & Tips
                                </h3>
                                <p className="text-lg text-gray-600 mt-2">  {/* Increased text size */}
                                    Delve deeper into advanced use-cases, best practices, and more.
                                </p>
                            </div>
                            <motion.button
                                onClick={() => navigate('/docs/articles')}  // Replace with your articles route
                                className="mt-6 md:mt-0 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors shadow-md flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Browse Knowledge Articles
                                <FaArrowRight className="ml-2" />
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Example Additional Articles (Replace with your data) */}
                            <motion.div whileHover={{ y: -5 }} className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                    Project Templates
                                </h4>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Kickstart new projects with curated templates for different
                                    industries.
                                </p>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }}  className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                    Complex Permissions
                                </h4>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Learn to configure advanced roles and permissions for enterprise
                                    setups.
                                </p>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }}  className="p-6 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                                    Automation & Webhooks
                                </h4>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    Automate repetitive tasks and integrate external tools using
                                    webhooks & triggers.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            </motion.main>
        </AnimatePresence>
    );
};

export default KnowledgeBase;