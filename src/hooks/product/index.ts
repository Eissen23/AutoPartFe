import {
  createProduct,
  deleteProduct,
  getProduct,
  searchProducts,
  updateProduct,
} from "#src/apis/products";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";
import type {
  CreateProductRequest,
  SearchProductRequest,
  UpdateProductRequest,
} from "#src/openapi";

export function useProductQuery(payload: SearchProductRequest) {
  return useFetch({
    queryKey: ["products", payload],
    queryFn: async () => {
      const result = await searchProducts(payload);

      return result.data;
    },
  });
}

export function useProductById(id: string) {
  return useFetch({
    queryKey: ["product", id],
    queryFn: async () => {
      const result = await getProduct(id);

      return result.data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateProductRequest) => {
      const resp = await createProduct(payload);

      return resp.data;
    },
    onSuccess: () => {
      message.success("Product created successfully");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data: UpdateProductRequest }) => {
      const resp = await updateProduct(payload.id, payload.data);

      return resp.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Product has been updated");
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", variable.id] });
    },
    onError: () => {
      message.error("Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteProduct(id);

      return resp.data;
    },
    onSuccess: () => {
      message.success("Product has been deleted");
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      message.error("Failed to delete");
    },
  });
}
