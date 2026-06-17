import {
  creatInvoice,
  updateInvoice,
  deleteInvoice,
  searchInvoice,
  getInvoice,
  creatInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
  searchInvoiceItems,
  getInvoiceItem,
} from "#src/apis/invoices";
import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  SearchInvoiceRequest,
  CreateInvoiceItemRequest,
  UpdateInvoiceItemRequest,
  SearchInvoiceItemRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function useInvoicesQuery(payload?: SearchInvoiceRequest) {
  return useFetch({
    queryKey: ["invoices", payload],
    queryFn: async () => {
      const result = await searchInvoice(payload);

      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useInvoiceSearch(payload?: SearchInvoiceRequest) {
  // alias to useInvoicesQuery for clarity in some pages
  return useInvoicesQuery(payload);
}

export function useInvoiceById(id: string) {
  return useFetch({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const result = await getInvoice(id);

      return result?.data;
    },
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateInvoiceRequest) => {
      const resp = await creatInvoice(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Invoice created successfully");
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: () => {
      message.error("Failed to create invoice");
    },
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: {
      id: string;
      data?: UpdateInvoiceRequest;
    }) => {
      const resp = await updateInvoice(payload.id, payload.data);

      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Invoice has been updated");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["invoice", variable.id] });
    },
    onError: () => {
      message.error("Failed to update invoice");
    },
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteInvoice(id);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Invoice has been deleted");
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: () => {
      message.error("Failed to delete invoice");
    },
  });
}

// -------------------- Invoice items --------------------
export function useInvoiceItemsQuery(payload?: SearchInvoiceItemRequest) {
  return useFetch({
    queryKey: ["invoice-items", payload],
    queryFn: async () => {
      const result = await searchInvoiceItems(payload);

      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useInvoiceItemById(id: string) {
  return useFetch({
    queryKey: ["invoice-item", id],
    queryFn: async () => {
      const result = await getInvoiceItem(id);

      return result?.data;
    },
  });
}

export function useCreateInvoiceItem() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateInvoiceItemRequest) => {
      const resp = await creatInvoiceItem(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Invoice item created successfully");
      qc.invalidateQueries({ queryKey: ["invoice-items"] });
    },
    onError: () => {
      message.error("Failed to create invoice item");
    },
  });
}

export function useUpdateInvoiceItem() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: {
      id: string;
      data?: UpdateInvoiceItemRequest;
    }) => {
      const resp = await updateInvoiceItem(payload.id, payload.data);

      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Invoice item has been updated");
      qc.invalidateQueries({ queryKey: ["invoice-items"] });
      qc.invalidateQueries({ queryKey: ["invoice-item", variable.id] });
    },
    onError: () => {
      message.error("Failed to update invoice item");
    },
  });
}

export function useDeleteInvoiceItem() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteInvoiceItem(id);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Invoice item has been deleted");
      qc.invalidateQueries({ queryKey: ["invoice-items"] });
    },
    onError: () => {
      message.error("Failed to delete invoice item");
    },
  });
}
