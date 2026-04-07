/**
 * Ant Design Message Configuration
 *
 * Centralized configuration for message notifications globally
 */

import type { MessageInstance } from "antd/es/message/interface";

export const messageConfig = {
  /**
   * Duration of message display in seconds
   * Set to 0 to display indefinitely
   */
  duration: 3,

  /**
   * Position from top of viewport (in pixels)
   */
  maxCount: 3,

  /**
   * Top offset in pixels
   */
  top: 24,
} as const;

/**
 * Message instance reference (will be set via setMessageInstance)
 * Used for centralized message control
 */
let messageInstance: MessageInstance | null = null;

/**
 * Set the message instance for use throughout the app
 * This should be called in the App component or root level
 *
 * @param instance - The message instance from Ant Design
 */
export const setMessageInstance = (instance: MessageInstance): void => {
  messageInstance = instance;
};

/**
 * Get the current message instance
 *
 * @returns The message instance or null if not initialized
 */
export const getMessageInstance = (): MessageInstance | null => {
  return messageInstance;
};
