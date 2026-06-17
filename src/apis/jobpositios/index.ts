import type {
  CreateJobPositionRequest,
  SearchJobPositionsRequest,
  UpdateJobPositionRequest,
} from "#src/openapi";

import { apiClients } from "#src/utils/api";

export const createJobPosition = async (request?: CreateJobPositionRequest) => {
  const result = await apiClients.jobPositions.apiV1JobpositionsPost({
    createJobPositionRequest: request,
  });
  return result.data;
};

export const getJobPosition = async (id: string) => {
  const result = await apiClients.jobPositions.apiV1JobpositionsIdGet({
    id: id,
  });

  return result.data;
};

export const searchJobPosition = async (
  request?: SearchJobPositionsRequest,
) => {
  const result = await apiClients.jobPositions.apiV1JobpositionsSearchPost({
    searchJobPositionsRequest: request,
  });

  return result.data;
};

export const updateJobPosition = async (
  id: string,
  request?: UpdateJobPositionRequest,
) => {
  const result = await apiClients.jobPositions.apiV1JobpositionsIdPut({
    id: id,
    updateJobPositionRequest: request,
  });

  return result.data;
};

export const deleteJobPosition = async (id: string) => {
  const result = await apiClients.jobPositions.apiV1JobpositionsIdDelete({
    id: id,
  });
  return result.data;
};
