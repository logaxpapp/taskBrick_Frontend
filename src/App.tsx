// File: src/App.tsx
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { useSelectedOrgId } from './contexts/OrgContext';
import Loader from './components/commons/Loader';
import { useAppSelector } from './app/hooks/redux';
import { initSocketConnection } from './socket/socketClient';
const AdminMetrics = lazy(() => import('./pages/metrics_logs/AdminDashboard'));
const LogsDashboard = lazy(() => import('./pages/metrics_logs/LogsDashboard'));
// Layouts
const PublicLayout = lazy(() => import('./layout/PublicLayout'));
const MainLayout = lazy(() => import('./layout/MainLayout'));
const AdminLayout = lazy(() => import('./layout/AdminLayout'));
const RolePermissionManager = lazy(() => import('./pages/RolePermission/RolePermissionManager'));

// Public pages
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const ContactUs = lazy(() => import('./pages/Home/ContactUs'));
const Services = lazy(() => import('./pages/Home/Services'));
const About = lazy(() => import('./pages/Home/About'));
const SignUp = lazy(() => import('./pages/User/SignUp'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ResetSuccess = lazy(() => import('./pages/auth/ResetSuccess'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

// Auth’d pages
const Project = lazy(() => import('./pages/Project/Project'));
const ProjectsListPage = lazy(() => import('./pages/Project/Project'));

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const GetStarted = lazy(() => import('./pages/Dashboard/GetStarted'));
const TeamManager = lazy(() => import('./pages/Team/TeamManager'));
const AllUser = lazy(() => import('./pages/User/AllUser'));
const Chat = lazy(() => import('./pages/Chat/Chat'));
const Calendar = lazy(() => import('./pages/Calendar/Calendar'));
const ProfilePage = lazy(() => import('./pages/User/ProfilePage'));
const UserSettings = lazy(() => import('./pages/Settings/UserSettings'));
const PreDashboard = lazy(() => import('./pages/auth/PreDashboard'));
const InvitationLanding = lazy(() => import('./pages/Team/InvitationLanding'));
const NotificationManager = lazy(() => import('./pages/Notification/NotificationManager'));
const SprintDetailPage = lazy(() => import('./pages/Sprint/SprintDetailModal'));
const SprintIssueListView = lazy(() => import('./pages/Sprint/SprintIssueListView'));

// Organization / Subscription
const OrgSubscriptionManager = lazy(() => import('./pages/Supscription/OrgSubscriptionManager'));
const ListOrgUsers = lazy(() => import('./pages/User/ListOrgUsers'));
const ProjectManager = lazy(() => import('./pages/Project/ProjectManager'));
const SprintManager = lazy(() => import('./pages/Sprint/SprintManager'));
const LabelManager = lazy(() => import('./pages/Label/LabelManager'));
const IssuesDetailPage = lazy(() => import('./pages/Issues/IssueDetailPage'));
const PortfolioManager = lazy(() => import('./pages/Portfolio/PortfolioManager'));
const ProjectDetailContainer = lazy(() => import('./pages/Management/ProjectDetailContainer'));
const IssueListView = lazy(() => import('./pages/Issues/IssueListView'));
const MyIssueListView = lazy(() => import('./pages/Issues/MyIssueListView'));
const IssuesWatchedByMe = lazy(() => import('./pages/Issues/IssuesWatchedByMe'));
const AcceptInvite = lazy(() => import('./pages/auth/AcceptInvite'));
const SprintReport = lazy(() => import('./pages/Reports/SprintReport'));
const Velocity = lazy(() => import('./pages/Reports/Velocity'));
const BurnupChart = lazy(() => import('./pages/Reports/BurnupChart'));
const BurndownChart = lazy(() => import('./pages/Reports/BurndownChart'));
const KnowledgeBase = lazy(() => import('./pages/Dashboard/KnowledgeBase'));


// Admin routes
const ListOrganizationManager = lazy(() => import('./pages/Organization/ListOrganizationManager'));
const AdminDashboard = lazy(() => import('./pages/Dashboard/AdminDashboard'));
const SubscriptionPlan = lazy(() => import('./pages/Supscription/SubscriptionPlanManager'));
const AdminOrgSubscriptionManager = lazy(() => import('./pages/Supscription/AdminOrgSubscriptionManager'));
const FeaturesManager = lazy(() => import('./pages/Features/FeatureManager'));
const InvitationManager = lazy(() => import('./pages/Team/InvitationManager'));
const IssueTypeManager = lazy(() => import('./pages/Issues/IssueTypeManager'));
const CommunityQAManager = lazy(() => import('./pages/Community/CommunityQAManager'));
const PublicQAPage = lazy(() => import('./pages/Community/PublicQAPage'));
const PermissionManager = lazy(() => import('./pages/RolePermission/PermissionManager'));
const  RolePermissionsPage = lazy(() => import('./pages/RolePermission/RolePermissionsPage'));
const AdminUserManager = lazy(() => import('./pages/User/AdminUserManager'));

const StepByStepParent = lazy(() => import('./pages/Dashboard/StepByStep/StepByStepParent'));
const DeveloperAPIParent = lazy(() => import('./pages/Dashboard/DevApi/DeveloperAPIParent'));
function App() {
  const { mode, fontSize, bgColor } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);

  // Get the selected org ID
  const selectedOrgId = useSelectedOrgId();

   /**
   * Initialize Socket.IO once we have a user logged in
   * e.g. user?._id, user?.orgId
   */
   useEffect(() => {
    if (user && user._id && selectedOrgId) {
      initSocketConnection(user._id, selectedOrgId);
    }
  }, [user, selectedOrgId]);


  useEffect(() => {
    // 1) Toggle dark mode class on <html>
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2) Set base font size
    switch (fontSize) {
      case 'small':
        document.documentElement.style.fontSize = '14px';
        break;
      case 'medium':
        document.documentElement.style.fontSize = '16px';
        break;
      case 'large':
        document.documentElement.style.fontSize = '18px';
        break;
    }

    // 3) Set background color
    document.body.style.backgroundColor = bgColor;
  }, [mode, fontSize, bgColor]);

  return (
    <div className="font-sans">
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ---------- Public Layout ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/invite/:token" element={<InvitationLanding />} />
            <Route path="/invite" element={<AcceptInvite />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ---------- Main Layout (Auth’d) ---------- */}
          <Route element={<MainLayout />}>
            <Route path="/pre-dashboard" element={<PreDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/get-started" element={<GetStarted />} />
            <Route path="/dashboard/projects" element={<ProjectsListPage />} />
            <Route path="/dashboard/project/:projectId/*" element={<Project />} />
           
            <Route path="/dashboard/team-manager" element={<TeamManager />} />
            <Route path="/dashboard/chat" element={<Chat />} />
          
            <Route path="/dashboard/calendar" element={<Calendar />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/settings/user" element={<UserSettings />} />
            <Route path="/dashboard/subscription" element={<OrgSubscriptionManager />} />
            <Route path="/dashboard/subscription-plan" element={<SubscriptionPlan />} />
            <Route path="/dashboard/users" element={<ListOrgUsers />} />
            <Route path="/dashboard/invitations" element={<InvitationManager />} />
            <Route path="/dashboard/project-manager" element={<ProjectManager />} />
            <Route path="/dashboard/sprint-manager" element={<SprintManager />} />
            <Route path="/dashboard/label-manager" element={<LabelManager />} />
            <Route path="/dashboard/issue-type-manager" element={<IssueTypeManager />} />
            <Route path="/dashboard/issues/:issueId" element={<IssuesDetailPage />} />
            <Route path="/dashboard/portfolio" element={<PortfolioManager />} />
            <Route path="/dashboard/project-details" element={<ProjectDetailContainer />} />
            <Route path="/dashboard/notification" element={<NotificationManager />} />
            <Route path="/dashboard/issues" element={<IssueListView />} />
            <Route path="/dashboard/my-issues" element={<MyIssueListView />} />
            <Route path="/dashboard/issues-watched-by-me" element={<IssuesWatchedByMe />} />
            <Route path="/dashboard/sprint-detail/:sprintId" element={<SprintDetailPage />} />
            <Route path="/dashboard/sprint-issue" element={<SprintIssueListView />} />

            <Route path="/dashboard/step-by-step" element={<StepByStepParent />} />
            <Route path="/dashboard/developer-api" element={<DeveloperAPIParent />} />
            <Route path="/dashboard/public-qa" element={<PublicQAPage />} />
            <Route path="/dashboard/knowledge-base" element={<KnowledgeBase />} />

            <Route path="/dashboard/burnup" element={<BurnupChart />} />
            <Route path="/dashboard/burndown" element={<BurndownChart />} />
            <Route path="/dashboard/sprint-report" element={<SprintReport />} />
            <Route path="/dashboard/velocity" element={<Velocity />} />
           
            
            {/* Add more routes as needed */}
          </Route>

          {/* ---------- Admin Layout ---------- */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/organization-manager" element={<ListOrganizationManager />} />
            <Route path="/admin/users" element={<AllUser />} />
            <Route path="/admin/subscription" element={<AdminOrgSubscriptionManager />} />
            <Route path="/admin/features" element={<FeaturesManager />} />
            <Route path="/admin/subscription-plan" element={<SubscriptionPlan />} />
            <Route path="/admin/community-qa" element={<CommunityQAManager />} />
            <Route path="/admin/role-permission" element={<RolePermissionManager />} />
            <Route path="/admin/metrics" element={<AdminMetrics />} />
            <Route path="/admin/logs" element={<LogsDashboard />} />
            <Route path="/admin/permissions" element={<PermissionManager />} />
            <Route path="/admin/role-permissions/:roleId" element={<RolePermissionsPage />} />
            <Route path="/admin/admin-user-manager" element={<AdminUserManager />} />
           
            {/* Additional Admin routes */}
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
