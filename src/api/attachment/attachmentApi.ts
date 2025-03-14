// File: src/api/attachment/attachmentApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface Attachment {
  _id: string;
  issueId: string;
  filename: string;
  fileUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// We'll pass { issueId } to list attachments, { formData } to upload, etc.
interface ListAttachmentsArgs {
  issueId: string;
}

export const attachmentApi = createApi({
  reducerPath: 'attachmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Attachment'],
  endpoints: (builder) => ({
    // 1) LIST => GET /attachments?issueId=...
    listAttachments: builder.query<Attachment[], ListAttachmentsArgs>({
      query: ({ issueId }) => `/attachments?issueId=${issueId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((att) => ({ type: 'Attachment' as const, id: att._id })),
              'Attachment',
            ]
          : ['Attachment'],
    }),

    // 2) UPLOAD => POST /attachments (multipart form data)
    uploadAttachment: builder.mutation<{ message: string; attachments: Attachment[] }, FormData>({
      query: (formData) => ({
        url: '/attachments',
        method: 'POST',
        body: formData, // must be FormData
      }),
      invalidatesTags: ['Attachment'],
    }),

    // 3) DELETE => DELETE /attachments/:id
    deleteAttachment: builder.mutation<{ message: string }, string>({
      query: (attachmentId) => ({
        url: `/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attachment'],
    }),
  }),
});

export const {
  useListAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
} = attachmentApi;
