// File: src/api/subscriptionApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/* ------------------------------------------------------------------
   1) Define TypeScript Interfaces for FEATUES
   ------------------------------------------------------------------ */
export interface Feature {
  _id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  isBeta?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** For creating a Feature */
export interface CreateFeaturePayload {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
  isBeta?: boolean;
}

/** For updating a Feature */
export interface UpdateFeaturePayload {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  isBeta?: boolean;
}

/* ------------------------------------------------------------------
   2) Define TypeScript Interfaces for SUBSCRIPTION PLANS
   ------------------------------------------------------------------ */
export interface SubscriptionPlan {
  _id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  isActive: boolean;
  seatLimit?: number;
  usageLimits?: Record<string, any>;
  // The plan includes an array of feature IDs or populated feature objects.
  features: Feature[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

/** For creating a Plan */
export interface CreatePlanPayload {
  name: string;
  monthlyPrice?: number;
  annualPrice?: number;
  featureIds?: string[];
  isActive?: boolean;
  seatLimit?: number;
  usageLimits?: Record<string, any>;
}

/** For updating a Plan */
export interface UpdatePlanPayload {
  name?: string;
  monthlyPrice?: number;
  annualPrice?: number;
  featureIds?: string[];
  isActive?: boolean;
  seatLimit?: number;
  usageLimits?: Record<string, any>;
}

/* ------------------------------------------------------------------
   3) Define TypeScript Interfaces for ORGANIZATION SUBSCRIPTIONS
   ------------------------------------------------------------------ */
export interface OrganizationSubscription {
  _id: string;
  organizationId: string; // or an object if the API returns it populated
  planId: SubscriptionPlan; // if populated
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  seatsUsed?: number;
  usage?: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

/** For creating or updating an Org Subscription */
export interface CreateOrUpdateSubscriptionPayload {
  organizationId: string;
  planId: string;
  status?: 'active' | 'canceled' | 'expired' | 'trial';
  seatsUsed?: number;
}

/** For canceling an Org Subscription */
export interface CancelSubscriptionPayload {
  orgId: string;
}

/** For the "has-feature" check */
export interface HasFeatureResponse {
  hasFeature: boolean;
}

/* ------------------------------------------------------------------
   4) Create ONE RTK Query Slice (subscriptionApi)
   ------------------------------------------------------------------ */
export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: baseQueryWithReauth, // Adjust if using fetchBaseQuery or baseQueryWithReauth
  tagTypes: [
    'Feature',
    'SubscriptionPlan',
    'OrganizationSubscription',
  ],

  endpoints: (builder) => ({
    /* ------------------- FEATURES ------------------- */
    createFeature: builder.mutation<Feature, CreateFeaturePayload>({
      query: (body) => ({
        url: '/features',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Feature'],
    }),

    listFeatures: builder.query<Feature[], void>({
      query: () => '/features',
      providesTags: (result) =>
        result
          ? [
              ...result.map((f) => ({ type: 'Feature' as const, id: f._id })),
              'Feature',
            ]
          : ['Feature'],
    }),

    getFeature: builder.query<Feature, string>({
      query: (id) => `/features/${id}`,
      providesTags: (result, error, id) => [{ type: 'Feature', id }],
    }),

    updateFeature: builder.mutation<
      Feature,
      { id: string; updates: UpdateFeaturePayload }
    >({
      query: ({ id, updates }) => ({
        url: `/features/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Feature', id: arg.id }],
    }),

    activateFeature: builder.mutation<Feature, string>({
      query: (featureId) => ({
        url: `/features/${featureId}/activate`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, featureId) => [
        { type: 'Feature', id: featureId },
      ],
    }),

    deactivateFeature: builder.mutation<Feature, string>({
      query: (featureId) => ({
        url: `/features/${featureId}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, featureId) => [
        { type: 'Feature', id: featureId },
      ],
    }),

    deleteFeature: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/features/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feature'],
    }),

    /* ------------------- SUBSCRIPTION PLANS ------------------- */
    createPlan: builder.mutation<SubscriptionPlan, CreatePlanPayload>({
      query: (body) => ({
        url: '/plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubscriptionPlan'],
    }),

    listPlans: builder.query<SubscriptionPlan[], void>({
      query: () => '/plans',
      providesTags: (result) =>
        result
          ? [
              ...result.map((plan) => ({
                type: 'SubscriptionPlan' as const,
                id: plan._id,
              })),
              'SubscriptionPlan',
            ]
          : ['SubscriptionPlan'],
    }),

    getPlan: builder.query<SubscriptionPlan, string>({
      query: (id) => `/plans/${id}`,
      providesTags: (result, error, id) => [
        { type: 'SubscriptionPlan', id },
      ],
    }),

    updatePlan: builder.mutation<
      SubscriptionPlan,
      { id: string; updates: UpdatePlanPayload }
    >({
      query: ({ id, updates }) => ({
        url: `/plans/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'SubscriptionPlan', id: arg.id },
      ],
    }),

    activatePlan: builder.mutation<SubscriptionPlan, string>({
      query: (planId) => ({
        url: `/plans/${planId}/activate`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, planId) => [
        { type: 'SubscriptionPlan', id: planId },
      ],
    }),

    deactivatePlan: builder.mutation<SubscriptionPlan, string>({
      query: (planId) => ({
        url: `/plans/${planId}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, planId) => [
        { type: 'SubscriptionPlan', id: planId },
      ],
    }),

    deletePlan: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubscriptionPlan'],
    }),

    /* ------------------- ORG SUBSCRIPTIONS ------------------- */
    createOrUpdateSubscription: builder.mutation<
      OrganizationSubscription,
      CreateOrUpdateSubscriptionPayload
    >({
      query: (body) => ({
        url: '/org-subs',  //org-subs
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganizationSubscription'],
    }),

    cancelSubscription: builder.mutation<OrganizationSubscription, CancelSubscriptionPayload>({
      query: (body) => ({
        url: '/org-subs/cancel',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrganizationSubscription'],
    }),

    getActiveSubscription: builder.query<OrganizationSubscription, string>({
      query: (orgId) => `/org-subs/active/${orgId}`,
      providesTags: (result) =>
        result
          ? [{ type: 'OrganizationSubscription', id: result._id }]
          : ['OrganizationSubscription'],
    }),

    listSubscriptionsForOrg: builder.query<OrganizationSubscription[], string>({
      query: (orgId) => `/org-subs/list/${orgId}`,
      providesTags: ['OrganizationSubscription'],
    }),

    orgHasFeature: builder.query<HasFeatureResponse, { orgId: string; featureCode: string }>({
      query: ({ orgId, featureCode }) =>
        `/org-subs/has-feature?orgId=${orgId}&featureCode=${featureCode}`,
    }),
  }),
});

/* ------------------------------------------------------------------
   5) Export Auto-Generated Hooks
   ------------------------------------------------------------------ */

// FEATURES
export const {
  useCreateFeatureMutation,
  useListFeaturesQuery,
  useGetFeatureQuery,
  useUpdateFeatureMutation,
  useActivateFeatureMutation,
  useDeactivateFeatureMutation,
  useDeleteFeatureMutation,

  // PLANS
  useCreatePlanMutation,
  useListPlansQuery,
  useGetPlanQuery,
  useUpdatePlanMutation,
  useActivatePlanMutation,
  useDeactivatePlanMutation,
  useDeletePlanMutation,

  // ORG SUBS
  useCreateOrUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useGetActiveSubscriptionQuery,
  useListSubscriptionsForOrgQuery,
  useOrgHasFeatureQuery,
} = subscriptionApi;
