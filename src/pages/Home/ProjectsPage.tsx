import React from 'react'
import { motion } from 'framer-motion'

// Heroicons (outline versions)
import {
  HomeIcon,
  FolderIcon,
  EyeIcon,
  MapIcon,
  UsersIcon,
  PaintBrushIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

// 1) Define a TypeScript union type for statuses
type StatusType = 'In progress' | 'Completed' | 'Review' | 'Backlog' | 'Under Review'

// 2) Your sample project data
interface Project {
  title: string
  creator: string
  assignee: string
  reviewer: string
  status: StatusType
}

const projects: Project[] = [
  {
    title: 'UI Design and Branding for logaXP',
    creator: 'Riley Adebajo',
    assignee: 'Carl Osis',
    reviewer: 'Tinalight',
    status: 'In progress'
  },
  {
    title: 'Website Design',
    creator: 'John Smith',
    assignee: 'Max Payne',
    reviewer: 'Tinalight',
    status: 'Completed'
  },
  {
    title: 'Landing page Design',
    creator: 'Joshua Low',
    assignee: 'Tim Howard',
    reviewer: 'Emeka',
    status: 'Review'
  },
  {
    title: 'Travel agency landing page',
    creator: 'Omoye Adebajo',
    assignee: 'Phillip O',
    reviewer: 'Clark Kent',
    
    status: 'Backlog'
  },
  {
    title: 'Food Delivery App',
    creator: 'Gerry Emeka',
    assignee: 'Peter Duke',
    reviewer: 'Mason Gardner',
    status: 'Completed'
  },
  {
    title: 'Career Coaching App',
    creator: 'Nonso Okun',
    assignee: 'Yong Chen',
    reviewer: 'Gabriel W',
    status: 'In progress'
  },
  {
    title: 'Flight booking website',
    creator: 'Chris Brown',
    assignee: 'Ujah Emmanuel',
    reviewer: 'Ryan Kane',
    status: 'Review'
  }
]

// 3) Nav Links with Icons for the Sidebar
const navLinks = [
  { label: 'Dashboard', icon: HomeIcon, href: '#dashboard' },
  { label: 'My projects', icon: FolderIcon, href: '#my-projects' },
  { label: 'Views', icon: EyeIcon, href: '#views' },
  { label: 'Roadmaps', icon: MapIcon, href: '#roadmaps' },
  { label: 'Teams', icon: UsersIcon, href: '#teams' },
  // Section header in sidebar
  { label: 'Your teams', icon: null, isHeader: true },
  { label: 'Design', icon: PaintBrushIcon, href: '#design' },
  { label: 'Engineering', icon: CpuChipIcon, href: '#engineering' }
]

// 4) Framer Motion variants for the sidebar / content
const sidebarVariants = {
  hidden: { x: -80, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 }
  }
}

const contentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: 'beforeChildren',
      staggerChildren: 0.05
    }
  }
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

// 5) Helper function to color-code statuses
const renderStatusBadge = (status: StatusType) => {
  let bg = 'bg-gray-100'
  let text = 'text-gray-800'

  switch (status) {
    case 'In progress':
      bg = 'bg-blue-100'
      text = 'text-blue-600'
      break
    case 'Completed':
      bg = 'bg-green-100'
      text = 'text-green-600'
      break
    case 'Review':
    case 'Under Review':
      bg = 'bg-yellow-100'
      text = 'text-yellow-600'
      break
    case 'Backlog':
      bg = 'bg-red-100'
      text = 'text-red-600'
      break
    default:
      // fallback
      bg = 'bg-gray-100'
      text = 'text-gray-600'
  }

  return (
    <span className={`inline-block px-2 py-1 rounded-md text-sm font-semibold ${bg} ${text}`}>
      {status}
    </span>
  )
}

const ProjectsPage: React.FC = () => {
  return (
    <div className='bg-[#F8F9FA] text-white py-10 md:py-20 overflow-hidden'>
    <div className="max-h-screen flex bg-gry-100 text-gray-800 container mx-auto">
      {/*
        SIDEBAR
        Using Framer Motion to animate it in from the left.
      */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="show"
        className="hidden md:flex flex-col w-64 bg-white text-gray-700 shadow-md"
      >
        {/* BRAND */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="font-extrabold text-xl text-blue-600">TaskBricks</h1>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-4">
            {navLinks.map((item, i) =>
              item.isHeader ? (
                // Section header text
                <li key={i} className="mt-6 mb-2 text-xs uppercase text-gray-400 font-semibold">
                  {item.label}
                </li>
              ) : (
                <li key={i}>
                  <a
                    href={item.href}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {item.icon && (
                      <item.icon className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* USER PROFILE AT BOTTOM */}
        <div className="p-4 border-t border-gray-200 flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/32"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-700">Chris Bajo</p>
          </div>
        </div>
      </motion.aside>

      {/*
        MAIN CONTENT
        Another motion wrapper for fade-in/stagger.
      */}
      <motion.main
        variants={contentVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col"
      >
        {/* TOP BAR / HEADING */}
        <div className="p-6 text-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="font-extrabold text-xl md:text-4xl text-blue-600">CHOOSE FROM TEMPLATE</span>
          </h2>
          <p className="text-sm text-gray-500">
            Start by selecting one of our prebuilt templates for your new project.
          </p>
        </div>

        {/* WRAPPER FOR TABLE CARD */}
        <div className="flex-1 p-6">
          <div className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Header: Filters + Button */}
            <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Projects</span> &gt; All
                </p>
                <div className="mt-2 space-x-4">
                  {['All', 'Backlogs', 'In progress', 'Under Review', 'Completed'].map((tab, idx) => (
                    <button
                      key={idx}
                      className="inline-block text-sm py-1 px-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <button className="bg-[#192bc2] hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                + New Task
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewer
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={contentVariants}
                  className="divide-y divide-gray-100"
                >
                  {projects.map((proj, i) => (
                    <motion.tr
                      key={i}
                      variants={rowVariants}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {proj.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {proj.creator}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {proj.assignee}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {proj.reviewer}
                      </td>
                      <td className="px-6 py-4 text-sm">{renderStatusBadge(proj.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <button className="hover:text-gray-600">&middot;&middot;&middot;</button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
    </div>
  )
}

export default ProjectsPage
