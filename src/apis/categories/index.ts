import type {
  CategoryDto,
  CategoryDtoPaginatedResponse,
  CategoriesApiApiV1CategoriesIdDeleteRequest,
  CategoriesApiApiV1CategoriesIdGetRequest,
  CategoriesApiApiV1CategoriesIdPutRequest,
  CategoriesApiApiV1CategoriesPostRequest,
  CategoriesApiApiV1CategoriesSearchPostRequest,
} from "../../openapi";
import { apiClients } from "../../utils/api";

// ===========================
// Types - Category Request Objects
// ===========================

/**
 * Category - Create Request
 * API request for creating a new category
 */
export type CategoryCreateRequest =
  CategoriesApiApiV1CategoriesPostRequest["createCategoryRequest"];

/**
 * Category - Get Request
 * API request for retrieving a specific category
 */
export type CategoryGetRequest = CategoriesApiApiV1CategoriesIdGetRequest;

/**
 * Category - Update Request
 * API request for updating an existing category
 */
export type CategoryUpdateRequest =
  CategoriesApiApiV1CategoriesIdPutRequest["updateCategoryRequest"];

/**
 * Category - Delete Request
 * API request for deleting a category
 */
export type CategoryDeleteRequest = CategoriesApiApiV1CategoriesIdDeleteRequest;

/**
 * Category - Search Request
 * API request for searching categories
 */
export type CategorySearchRequest =
  CategoriesApiApiV1CategoriesSearchPostRequest["searchCategoryRequest"];

// ===========================
// Types - Category Response Objects
// ===========================

/**
 * Category response
 * Contains category details
 */
export type CategoryResponse = CategoryDto;

/**
 * Paginated categories response
 * List of categories with pagination info
 */
export type CategoryListResponse = CategoryDtoPaginatedResponse;

// ===========================
// Category Functions
// ===========================

/**
 * Create a new category
 * POST /api/v1/categories
 * Add a new category to the system
 */
export const createCategory = async (request?: CategoryCreateRequest) => {
  const result = await apiClients.categories.apiV1CategoriesPost({
    createCategoryRequest: request,
  });
  return result.data;
};

/**
 * Get category by ID
 * GET /api/v1/categories/{id}
 * Retrieve details of a specific category
 */
export const getCategory = async (request: CategoryGetRequest) => {
  const result = await apiClients.categories.apiV1CategoriesIdGet(request);
  return result.data;
};

/**
 * Update category
 * PUT /api/v1/categories/{id}
 * Modify an existing category
 */
export const updateCategory = async (
  id: string,
  request?: CategoryUpdateRequest,
) => {
  const result = await apiClients.categories.apiV1CategoriesIdPut({
    id,
    updateCategoryRequest: request,
  });
  return result.data;
};

/**
 * Delete category
 * DELETE /api/v1/categories/{id}
 * Remove a category from the system
 */
export const deleteCategory = async (request: CategoryDeleteRequest) => {
  const result = await apiClients.categories.apiV1CategoriesIdDelete(request);
  return result.data;
};

/**
 * Search categories
 * POST /api/v1/categories/search
 * Query categories with filters and pagination
 */
export const searchCategories = async (request?: CategorySearchRequest) => {
  const result = await apiClients.categories.apiV1CategoriesSearchPost({
    searchCategoryRequest: request,
  });
  return result.data;
};

export const getCategoryMap = async () => {
  const result = await apiClients.categories.apiV1CategoriesCategoryMapGet();

  return result.data;
};
