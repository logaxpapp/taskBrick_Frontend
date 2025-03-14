// File: src/store/index.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import conversationReducer, { conversationActions } from './slices/conversationSlice';
import messageReducer, { messageActions } from './slices/messageSlice';
import organizationReducer from './slices/organizationSlice';


// Existing slices
import authReducer from '../../features/auth/authSlice';
import { authApi } from '../../api/auth/authApi';
import { userApi } from '../../api/user/userApi';
import { userOrganizationApi } from '../../api/userOrganization/userOrganizationApi';
import { organizationApi } from '../../api/organization/organizationApi';
import { subscriptionApi } from '../../api/subscription/subscriptionApi';
import { teamApi } from '../../api/team/teamApi';
import { userTeamApi } from '../../api/userTeam/userTeamApi';
import { invitationApi } from '../../api/invitation/invitationApi';
// 🔹 Import your newly created themeReducer
import themeReducer from '../../features/theme/themeSlice';
import {userSettingsApi} from '../../api/Settings/userSettingsApi';
import { projectApi } from '../../api/project/projectApi';
import { projectMemberApi } from '../../api/project/projectMemberApi';
import { sprintApi } from '../../api/sprint/sprintApi';
import { labelApi } from '../../api/label/labelApi';
import { boardApi } from '../../api/board/boardApi';
import { boardColumnApi } from '../../api/boardColumn/boardColumnApi';
import { issueApi } from '../../api/issue/issueApi';
import { issueTypeApi } from '../../api/issueType/issueTypeApi';
import { issueWatcherApi } from '../../api/issueWatcher/issueWatcherApi';
import { commentApi } from '../../api/comment/commentApi';
import { attachmentApi } from '../../api/attachment/attachmentApi';
import { issueHistoryApi } from '../../api/issueHistory/issueHistoryApi';
import { issueLabelApi } from '../../api/issueLabel/issueLabelApi';
import { workLogApi } from '../../api/workLog/workLogApi';
// New imports for the new APIs
import { portfolioApi } from '../../api/portfolio/portfolioApi';
import { milestoneApi } from '../../api/milestone/milestoneApi';
import { statusReportApi } from '../../api/statusReport/statusReportApi';
import { projectBudgetApi } from '../../api/projectBudget/projectBudgetApi';
import { projectRiskApi } from '../../api/projectRisk/projectRiskApi';
import { resourceAllocationApi } from '../../api/resourceAllocation/resourceAllocationApi';
import { timesheetApi } from '../../api/timesheet/timesheetApi';
import { projectTimesheetApi } from '../../api/timesheet/projectTimesheetApi';
import { notificationApi } from '../../api/notification/notificationApi';
import { formApi } from '../../api/form/formApi';
import { retroApi } from '../../api/retrospective/retrospectiveApi';
import { conversationApi } from '../../api/conversation/conversationApi.ts';
import { messageApi } from '../../api/message/messageApi.ts';
import { eventApi } from '../../api/event/eventApi.ts';
import { communityApi } from '../../api/community/communityApi.ts';
import { metricsApi } from '../../api/metrics/metricsApi.ts';
import { logsApi } from '../../api/metrics/logsApi.ts';
import { rolePermissionApi } from '../../api/rolePermission/rolePermissionApi.ts';
import { permissionMappingApi } from '../../api/rolePermission/permissionMappingApi.tsx';
import { adminUserApi } from '../../api/admin/adminUserApi.ts';
// 1) Persist config
const persistConfig = {
  key: 'root',
  storage,
  // We want to persist both 'auth' AND 'theme'
  whitelist: ['auth', 'theme', 'organization', 'conversation', 'message'],
};

// 2) Combine your slices
const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  conversation: conversationReducer,
  message: messageReducer,
  organization: organizationReducer,


  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [userOrganizationApi.reducerPath]: userOrganizationApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer, 
  [teamApi.reducerPath]: teamApi.reducer,
  [userTeamApi.reducerPath]: userTeamApi.reducer,
  [invitationApi.reducerPath]: invitationApi.reducer,
  [userSettingsApi.reducerPath]: userSettingsApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [projectMemberApi.reducerPath]: projectMemberApi.reducer,
  [sprintApi.reducerPath]: sprintApi.reducer,
  [labelApi.reducerPath]: labelApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [boardColumnApi.reducerPath]: boardColumnApi.reducer,
  [issueApi.reducerPath]: issueApi.reducer,
  [issueTypeApi.reducerPath]: issueTypeApi.reducer,
  [issueWatcherApi.reducerPath]: issueWatcherApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [attachmentApi.reducerPath]: attachmentApi.reducer,
  [issueLabelApi.reducerPath]: issueLabelApi.reducer, 
  [issueHistoryApi.reducerPath]: issueHistoryApi.reducer,
  [workLogApi.reducerPath]: workLogApi.reducer,
  [portfolioApi.reducerPath]: portfolioApi.reducer,
  [milestoneApi.reducerPath]: milestoneApi.reducer,
  [statusReportApi.reducerPath]: statusReportApi.reducer,
  [projectBudgetApi.reducerPath]: projectBudgetApi.reducer,
  [projectRiskApi.reducerPath]: projectRiskApi.reducer,
  [resourceAllocationApi.reducerPath]: resourceAllocationApi.reducer,
  [timesheetApi.reducerPath]: timesheetApi.reducer,
  [projectTimesheetApi.reducerPath]: projectTimesheetApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [formApi.reducerPath]: formApi.reducer,
  [retroApi.reducerPath]: retroApi.reducer,
  [conversationApi.reducerPath]: conversationApi.reducer,
  [messageApi.reducerPath]: messageApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [metricsApi.reducerPath]: metricsApi.reducer,
  [logsApi.reducerPath]: logsApi.reducer,
  [rolePermissionApi.reducerPath]: rolePermissionApi.reducer,
  [permissionMappingApi.reducerPath]: permissionMappingApi.reducer,
  [adminUserApi.reducerPath]: adminUserApi.reducer,

});

// 3) Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4) Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware,
       userApi.middleware,
        userOrganizationApi.middleware,
        organizationApi.middleware,
        subscriptionApi.middleware,
        teamApi.middleware,
        userTeamApi.middleware, 
        invitationApi.middleware,
        userSettingsApi.middleware,
        projectApi.middleware,
        projectMemberApi.middleware,
        sprintApi.middleware,
        labelApi.middleware,
        boardApi.middleware,
        boardColumnApi.middleware,
        issueApi.middleware,
        issueTypeApi.middleware,
        issueWatcherApi.middleware,
        commentApi.middleware,
        attachmentApi.middleware,
        issueHistoryApi.middleware,
        issueLabelApi.middleware,
        workLogApi.middleware,
        projectApi.middleware,
      portfolioApi.middleware,
      milestoneApi.middleware,
      statusReportApi.middleware,
      projectBudgetApi.middleware,
      projectRiskApi.middleware,
      resourceAllocationApi.middleware,
      timesheetApi.middleware,
      projectTimesheetApi.middleware,
      notificationApi.middleware,
      formApi.middleware,
      retroApi.middleware,
      conversationApi.middleware,
      messageApi.middleware,
      eventApi.middleware,
      communityApi.middleware,
      metricsApi.middleware,
      logsApi.middleware,
      rolePermissionApi.middleware,
      permissionMappingApi.middleware,
      adminUserApi.middleware,
      ),
});

// 5) Create the persistor
export const persistor = persistStore(store);

// 6) Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
