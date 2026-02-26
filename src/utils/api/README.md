# API Utilities

Centralized API setup and data-fetching helpers for the AutoPart FE application.

## Features

- ✅ Configured Axios instance with automatic auth token injection
- ✅ Automatic token refresh on 401 errors
- ✅ OpenAPI client instances for all API endpoints
- ✅ React hooks for API calls with loading/error handling
- ✅ React Query integration for efficient data fetching
- ✅ TypeScript support with full type safety

## Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Usage

### 1. Authentication

```typescript
import { login, logout, isAuthenticated } from "@/utils/api";

// Login
const handleLogin = async () => {
  try {
    const response = await login({
      loginCredentials: "username@example.com",
      password: "password123",
    });
    console.log("Logged in:", response);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Logout
const handleLogout = async () => {
  await logout();
};

// Check authentication status
const authed = isAuthenticated();
```

### 2. Using OpenAPI Client Instances

Direct API calls using the generated OpenAPI clients:

```typescript
import { api } from "@/utils/api";

// Get all customers
const customers = await api.customers.apiV1CustomersGet();

// Get a specific customer
const customer = await api.customers.apiV1CustomersIdGet({ id: "customer-id" });

// Create a new customer
const newCustomer = await api.customers.apiV1CustomersPost({
  createCustomerRequest: {
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "123-456-7890",
    customerType: 1,
  },
});

// Update a customer
await api.customers.apiV1CustomersIdPut({
  id: "customer-id",
  updateCustomerRequest: {
    name: "Jane Doe",
    email: "jane@example.com",
  },
});

// Delete a customer
await api.customers.apiV1CustomersIdDelete({ id: "customer-id" });
```

### 3. Using the `useApi` Hook

For manual API calls with loading and error state management:

```typescript
import { useApi, api } from '@/utils/api';

function CustomerDetails({ customerId }: { customerId: string }) {
  const { data, loading, error, execute } = useApi(
    (id: string) => api.customers.apiV1CustomersIdGet({ id })
  );

  const loadCustomer = async () => {
    try {
      await execute(customerId);
    } catch (err) {
      // Error is already captured in the error state
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <button onClick={loadCustomer}>Load Customer</button>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### 4. Using the `useFetch` Hook (React Query)

For automatic data fetching with caching and refetching:

```typescript
import { useFetch, api } from '@/utils/api';

function CustomersList() {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useFetch({
    queryKey: ['customers'],
    queryFn: () => api.customers.apiV1CustomersGet(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {data?.map(customer => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. Using the `useApiMutation` Hook

For create, update, and delete operations:

```typescript
import { useApiMutation, api } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';

function CreateCustomer() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation({
    mutationFn: (data: CreateCustomerRequest) =>
      api.customers.apiV1CustomersPost({ createCustomerRequest: data }),
    onSuccess: () => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      alert('Customer created successfully!');
    },
    onError: (error) => {
      alert(`Failed to create customer: ${error.message}`);
    }
  });

  const handleSubmit = (formData: CreateCustomerRequest) => {
    mutate(formData);
  };

  return (
    <form onSubmit={e => {
      e.preventDefault();
      handleSubmit({
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123-456-7890'
      });
    }}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Customer'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### 6. Advanced: Dependent Queries

```typescript
import { useFetch, api } from '@/utils/api';

function CustomerInvoices({ customerId }: { customerId: string }) {
  // First, fetch the customer
  const { data: customer } = useFetch({
    queryKey: ['customer', customerId],
    queryFn: () => api.customers.apiV1CustomersIdGet({ id: customerId }),
  });

  // Then, fetch invoices only when customer is loaded
  const { data: invoices, isLoading } = useFetch({
    queryKey: ['invoices', customerId],
    queryFn: () => api.invoices.apiV1InvoicesGet(), // Adjust based on your API
    enabled: !!customer, // Only run when customer exists
  });

  if (!customer) return <div>Loading customer...</div>;
  if (isLoading) return <div>Loading invoices...</div>;

  return (
    <div>
      <h2>{customer.name}'s Invoices</h2>
      {/* Render invoices */}
    </div>
  );
}
```

### 7. Custom Axios Requests

For requests not covered by the OpenAPI client:

```typescript
import { apiClient, handleApiError } from "@/utils/api";

async function customRequest() {
  try {
    const response = await apiClient.get("/custom-endpoint");
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw apiError;
  }
}
```

## Available API Clients

All OpenAPI-generated API clients are available through the `api` object:

- `api.customers` - Customer management
- `api.departments` - Department management
- `api.invoiceItems` - Invoice item operations
- `api.invoices` - Invoice management
- `api.jobPositions` - Job position management
- `api.partLocations` - Part location operations
- `api.products` - Product management
- `api.token` - Authentication
- `api.user` - User management
- `api.warehouses` - Warehouse operations

## Token Management

The API setup handles token management automatically:

- **Token Storage**: Tokens are stored in localStorage
- **Auto-Injection**: Auth tokens are automatically added to request headers
- **Auto-Refresh**: On 401 errors, the system attempts to refresh the token
- **Queue Management**: Requests are queued during token refresh

Manual token management:

```typescript
import { tokenManager } from "@/utils/api";

// Get current token
const token = tokenManager.getToken();

// Set token manually
tokenManager.setToken("new-token");

// Clear tokens (logout)
tokenManager.clearTokens();

// Check if token exists
const hasToken = tokenManager.hasToken();
```

## Error Handling

All errors are normalized to the `ApiError` interface:

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}
```

Use the `handleApiError` utility to normalize errors:

```typescript
import { handleApiError } from "@/utils/api";

try {
  await api.customers.apiV1CustomersGet();
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.message, apiError.status);
}
```

## TypeScript Support

All hooks and functions are fully typed. TypeScript will provide autocomplete and type checking:

```typescript
import { api, type ApiError, type UseApiReturn } from "@/utils/api";

// Types are inferred automatically
const { data, loading } = useApi((id: string) =>
  api.customers.apiV1CustomersIdGet({ id }),
);
// data is typed as the response type
// error is typed as ApiError

// You can also explicitly type variables
const handleError = (error: ApiError) => {
  console.error(error.message);
};
```

## Best Practices

1. **Use React Query hooks** (`useFetch`, `useApiMutation`) for most data fetching - they provide caching, automatic refetching, and better UX
2. **Use `useApi`** for one-off manual API calls where you need direct control
3. **Use direct API client calls** in utility functions or outside React components
4. **Always handle errors** - use try/catch or the error state from hooks
5. **Invalidate queries** after mutations to keep data fresh
6. **Use query keys wisely** - include relevant parameters to ensure proper caching

## Setup for New Projects

1. Install dependencies:

   ```bash
   pnpm add axios @tanstack/react-query
   ```

2. Set up React Query provider in your app:

   ```typescript
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 60 * 1000, // 1 minute
         retry: 1,
       },
     },
   });

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         {/* Your app */}
       </QueryClientProvider>
     );
   }
   ```

3. Configure environment variables in `.env`

4. Start using the API utilities!
