// File: src/pages/Board/CommentManager.tsx

import React, { useState } from 'react';
import {
  useListCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  Comment,
} from '../../api/comment/commentApi';
import {
  FaComment,
  FaTrashAlt,
  FaPlusCircle,
  FaUserCircle,
  FaClock,
} from 'react-icons/fa'; // More icons from react-icons

interface CommentManagerProps {
  issueId: string;
}

const CommentManager: React.FC<CommentManagerProps> = ({ issueId }) => {
  // 1) Query for comments (skip if no issueId)
  const { data: comments, refetch } = useListCommentsQuery(
    { issueId },
    { skip: !issueId }
  );

  // 2) Create & delete mutations
  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // 3) Local text state
  const [text, setText] = useState('');

  // 4) Add comment
  const handleAdd = async () => {
    if (!text.trim()) return;
    await createComment({
      issueId,
      commentText: text.trim(),
    }).unwrap();
    setText('');
    refetch();
  };

  // 5) Delete comment
  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;
    await deleteComment(commentId).unwrap();
    refetch();
  };

  if (!issueId) {
    return <div>No issueId provided.</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center mb-2">
        <FaComment className="text-gray-500 mr-2" />
        <h4 className="text-lg font-semibold">Comments</h4>
      </div>

      {/* Comment List */}
      <div className="space-y-5">
        {comments?.map((c: Comment) => {
          // If your server populates userId with firstName & lastName:
          const userName =
            typeof c.userId === 'object'
              ? `${c.userId.firstName ?? ''} ${c.userId.lastName ?? ''}`
              : String(c.userId);

          // If your server populates issueId with title:
          const issueTitle =
            typeof c.issueId === 'object'
              ? c.issueId.title
              : '(No Title)';

          // Format date
          const createdAt = c.createdAt
            ? new Date(c.createdAt).toLocaleString()
            : '(No date)';

          return (
            <div
              key={c._id}
              className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition-colors relative"
            >
              {/* Trash icon */}
              <button
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                onClick={() => handleDelete(c._id)}
              >
                <FaTrashAlt />
              </button>

              {/* User info + time */}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FaUserCircle className="mr-1" />
                <span className="font-medium mr-2">
                  {userName.trim() || 'Someone'}
                </span>
                <FaClock className="mr-1" />
                <span>{createdAt}</span>
              </div>

              {/* Issue title (optional) */}
              <div className="text-xs text-gray-400 mb-2 italic">
                Issue: {issueTitle}
              </div>

              {/* Comment text */}
              <div className="text-sm text-gray-800">{c.commentText}</div>
            </div>
          );
        })}
      </div>

      {/* Add Comment */}
      <div className="flex mt-4 items-center space-x-3">
        <input
          className="border border-gray-300 p-2 rounded text-sm flex-grow focus:ring focus:ring-blue-200"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
          onClick={handleAdd}
        >
          <FaPlusCircle className="mr-2" />
          Add
        </button>
      </div>
    </div>
  );
};

export default CommentManager;
