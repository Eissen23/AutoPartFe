import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { ChevronDown } from "lucide-react";
import {
  dashboardNavItems,
  type DashboardNavItem,
} from "#src/config/dashboardNav";

const MAX_NAV_LEVELS = 3;
const MAX_CHILD_DEPTH = MAX_NAV_LEVELS - 1;

const createItemKey = (
  item: DashboardNavItem,
  parentKey: string,
  index: number,
): string => `${parentKey}:${item.href || item.label}:${index}`;

const branchHasActivePath = (
  item: DashboardNavItem,
  pathname: string,
  depth: number,
): boolean => {
  const matchesCurrentItem =
    Boolean(item.href) && pathname.startsWith(item.href);

  if (matchesCurrentItem) {
    return true;
  }

  if (depth >= MAX_CHILD_DEPTH || !item.children?.length) {
    return false;
  }

  return item.children.some((child) =>
    branchHasActivePath(child, pathname, depth + 1),
  );
};

const buildInitialExpandedState = (
  items: DashboardNavItem[],
  pathname: string,
  depth = 0,
  parentKey = "root",
): Record<string, boolean> =>
  items.reduce<Record<string, boolean>>((acc, item, index) => {
    const itemKey = createItemKey(item, parentKey, index);
    const canExpand = depth < MAX_CHILD_DEPTH && Boolean(item.children?.length);

    if (!canExpand) {
      return acc;
    }

    const children = item.children ?? [];
    const hasActiveChild = children.some((child) =>
      branchHasActivePath(child, pathname, depth + 1),
    );

    acc[itemKey] = hasActiveChild;

    Object.assign(
      acc,
      buildInitialExpandedState(children, pathname, depth + 1, itemKey),
    );

    return acc;
  }, {});

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
    () => buildInitialExpandedState(dashboardNavItems, location.pathname),
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNavItems = (
    items: DashboardNavItem[],
    depth = 0,
    parentKey = "root",
  ) =>
    items.map((item, index) => {
      const itemKey = createItemKey(item, parentKey, index);
      const isChildLevel = depth > 0;
      const isGrandchildLevel = depth > 1;
      const depthClasses = `${isChildLevel ? " nav-item-child" : ""}${
        isGrandchildLevel ? " nav-item-grandchild" : ""
      }`;
      const canExpand =
        depth < MAX_CHILD_DEPTH && Boolean(item.children?.length);

      if (canExpand) {
        const children = item.children ?? [];
        const isExpanded = expandedGroups[itemKey] ?? false;
        const hasActiveChild = children.some((child) =>
          branchHasActivePath(child, location.pathname, depth + 1),
        );
        const groupId = `sidebar-group-${itemKey.replace(/[^a-zA-Z0-9-_]/g, "-")}`;

        return (
          <div key={itemKey} className="nav-group">
            <button
              type="button"
              onClick={() => toggleGroup(itemKey)}
              className={`nav-item nav-item-parent${depthClasses}${
                hasActiveChild ? " nav-item-active" : ""
              }`}
              aria-expanded={isExpanded}
              aria-controls={groupId}
            >
              {item.icon && <span className="nav-item-icon">{item.icon}</span>}
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown
                size={16}
                className={`nav-chevron${isExpanded ? " nav-chevron-expanded" : ""}`}
                aria-hidden="true"
              />
            </button>

            {isExpanded && (
              <div id={groupId} className="nav-children">
                {renderNavItems(children, depth + 1, itemKey)}
              </div>
            )}
          </div>
        );
      }

      if (!item.href) {
        return (
          <div key={itemKey} className={`nav-item${depthClasses}`}>
            {item.icon && <span className="nav-item-icon">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        );
      }

      return (
        <NavLink
          key={itemKey}
          to={item.href}
          end={item.href === "/dashboard"}
          className={({ isActive }) =>
            `nav-item${depthClasses}${isActive ? " nav-item-active" : ""}`
          }
        >
          {item.icon && <span className="nav-item-icon">{item.icon}</span>}
          <span>{item.label}</span>
        </NavLink>
      );
    });

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
          <nav className="sidebar-nav">{renderNavItems(dashboardNavItems)}</nav>
        </aside>

        {/* Page content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
