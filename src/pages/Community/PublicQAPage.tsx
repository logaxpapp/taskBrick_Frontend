import React, { useState } from 'react';
import {
  useListQuestionsQuery,
  useGetQuestionByIdQuery,
} from '../../api/community/communityApi';

const PublicQAPage: React.FC = () => {
  // State to track which question we’re currently viewing
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  // 1) Load entire question list
  const { data: questions, isLoading: questionsLoading, isError: listError } =
    useListQuestionsQuery();

  // 2) If a question is selected, load its details
  const { data: questionDetail, isLoading: detailLoading } = useGetQuestionByIdQuery(
    selectedQuestionId ?? '',
    { skip: !selectedQuestionId } // skip if no question selected
  );

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Public Community Q&A</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: List of Questions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Available Questions</h2>

          {/* Loading / Error / List */}
          {questionsLoading ? (
            <p className="text-gray-500">Loading questions...</p>
          ) : listError ? (
            <p className="text-red-600">Failed to load questions.</p>
          ) : !questions || questions.length === 0 ? (
            <p className="text-gray-500">No questions found.</p>
          ) : (
            <ul className="space-y-3">
              {questions.map((q) => (
                <li
                  key={q._id}
                  className="p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => handleSelectQuestion(q._id)}
                >
                  <h3 className="font-medium text-lg mb-1">{q.title}</h3>
                  <p className="text-sm text-gray-600">
                    Asked by: {q.author?.email || 'Unknown'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* RIGHT: Selected Question Detail */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Question Detail</h2>

          {selectedQuestionId ? (
            detailLoading ? (
              <p className="text-gray-500">Loading question detail...</p>
            ) : questionDetail ? (
              <div className="p-4 border border-gray-300 rounded-md space-y-4">
                {/* Title & Body */}
                <div>
                  <h3 className="text-2xl font-medium mb-1">{questionDetail.title}</h3>
                  <p className="text-gray-700">{questionDetail.body}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Asked by: {questionDetail.author?.email || 'Unknown'}
                  </p>
                </div>

                {/* Answers (Read-Only) */}
                <div>
                  <h4 className="text-lg font-semibold mb-2">Answers</h4>
                  {questionDetail.answers && questionDetail.answers.length > 0 ? (
                    <ul className="space-y-3">
                      {questionDetail.answers.map((ans) => (
                        <li
                          key={ans._id}
                          className="p-3 border border-gray-200 rounded-md"
                        >
                          <p>{ans.body}</p>
                          <small className="text-gray-500">
                            by {ans.author?.email || 'Unknown'}
                          </small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No answers yet.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-red-600">Question not found.</p>
            )
          ) : (
            <div className="p-4 border border-gray-200 rounded-md text-gray-600">
              <p>Select a question on the left to see its details.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PublicQAPage;
