import type {
  CreateCustomerRequest,
  SearchCustomerRequest,
  UpdateCustomerRequest,
} from "#src/openapi";

import { apiClients } from "#src/utils/api";

export const createCustomer = async (request?: CreateCustomerRequest) => {
  const result = await apiClients.customers.apiV1CustomersPost({
    createCustomerRequest: request,
  });
  return result.data;
};

export const getCustomer = async (id: string) => {
  const result = await apiClients.customers.apiV1CustomersIdGet({
    id: id,
  });

  return result.data;
};

export const searchCustomer = async (request?: SearchCustomerRequest) => {
  const result = await apiClients.customers.apiV1CustomersSearchPost({
    searchCustomerRequest: request,
  });

  return result.data;
};

export const updateCustomer = async (
  id: string,
  request?: UpdateCustomerRequest,
) => {
  const result = await apiClients.customers.apiV1CustomersIdPut({
    id: id,
    updateCustomerRequest: request,
  });

  return result.data;
};

export const deleteCustomer = async (id: string) => {
  const result = await apiClients.customers.apiV1CustomersIdDelete({ id: id });
  return result.data;
};
