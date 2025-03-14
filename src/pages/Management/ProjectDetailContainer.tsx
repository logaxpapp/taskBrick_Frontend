/*****************************************************************
 * File: src/pages/ProjectDetailContainer.tsx
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { useListProjectsQuery, Project } from '../../api/project/projectApi';
import { useSelectedOrgId, useSelectedOrgName } from '../../contexts/OrgContext';
import ProjectDetail from './ProjectDetail';
import PreDashboard from '../auth/PreDashboard';
import { useAppSelector } from '../../app/hooks/redux';
import { setSelectedOrg } from '../../app/store/slices/organizationSlice';
const ProjectDetailContainer: React.FC = () => {
  // 1) We get the organization ID from context (or from a prop).
     // 1) Grab the selectedOrgName from Redux
     const { selectedOrgId } = useAppSelector((state) => state.organization);
  const selectedOrgName = useSelectedOrgName();

  // 2) Fetch all projects for this org using RTK Query
  const {
    data: projects,
    isLoading: loadingProjects,
    isError,
    refetch: refetchProjects,
  } = useListProjectsQuery(selectedOrgId || undefined);

  // 3) Keep track of the currently selected project in local state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 4) Whenever we get a fresh list of projects, default to the first if none chosen
  useEffect(() => {
    if (projects && projects.length > 0) {
      // If no project is selected yet, default to the first
      if (!selectedProject) {
        setSelectedProject(projects[0]);
      }
    }
  }, [projects, selectedProject]);

  // If there is no org selected or we are loading
  if (!selectedOrgId) {
    return <p>
      <PreDashboard />
    </p>;
  }
  if (loadingProjects) {
    return <p>Loading projects for org {selectedOrgId}...</p>;
  }
  if (isError) {
    return (
      <div>
        <p>
          Error loading projects.{' '}
          <button onClick={() => refetchProjects()}>Retry</button>
        </p>
      </div>
    );
  }

  // 5) Render a dropdown to allow changing the selected project
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projId = e.target.value;
    const found = projects?.find((p) => p._id === projId) || null;
    setSelectedProject(found);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">
        Projects in Organization: {selectedOrgName}
      </h2>

      {projects && projects.length > 0 ? (
        <>
          <label className="block mb-2">
            <span className="text-gray-700">Choose Project</span>
            <select
              className="mt-  border-gray-300 "
              value={selectedProject?._id || ''}
              onChange={handleSelectChange}
            >
              {projects.map((p: Project) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>
          </label>

          {/* If we have a selected project, show the ProjectDetail page */}
          {selectedProject ? (
            <ProjectDetail project={selectedProject} />
          ) : (
            <p>No project selected.</p>
          )}
        </>
      ) : (
        <p>No projects found for this organization.</p>
      )}
    </div>
  );
};

export default ProjectDetailContainer;
