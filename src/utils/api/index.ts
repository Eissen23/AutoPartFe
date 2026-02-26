import axios, { AxiosError } from 'axios';
import type { 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse 
} from 'axios';
import { 
  Configuration,
  CustomersApi,
  DepartmentsApi,
  InvoiceItemsApi,
  InvoicesApi,
  JobPositionsApi,
  PartLocationsApi,
  ProductsApi,
  TokenApi,
  UserApi,
  WarehousesApi
} from '../../openapi';
import { useCallback, useState } from 'react';
import { 
  useQuery, 
  useMutation 
} from '@tanstack/react-query';
import type { 
  UseQueryOptions,
  UseMutationOptions,
  QueryKey 
} from '@tanstack/react-query';

// ===========================
// Configuration & Constants
// ===========================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

// ===========================
// Token Management
// ===========================

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  }
};

// ===========================
// Axios Instance Configuration
// ===========================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create configured Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - inject auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/api/v1/token/refresh`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        tokenManager.setToken(newToken);
        if (newRefreshToken) {
          tokenManager.setRefreshToken(newRefreshToken);
        }

        processQueue(null, newToken);
        
        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ===========================
// OpenAPI Configuration
// ===========================

const createOpenApiConfiguration = (): Configuration => {
  return new Configuration({
    basePath: API_BASE_URL,
    accessToken: () => {
      const token = tokenManager.getToken();
      return token || '';
    },
    baseOptions: {
      timeout: 30000,
    }
  });
};

// ===========================
// API Client Instances
// ===========================

class ApiClients {
  private configuration: Configuration;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.configuration = createOpenApiConfiguration();
    this.axiosInstance = apiClient;
  }

  // Update configuration (useful after login/logout)
  updateConfiguration(): void {
    this.configuration = createOpenApiConfiguration();
  }

  get customers(): CustomersApi {
    return new CustomersApi(this.configuration, undefined, this.axiosInstance);
  }

  get departments(): DepartmentsApi {
    return new DepartmentsApi(this.configuration, undefined, this.axiosInstance);
  }

  get invoiceItems(): InvoiceItemsApi {
    return new InvoiceItemsApi(this.configuration, undefined, this.axiosInstance);
  }

  get invoices(): InvoicesApi {
    return new InvoicesApi(this.configuration, undefined, this.axiosInstance);
  }

  get jobPositions(): JobPositionsApi {
    return new JobPositionsApi(this.configuration, undefined, this.axiosInstance);
  }

  get partLocations(): PartLocationsApi {
    return new PartLocationsApi(this.configuration, undefined, this.axiosInstance);
  }

  get products(): ProductsApi {
    return new ProductsApi(this.configuration, undefined, this.axiosInstance);
  }

  get token(): TokenApi {
    return new TokenApi(this.configuration, undefined, this.axiosInstance);
  }

  get user(): UserApi {
    return new UserApi(this.configuration, undefined, this.axiosInstance);
  }

  get warehouses(): WarehousesApi {
    return new WarehousesApi(this.configuration, undefined, this.axiosInstance);
  }
}

export const api = new ApiClients();

// ===========================
// Error Handling Utilities
// ===========================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return {
      message: axiosError.response?.data?.message || 
               axiosError.response?.data?.error || 
               axiosError.message || 
               'An unexpected error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
      details: axiosError.response?.data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unknown error occurred',
  };
};

// ===========================
// React Hook: useApi
// ===========================

export interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

export interface UseApiReturn<T, TArgs extends unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<T>;
  reset: () => void;
}

/**
 * Hook for manual API calls with loading and error state management
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi(
 *   (id: string) => api.customers.apiV1CustomersIdGet({ id })
 * );
 * 
 * const handleFetch = async () => {
 *   await execute('customer-id-123');
 * };
 * ```
 */
export function useApi<T, TArgs extends unknown[]>(
  apiFunction: (...args: TArgs) => Promise<AxiosResponse<T>>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<T> => {
      setState({ data: null, error: null, loading: true });
      
      try {
        const response = await apiFunction(...args);
        const data = response.data;
        setState({ data, error: null, loading: false });
        return data;
      } catch (error) {
        const apiError = handleApiError(error);
        setState({ data: null, error: apiError, loading: false });
        throw apiError;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// ===========================
// React Hook: useFetch (React Query Integration)
// ===========================

export interface UseFetchOptions<T> extends Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'> {
  queryKey: QueryKey;
}

/**
 * Hook for data fetching with React Query integration
 * Provides automatic caching, refetching, and state management
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useFetch({
 *   queryKey: ['customers', customerId],
 *   queryFn: () => api.customers.apiV1CustomersIdGet({ id: customerId }),
 *   enabled: !!customerId,
 * });
 * ```
 */
export function useFetch<T>(
  options: UseFetchOptions<T> & {
    queryFn: () => Promise<AxiosResponse<T>>;
  }
) {
  return useQuery<T, ApiError>({
    ...options,
    queryFn: async () => {
      try {
        const response = await options.queryFn();
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
}

// ===========================
// React Hook: useApiMutation (React Query Mutations)
// ===========================

export type UseApiMutationOptions<TData, TVariables, TContext = unknown> =
  Omit<UseMutationOptions<TData, ApiError, TVariables, TContext>, 'mutationFn'>;

/**
 * Hook for API mutations with React Query
 * Ideal for create, update, delete operations
 * 
 * @example
 * ```tsx
 * const { mutate, isPending, isError } = useApiMutation({
 *   mutationFn: (data: CreateCustomerRequest) => 
 *     api.customers.apiV1CustomersPost({ createCustomerRequest: data }),
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['customers'] });
 *   },
 * });
 * 
 * const handleCreate = () => {
 *   mutate({ name: 'John Doe', email: 'john@example.com' });
 * };
 * ```
 */
export function useApiMutation<TData, TVariables, TContext = unknown>(
  options: UseApiMutationOptions<TData, TVariables, TContext> & {
    mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>;
  }
) {
  return useMutation<TData, ApiError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      try {
        const response = await options.mutationFn(variables);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
}



// ===========================
// Exports
// ===========================

export {
  api as apiClients,
};

export { queryClient } from './queryClient.js';
