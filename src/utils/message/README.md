# Centralized Message Configuration & Usage Guide

## Overview

This directory contains a centralized message configuration system for Ant Design's message component. This ensures consistent messaging behavior across the entire application and makes it easy to update message settings globally.

## Structure

- **`config.ts`**: Message configuration settings and instance management
- **`useMessage.ts`**: Hook and utilities for accessing the message instance
- **`provider.tsx`**: React provider component for message context
- **`index.ts`**: Exports all public APIs

## Configuration

Edit `config.ts` to adjust message settings:

```typescript
export const messageConfig = {
  duration: 3, // Display duration in seconds
  maxCount: 3, // Maximum number of messages to display simultaneously
  top: 24, // Distance from top of viewport in pixels
};
```

## Usage

### In React Hooks

Use the `useMessage()` hook in any custom hook:

```typescript
import { useMessage } from "#src/utils/message";
import { useApiMutation } from "#src/utils/api";

export function useMyAction() {
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (data) => {
      // Your API call here
      return await myApi(data);
    },
    onSuccess: () => {
      message.success("Action completed!");
    },
    onError: () => {
      message.error("Action failed!");
    },
  });
}
```

### In React Components

Use the `useMessage()` hook in any React component:

```typescript
import { useMessage } from '#src/utils/message';

export function MyComponent() {
  const message = useMessage();

  const handleClick = () => {
    message.success("Success!");
    message.info("Information");
    message.warning("Warning");
    message.error("Error!");
  };

  return <button onClick={handleClick}>Show Message</button>;
}
```

## Message Methods

The message instance provides these methods:

- **`message.success(content)`**: Show success message
- **`message.error(content)`**: Show error message
- **`message.info(content)`**: Show info message
- **`message.warning(content)`**: Show warning message
- **`message.loading(content)`**: Show loading message (returns promise)

## Setup in App

The `MessageProvider` component must be placed in your App component to enable the message context holder:

```typescript
// App.tsx
import { MessageProvider } from '#src/utils/message';

function App() {
  return (
    <Provider store={store}>
      <ApiProvider>
        <MessageProvider>
          <RouterProvider router={router} />
        </MessageProvider>
      </ApiProvider>
    </Provider>
  );
}
```

## Benefits

1. **Centralized Configuration**: Update message settings in one place, affects entire app
2. **Consistent Behavior**: All messages follow the same rules
3. **Easy Maintenance**: Changes to message logic only require updates in this module
4. **Type Safe**: Full TypeScript support
5. **Best Practices**: Follows Ant Design recommendations for message management

## Migration

If you have existing code using `import { message } from 'antd'`, replace with:

```typescript
// Before
import { message } from "antd";

export function useMyHook() {
  // ...
  message.success("Done");
}

// After
import { useMessage } from "#src/utils/message";

export function useMyHook() {
  const message = useMessage();
  // ...
  message.success("Done");
}
```

## Advanced: Static Message Access

For use cases outside React components, you can use static methods:

```typescript
import { getStaticMessage } from "#src/utils/message";

// In non-React context
const msg = getStaticMessage();
msg.success("Message from outside React!");
```
