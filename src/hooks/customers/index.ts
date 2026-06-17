import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  searchCustomer,
  updateCustomer,
} from "#src/apis/customers";
import type {
  CreateCustomerRequest,
  SearchCustomerRequest,
  UpdateCustomerRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function useCustomersQuery(payload?: SearchCustomerRequest) {
  return useFetch({
    queryKey: ["customers", payload],
    queryFn: async () => {
      const result = await searchCustomer(payload);

      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCustomerById(id: string) {
  return useFetch({
    queryKey: ["customer", id],
    queryFn: async () => {
      const result = await getCustomer(id);

      return result?.data;
    },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateCustomerRequest) => {
      const resp = await createCustomer(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Customer created successfully");
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      message.error("Failed to create customer");
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data: UpdateCustomerRequest }) => {
      const resp = await updateCustomer(payload.id, payload.data);

      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Customer has been updated");
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customer", variable.id] });
    },
    onError: () => {
      message.error("Failed to update customer");
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteCustomer(id);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Customer has been deleted");
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      message.error("Failed to delete customer");
    },
  });
}
