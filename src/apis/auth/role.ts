import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  SearchRolesRequest,
  AssignPermissionsToRoleRequest,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

export const createRole = async (request?: CreateRoleRequest) => {
  const result = await apiClients.roles.apiV1RolesPost({
    createRoleRequest: request,
  });

  return result.data;
};

export const updateRole = async (id: string, request?: UpdateRoleRequest) => {
  const result = await apiClients.roles.apiV1RolesIdPut({
    id,
    updateRoleRequest: request,
  });

  return result.data;
};

export const searchRole = async (request?: SearchRolesRequest) => {
  const result = await apiClients.roles.apiV1RolesSearchPost({
    searchRolesRequest: request,
  });

  return result.data;
};

export const getRole = async (id: string) => {
  const result = await apiClients.roles.apiV1RolesIdGet({ id });

  return result.data;
};

export const deleteRole = async (id: string) => {
  const result = await apiClients.roles.apiV1RolesIdDelete({
    id,
  });

  return result.data;
};

export const assignRolePermission = async (
  id: string,
  request?: AssignPermissionsToRoleRequest,
) => {
  const result = await apiClients.roles.apiV1RolesIdPermissionsPost({
    id,
    assignPermissionsToRoleRequest: request,
  });

  return result.data;
};

export const removeRolePermission = async (
  id: string,
  request?: AssignPermissionsToRoleRequest,
) => {
  const result = await apiClients.roles.apiV1RolesIdPermissionsDelete({
    id,
    assignPermissionsToRoleRequest: request,
  });

  return result.data;
};

export const viewRolePermission = async (id: string) => {
  const result = await apiClients.roles.apiV1RolesIdPermissionsGet({
    id,
  });

  return result.data;
};
