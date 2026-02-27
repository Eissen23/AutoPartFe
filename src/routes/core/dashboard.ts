import { lazy } from "react";
import type { RouteObject } from "react-router";
import DashboardLayout from "#src/components/layouts/DashboardLayout";

const HomePage = lazy(() => import("#src/pages/HomePage"));
const WarehousesPage = lazy(() => import("#src/pages/admin/warehouses"));

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: HomePage,
        handle: { label: "Home" },
      },
      {
        path: "/dashboard/warehouse",
        Component: WarehousesPage,
        handle: { label: "Warehouse" },
      },
    ],
  },
];
