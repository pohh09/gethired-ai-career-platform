import { Suspense, lazy } from "react";
import { useAuthStore } from "../store/authStore";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/ui/Loader";

const LandingPage = lazy(() => import("../pages/LandingPage"));

export default function RootRoute() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return (
      <Suspense fallback={<Loader fullScreen text="Loading GetHired..." />}>
        <LandingPage />
      </Suspense>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}
