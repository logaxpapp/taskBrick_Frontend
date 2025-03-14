import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  HiCheckCircle,
  HiOutlineLightningBolt,
  HiOutlineCalendar,
  HiOutlineClock,
} from 'react-icons/hi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Animation variants for container + items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectSummary: React.FC = () => {
  // Mock data for top small stat cards
  const topStats = [
    {
      label: '0 completed',
      subtitle: 'in the last 7 days',
      icon: <HiCheckCircle className="text-green-500 text-2xl" />,
    },
    {
      label: '0 updated',
      subtitle: 'in the last 7 days',
      icon: <HiOutlineLightningBolt className="text-yellow-500 text-2xl" />,
    },
    {
      label: '0 created',
      subtitle: 'in the last 7 days',
      icon: <HiOutlineCalendar className="text-blue-500 text-2xl" />,
    },
    {
      label: '0 due soon',
      subtitle: 'in the next 7 days',
      icon: <HiOutlineClock className="text-purple-500 text-2xl" />,
    },
  ];

  // Status Overview (bar chart)
  const statusData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Issues',
        data: [0, 0, 0], // mock
        backgroundColor: ['#60a5fa', '#fbbf24', '#34d399'], // Tailwind: blue-400, amber-400, green-400
      },
    ],
  };
  const statusOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  // Priority Breakdown (pie chart)
  const priorityData = {
    labels: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
    datasets: [
      {
        label: 'Priority',
        data: [0, 0, 0, 0, 0], // mock
        backgroundColor: [
          '#ef4444', // red-500
          '#f97316', // orange-500
          '#fbbf24', // amber-400
          '#3b82f6', // blue-500
          '#10b981', // green-500
        ],
      },
    ],
  };

  // Type of Work (doughnut)
  const typeData = {
    labels: ['Epic', 'Task', 'Subtask'],
    datasets: [
      {
        label: 'Types of Work',
        data: [0, 0, 0], // mock
        backgroundColor: ['#6366f1', '#06b6d4', '#a855f7'], // indigo-500, cyan-500, purple-500
      },
    ],
  };

  // Team workload (horizontal bar)
  const workloadData = {
    labels: ['Unassigned', 'User1', 'User2'],
    datasets: [
      {
        label: 'Work distribution',
        data: [0, 0, 0], // mock
        backgroundColor: '#6366f1', // indigo-500
      },
    ],
  };
  const workloadOptions = {
    indexAxis: 'y' as const, // horizontal bar
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, beginAtZero: true },
      y: { grid: { display: false } },
    },
  };

  return (
    <motion.div 
      className="space-y-6 p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Project Title */}
      <motion.h2 
        className="text-2xl font-semibold "
        variants={itemVariants}
      >
        ProFixer <small className="text-sm text-gray-500">Project</small>
        <span className="text-sm text-gray-400 ml-2">Last updated: 12:00 PM</span>
      </motion.h2>

      {/* Top Stats Row */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        {topStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow flex items-center space-x-3">
            {stat.icon}
            <div>
              <p className="text-lg font-semibold">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3-Column Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Status overview */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Status overview</h3>
          <p className="text-sm text-gray-400">
            The status overview for this project will display here after you create some issues.
          </p>
          <div className="h-36">
            <Bar data={statusData} options={statusOptions} />
          </div>
        </div>

        {/* No activity */}
        <div className="bg-white p-4 rounded shadow flex flex-col justify-center items-center">
          <p className="text-md font-medium text-gray-600 mb-2">No activity yet</p>
          <p className="text-sm text-gray-500 text-center">
            Create a few issues and invite some teammates to your project <br/>
            to see your project activity.
          </p>
        </div>

        {/* Priority breakdown */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Priority breakdown</h3>
          <p className="text-sm text-gray-400">
            Get a holistic view of how work is being prioritized.
          </p>
          <div className="h-36 flex items-center justify-center">
            <Pie data={priorityData} />
          </div>
        </div>

        {/* Type of work */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Types of work</h3>
          <p className="text-sm text-gray-400">
            Create some issues to view a breakdown of total work by issue type.
          </p>
          <div className="h-36 flex items-center justify-center">
            <Doughnut data={typeData} />
          </div>
        </div>

        {/* Team workload */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Team workload</h3>
          <p className="text-sm text-gray-400">
            To monitor the capacity of your team, create some issues.
          </p>
          <div className="h-36">
            <Bar data={workloadData} options={workloadOptions} />
          </div>
        </div>

        {/* Epic progress */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Epic progress</h3>
          <p className="text-sm text-gray-400">
            Use epics to track larger initiatives in your project. 
            Create epics to see progress here.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectSummary;
