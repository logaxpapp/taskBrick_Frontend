// File: src/pages/CommunityQAManager.tsx
import React, { useState } from 'react';
import {
  useListQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useCreateAnswerMutation,
} from '../../api/community/communityApi';

const CommunityQAManager: React.FC = () => {
  // 1) Local state for controlling views
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // 2) RTK Query hooks for listing and detail
  const { data: questionList, isLoading: listLoading } = useListQuestionsQuery();
  const { data: questionDetail, isLoading: detailLoading } = useGetQuestionByIdQuery(
    selectedQuestionId ?? '', // pass empty string if null
    { skip: !selectedQuestionId } // skip if we have no question selected
  );

  // 3) Mutations for create question + create answer
  const [createQuestion, { isLoading: creatingQuestion }] = useCreateQuestionMutation();
  const [createAnswer, { isLoading: creatingAnswer }] = useCreateAnswerMutation();

  // 4) Local state for forms
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  const [newAnswerBody, setNewAnswerBody] = useState('');

  // 5) Handlers
  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
  };

  const handleCreateQuestion = async () => {
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) {
      alert('Title/Body required');
      return;
    }

    try {
      await createQuestion({
        title: newQuestionTitle,
        body: newQuestionBody,
      }).unwrap();
      setNewQuestionTitle('');
      setNewQuestionBody('');
      alert('Question created!');
    } catch (err: any) {
      alert('Error creating question: ' + err.message);
    }
  };

  const handleCreateAnswer = async () => {
    if (!selectedQuestionId) return;
    if (!newAnswerBody.trim()) {
      alert('Answer text required');
      return;
    }

    try {
      await createAnswer({
        questionId: selectedQuestionId,
        body: newAnswerBody,
      }).unwrap();
      setNewAnswerBody('');
      alert('Answer created!');
    } catch (err: any) {
      alert('Error creating answer: ' + err.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Community Q&A Manager</h1>

      {/* Left: List of questions */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">All Questions</h2>
        {listLoading ? (
          <p>Loading questions...</p>
        ) : (
          <ul className="space-y-2 mt-3">
            {questionList?.map((q) => (
              <li key={q._id} className="p-2 border border-gray-200 rounded">
                <h3 className="font-medium">{q.title}</h3>
                <p className="text-sm">Author: {q.author?.email}</p>
                <button
                  className="mt-2 text-blue-600 hover:underline"
                  onClick={() => handleSelectQuestion(q._id)}
                >
                  View Detail
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Right: Create New Question */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Ask a New Question</h2>
        <div className="mt-2 space-y-2">
          <input
            type="text"
            className="border rounded w-full p-1"
            placeholder="Question Title"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
          />
          <textarea
            className="border rounded w-full p-1"
            rows={3}
            placeholder="Question Body"
            value={newQuestionBody}
            onChange={(e) => setNewQuestionBody(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={handleCreateQuestion}
            disabled={creatingQuestion}
          >
            {creatingQuestion ? 'Creating...' : 'Create Question'}
          </button>
        </div>
      </section>

      {/* Selected Question Detail + Answers */}
      {selectedQuestionId && (
        <section>
          <h2 className="text-xl font-semibold">Question Detail</h2>
          {detailLoading ? (
            <p>Loading question detail...</p>
          ) : (
            <>
              {questionDetail ? (
                <div className="border border-gray-300 p-3 rounded space-y-2">
                  <h3 className="text-lg font-medium">{questionDetail.title}</h3>
                  <p>{questionDetail.body}</p>
                  <p className="text-sm text-gray-600">
                    Asked by: {questionDetail.author?.email}
                  </p>

                  {/* Answers List */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-1">Answers</h4>
                    {questionDetail.answers && questionDetail.answers.length > 0 ? (
                      <ul className="space-y-2">
                        {questionDetail.answers.map((ans) => (
                          <li key={ans._id} className="border rounded p-2">
                            <p>{ans.body}</p>
                            <small className="text-gray-500">
                              by {ans.author?.email}
                            </small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No answers yet.</p>
                    )}
                  </div>

                  {/* Form to add a new answer */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-1">Add an Answer</h4>
                    <textarea
                      className="border rounded w-full p-1"
                      rows={2}
                      placeholder="Your answer"
                      value={newAnswerBody}
                      onChange={(e) => setNewAnswerBody(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700"
                      onClick={handleCreateAnswer}
                      disabled={creatingAnswer}
                    >
                      {creatingAnswer ? 'Posting...' : 'Post Answer'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">Question not found.</p>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default CommunityQAManager;
