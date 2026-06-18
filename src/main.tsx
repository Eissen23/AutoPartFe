import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.css";
import App from "./App.tsx";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider layer={true}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
