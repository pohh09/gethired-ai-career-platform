import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute from "./RootRoute";
import Loader from "../components/ui/Loader";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Jobs = lazy(() => import("../pages/Jobs"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Calendar = lazy(() => import("../pages/Calendar"));
const AIWorkspace = lazy(() => import("../pages/AIWorkspace"));
const ResumeBuilder = lazy(() => import("../pages/ResumeBuilder"));
const Community = lazy(() => import("../pages/Community"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

const DemoLayout = lazy(() => import("../layouts/DemoLayout"));
const DemoDashboard = lazy(() => import("../pages/demo/DemoDashboard"));
const DemoJobs = lazy(() => import("../pages/demo/DemoJobs"));
const DemoApplications = lazy(() => import("../pages/demo/DemoApplications"));
const DemoAIWorkspace = lazy(() => import("../pages/demo/DemoAIWorkspace"));
const DemoAnalytics = lazy(() => import("../pages/demo/DemoAnalytics"));
const DemoCalendar = lazy(() => import("../pages/demo/DemoCalendar"));

const router = createBrowserRouter([
  {
    path: "/landing",
    element: (
      <Suspense fallback={<Loader fullScreen text="Loading GetHired..." />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/demo",
    element: (
      <Suspense fallback={<Loader fullScreen text="Launching Demo Mode..." />}>
        <DemoLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader text="Loading Demo Dashboard..." />}>
            <DemoDashboard />
          </Suspense>
        ),
      },
      {
        path: "jobs",
        element: (
          <Suspense fallback={<Loader text="Loading Demo Jobs..." />}>
            <DemoJobs />
          </Suspense>
        ),
      },
      {
        path: "applications",
        element: (
          <Suspense fallback={<Loader text="Loading Demo Tracker..." />}>
            <DemoApplications />
          </Suspense>
        ),
      },
      {
        path: "ai-workspace",
        element: (
          <Suspense fallback={<Loader text="Loading Demo AI Workspace..." />}>
            <DemoAIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "analytics",
        element: (
          <Suspense fallback={<Loader text="Loading Demo Analytics..." />}>
            <DemoAnalytics />
          </Suspense>
        ),
      },
      {
        path: "calendar",
        element: (
          <Suspense fallback={<Loader text="Loading Demo Calendar..." />}>
            <DemoCalendar />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader fullScreen text="Loading..." />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loader fullScreen text="Loading..." />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <RootRoute />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader text="Loading Dashboard..." />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "jobs",
        element: (
          <Suspense fallback={<Loader text="Loading Jobs..." />}>
            <Jobs />
          </Suspense>
        ),
      },
      {
        path: "interview-prep",
        element: (
          <Suspense fallback={<Loader text="Loading AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "interview",
        element: (
          <Suspense fallback={<Loader text="Loading AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "analytics",
        element: (
          <Suspense fallback={<Loader text="Loading Analytics..." />}>
            <Analytics />
          </Suspense>
        ),
      },
      {
        path: "calendar",
        element: (
          <Suspense fallback={<Loader text="Loading Interview Planner..." />}>
            <Calendar />
          </Suspense>
        ),
      },
      {
        path: "ai-workspace",
        element: (
          <Suspense fallback={<Loader text="Loading AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "ai-insights",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "resume-optimizer",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "cover-letter",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "job-analyzer",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "career-coach",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "resumes",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "resumes/builder",
        element: (
          <Suspense fallback={<Loader text="Launching Resume Builder..." />}>
            <ResumeBuilder />
          </Suspense>
        ),
      },
      {
        path: "ai-workspace/builder",
        element: (
          <Suspense fallback={<Loader text="Launching Resume Builder..." />}>
            <ResumeBuilder />
          </Suspense>
        ),
      },
      {
        path: "resume-builder",
        element: (
          <Suspense fallback={<Loader text="Launching Resume Builder..." />}>
            <ResumeBuilder />
          </Suspense>
        ),
      },
      {
        path: "community",
        element: (
          <Suspense fallback={<Loader text="Loading Community Hub..." />}>
            <Community />
          </Suspense>
        ),
      },
      {
        path: "documents",
        element: (
          <Suspense fallback={<Loader text="Redirecting to AI Workspace..." />}>
            <AIWorkspace />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loader text="Loading Notifications..." />}>
            <Analytics />
          </Suspense>
        ),
      },
      {
        path: "activity",
        element: (
          <Suspense fallback={<Loader text="Loading Activity Timeline..." />}>
            <Analytics />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader text="Loading Profile..." />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loader text="Loading Settings..." />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader fullScreen text="Loading..." />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
