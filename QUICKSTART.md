# Quick Start Guide

## Step 1: Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Step 2: Wrap Your App with ApiProvider

Update your `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApiProvider } from './utils/api/provider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </React.StrictMode>
);
```

## Step 3: Start Using the API

### Example 1: Login Page

```typescript
// src/pages/Login.tsx
import { useState } from 'react';
import { login } from '@/utils/api';
import { useNavigate } from 'react-router';

export function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    loginCredentials: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username or Email"
        value={credentials.loginCredentials}
        onChange={(e) => setCredentials({
          ...credentials,
          loginCredentials: e.target.value
        })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({
          ...credentials,
          password: e.target.value
        })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Example 2: Fetch and Display Data

```typescript
// src/components/CustomersList.tsx
import { useFetch, api } from '@/utils/api';

export function CustomersList() {
  const { data, isLoading, error, refetch } = useFetch({
    queryKey: ['customers'],
    queryFn: () => api.customers.apiV1CustomersGet(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Customers</h2>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {data?.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 3: Create/Update Data

```typescript
// src/components/CreateCustomer.tsx
import { useState } from 'react';
import { useApiMutation, api } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import type { CreateCustomerRequest } from '@/openapi';

export function CreateCustomer() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const { mutate, isPending, error } = useApiMutation({
    mutationFn: (data: CreateCustomerRequest) =>
      api.customers.apiV1CustomersPost({ createCustomerRequest: data }),
    onSuccess: () => {
      // Refetch customers list
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      // Reset form
      setFormData({ name: '', email: '', phoneNumber: '' });
      alert('Customer created!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email || ''}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

## Available API Clients

Access all API endpoints through the `api` object:

```typescript
import { api } from "@/utils/api";

// Available clients:
api.customers; // Customer operations
api.departments; // Department operations
api.invoiceItems; // Invoice item operations
api.invoices; // Invoice operations
api.jobPositions; // Job position operations
api.partLocations; // Part location operations
api.products; // Product operations
api.token; // Authentication
api.user; // User operations
api.warehouses; // Warehouse operations
```

## Authentication Flow

```typescript
import { login, logout, isAuthenticated } from "@/utils/api";

// Login
await login({
  loginCredentials: "user@example.com",
  password: "pass123",
});

// Check auth status
if (isAuthenticated()) {
  // User is logged in
}

// Logout
await logout();
```

## Error Handling

All errors are normalized to the `ApiError` type:

```typescript
import type { ApiError } from "@/utils/api";

try {
  await api.customers.apiV1CustomersGet();
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.message);
  console.error(apiError.status); // HTTP status code
}
```

## Best Practices

1. **Use `useFetch`** for GET requests and data fetching
2. **Use `useApiMutation`** for POST/PUT/DELETE operations
3. **Invalidate queries** after mutations to keep data fresh
4. **Use proper query keys** to enable caching (include IDs and filters)
5. **Handle loading and error states** in your UI
6. **Use TypeScript** - all types are auto-generated from your API

## Need Help?

- Check the full [README.md](./README.md) for detailed documentation
- See [examples.tsx](./examples.tsx) for more code examples
- Review the OpenAPI types in `src/openapi/api.ts`

## Troubleshooting

**Q: Getting 401 errors?**  
A: Make sure you're logged in and tokens are stored. Check browser localStorage for `auth_token`.

**Q: CORS errors?**  
A: Ensure your backend API allows requests from your frontend origin.

**Q: Data not updating after mutation?**  
A: Use `queryClient.invalidateQueries()` in your mutation's `onSuccess` callback.
