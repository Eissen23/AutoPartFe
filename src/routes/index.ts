import { createElement, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router";
import { useAuthContext } from "#src/contexts";
import { coreRoutes } from "./core";

const RootLayout = lazy(() => import("#src/components/layouts/RootLayout.tsx"));

function EntryRedirect() {
  const { isAuthenticated } = useAuthContext();

  return createElement(Navigate, {
    to: isAuthenticated ? "/dashboard" : "/login",
    replace: true,
  });
}

/**
 * Global root route configuration
 * Using React Router v7 with createBrowserRouter and lazy loading
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: EntryRedirect,
      },
      ...coreRoutes,
    ],
  },
  // Catch-all route redirects to dashboard/login by auth state
  {
    path: "*",
    Component: EntryRedirect,
  },
]);
