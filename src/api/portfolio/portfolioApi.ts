/*****************************************************************
 * File: src/api/portfolioApi.ts
 * Description: RTK Query API slice for Portfolios
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** ----------------------
 * Portfolio Types
 * --------------------- */
export interface IPortfolio {
  _id: string;
  name: string;
  description?: string;
  projectIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

// For creating a portfolio
export interface CreatePortfolioPayload {
  name: string;
  description?: string;
  projectIds?: string[];
}

// For updating a portfolio
export interface UpdatePortfolioPayload {
  name?: string;
  description?: string;
  projectIds?: string[];
}

export interface AddProjectToPortfolioPayload {
  portfolioId: string;
  projectId: string;
}

export interface RemoveProjectFromPortfolioPayload {
  portfolioId: string;
  projectId: string;
}

// Example aggregator response structure (adjust as needed)
export interface PortfolioSummary {
  id: string;
  name: string;
  projectCount: number;
}

/** ----------------------
 * Portfolio API Slice
 * --------------------- */
export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Portfolio'],

  endpoints: (builder) => ({
    // POST /portfolios
    createPortfolio: builder.mutation<IPortfolio, CreatePortfolioPayload>({
      query: (body) => ({
        url: '/portfolios',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Portfolio'],
    }),

    // GET /portfolios
    listPortfolios: builder.query<IPortfolio[], void>({
      query: () => '/portfolios',
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: 'Portfolio' as const, id: p._id })), 'Portfolio']
          : ['Portfolio'],
    }),

    // GET /portfolios/:id
    getPortfolio: builder.query<IPortfolio, string>({
      query: (id) => `/portfolios/${id}`,
      providesTags: (result, error, id) => [{ type: 'Portfolio', id }],
    }),

    // PATCH or PUT /portfolios/:id
    updatePortfolio: builder.mutation<IPortfolio, { id: string; updates: UpdatePortfolioPayload }>({
      query: ({ id, updates }) => ({
        url: `/portfolios/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Portfolio', id: arg.id }],
    }),

    // DELETE /portfolios/:id
    deletePortfolio: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/portfolios/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Portfolio'],
    }),

    // POST /portfolios/:id/projects
    addProjectToPortfolio: builder.mutation<IPortfolio, AddProjectToPortfolioPayload>({
      query: ({ portfolioId, projectId }) => ({
        url: `/portfolios/${portfolioId}/projects`,
        method: 'POST',
        body: { projectId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Portfolio', id: arg.portfolioId }],
    }),

    // DELETE /portfolios/:id/projects
    removeProjectFromPortfolio: builder.mutation<IPortfolio, RemoveProjectFromPortfolioPayload>({
      query: ({ portfolioId, projectId }) => ({
        url: `/portfolios/${portfolioId}/projects`,
        method: 'DELETE',
        body: { projectId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Portfolio', id: arg.portfolioId }],
    }),

    // GET /portfolios/:id/summary
    getPortfolioSummary: builder.query<PortfolioSummary, string>({
      query: (portfolioId) => `/portfolios/${portfolioId}/summary`,
    }),
  }),
});

export const {
  useCreatePortfolioMutation,
  useListPortfoliosQuery,
  useGetPortfolioQuery,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useAddProjectToPortfolioMutation,
  useRemoveProjectFromPortfolioMutation,
  useGetPortfolioSummaryQuery,
} = portfolioApi;
