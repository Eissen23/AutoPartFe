import { RouterProvider } from "react-router";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { router } from "./routes";
import { ApiProvider } from "./utils/api/provider";
import { MessageProvider } from "#src/utils/message";
import { store } from "#src/store";

function App() {
  return (
    <Provider store={store}>
      <ApiProvider>
        <MessageProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </MessageProvider>
      </ApiProvider>
    </Provider>
  );
}

export default App;
