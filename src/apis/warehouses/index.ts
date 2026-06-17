import type {
  CreatePartLocationRequest,
  CreateWarehouseLocationRequest,
  SearchPartLocationRequest,
  SearchWarehouseLocationRequest,
  UpdatePartLocationRequest,
  UpdateWarehouseLocationRequest,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

/**
 * Create a new part location
 * POST /api/v1/partlocations
 * Links a part to a warehouse location with quantity
 */
export const createPartLocation = async (
  request?: CreatePartLocationRequest,
) => {
  const result = await apiClients.partLocations.apiV1PartlocationsPost({
    createPartLocationRequest: request,
  });
  return result.data;
};

/**
 * Get part location by ID
 * GET /api/v1/partlocations/{id}
 * Retrieve details of a specific part location
 */
export const getPartLocation = async (id: string) => {
  const result = await apiClients.partLocations.apiV1PartlocationsIdGet({
    id,
  });
  return result.data;
};

/**
 * Update part location
 * PUT /api/v1/partlocations/{id}
 * Modify an existing part location
 */
export const updatePartLocation = async (
  id: string,
  request?: UpdatePartLocationRequest,
) => {
  const result = await apiClients.partLocations.apiV1PartlocationsIdPut({
    id,
    updatePartLocationRequest: request,
  });
  return result.data;
};

/**
 * Delete part location
 * DELETE /api/v1/partlocations/{id}
 * Remove a part location from the system
 */
export const deletePartLocation = async (id: string) => {
  const result = await apiClients.partLocations.apiV1PartlocationsIdDelete({
    id: id,
  });
  return result.data;
};

/**
 * Search part locations
 * POST /api/v1/partlocations/search
 * Query part locations with filters and pagination
 */
export const searchPartLocations = async (
  request?: SearchPartLocationRequest,
) => {
  const result = await apiClients.partLocations.apiV1PartlocationsSearchPost({
    searchPartLocationRequest: request,
  });
  return result.data;
};

// ===========================
// Warehouse Location Functions
// ===========================

/**
 * Create a new warehouse location
 * POST /api/v1/warehouses
 * Define a new warehouse location (zone, aisle, shelf, bin)
 */
export const createWarehouseLocation = async (
  request?: CreateWarehouseLocationRequest,
) => {
  const result = await apiClients.warehouses.apiV1WarehousesPost({
    createWarehouseLocationRequest: request,
  });
  return result.data;
};

/**
 * Get warehouse location by ID
 * GET /api/v1/warehouses/{id}
 * Retrieve details of a specific warehouse location
 */
export const getWarehouseLocation = async (id: string) => {
  const result = await apiClients.warehouses.apiV1WarehousesIdGet({
    id: id,
  });

  return result.data;
};

/**
 * Update warehouse location
 * PUT /api/v1/warehouses/{id}
 * Modify an existing warehouse location
 */
export const updateWarehouseLocation = async (
  id: string,
  request?: UpdateWarehouseLocationRequest,
) => {
  const result = await apiClients.warehouses.apiV1WarehousesIdPut({
    id,
    updateWarehouseLocationRequest: request,
  });
  return result.data;
};

/**
 * Delete warehouse location
 * DELETE /api/v1/warehouses/{id}
 * Remove a warehouse location from the system
 */
export const deleteWarehouseLocation = async (id: string) => {
  const result = await apiClients.warehouses.apiV1WarehousesIdDelete({
    id,
  });
  return result.data;
};

/**
 * Search warehouse locations
 * POST /api/v1/warehouses/search
 * Query warehouse locations with filters and pagination
 */
export const searchWarehouseLocations = async (
  request?: SearchWarehouseLocationRequest,
) => {
  const result = await apiClients.warehouses.apiV1WarehousesSearchPost({
    searchWarehouseLocationRequest: request,
  });
  return result.data;
};
