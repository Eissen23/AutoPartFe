import type {
  CreateUserByAdminRequest,
  CreateUserRequest,
  UpdateUserByManagerRequest,
  UpdateUserRequest,
} from "#src/openapi";

import { apiClients } from "#src/utils/api";

export const createUser = async (request?: CreateUserRequest) => {
  const result = await apiClients.user.apiV1UserPost({
    createUserRequest: request,
  });
  return result.data;
};

export const getMe = async () => {
  const result = await apiClients.user.apiV1UserProfileGet();

  return result.data;
};

export const updateUser = async (request?: UpdateUserRequest) => {
  const result = await apiClients.user.apiV1UserPut({
    updateUserRequest: request,
  });

  return result.data;
};

export const createUserByAdmin = async (request?: CreateUserByAdminRequest) => {
  const result = await apiClients.user.apiV1UserCreateByAdminPost({
    createUserByAdminRequest: request,
  });

  return result.data;
};

export const updateByManager = async (request?: UpdateUserByManagerRequest) => {
  const result = await apiClients.user.apiV1UserUpdateByManagerPut({
    updateUserByManagerRequest: request,
  });

  return result.data;
};
