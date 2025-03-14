import React, { useEffect, useState } from 'react';
import {
  useGetFormQuery,
  useSubmitFormMutation,
  FormData,
  FormField,
  SubmissionAnswer,
} from '../../api/form/formApi';

interface Props {
  formId: string;
  onClose: () => void;
}

const FormFiller: React.FC<Props> = ({ formId, onClose }) => {
  const { data: form, isLoading, isError } = useGetFormQuery(formId);
  const [submitForm] = useSubmitFormMutation();

  const [answers, setAnswers] = useState<SubmissionAnswer[]>([]);

  useEffect(() => {
    if (form) {
      // Initialize
      const initial = form.fields.map((fld) => ({
        fieldName: fld.name,
        value: '',
      }));
      setAnswers(initial);
    }
  }, [form]);

  if (isLoading) return <div>Loading form...</div>;
  if (isError || !form) return <div>Error loading form.</div>;

  const handleChange = (fieldName: string, value: any) => {
    setAnswers((prev) =>
      prev.map((a) => (a.fieldName === fieldName ? { ...a, value } : a))
    );
  };

  const handleSubmit = async () => {
    try {
      await submitForm({ formId, answers }).unwrap();
      alert('Form submitted!');
      onClose();
    } catch (err: any) {
      alert('Failed to submit form: ' + err.message);
    }
  };

  return (
    <div className="border p-3 mt-2 bg-white">
      <h3 className="font-semibold mb-2">Fill Form: {form.title}</h3>
      {form.fields.map((fld) => {
        const val = answers.find((a) => a.fieldName === fld.name)?.value || '';
        return (
          <div key={fld.name} className="mb-2">
            <label className="block text-sm font-medium">
              {fld.label}
              {fld.required && <span className="text-red-500"> *</span>}
            </label>
            {fld.type === 'textarea' ? (
              <textarea
                className="border p-1 w-full text-sm rounded"
                rows={3}
                value={val}
                onChange={(e) => handleChange(fld.name, e.target.value)}
              />
            ) : fld.type === 'select' ? (
              <select
                className="border p-1 w-full text-sm rounded"
                value={val}
                onChange={(e) => handleChange(fld.name, e.target.value)}
              >
                <option value="">-- Select --</option>
                {fld.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              // default to 'text'
              <input
                className="border p-1 w-full text-sm rounded"
                value={val}
                onChange={(e) => handleChange(fld.name, e.target.value)}
              />
            )}
          </div>
        );
      })}
      <div className="flex justify-end gap-2">
        <button className="bg-gray-300 px-3 py-1 text-sm rounded" onClick={onClose}>
          Cancel
        </button>
        <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormFiller;
