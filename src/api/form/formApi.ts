import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface FormField {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export interface FormData {
  _id: string;
  title: string;
  description?: string;
  fields: FormField[];
  organizationId?: string;
  createdByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFormPayload {
  title: string;
  description?: string;
  fields: FormField[];
  organizationId?: string;
}

export interface UpdateFormPayload {
  title?: string;
  description?: string;
  fields?: FormField[];
}

export interface SubmissionAnswer {
  fieldName: string;
  value: any;
}

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Form'],

  endpoints: (builder) => ({
    listForms: builder.query<FormData[], { organizationId?: string } | void>({
      query: (arg) => {
        // If you want to filter by org, use ?organizationId=...
        const orgId = arg?.organizationId;
        let url = '/forms';
        if (orgId) {
          url += `?organizationId=${orgId}`;
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [...result.map((f) => ({ type: 'Form', id: f._id } as const)), 'Form']
          : ['Form'],
    }),

    createForm: builder.mutation<FormData, CreateFormPayload>({
      query: (body) => ({
        url: '/forms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Form'],
    }),

    getForm: builder.query<FormData, string>({
      query: (id) => `/forms/${id}`,
      providesTags: (result, error, arg) =>
        result ? [{ type: 'Form', id: result._id }] : [],
    }),

    updateForm: builder.mutation<FormData, { id: string; updates: UpdateFormPayload }>({
      query: ({ id, updates }) => ({
        url: `/forms/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Form', id: arg.id }, 'Form'],
    }),

    deleteForm: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/forms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Form'],
    }),

    submitForm: builder.mutation<
      { message: string; submission: any; issue?: any },
      { formId: string; answers: SubmissionAnswer[] }
    >({
      query: ({ formId, answers }) => ({
        url: `/forms/${formId}/submit`,
        method: 'POST',
        body: { answers },
      }),
    }),
  }),
});

export const {
  useListFormsQuery,
  useCreateFormMutation,
  useGetFormQuery,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useSubmitFormMutation,
} = formApi;
