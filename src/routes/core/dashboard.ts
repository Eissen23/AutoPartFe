import { lazy } from "react";
import type { RouteObject } from "react-router";
import ProtectedDashboardLayout from "#src/components/layouts/ProtectedDashboardLayout";
import RoleManagenent from "#src/pages/superadmin/role";
import UserManagementPage from "#src/pages/superadmin/user";

const HomePage = lazy(() => import("#src/pages/HomePage"));
const WarehousesPage = lazy(() => import("#src/pages/admin/warehouses"));
const ProductPage = lazy(() => import("#src/pages/admin/products"));
const CategoriesPage = lazy(() => import("#src/pages/admin/categories"));

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    Component: ProtectedDashboardLayout,
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
      {
        path: "/dashboard/products",
        Component: ProductPage,
        handle: { label: "Product" },
      },
      {
        path: "/dashboard/categories",
        Component: CategoriesPage,
        handle: { label: "Categories" },
      },
      {
        path: "/dashboard/roles",
        Component: RoleManagenent,
        handle: { label: "Roles" },
      },
      {
        path: "/dashboard/users",
        Component: UserManagementPage,
        handle: { label: "Users" },
      },
    ],
  },
];
