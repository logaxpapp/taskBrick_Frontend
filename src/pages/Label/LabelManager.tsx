// File: src/pages/LabelManager.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useListLabelsQuery, Label } from '../../api/label/labelApi';
import PreDashboard from '../auth/PreDashboard';
import { useAppSelector } from '../../app/hooks/redux';

// Sub-components
import LabelList from './LabelList';
import LabelCreateModal from './LabelCreateModal';
import LabelEditModal from './LabelEditModal';

const LabelManager: React.FC = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

    // 1) Grab the selectedOrgName from Redux
   const { selectedOrgId } = useAppSelector((state) => state.organization);

  // Store the entire label object here
  const [editLabel, setEditLabel] = useState<Label | null>(null);

  // If no org, show fallback
  if (!selectedOrgId) {
    return (
      <div className="p-6">
        <PreDashboard />
      </div>
    );
  }

  // Fetch labels for this org
  const { data: labels, isLoading, refetch } = useListLabelsQuery(selectedOrgId);

  // Filter labels in memory
  const filteredLabels = useMemo(() => {
    if (!labels) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return labels;
    return labels.filter(
      (lbl) =>
        lbl.name.toLowerCase().includes(term) ||
        (lbl.color || '').toLowerCase().includes(term)
    );
  }, [labels, searchTerm]);

  return (
    <motion.div
      className="p-6 space-y-6 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold">Label Manager</h1>

      {/* Top bar: search + create */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Search:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            placeholder="Search labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + New Label
        </button>
      </div>

      {/* Label List */}
      <LabelList
        labels={filteredLabels}
        isLoading={isLoading}
        onRefresh={refetch}
        // Instead of passing an ID, pass the entire label
        onEdit={(label) => setEditLabel(label)}
      />

      {/* CREATE MODAL */}
      {showCreateModal && (
        <LabelCreateModal
          organizationId={selectedOrgId}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            refetch();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editLabel && (
        <LabelEditModal
          label={editLabel} // Pass the actual label object
          onClose={() => setEditLabel(null)}
          onUpdated={() => {
            refetch();
            setEditLabel(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default LabelManager;
