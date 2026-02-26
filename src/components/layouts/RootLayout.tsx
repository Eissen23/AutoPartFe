import { Outlet } from "react-router";

/**
 * Root Layout Component
 * This wraps the basic routes in the application
 */
export default function RootLayout() {
  return (
    <div className="app-container">
      <main className="app-main">
        {/* Child routes render here */}
        <Outlet />
      </main>
    </div>
  );
}
