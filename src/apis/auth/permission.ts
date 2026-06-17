import type {
  CreatePermissionRequest,
  SearchPermissionsRequest,
  UpdatePermissionRequest,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

export const createPermission = async (request?: CreatePermissionRequest) => {
  const result = await apiClients.permissions.apiV1PermissionsPost({
    createPermissionRequest: request,
  });

  return result.data;
};

export const updatePermission = async (
  id: string,
  request?: UpdatePermissionRequest,
) => {
  const result = await apiClients.permissions.apiV1PermissionsIdPut({
    id,
    updatePermissionRequest: request,
  });

  return result.data;
};

export const searchPermission = async (request?: SearchPermissionsRequest) => {
  const result = await apiClients.permissions.apiV1PermissionsSearchPost({
    searchPermissionsRequest: request,
  });

  return result.data;
};

export const getPermission = async (id: string) => {
  const result = await apiClients.permissions.apiV1PermissionsIdGet({ id });

  return result.data;
};

export const deletePermission = async (id: string) => {
  const result = await apiClients.permissions.apiV1PermissionsIdDelete({
    id,
  });

  return result.data;
};
