import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.css";
import App from "./App.tsx";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, type ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorLink: "inherit",
    colorLinkHover: "inherit",
    colorLinkActive: "inherit",
    linkDecoration: "none",
    linkHoverDecoration: "none",
    linkFocusDecoration: "none",
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider layer={true}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
