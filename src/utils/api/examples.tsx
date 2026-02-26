/**
 * API Usage Examples
 * 
 * ⚠️ IMPORTANT: This file contains reference examples for demonstration purposes.
 * These examples may not work exactly as-is and will need to be adapted to your
 * specific API endpoints and data structures. Use them as a guide for implementing
 * your own components.
 * 
 * This file is NOT meant to be imported directly into your application.
 * Copy and modify individual examples as needed for your use cases.
 */

/* eslint-disable */
// @ts-nocheck

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  api, 
  useApi, 
  useFetch, 
  useApiMutation, 
  login, 
  logout, 
  isAuthenticated 
} from './index';

// ===========================
// Example 1: Login Form
// ===========================

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({
        loginCredentials: username,
        password: password,
      });
      
      // Redirect to dashboard or home
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username or Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

// ===========================
// Example 2: Protected Route Component
// ===========================

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
}

// ===========================
// Example 3: User Profile with useFetch
// ===========================

export function UserProfile() {
  const { data, isLoading, error, refetch } = useFetch({
    queryKey: ['user', 'profile'],
    queryFn: () => api.user.apiV1UserProfileGet(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>User Profile</h1>
      <div>{JSON.stringify(data)}</div>
      <button onClick={() => refetch()}>Refresh</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// ===========================
// Example 4: Customers List with Pagination
// ===========================

export function CustomersList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useFetch({
    queryKey: ['customers', { page, pageSize }],
    queryFn: () => api.customers.apiV1CustomersGet({
      // Add pagination params based on your API
    }),
    keepPreviousData: true, // Keep old data while fetching new
  });

  if (isLoading && !data) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Customers</h2>
      {isLoading && <div>Updating...</div>}
      <ul>
        {/* Render customer list */}
      </ul>
      <div>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

// ===========================
// Example 5: Create Customer Form with Mutation
// ===========================

export function CreateCustomerForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    customerType: 1,
  });

  const { mutate, isPending, error, isSuccess } = useApiMutation({
    mutationFn: (data: typeof formData) => 
      api.customers.apiV1CustomersPost({ 
        createCustomerRequest: data 
      }),
    onSuccess: () => {
      // Invalidate customers list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        customerType: 1,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Customer</h2>
      
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
      />
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Customer'}
      </button>
      
      {error && <div className="error">Error: {error.message}</div>}
      {isSuccess && <div className="success">Customer created successfully!</div>}
    </form>
  );
}

// ===========================
// Example 6: Customer Details with Manual API Call
// ===========================

export function CustomerDetails({ customerId }: { customerId: string }) {
  const { data, loading, error, execute, reset } = useApi(
    (id: string) => api.customers.apiV1CustomersIdGet({ id })
  );

  const loadCustomer = () => {
    execute(customerId);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await api.customers.apiV1CustomersIdDelete({ id: customerId });
      alert('Customer deleted successfully');
      reset();
    } catch (err) {
      alert('Failed to delete customer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  if (!data) {
    return <button onClick={loadCustomer}>Load Customer</button>;
  }

  return (
    <div>
      <h2>Customer Details</h2>
      <div>{JSON.stringify(data, null, 2)}</div>
      <button onClick={loadCustomer}>Refresh</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={reset}>Clear</button>
    </div>
  );
}

// ===========================
// Example 7: Update Customer with Mutation
// ===========================

export function EditCustomerForm({ customerId }: { customerId: string }) {
  const queryClient = useQueryClient();

  // Fetch existing customer data
  const { data: customer } = useFetch({
    queryKey: ['customer', customerId],
    queryFn: () => api.customers.apiV1CustomersIdGet({ id: customerId }),
  });

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phoneNumber: customer?.phoneNumber || '',
  });

  // Update mutation
  const { mutate, isPending, error } = useApiMutation({
    mutationFn: (data: typeof formData) => 
      api.customers.apiV1CustomersIdPut({ 
        id: customerId,
        updateCustomerRequest: data 
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      alert('Customer updated successfully!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Customer</h2>
      
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      
      <input
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
      />
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Customer'}
      </button>
      
      {error && <div className="error">Error: {error.message}</div>}
    </form>
  );
}

// ===========================
// Example 8: Products Search with Debounce
// ===========================

export function ProductsSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  });

  const { data, isLoading } = useFetch({
    queryKey: ['products', 'search', debouncedSearch],
    queryFn: () => api.products.apiV1ProductsGet({
      // Add search params based on your API
    }),
    enabled: debouncedSearch.length >= 3, // Only search with 3+ characters
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {isLoading && <div>Searching...</div>}
      
      {data && (
        <ul>
          {/* Render search results */}
        </ul>
      )}
    </div>
  );
}

// ===========================
// Example 9: Invoice with Associated Items
// ===========================

export function InvoiceDetails({ invoiceId }: { invoiceId: string }) {
  // Fetch invoice
  const { data: invoice, isLoading: invoiceLoading } = useFetch({
    queryKey: ['invoice', invoiceId],
    queryFn: () => api.invoices.apiV1InvoicesIdGet({ id: invoiceId }),
  });

  // Fetch invoice items (only when invoice exists)
  const { data: items, isLoading: itemsLoading } = useFetch({
    queryKey: ['invoice-items', invoiceId],
    queryFn: () => api.invoiceItems.apiV1InvoiceItemsGet({
      // Filter by invoice ID based on your API
    }),
    enabled: !!invoice,
  });

  if (invoiceLoading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div>
      <h2>Invoice #{invoiceId}</h2>
      <div>{JSON.stringify(invoice, null, 2)}</div>
      
      <h3>Items</h3>
      {itemsLoading ? (
        <div>Loading items...</div>
      ) : (
        <ul>
          {items?.map((item: any) => (
            <li key={item.id}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===========================
// Example 10: Optimistic Updates
// ===========================

export function OptimisticCustomerUpdate({ customerId }: { customerId: string }) {
  const queryClient = useQueryClient();

  const { mutate } = useApiMutation({
    mutationFn: (data: { name: string }) => 
      api.customers.apiV1CustomersIdPut({ 
        id: customerId,
        updateCustomerRequest: data 
      }),
    // Optimistic update - update UI before server responds
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customer', customerId] });

      // Snapshot the previous value
      const previousCustomer = queryClient.getQueryData(['customer', customerId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['customer', customerId], (old: any) => ({
        ...old,
        ...newData,
      }));

      // Return context with snapshot
      return { previousCustomer };
    },
    // If mutation fails, roll back to previous value
    onError: (err, newData, context) => {
      queryClient.setQueryData(
        ['customer', customerId],
        context?.previousCustomer
      );
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });

  return (
    <button onClick={() => mutate({ name: 'Updated Name' })}>
      Update Customer Name
    </button>
  );
}
