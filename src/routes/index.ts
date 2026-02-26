import { createBrowserRouter } from "react-router";
import { coreRoutes } from "./core";
import { lazy } from "react";

const RootLayout = lazy(() => import("#src/components/layouts/RootLayout.tsx"));
const HomePage = lazy(() => import("../pages/HomePage.tsx"));
const NotFoundPage = lazy(() => import("#src/pages/NotFoundPage.tsx"));

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
        Component: HomePage,
      },
      ...coreRoutes,
    ],
  },
  // Catch-all route for 404s
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
