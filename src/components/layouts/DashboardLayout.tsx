import { Outlet } from "react-router";
import { dashboardRoutes } from "#src/routes/core/dashboard";

/**
 * Interface for dashboard route with navigation metadata
 */
interface DashboardRoute {
  path?: string;
  index?: boolean;
  handle?: {
    label?: string;
  };
}

/**
 * Dashboard Layout Component
 * Acts as a wrapper for dashboard routes with top navigation and sidebar
 * Dark and yellow theme
 */
export default function DashboardLayout() {
  // Get child routes from the dashboard routes configuration
  const dashboardRoute = dashboardRoutes.find(
    (route) => route.path === "/dashboard",
  );
  const childRoutes = (dashboardRoute?.children || []) as DashboardRoute[];

  // Filter and map child routes to navigation items
  const navItems = childRoutes
    .filter((route) => route.path || route.index)
    .map((route) => {
      const label =
        route.handle?.label ||
        (route.path
          ? route.path.charAt(0).toUpperCase() + route.path.slice(1)
          : "Home");
      const href = route.path ? `/dashboard${route.path}` : "/dashboard";

      return { label, href };
    });

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="dashboard-top">
        <div className="dashboard-top-left">
          <div className="logo-placeholder">Logo</div>
        </div>
        <div className="dashboard-top-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-item">
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
