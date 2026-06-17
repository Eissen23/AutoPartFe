import {
  createUser,
  getMe,
  updateUser,
  createUserByAdmin,
  updateByManager,
} from "#src/apis/users";
import type {
  CreateUserRequest,
  CreateUserByAdminRequest,
  UpdateUserRequest,
  UpdateUserByManagerRequest,
} from "#src/openapi";
import { useApiMutation, useFetch } from "#src/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";

export function useMeQuery() {
  return useFetch({
    queryKey: ["me"],
    queryFn: async () => {
      const result = await getMe();

      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateUserRequest) => {
      const resp = await createUser(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("User created successfully");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Failed to create user");
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: UpdateUserRequest) => {
      const resp = await updateUser(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("User has been updated");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      message.error("Failed to update user");
    },
  });
}

export function useCreateUserByAdmin() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: CreateUserByAdminRequest) => {
      const resp = await createUserByAdmin(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("User created successfully");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Failed to create user");
    },
  });
}

export function useUpdateUserByManager() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: UpdateUserByManagerRequest) => {
      const resp = await updateByManager(payload);

      return resp?.data;
    },
    onSuccess: () => {
      message.success("User has been updated by manager");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Failed to update user by manager");
    },
  });
}
