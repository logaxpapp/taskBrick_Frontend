import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

// Add console logs to see exactly what's happening
export const customBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  credentials: 'include', // IMPORTANT for cross-site cookies
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    console.log(
      '🔹 [prepareHeaders]',
      'Endpoint:', endpoint,
      'Has Access Token?', !!token
    );
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
