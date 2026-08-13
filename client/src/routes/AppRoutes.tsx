import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute from "./RootRoute";
import Loader from "../components/ui/Loader";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Jobs = lazy(() => import("../pages/Jobs"));
const Companies = lazy(() => import("../pages/Companies"));
const CompanyDetail = lazy(() => import("../pages/CompanyDetail"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Calendar = lazy(() => import("../pages/Calendar"));
const AIWorkspace = lazy(() => import("../pages/AIWorkspace"));
const Resumes = lazy(() => import("../pages/Resumes"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Activity = lazy(() => import("../pages/Activity"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

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
        path: "companies",
        element: (
          <Suspense fallback={<Loader text="Loading Companies CRM..." />}>
            <Companies />
          </Suspense>
        ),
      },
      {
        path: "companies/:id",
        element: (
          <Suspense fallback={<Loader text="Loading Company Profile..." />}>
            <CompanyDetail />
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
          <Suspense fallback={<Loader text="Loading Resume Manager..." />}>
            <Resumes />
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
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "activity",
        element: (
          <Suspense fallback={<Loader text="Loading Activity Timeline..." />}>
            <Activity />
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
