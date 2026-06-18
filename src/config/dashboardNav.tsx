import { Home, Warehouse, Package, FolderTree } from "lucide-react";
import type { ReactElement } from "react";

/**
 * Represents a single item in the dashboard sidebar.
 *
 * - `href`  — absolute route path (must match a route registered in src/routes/core/dashboard.ts)
 * - `label` — display text shown in the sidebar
 * - `icon`  — optional icon element; accepts any React element so you can use
 *              Lucide icons, Ant Design icons, or raw font/svg icons:
 *
 * @example Lucide icon
 *   icon: <Home size={18} />
 *
 * @example Font icon (e.g. Font Awesome loaded globally)
 *   icon: <i className="fa fa-home" />
 */
export interface DashboardNavItem {
  href: string;
  label: string;
  icon?: ReactElement;
  children?: DashboardNavItem[];
}

/**
 * Dashboard sidebar navigation items.
 *
 * Add or remove entries here to change what appears in the sidebar.
 * Each `href` must correspond to a route registered under /dashboard in
 * src/routes/core/dashboard.ts.
 */
export const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: <Home size={18} />,
  },
  {
    href: "/dashboard/warehouse",
    label: "Warehouse",
    icon: <Warehouse size={18} />,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: <Package size={18} />,
  },
  {
    href: "/dashboard/categories",
    label: "Categories",
    icon: <FolderTree size={18} />,
  },
];
