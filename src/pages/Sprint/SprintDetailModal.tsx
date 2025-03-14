// File: src/pages/SprintDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetSprintQuery,
  useUpdateSprintMutation,
  useStartSprintMutation,
  useCompleteSprintMutation,
  Sprint,
} from '../../api/sprint/sprintApi';
import RetrospectiveManager from './RetrospectiveManager';

import {
  FaArrowLeft,
  FaPlay,
  FaCheck,
  FaSave,
  FaInfoCircle,
  FaSyncAlt,
  FaClipboardList,
} from 'react-icons/fa';

type DetailTab = 'info' | 'retro' | 'review';

const SprintDetailPage: React.FC = () => {
  // For route param: /dashboard/sprints/:sprintId
  const { sprintId } = useParams<{ sprintId: string }>();
  const navigate = useNavigate();

  // RTK Query
  const {
    data: sprint,
    isLoading,
    isError,
    refetch,
  } = useGetSprintQuery(sprintId!, { skip: !sprintId });

  const [updateSprint] = useUpdateSprintMutation();
  const [startSprint] = useStartSprintMutation();
  const [completeSprint] = useCompleteSprintMutation();

  // Current tab
  const [activeTab, setActiveTab] = useState<DetailTab>('info');

  // Local form fields for "info" tab
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'PLANNED' | 'ACTIVE' | 'CLOSED'>('PLANNED');

  // Additional local fields for "review" tab
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [retrospectiveNotes, setRetrospectiveNotes] = useState('');

  // Populate from sprint data
  useEffect(() => {
    if (sprint) {
      setName(sprint.name);
      setGoal(sprint.goal || '');
      setStatus(sprint.status);
      setStartDate(sprint.startDate ? sprint.startDate.slice(0, 10) : '');
      setEndDate(sprint.endDate ? sprint.endDate.slice(0, 10) : '');
      setReviewFeedback(sprint.reviewFeedback || '');
      setRetrospectiveNotes(sprint.retrospectiveNotes || '');
    }
  }, [sprint]);

  async function handleSaveInfo() {
    if (!sprint) return;
    try {
      await updateSprint({
        id: sprint._id,
        updates: {
          name: name.trim(),
          goal: goal.trim() || null,
          startDate: startDate || null,
          endDate: endDate || null,
          status,
        },
      }).unwrap();
      refetch();
      alert('Sprint info updated!');
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

  async function handleStart() {
    if (!sprint) return;
    try {
      await startSprint(sprint._id).unwrap();
      refetch();
      alert('Sprint started');
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

  async function handleComplete() {
    if (!sprint) return;
    try {
      await completeSprint(sprint._id).unwrap();
      refetch();
      alert('Sprint completed');
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

  async function handleSaveReview() {
    if (!sprint) return;
    try {
      // We'll reuse the same update endpoint to store reviewFeedback & retrospectiveNotes
      await updateSprint({
        id: sprint._id,
        updates: {
          reviewFeedback: reviewFeedback.trim() || null,
          retrospectiveNotes: retrospectiveNotes.trim() || null,
        },
      }).unwrap();
      refetch();
      alert('Review info saved!');
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

 

  // If no sprintId param, or skip fetching
  if (!sprintId) {
    return (
      <div className="p-4 text-red-500">
        No sprintId in URL.
      </div>
    );
  }
  if (isLoading) {
    return <div className="p-4">Loading sprint...</div>;
  }
  if (isError || !sprint) {
    return (
      <div className="p-4 text-red-500">
        Error loading sprint or sprint not found.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaClipboardList />
          Sprint Detail: {sprint.name}
        </h2>
        <button
          className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b mb-4 text-sm font-medium">
        <button
          className={`pb-2 ${
            activeTab === 'info'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } flex items-center gap-1`}
          onClick={() => setActiveTab('info')}
        >
          <FaInfoCircle />
          Info
        </button>
        <button
          className={`pb-2 ${
            activeTab === 'retro'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } flex items-center gap-1`}
          onClick={() => setActiveTab('retro')}
        >
          <FaSyncAlt />
          Retrospective
        </button>
        <button
          className={`pb-2 ${
            activeTab === 'review'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } flex items-center gap-1`}
          onClick={() => setActiveTab('review')}
        >
          <FaClipboardList />
          Review
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sprint Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Sprint Name
              </label>
              <input
                className="border rounded w-full px-3 py-2 text-sm mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Sprint Goal
              </label>
              <input
                className="border rounded w-full px-3 py-2 text-sm mt-1"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                className="border rounded w-full px-3 py-2 text-sm mt-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                className="border rounded w-full px-3 py-2 text-sm mt-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                className="border rounded w-full px-3 py-2 text-sm mt-1"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'PLANNED' | 'ACTIVE' | 'CLOSED')
                }
              >
                <option value="PLANNED">PLANNED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {sprint.status === 'PLANNED' && (
              <button
                onClick={handleStart}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlay />
                Start Sprint
              </button>
            )}
            {sprint.status === 'ACTIVE' && (
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 flex items-center gap-2"
              >
                <FaCheck />
                Complete Sprint
              </button>
            )}
            <button
              onClick={handleSaveInfo}
              className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300 flex items-center gap-2"
            >
              <FaSave />
              Save
            </button>
          </div>
        </div>
      )}

      {activeTab === 'retro' && (
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
         <RetrospectiveManager sprint={sprint} />
        </div>
      )}

      {activeTab === 'review' && (
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Review Feedback
            </label>
            <textarea
              className="border rounded w-full px-3 py-2 text-sm mt-1"
              rows={3}
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Retrospective Notes
            </label>
            <textarea
              className="border rounded w-full px-3 py-2 text-sm mt-1"
              rows={3}
              value={retrospectiveNotes}
              onChange={(e) => setRetrospectiveNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveReview}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSave />
              Save Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintDetailPage;
