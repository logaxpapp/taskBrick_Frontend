import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Pie, Doughnut, Line, Radar, PolarArea } from 'react-chartjs-2';

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const scaleOnHover = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

// Chart Data
const taskStatusData = {
  labels: ['Backlog', 'In Progress', 'Done'],
  datasets: [{ label: 'Tasks', data: [12, 7, 15], backgroundColor: ['#f87171', '#fbbf24', '#34d399'] }],
};

const riskData = {
  labels: ['Low', 'Medium', 'High'],
  datasets: [{ label: 'Risk Level', data: [20, 10, 5], backgroundColor: ['#34d399', '#fbbf24', '#f87171'] }],
};

const priorityData = {
  labels: ['Low', 'Medium', 'High'],
  datasets: [{ label: 'Priority Level', data: [5, 15, 25], backgroundColor: ['#60a5fa', '#fbbf24', '#f87171'] }],
};

const projectData = {
  labels: ['Project A', 'Project B', 'Project C'],
  datasets: [{ label: 'Projects', data: [30, 20, 50], borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.3)', fill: true, tension: 0.3 }],
};

const projectProgressData = {
  labels: ['Week 1', 'Week 2', 'Week 3'],
  datasets: [{ label: 'Project Progress', data: [25, 50, 75], borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.3)', fill: true }],
};

const projectRiskData = {
  labels: ['Low', 'Medium', 'High'],
  datasets: [{ label: 'Project Risk', data: [10, 15, 5], backgroundColor: ['#34d399', '#fbbf24', '#f87171'] }],
};

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
};

const Summary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
      {[ // List of charts for mapping
        { title: 'Projects (Line)', Component: Line, data: projectData },
        { title: 'Project Progress (Radar)', Component: Radar, data: projectProgressData },
        { title: 'Project Risks (PolarArea)', Component: PolarArea, data: projectRiskData },
        { title: 'Task Status (Bar)', Component: Bar, data: taskStatusData },
        { title: 'Risk Levels (Pie)', Component: Pie, data: riskData },
        { title: 'Priority Levels (Doughnut)', Component: Doughnut, data: priorityData },
      ].map(({ title, Component, data }, index) => (
        <motion.div
          key={index}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover="hover"
          className="bg-white p-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
          <motion.div variants={scaleOnHover}>
            <Component data={data} options={options} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default Summary;
