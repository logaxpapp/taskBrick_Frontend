/*****************************************************************
 * File: src/pages/ProjectDetail.tsx
 *****************************************************************/
import React, { useState } from 'react';
import MilestoneManager from '../Milestone/MilestoneManager';
import StatusReportManager from '../StatusReport/StatusReportManager';
import ProjectBudgetManager from '../ProjectBudget/ProjectBudgetManager';
import ResourceAllocationManager from '../ResourceAllocation/ResourceAllocationManager';
import TimesheetManager from '../Timesheet/TimesheetManager';
import ProjectRiskManager from '../ProjectRisk/ProjectRiskManager';
import ProjectTimesheetManager from '../ProjectTimesheet/ProjectTimesheetManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

// Suppose your Project type from your RTK Query is:
export interface Project {
  _id: string;
  name: string;
  key: string;
  // etc...
}

interface ProjectDetailProps {
  project: Project; // pass the entire project object, not just the ID
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('milestones');

  // Grab the logged-in user from Redux if needed
  const user = useSelector((state: RootState) => state.auth.user);

  // The ID is now from `project._id`
  const projectId = project._id;

  const tabs = [
    { id: 'milestones', label: 'Milestones' },
    { id: 'statusReports', label: 'Status Reports' },
    { id: 'budget', label: 'Budget' },
    { id: 'allocation', label: 'Resource Allocation' },
    { id: 'timesheets', label: 'Timesheets' },
    { id: 'risks', label: 'Risks' },
    { id: 'projectTimesheet', label: 'Project Timesheet' },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        Project Detail: <span className="text-blue-600">{project.name}</span>{' '}
        <span className="text-sm text-gray-500">(ID: {project._id})</span>
      </h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'milestones' && (
          <MilestoneManager selectedProjectId={projectId} />
        )}
        {activeTab === 'statusReports' && (
          <StatusReportManager selectedProjectId={projectId} />
        )}
        {activeTab === 'budget' && <ProjectBudgetManager selectedProjectId={projectId} />}
        {activeTab === 'allocation' && (
          <ResourceAllocationManager selectedProjectId={projectId} />
        )}
        {activeTab === 'timesheets' && (
          <TimesheetManager selectedProjectId={projectId} currentUserId={user._id} />
        )}
        {activeTab === 'risks' && <ProjectRiskManager selectedProjectId={projectId} />}
        {activeTab === 'projectTimesheet' && (
          <ProjectTimesheetManager selectedProjectId={projectId} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
