import { RouterProvider } from "react-router";
import { Suspense } from "react";
import { router } from "./routes";
import { ApiProvider } from "./utils/api/provider";
import { AuthProvider } from "#src/contexts/AuthContext";

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
