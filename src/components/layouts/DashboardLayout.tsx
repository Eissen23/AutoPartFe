import { Outlet, NavLink } from "react-router";
import { dashboardNavItems } from "#src/config/dashboardNav";

/**
 * Dashboard Layout
 *
 * Sidebar navigation is driven entirely by `dashboardNavItems` in
 * src/config/dashboardNav.tsx — edit that file to add, remove, or
 * reorder sidebar entries. Each entry carries its own icon so no
 * mapping logic is needed here.
 */
export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      {/* Top bar */}
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

      {/* Body */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {dashboardNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/dashboard"}
                className={({ isActive }) =>
                  `nav-item${isActive ? " nav-item-active" : ""}`
                }
              >
                {item.icon && (
                  <span className="nav-item-icon">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
