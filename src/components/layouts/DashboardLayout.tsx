import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";
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
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () =>
      dashboardNavItems.reduce<Record<string, boolean>>((acc, item) => {
        if (item.children?.length) {
          acc[item.href] = item.children.some((child) =>
            location.pathname.startsWith(child.href),
          );
        }
        return acc;
      }, {}),
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
            {dashboardNavItems.map((item) => {
              if (item.children?.length) {
                const isExpanded = expandedGroups[item.href] ?? false;
                const hasActiveChild = item.children.some((child) =>
                  location.pathname.startsWith(child.href),
                );

                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.href)}
                      className={`nav-item${hasActiveChild ? " nav-item-active" : ""}`}
                      aria-expanded={isExpanded}
                      aria-controls={`sidebar-group-${item.href.replaceAll("/", "-")}`}
                    >
                      {item.icon && (
                        <span className="nav-item-icon">{item.icon}</span>
                      )}
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`ml-auto transition-transform${isExpanded ? " rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <div
                        id={`sidebar-group-${item.href.replaceAll("/", "-")}`}
                        className="ml-6"
                      >
                        {item.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            end={child.href === "/dashboard"}
                            className={({ isActive }) =>
                              `nav-item${isActive ? " nav-item-active" : ""}`
                            }
                          >
                            {child.icon && (
                              <span className="nav-item-icon">
                                {child.icon}
                              </span>
                            )}
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
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
