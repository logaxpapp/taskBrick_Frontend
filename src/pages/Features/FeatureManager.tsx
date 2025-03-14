// File: src/components/FeatureManager/FeatureManager.tsx

import React, { useState, useMemo } from 'react';
import {
  useListFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useActivateFeatureMutation,
  useDeactivateFeatureMutation,
  useDeleteFeatureMutation,
  Feature,
} from '../../api/subscription/subscriptionApi';

import { motion } from 'framer-motion';
import {
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import FeatureModal, { FeatureFormData } from './FeatureModal';
import FeatureCard from './FeatureCard';
import FeatureListRow from './FeatureListRow';

const FeatureManager: React.FC = () => {
  // 1) Queries / Mutations
  const { data: features, isLoading, isError, refetch } = useListFeaturesQuery();
  const [createFeature] = useCreateFeatureMutation();
  const [updateFeature] = useUpdateFeatureMutation();
  const [activateFeature] = useActivateFeatureMutation();
  const [deactivateFeature] = useDeactivateFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();

  // 2) Local UI State
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'createdAt'>('name');

  // CREATE modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // EDIT modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Partial<Feature>>({});

  // 3) Filter & Sort
  const filteredAndSorted: Feature[] = useMemo(() => {
    if (!features) return [];
    let result = [...features];

    // filter by search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(lower) ||
          f.code.toLowerCase().includes(lower) ||
          (f.description || '').toLowerCase().includes(lower)
      );
    }

    // sort
    if (sortKey === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // sort by createdAt desc
      result.sort((a, b) => {
        const ta = new Date(a.createdAt ?? '').getTime();
        const tb = new Date(b.createdAt ?? '').getTime();
        return tb - ta;
      });
    }
    return result;
  }, [features, searchTerm, sortKey]);

  // 4) Handlers
  const handleCreateFeature = async (data: FeatureFormData) => {
    try {
      await createFeature({
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: true,
        isBeta: data.isBeta,
      }).unwrap();
      setShowCreateModal(false);
      refetch();
    } catch (err: any) {
      alert(`Error creating feature: ${err.message || err}`);
    }
  };

  const handleEditFeature = async (featId: string, data: FeatureFormData) => {
    try {
      await updateFeature({
        id: featId,
        updates: {
          name: data.name,
          code: data.code,
          description: data.description,
          isBeta: data.isBeta,
        },
      }).unwrap();
      setShowEditModal(false);
      refetch();
    } catch (err: any) {
      alert(`Error updating feature: ${err.message || err}`);
    }
  };

  const handleActivate = async (featureId: string) => {
    try {
      await activateFeature(featureId).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error activating feature: ${err.message || err}`);
    }
  };

  const handleDeactivate = async (featureId: string) => {
    try {
      await deactivateFeature(featureId).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error deactivating feature: ${err.message || err}`);
    }
  };

  const handleDelete = async (featureId: string) => {
    try {
      await deleteFeature(featureId).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error deleting feature: ${err.message || err}`);
    }
  };

  // 5) Rendering
  if (isLoading) {
    return (
      <div className="p-8 animate-pulse text-xl text-gray-600">
        Loading Features...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-8 text-red-500 text-xl">
        Error loading features. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-10 space-y-6 relative">
      {/* Header / Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feature Management</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center border px-2 rounded bg-white">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search features..."
              className="outline-none px-2 py-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="text-sm border rounded px-2 py-1 bg-white"
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value === 'createdAt' ? 'createdAt' : 'name')
            }
          >
            <option value="name">Name</option>
            <option value="createdAt">Newest</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1">
            <button
              className={`p-1 rounded hover:bg-gray-100 ${
                viewMode === 'cards' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setViewMode('cards')}
            >
              <Squares2X2Icon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className={`p-1 rounded hover:bg-gray-100 ${
                viewMode === 'list' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="
              bg-blue-600 text-white
              px-4 py-2 rounded-md 
              hover:bg-blue-700 transition
            "
          >
            + New Feature
          </button>
        </div>
      </div>

      {/* Main Content */}
      {filteredAndSorted.length === 0 ? (
        <p className="text-gray-500">No features match your filters/search.</p>
      ) : viewMode === 'cards' ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((feat) => (
            <FeatureCard
              key={feat._id}
              feature={feat}
              onEdit={(f) => {
                setEditData(f);
                setShowEditModal(true);
              }}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Feature Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Beta?
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((feat) => (
                <FeatureListRow
                  key={feat._id}
                  feature={feat}
                  onEdit={(f) => {
                    setEditData(f);
                    setShowEditModal(true);
                  }}
                  onDelete={handleDelete}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE Modal */}
      <FeatureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Feature"
        onSubmit={(data) => handleCreateFeature(data)}
      />

      {/* EDIT Modal */}
      <FeatureModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Feature"
        initialData={{
          name: editData.name,
          code: editData.code,
          description: editData.description,
          isBeta: editData.isBeta,
        }}
        onSubmit={(data) => {
          if (!editData._id) return;
          handleEditFeature(editData._id, data);
        }}
      />
    </div>
  );
};

export default FeatureManager;
