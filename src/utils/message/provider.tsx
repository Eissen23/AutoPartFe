/**
 * Message Provider Context
 *
 * Provides global message configuration and context holder for Ant Design messages
 */

import React from "react";
import { App as AntdApp } from "antd";
import { messageConfig } from "./config";

/**
 * MessageProvider component
 *
 * Wraps your application with Ant Design's App component to provide message context holder
 * This should be placed at a high level in your app (typically in the root layout or main App component)
 *
 * Usage:
 * ```tsx
 * import { MessageProvider } from '#src/utils/message';
 *
 * export function App() {
 *   return (
 *     <MessageProvider>
 *       <YourAppContent />
 *     </MessageProvider>
 *   );
 * }
 * ```
 */
export function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AntdApp
      message={{ maxCount: messageConfig.maxCount, top: messageConfig.top }}
    >
      {children}
    </AntdApp>
  );
}
