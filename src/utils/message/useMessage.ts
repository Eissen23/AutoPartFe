/**
 * Centralized Message Hook
 *
 * Provides a unified interface for displaying messages throughout the app
 * Uses Ant Design's message component with centralized configuration
 */

import { message as antdMessage } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

let staticMessageInstance: MessageInstance | null = null;

/**
 * Initialize the static message instance (called during app setup)
 * This is useful for showing messages outside of React components
 *
 * @param instance - The message instance
 */
export const initializeStaticMessage = (instance: MessageInstance): void => {
  staticMessageInstance = instance;
};

/**
 * Get the message instance for use outside of components
 */
export const getStaticMessage = (): MessageInstance => {
  if (!staticMessageInstance) {
    // Return the default Ant Design message if not initialized
    return antdMessage;
  }
  return staticMessageInstance;
};

/**
 * Unified message interface used throughout the app
 * This provides a consistent interface for displaying messages
 *
 * Usage in any component:
 * ```tsx
 * import { useMessage } from '#src/utils/message';
 *
 * export function MyComponent() {
 *   const message = useMessage();
 *   const handleClick = () => {
 *     message.success("Operation completed!");
 *   };
 * }
 * ```
 */
export const useMessage = (): MessageInstance => {
  // In React components, use the default Ant Design message
  // The ConfigProvider context holder will handle the positioning
  return antdMessage;
};
