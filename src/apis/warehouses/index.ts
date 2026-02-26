import type {
  PartLocationDto,
  PartLocationDtoPaginatedResponse,
  PartLocationsApiApiV1PartlocationsIdDeleteRequest,
  PartLocationsApiApiV1PartlocationsIdGetRequest,
  PartLocationsApiApiV1PartlocationsIdPutRequest,
  PartLocationsApiApiV1PartlocationsPostRequest,
  PartLocationsApiApiV1PartlocationsSearchPostRequest,
  WarehouseLocationDto,
  WarehouseLocationDtoPaginatedResponse,
  WarehousesApiApiV1WarehousesIdDeleteRequest,
  WarehousesApiApiV1WarehousesIdGetRequest,
  WarehousesApiApiV1WarehousesIdPutRequest,
  WarehousesApiApiV1WarehousesPostRequest,
  WarehousesApiApiV1WarehousesSearchPostRequest,
} from "../../openapi";
import { apiClients } from "../../utils/api";

// ===========================
// Types - Part Location Request Objects
// ===========================

/**
 * Part Location - Create Request
 * API request for creating a new part location
 */
export type PartLocationCreateRequest =
  PartLocationsApiApiV1PartlocationsPostRequest["createPartLocationRequest"];

/**
 * Part Location - Get Request
 * API request for retrieving a specific part location
 */
export type PartLocationGetRequest =
  PartLocationsApiApiV1PartlocationsIdGetRequest;

/**
 * Part Location - Update Request
 * API request for updating an existing part location
 */
export type PartLocationUpdateRequest =
  PartLocationsApiApiV1PartlocationsIdPutRequest["updatePartLocationRequest"];

/**
 * Part Location - Delete Request
 * API request for deleting a part location
 */
export type PartLocationDeleteRequest =
  PartLocationsApiApiV1PartlocationsIdDeleteRequest;

/**
 * Part Location - Search Request
 * API request for searching part locations
 */
export type PartLocationSearchRequest =
  PartLocationsApiApiV1PartlocationsSearchPostRequest["searchPartLocationRequest"];

// ===========================
// Types - Warehouse Location Request Objects
// ===========================

/**
 * Warehouse Location - Create Request
 * API request for creating a new warehouse location
 */
export type WarehouseLocationCreateRequest =
  WarehousesApiApiV1WarehousesPostRequest["createWarehouseLocationRequest"];

/**
 * Warehouse Location - Get Request
 * API request for retrieving a specific warehouse location
 */
export type WarehouseLocationGetRequest =
  WarehousesApiApiV1WarehousesIdGetRequest;

/**
 * Warehouse Location - Update Request
 * API request for updating an existing warehouse location
 */
export type WarehouseLocationUpdateRequest =
  WarehousesApiApiV1WarehousesIdPutRequest["updateWarehouseLocationRequest"];

/**
 * Warehouse Location - Delete Request
 * API request for deleting a warehouse location
 */
export type WarehouseLocationDeleteRequest =
  WarehousesApiApiV1WarehousesIdDeleteRequest;

/**
 * Warehouse Location - Search Request
 * API request for searching warehouse locations
 */
export type WarehouseLocationSearchRequest =
  WarehousesApiApiV1WarehousesSearchPostRequest["searchWarehouseLocationRequest"];

// ===========================
// Types - Part Location Response Objects
// ===========================

/**
 * Part location response
 * Contains part location details
 */
export type PartLocationResponse = PartLocationDto;

/**
 * Paginated part locations response
 * List of part locations with pagination info
 */
export type PartLocationListResponse = PartLocationDtoPaginatedResponse;

// ===========================
// Types - Warehouse Location Response Objects
// ===========================

/**
 * Warehouse location response
 * Contains warehouse location details
 */
export type WarehouseLocationResponse = WarehouseLocationDto;

/**
 * Paginated warehouse locations response
 * List of warehouse locations with pagination info
 */
export type WarehouseLocationListResponse =
  WarehouseLocationDtoPaginatedResponse;

// ===========================
// Part Location Functions
// ===========================

/**
 * Create a new part location
 * POST /api/v1/partlocations
 * Links a part to a warehouse location with quantity
 */
export const createPartLocation = async (
  request?: PartLocationCreateRequest,
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
export const getPartLocation = async (request: PartLocationGetRequest) => {
  const result =
    await apiClients.partLocations.apiV1PartlocationsIdGet(request);
  return result.data;
};

/**
 * Update part location
 * PUT /api/v1/partlocations/{id}
 * Modify an existing part location
 */
export const updatePartLocation = async (
  id: string,
  request?: PartLocationUpdateRequest,
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
export const deletePartLocation = async (
  request: PartLocationDeleteRequest,
) => {
  const result =
    await apiClients.partLocations.apiV1PartlocationsIdDelete(request);
  return result.data;
};

/**
 * Search part locations
 * POST /api/v1/partlocations/search
 * Query part locations with filters and pagination
 */
export const searchPartLocations = async (
  request?: PartLocationSearchRequest,
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
  request?: WarehouseLocationCreateRequest,
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
export const getWarehouseLocation = async (
  request: WarehouseLocationGetRequest,
) => {
  const result = await apiClients.warehouses.apiV1WarehousesIdGet(request);
  return result.data;
};

/**
 * Update warehouse location
 * PUT /api/v1/warehouses/{id}
 * Modify an existing warehouse location
 */
export const updateWarehouseLocation = async (
  id: string,
  request?: WarehouseLocationUpdateRequest,
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
export const deleteWarehouseLocation = async (
  request: WarehouseLocationDeleteRequest,
) => {
  const result = await apiClients.warehouses.apiV1WarehousesIdDelete(request);
  return result.data;
};

/**
 * Search warehouse locations
 * POST /api/v1/warehouses/search
 * Query warehouse locations with filters and pagination
 */
export const searchWarehouseLocations = async (
  request?: WarehouseLocationSearchRequest,
) => {
  const result = await apiClients.warehouses.apiV1WarehousesSearchPost({
    searchWarehouseLocationRequest: request,
  });
  return result.data;
};
