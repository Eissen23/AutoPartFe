/**
 * Protected Dashboard Layout
 *
 * Wrapper component that ensures the user is authenticated
 * before rendering the dashboard layout
 */

import { useAuthContext } from "#src/contexts";
import { Navigate } from "react-router";
import DashboardLayout from "./DashboardLayout";

/**
 * ProtectedDashboardLayout component
 * Checks if user is authenticated before rendering dashboard
 * Redirects to login if user is not authenticated
 */
export default function ProtectedDashboardLayout() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
}
