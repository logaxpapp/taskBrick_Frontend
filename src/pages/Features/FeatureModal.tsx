// File: src/components/FeatureManager/FeatureModal.tsx

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

/** 
 * For the form data in create/edit.
 * We'll expand to include all relevant fields.
 */
export interface FeatureFormData {
  name: string;
  code: string;
  description?: string;
  isBeta: boolean;
}

/** If the user toggles "autoGenCode", we might create code from name. */
function generateCodeFromName(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '');
}

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;

  /** If editing, we pass initialData, else it's for creating */
  initialData?: Partial<FeatureFormData>;
  title: string;

  /** Called when user hits "Save" */
  onSubmit: (data: FeatureFormData) => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
  title,
  onSubmit,
}) => {
  const [autoGenCode, setAutoGenCode] = useState(true);

  const [formData, setFormData] = useState<FeatureFormData>({
    name: initialData.name || '',
    code: initialData.code || '',
    description: initialData.description || '',
    isBeta: initialData.isBeta || false,
  });

  // auto-generate code from name if user toggles it
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      code: autoGenCode ? generateCodeFromName(value) : prev.code,
    }));
  };

  const handleCodeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      code: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      alert('Name and Code are required');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="FeatureModalOverlay"
          className="
            fixed inset-0 bg-black bg-opacity-50 
            flex items-center justify-center z-50
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              bg-white w-full max-w-md
              rounded-lg p-6 shadow-2xl relative
            "
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              {/* Feature Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feature Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              {/* Code + auto-generate toggle */}
              <div>
                <div className="flex items-center mb-1 gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Feature Code <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">(unique)</span>
                  <div className="ml-auto flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={autoGenCode}
                      onChange={() => {
                        setAutoGenCode(!autoGenCode);
                        if (!autoGenCode) {
                          // user just turned auto-gen on, generate code from current name
                          setFormData((prev) => ({
                            ...prev,
                            code: generateCodeFromName(prev.name),
                          }));
                        }
                      }}
                    />
                    <span className="text-xs text-gray-500">Auto-generate</span>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  disabled={autoGenCode}
                  value={formData.code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border px-3 py-1 rounded"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* isBeta */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isBeta}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isBeta: e.target.checked,
                    }))
                  }
                />
                <label className="text-sm text-gray-700">Is Beta?</label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureModal;
