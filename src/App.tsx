import { RouterProvider } from "react-router";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { router } from "./routes";
import { ApiProvider } from "./utils/api/provider";
import { store } from "#src/store";

function App() {
  return (
    <Provider store={store}>
      <ApiProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ApiProvider>
    </Provider>
  );
}

export default App;
