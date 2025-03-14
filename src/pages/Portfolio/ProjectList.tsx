// File: src/components/managers/ProjectList.tsx
import React from 'react';
import { Project } from '../../api/project/projectApi';

interface ProjectListProps {
    projects: Project[];
    orgName?: string;       // default to empty string if none
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, orgName = '' }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="mt-10 bg-white shadow p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Projects in {orgName}</h3>
        <p className="text-gray-600">No projects found for this org.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Projects in {orgName}</h3>
      <ul className="list-disc list-inside space-y-1">
        {projects.map((proj) => (
          <li key={proj._id}>
            <span className="font-medium text-blue-700">{proj.name}</span>
            <span className="text-gray-600"> (Key: {proj.key})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
