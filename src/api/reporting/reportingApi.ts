// src/api/reporting/reportingApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** Example data shapes for each reporting level */
export interface OrgReportingResponse {
  organizationName: string;
  projectCount: number;
  boardCount: number;
  issueCount: number;
  memberCount: number;
  issuesByStatus: { _id: string; count: number }[];
}

export interface ProjectReportingResponse {
  projectName: string;
  organizationId: string;
  boardCount: number;
  issueCount: number;
  issuesByStatus: { _id: string; count: number }[];
}

export interface BoardReportingResponse {
  boardName: string;
  boardType: string;
  columnCount: number;
  columnsWithIssueCount: Record<string, number>;
}

export interface IssueReportingResponse {
  title: string;
  status: string;
  priority: string;
  watchersCount: number;
  commentsCount: number;
  attachmentsCount: number;
}

export const reportingApi = createApi({
  reducerPath: 'reportingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Reporting'],
  endpoints: (builder) => ({
    // GET /reporting/organization/:orgId
    getOrgReporting: builder.query<OrgReportingResponse, string>({
      query: (orgId) => `/reporting/organization/${orgId}`,
    }),
    // GET /reporting/project/:projectId
    getProjectReporting: builder.query<ProjectReportingResponse, string>({
      query: (projectId) => `/reporting/project/${projectId}`,
    }),
    // GET /reporting/board/:boardId
    getBoardReporting: builder.query<BoardReportingResponse, string>({
      query: (boardId) => `/reporting/board/${boardId}`,
    }),
    // GET /reporting/issue/:issueId
    getIssueReporting: builder.query<IssueReportingResponse, string>({
      query: (issueId) => `/reporting/issue/${issueId}`,
    }),
  }),
});

export const {
  useGetOrgReportingQuery,
  useGetProjectReportingQuery,
  useGetBoardReportingQuery,
  useGetIssueReportingQuery,
} = reportingApi;
