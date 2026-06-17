import {
  createPermission,
  updatePermission,
  searchPermission,
  getPermission,
  deletePermission,
} from "#src/apis/auth";
import type {
  CreatePermissionRequest,
  SearchPermissionsRequest,
  UpdatePermissionRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function usePermissionsQuery(payload?: SearchPermissionsRequest) {
  return useFetch({
    queryKey: ["permissions", payload],
    queryFn: async () => {
      const result = await searchPermission(payload);
      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function usePermissionById(id: string) {
  return useFetch({
    queryKey: ["permission", id],
    queryFn: async () => {
      const result = await getPermission(id);
      return result?.data;
    },
  });
}

export function useCreatePermission() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreatePermissionRequest) => {
      const resp = await createPermission(payload);
      return resp?.data;
    },
    onSuccess: () => {
      message.success("Permission created successfully");
      qc.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: () => {
      message.error("Failed to create permission");
    },
  });
}

export function useUpdatePermission() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data?: UpdatePermissionRequest }) => {
      const resp = await updatePermission(payload.id, payload.data);
      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Permission has been updated");
      qc.invalidateQueries({ queryKey: ["permissions"] });
      qc.invalidateQueries({ queryKey: ["permission", variable.id] });
    },
    onError: () => {
      message.error("Failed to update permission");
    },
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deletePermission(id);
      return resp?.data;
    },
    onSuccess: () => {
      message.success("Permission has been deleted");
      qc.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: () => {
      message.error("Failed to delete permission");
    },
  });
}
