import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryMap,
  searchCategories,
  updateCategory,
} from "#src/apis/categories";
import type {
  CreateCategoryRequest,
  SearchCategoryRequest,
  UpdateCategoryRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useMessage } from "#src/utils/message";
import { useQueryClient } from "@tanstack/react-query";

export function useCategoriesQuery(payload: SearchCategoryRequest) {
  return useFetch({
    queryKey: ["categories", payload],
    queryFn: async () => {
      const result = await searchCategories(payload);
      return result;
    },
    staleTime: 1000 * 60,
  });
}

export function useCategoryMap() {
  return useFetch({
    queryKey: ["categories-map"],
    queryFn: async () => {
      const result = await getCategoryMap();
      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCategoryById(id: string | null | undefined) {
  const categoryId = id?.trim();

  return useFetch({
    queryKey: ["categories", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        throw new Error("Category id is required");
      }

      const result = await getCategory(categoryId);

      return result?.data;
    },
    enabled: !!categoryId,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateCategoryRequest) => {
      const resp = await createCategory(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Category created successfully");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: {
      id: string;
      data: UpdateCategoryRequest;
    }) => {
      const resp = await updateCategory(payload.id, payload.data);

      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Category has been updated");
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories", variable.id] });
    },
    onError: () => {
      message.error("Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteCategory(id);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Category has been deleted");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Failed to delete category");
    },
  });
}
