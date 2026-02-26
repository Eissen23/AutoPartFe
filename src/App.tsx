import { RouterProvider } from "react-router";
import { Suspense } from "react";
import { router } from "./routes";
import { ApiProvider } from "./utils/api/provider";

function App() {
  return (
    <ApiProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ApiProvider>
  );
}

export default App;
