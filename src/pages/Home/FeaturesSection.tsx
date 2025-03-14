
import { motion } from 'framer-motion'

// Replace these with your actual imports
import Sprint from '../../assets/images/sprint.svg'
import Project from '../../assets/images/projext.svg'
import Task from '../../assets/images/task.svg'
import Report from '../../assets/images/reports.svg'


const FeaturesSection = () => {
  // A simple Framer Motion variant you can reuse for fade-up
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }
  return (
    <section className="bg-white py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* 1) Meetings & Sprint Management */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-16"
        >
          {/* Left column: heading, text, button */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meetings &amp; Sprint Management
            </h2>
            <p className="text-gray-600 mb-6">
              Seamlessly plan and manage your meetings and sprints ensuring 
              your team stays focused and aligned towards your business goals.
            </p>
            <a
              href="#"
              className="inline-block bg-[#192bc2] text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Learn More
            </a>
          </div>

          {/* Right column: image/placeholder with tags */}
          <div className="order-1 md:order-2 flex justify-center relative">
          <img src={Sprint} alt="Sprint" className=" object-contain" />
            
          </div>
        </motion.div>
        {/* 2) Project Management */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-16"
        >
          {/* Left column: image/placeholder with tags */}
          <div className="flex justify-center relative">
        <img src={Project} alt="Project" className=" object-contain" />
          </div>

          {/* Right column: heading, text, button */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Project Management
            </h2>
            <p className="text-gray-600 mb-6">
              Stay on top of your projects by tracking milestones, deadlines, 
              and deliverables to ensure overall project success.
            </p>
            <a
              href="#"
              className="inline-block bg-[#192bc2] text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* 3) Tasks Management */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-16"
        >
          {/* Left column: heading, text, button */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tasks Management
            </h2>
            <p className="text-gray-600 mb-6">
              Task management helps you organize and prioritize your work, 
              track progress, and collaborate with your team.
            </p>
            <a
              href="#"
              className="inline-block bg-[#192bc2] text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Learn More
            </a>
          </div>

          {/* Right column: image/placeholder with tags */}
          <div className="order-1 md:order-2 flex justify-center relative">
            {/* Use your Task image/SVG below */}
            <img src={Task} alt="Task" className=" object-contain" />
          </div>
        </motion.div>

        {/* 4) Reports Generation */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 items-center gap-8"
        >
          {/* Left column: image/placeholder with tags */}
          <div className="flex justify-center relative">
            {/* Use your Report image/SVG below */}
            <img src={Report} alt="Report" className=" object-contain" />
          </div>

          {/* Right column: heading, text, button */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Reports Generation
            </h2>
            <p className="text-gray-600 mb-6">
              Our reports generation tool helps you generate detailed reports 
              about your team’s performance and make data-driven decisions.
            </p>
            <a
              href="#"
              className="inline-block bg-[#192bc2] text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
