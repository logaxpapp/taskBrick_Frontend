import React, { useState } from 'react';
import {
  useListFormsQuery,
  useDeleteFormMutation,
  FormData,
} from '../../api/form/formApi';
import FormBuilder from './FormBuilder';
import FormFiller from './FormFiller';

const FormsPage: React.FC = () => {
  const { data: forms, refetch, isLoading, isError } = useListFormsQuery();
  const [deleteForm] = useDeleteFormMutation();

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fillingId, setFillingId] = useState<string | null>(null);

  if (isLoading) return <div>Loading forms...</div>;
  if (isError) return <div>Error loading forms.</div>;

  const handleDelete = async (formId: string) => {
    if (!window.confirm('Delete this form?')) return;
    await deleteForm(formId);
    refetch();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Forms</h2>

      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() => setCreating(true)}
      >
        + New Form
      </button>

      {creating && (
        <FormBuilder
          onClose={() => {
            setCreating(false);
            refetch();
          }}
        />
      )}

      {editingId && (
        <FormBuilder
          formId={editingId}
          onClose={() => {
            setEditingId(null);
            refetch();
          }}
        />
      )}

      {fillingId && (
        <FormFiller
          formId={fillingId}
          onClose={() => setFillingId(null)}
        />
      )}

      <div className="space-y-2">
        {forms?.map((form) => (
          <div key={form._id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{form.title}</p>
              <p className="text-sm text-gray-600">{form.description}</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-gray-200 px-2 py-1 text-sm rounded"
                onClick={() => setEditingId(form._id)}
              >
                Edit
              </button>
              <button
                className="bg-green-200 px-2 py-1 text-sm rounded"
                onClick={() => setFillingId(form._id)}
              >
                Fill
              </button>
              <button
                className="bg-red-200 px-2 py-1 text-sm rounded"
                onClick={() => handleDelete(form._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {forms && forms.length === 0 && <p>No forms found.</p>}
      </div>
    </div>
  );
};

export default FormsPage;
