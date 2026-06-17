import type {
  CreateDepartmentRequest,
  SearchDepartmentRequest,
  UpdateDepartmentRequest,
} from "#src/openapi";

import { apiClients } from "#src/utils/api";

export const createDepartment = async (request?: CreateDepartmentRequest) => {
  const result = await apiClients.departments.apiV1DepartmentsPost({
    createDepartmentRequest: request,
  });
  return result.data;
};

export const getDepartment = async (id: string) => {
  const result = await apiClients.departments.apiV1DepartmentsIdGet({
    id: id,
  });

  return result.data;
};

export const searchDepartment = async (request?: SearchDepartmentRequest) => {
  const result = await apiClients.departments.apiV1DepartmentsSearchPost({
    searchDepartmentRequest: request,
  });

  return result.data;
};

export const updateDepartment = async (
  id: string,
  request?: UpdateDepartmentRequest,
) => {
  const result = await apiClients.departments.apiV1DepartmentsIdPut({
    id: id,
    updateDepartmentRequest: request,
  });

  return result.data;
};

export const deleteDepartment = async (id: string) => {
  const result = await apiClients.departments.apiV1DepartmentsIdDelete({
    id: id,
  });
  return result.data;
};
