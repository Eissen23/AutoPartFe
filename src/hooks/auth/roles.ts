import {
  createRole,
  updateRole,
  searchRole,
  getRole,
  deleteRole,
  assignRolePermission,
  removeRolePermission,
  viewRolePermission,
} from "#src/apis/auth";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  SearchRolesRequest,
  AssignPermissionsToRoleRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function useRolesQuery(payload?: SearchRolesRequest) {
  return useFetch({
    queryKey: ["roles", payload],
    queryFn: async () => {
      const result = await searchRole(payload);
      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useRoleById(id: string) {
  return useFetch({
    queryKey: ["role", id],
    queryFn: async () => {
      const result = await getRole(id);
      return result?.data;
    },
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateRoleRequest) => {
      const resp = await createRole(payload);
      return resp?.data;
    },
    onSuccess: () => {
      message.success("Role created successfully");
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      message.error("Failed to create role");
    },
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data?: UpdateRoleRequest }) => {
      const resp = await updateRole(payload.id, payload.data);
      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Role has been updated");
      qc.invalidateQueries({ queryKey: ["roles"] });
      qc.invalidateQueries({ queryKey: ["role", variable.id] });
    },
    onError: () => {
      message.error("Failed to update role");
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => {
      const resp = await deleteRole(id);
      return resp?.data;
    },
    onSuccess: () => {
      message.success("Role has been deleted");
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      message.error("Failed to delete role");
    },
  });
}

export function useAssignRolePermission() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data?: AssignPermissionsToRoleRequest }) => {
      const resp = await assignRolePermission(payload.id, payload.data);
      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Permissions assigned to role");
      qc.invalidateQueries({ queryKey: ["roles"] });
      qc.invalidateQueries({ queryKey: ["role", variable.id] });
    },
    onError: () => {
      message.error("Failed to assign permissions to role");
    },
  });
}

export function useRemoveRolePermission() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: { id: string; data?: AssignPermissionsToRoleRequest }) => {
      const resp = await removeRolePermission(payload.id, payload.data);
      return resp?.data;
    },
    onSuccess: (_data, variable) => {
      message.success("Permissions removed from role");
      qc.invalidateQueries({ queryKey: ["roles"] });
      qc.invalidateQueries({ queryKey: ["role", variable.id] });
    },
    onError: () => {
      message.error("Failed to remove permissions from role");
    },
  });
}

export function useViewRolePermission(id: string) {
  return useFetch({
    queryKey: ["role-permissions", id],
    queryFn: async () => {
      const result = await viewRolePermission(id);
      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}
