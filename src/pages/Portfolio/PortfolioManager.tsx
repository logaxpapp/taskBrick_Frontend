/*****************************************************************
 * File: src/components/managers/PortfolioManager.tsx
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { FaPlus, FaFolderOpen } from 'react-icons/fa';
import {
  useListPortfoliosQuery,
  useCreatePortfolioMutation,
  useDeletePortfolioMutation,
  useUpdatePortfolioMutation,
  useGetPortfolioSummaryQuery,
  useAddProjectToPortfolioMutation,
  useRemoveProjectFromPortfolioMutation,
  IPortfolio,
} from '../../api/portfolio/portfolioApi';
import {
  useListProjectsQuery,
  Project,
} from '../../api/project/projectApi';

import { useSelectedOrgName } from '../../contexts/OrgContext';
import { useAppSelector } from '../../app/hooks/redux';

import CreatePortfolioModal from './CreatePortfolioModal';
import PortfolioList from './PortfolioList';
import PortfolioSummary from './PortfolioSummary';
import ProjectList from './ProjectList';

const PortfolioManager: React.FC = () => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const selectedOrgName = useSelectedOrgName(); // might be string | null

  // Fetch projects
  const { data: projects } = useListProjectsQuery(selectedOrgId || undefined);

  // Fetch portfolios
  const {
    data: portfolios,
    refetch: refetchPortfolios,
    isLoading: loadingPortfolios,
  } = useListPortfoliosQuery();

  // RTK mutations
  const [createPortfolio, { isLoading: creatingPortfolio }] = useCreatePortfolioMutation();
  const [deletePortfolio, { isLoading: deletingPortfolio }] = useDeletePortfolioMutation();
  const [updatePortfolio, { isLoading: updatingPortfolio }] = useUpdatePortfolioMutation();
  const [addProjectToPortfolio] = useAddProjectToPortfolioMutation();
  const [removeProjectFromPortfolio] = useRemoveProjectFromPortfolioMutation();

  // CREATE MODAL
  const [showCreateModal, setShowCreateModal] = useState(false);

  // SELECTED PORTFOLIO (for summary)
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const { data: summaryData, refetch: refetchSummary } = useGetPortfolioSummaryQuery(
    selectedPortfolioId || '',
    { skip: !selectedPortfolioId }
  );

  useEffect(() => {
    if (selectedPortfolioId) {
      refetchSummary();
    }
  }, [selectedPortfolioId, refetchSummary]);

  // CREATE a new portfolio
  async function handleCreate(name: string, desc: string, projectIds: string[]) {
    try {
      await createPortfolio({ name, description: desc, projectIds }).unwrap();
      setShowCreateModal(false);
      refetchPortfolios();
    } catch (err) {
      console.error('Failed to create portfolio:', err);
    }
  }

  // DELETE a portfolio
  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) return;
    try {
      await deletePortfolio(id).unwrap();
      if (selectedPortfolioId === id) {
        setSelectedPortfolioId(null);
      }
      refetchPortfolios();
    } catch (err) {
      console.error('Failed to delete portfolio:', err);
    }
  }

  // EDIT a portfolio (rename, desc)
  // We'll keep the signature (id, newName, newDesc) => Promise<void>
  async function handleEdit(id: string, newName: string, newDesc: string): Promise<void> {
    try {
      await updatePortfolio({
        id,
        updates: { name: newName, description: newDesc },
      }).unwrap();
      refetchPortfolios();
    } catch (err) {
      console.error('Failed to update portfolio:', err);
    }
  }

  // TOGGLE a project in a portfolio
  async function handleToggleProject(
    portfolioId: string,
    projectId: string,
    isChecked: boolean
  ) {
    try {
      if (isChecked) {
        await addProjectToPortfolio({ portfolioId, projectId }).unwrap();
      } else {
        await removeProjectFromPortfolio({ portfolioId, projectId }).unwrap();
      }
      refetchPortfolios();
      if (selectedPortfolioId === portfolioId) {
        refetchSummary();
      }
    } catch (err) {
      console.error('Failed to toggle project in portfolio:', err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio Manager</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          <span>New Portfolio</span>
        </button>
      </div>

      {/* Create Modal */}
      <CreatePortfolioModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
        projects={projects ?? []}  // fallback
        isCreating={creatingPortfolio}
      />

      {/* Portfolio List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <FaFolderOpen className="text-yellow-600" />
          <span>Existing Portfolios</span>
        </h2>
        {loadingPortfolios && <p className="text-gray-500">Loading portfolios...</p>}

        <PortfolioList
          portfolios={portfolios ?? []}    // fallback
          projects={projects ?? []}        // fallback
          isDeleting={deletingPortfolio}
          isUpdating={updatingPortfolio}
          onDeletePortfolio={handleDelete}
          onEditPortfolio={handleEdit}
          onToggleProject={handleToggleProject}
          onSelectPortfolio={(id) => setSelectedPortfolioId(id)}
        />
      </div>

      {/* Portfolio Summary */}
      {selectedPortfolioId && summaryData && (
        <PortfolioSummary
          portfolio={portfolios?.find((p) => p._id === selectedPortfolioId)}
          summaryData={summaryData}
        />
      )}

      {/* Projects in Org */}
      {projects && (
        <ProjectList 
          projects={projects} 
          orgName={selectedOrgName ?? ''} 
        />
      )}
    </div>
  );
};

export default PortfolioManager;
