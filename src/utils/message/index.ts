/**
 * Ant Design Message Module
 *
 * Exports centralized message configuration, hooks, and provider
 */

export {
  useMessage,
  initializeStaticMessage,
  getStaticMessage,
} from "./useMessage";
export {
  messageConfig,
  setMessageInstance,
  getMessageInstance,
} from "./config";
export { MessageProvider } from "./provider";
