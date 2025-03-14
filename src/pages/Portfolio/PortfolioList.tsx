// File: src/components/managers/PortfolioList.tsx

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IPortfolio } from '../../api/portfolio/portfolioApi';
import { Project } from '../../api/project/projectApi';
import PortfolioItem from './PortfolioItem';

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

interface PortfolioListProps {
  portfolios: IPortfolio[];
  projects: Project[]; // we pass [] fallback from parent, so never undefined
  isDeleting: boolean;
  isUpdating: boolean;

  // Must match parent exactly
  onEditPortfolio: (id: string, name: string, desc: string) => Promise<void>;

  onDeletePortfolio: (id: string) => void;
  onToggleProject: (portfolioId: string, projectId: string, isChecked: boolean) => Promise<void>;
  onSelectPortfolio: (id: string) => void;
}

const PortfolioList: React.FC<PortfolioListProps> = ({
  portfolios,
  projects,
  isDeleting,
  isUpdating,
  onEditPortfolio,
  onDeletePortfolio,
  onToggleProject,
  onSelectPortfolio,
}) => {
  if (portfolios.length === 0) {
    return <p className="text-gray-600">No portfolios found.</p>;
  }

  return (
    <AnimatePresence>
      {portfolios.map((portfolio) => (
        <motion.div
          key={portfolio._id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <div
            onClick={() => onSelectPortfolio(portfolio._id)}
            className="cursor-pointer"
          >
            <PortfolioItem
              portfolio={portfolio}
              projects={projects}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
              onDelete={onDeletePortfolio}
              // Notice child expects onUpdate: (id, name, desc) => Promise<void> as well
              onUpdate={onEditPortfolio}
              onToggleProject={onToggleProject}
            />
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default PortfolioList;
