// File: src/pages/Board/AttachmentManager.tsx
import React, { useState } from 'react';
import {
  useListAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} from '../../api/attachment/attachmentApi';
import { FaPaperclip, FaFileUpload, FaTrashAlt, FaDownload } from 'react-icons/fa';

interface AttachmentManagerProps {
  issueId: string;
}

const AttachmentManager: React.FC<AttachmentManagerProps> = ({ issueId }) => {
  // 1) Fetch existing attachments
  const { data: attachments, refetch } = useListAttachmentsQuery({ issueId }, { skip: !issueId });

  // 2) Mutations
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  // local state
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setIsUploading(true);

    try {
      // Build FormData
      const formData = new FormData();
      formData.append('issueId', issueId);

      // Append all files under the same field name: "files"
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }

      // call RTK mutation
      await uploadAttachment(formData).unwrap();

      alert('Files uploaded successfully!');
      setSelectedFiles(null);
      refetch();
    } catch (error: any) {
      alert(`Failed to upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!window.confirm('Delete this attachment?')) return;
    await deleteAttachment(attachmentId).unwrap();
    refetch();
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex items-center mb-4">
        <FaPaperclip className="text-gray-500 mr-2" />
        <h4 className="text-lg font-semibold">Attachments</h4>
      </div>

      {/* Existing attachments */}
      <ul className="space-y-3 mb-4">
        {attachments?.map((att) => (
          <li
            key={att._id}
            className="border border-gray-200 p-3 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center flex-grow">
              <span className="font-medium mr-2">{att.filename}</span>
              <a
                href={att.fileUrl}
                className="text-blue-600 hover:underline text-sm flex items-center"
                target="_blank"
                rel="noreferrer"
              >
                <FaDownload className="mr-1" />
                Download
              </a>
            </div>
            <button
              className="text-red-600 hover:text-red-800 transition-colors"
              onClick={() => handleDelete(att._id)}
            >
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>

      {/* File input + Upload button */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label className="bg-gray-200 text-gray-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 flex items-center">
          <FaFileUpload className="mr-2" />
          <span>Select Files</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!selectedFiles || isUploading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center ${
            isUploading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  );
};

export default AttachmentManager;
