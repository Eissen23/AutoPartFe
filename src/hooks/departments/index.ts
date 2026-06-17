import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  searchDepartment,
  updateDepartment,
} from "#src/apis/departments";
import type {
  CreateDepartmentRequest,
  SearchDepartmentRequest,
  UpdateDepartmentRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function useDepartmentsQuery(payload?: SearchDepartmentRequest) {
  return useFetch({
    queryKey: ["departments", payload],
    queryFn: async () => {
      const result = await searchDepartment(payload);

      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useDepartmentById(id: string) {
  return useFetch({
    queryKey: ["department", id],
    queryFn: async () => {
      const result = await getDepartment(id);

      return result?.data;
    },
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateDepartmentRequest) => {
      const resp = await createDepartment(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Department created successfully");
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: () => {
      message.error("Failed to create department");
    },
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data: UpdateDepartmentRequest }) => {
      const resp = await updateDepartment(payload.id, payload.data);

      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Department has been updated");
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["department", variable.id] });
    },
    onError: () => {
      message.error("Failed to update department");
    },
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteDepartment(id);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("Department has been deleted");
      qc.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: () => {
      message.error("Failed to delete department");
    },
  });
}
