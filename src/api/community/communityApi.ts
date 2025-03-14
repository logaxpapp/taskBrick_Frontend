import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** -------------------------
 * 1) Define TS Interfaces
 * ------------------------ */
export interface Question {
  _id: string;
  title: string;
  body: string;
  author: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // etc.
  };
  answers: Answer[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Answer {
  _id: string;
  body: string;
  author: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  question: string; // question ID
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionPayload {
  title: string;
  body: string;
  tags?: string[];
}

export interface CreateAnswerPayload {
  questionId: string;
  body: string;
}

export interface UpdateQuestionPayload {
  questionId: string;
  data: Partial<Pick<Question, 'title' | 'body' | 'tags'>>;
}

export interface UpdateAnswerPayload {
  answerId: string;
  data: Partial<Pick<Answer, 'body'>>;
}

/** --------------------------------
 * 2) Define the RTK Query Slice
 * --------------------------------*/
export const communityApi = createApi({
  reducerPath: 'communityApi',
  baseQuery: baseQueryWithReauth, // same approach as in userApi
  tagTypes: ['Question', 'Answer'],
  endpoints: (builder) => ({

    // A) List all questions
    listQuestions: builder.query<Question[], void>({
      query: () => '/questions',
      providesTags: (result) =>
        result
          ? [
              ...result.map((q) => ({ type: 'Question' as const, id: q._id })),
              { type: 'Question', id: 'LIST' },
            ]
          : [{ type: 'Question', id: 'LIST' }],
    }),

    // B) Get single question (with answers)
    getQuestionById: builder.query<Question, string>({
      query: (questionId) => `/questions/${questionId}`,
      providesTags: (result, error, questionId) =>
        result
          ? [
              { type: 'Question' as const, id: questionId },
              // also mark each answer so we can potentially update them
              ...result.answers.map((ans) => ({ type: 'Answer' as const, id: ans._id })),
            ]
          : [{ type: 'Question', id: questionId }],
    }),

    // C) Create a new question
    createQuestion: builder.mutation<Question, CreateQuestionPayload>({
      query: (body) => ({
        url: '/questions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    }),

    // D) Update a question (optional)
    updateQuestion: builder.mutation<Question, UpdateQuestionPayload>({
      query: ({ questionId, data }) => ({
        url: `/questions/${questionId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),

    // E) Delete a question
    deleteQuestion: builder.mutation<{ message: string }, string>({
      query: (questionId) => ({
        url: `/questions/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, questionId) => [
        { type: 'Question', id: questionId },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    // F) Create an answer
    createAnswer: builder.mutation<Answer, CreateAnswerPayload>({
      query: ({ questionId, body }) => ({
        url: `/answers/${questionId}`,
        method: 'POST',
        body: { body },
      }),
      // Once we create an answer, invalidate the question detail so it re-fetches
      invalidatesTags: (result, error, { questionId }) => [
        { type: 'Question', id: questionId },
      ],
    }),

    // G) Update an answer
    updateAnswer: builder.mutation<Answer, UpdateAnswerPayload>({
      query: ({ answerId, data }) => ({
        url: `/answers/${answerId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Answer', id: result._id }] : [],
    }),

    // H) Delete an answer
    deleteAnswer: builder.mutation<{ message: string }, { answerId: string; questionId: string }>({
      query: ({ answerId }) => ({
        url: `/answers/${answerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { answerId, questionId }) => [
        { type: 'Answer', id: answerId },
        { type: 'Question', id: questionId },
      ],
    }),
  }),
});

// Export auto-generated hooks
export const {
  useListQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,

  useCreateAnswerMutation,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
} = communityApi;
