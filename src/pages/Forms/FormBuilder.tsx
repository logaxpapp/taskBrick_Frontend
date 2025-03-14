import React, { useState, useEffect } from 'react';
import {
  useCreateFormMutation,
  useGetFormQuery,
  useUpdateFormMutation,
  FormData,
  FormField,
} from '../../api/form/formApi';

interface Props {
  formId?: string;
  onClose: () => void;
}

const FormBuilder: React.FC<Props> = ({ formId, onClose }) => {
  const isEditing = !!formId;
  const { data: existingForm, isLoading } = useGetFormQuery(formId!, {
    skip: !isEditing,
  });

  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    if (existingForm && isEditing) {
      setTitle(existingForm.title);
      setDescription(existingForm.description ?? '');
      setFields(existingForm.fields || []);
    }
  }, [existingForm, isEditing]);

  if (isEditing && isLoading) {
    return <div>Loading Form...</div>;
  }

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        label: '',
        name: '',
        type: 'text',
        required: false,
        options: [],
      },
    ]);
  };

  const handleFieldChange = (index: number, key: keyof FormField, value: any) => {
    const updated = [...fields];
    (updated[index] as any)[key] = value;
    setFields(updated);
  };

  const handleRemoveField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  const handleSave = async () => {
    if (isEditing) {
      await updateForm({
        id: formId!,
        updates: { title, description, fields },
      });
    } else {
      await createForm({ title, description, fields });
    }
    onClose();
  };

  return (
    <div className="border p-3 mt-2 bg-white">
      <h3 className="font-semibold mb-2">
        {isEditing ? 'Edit Form' : 'Create Form'}
      </h3>
      <div className="mb-2">
        <label className="block text-sm">Title</label>
        <input
          className="border p-1 w-full rounded text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Description</label>
        <textarea
          className="border p-1 w-full rounded text-sm"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between">
          <label className="font-medium">Fields</label>
          <button
            className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
            onClick={handleAddField}
          >
            + Field
          </button>
        </div>
        {fields.map((f, idx) => (
          <div key={idx} className="border p-2 rounded mt-1">
            <div className="flex gap-2">
              <input
                className="border p-1 text-sm flex-1 rounded"
                placeholder="Label"
                value={f.label}
                onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
              />
              <input
                className="border p-1 text-sm flex-1 rounded"
                placeholder="Name"
                value={f.name}
                onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
              />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <select
                className="border p-1 text-sm"
                value={f.type}
                onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
              </select>
              <label className="flex items-center text-sm gap-1">
                <input
                  type="checkbox"
                  checked={!!f.required}
                  onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                />
                Required
              </label>
              <button
                className="bg-red-500 text-white text-xs px-2 py-1 ml-auto rounded"
                onClick={() => handleRemoveField(idx)}
              >
                Remove
              </button>
            </div>
            {f.type === 'select' && (
              <div className="mt-2 text-sm">
                <label>Options (comma separated)</label>
                <input
                  className="border p-1 text-sm w-full rounded"
                  placeholder="Option1,Option2"
                  value={f.options?.join(',') || ''}
                  onChange={(e) =>
                    handleFieldChange(idx, 'options', e.target.value.split(','))
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-3 gap-2">
        <button className="bg-gray-300 px-3 py-1 text-sm rounded" onClick={onClose}>
          Cancel
        </button>
        <button className="bg-green-500 px-3 py-1 text-sm text-white rounded" onClick={handleSave}>
          {isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;
