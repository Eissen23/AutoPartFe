import type {
  CreateCategoryRequest,
  SearchCategoryRequest,
  UpdateCategoryRequest,
} from "../../openapi";
import { apiClients } from "../../utils/api";

/**
 * Create a new category
 * POST /api/v1/categories
 * Add a new category to the system
 */
export const createCategory = async (request?: CreateCategoryRequest) => {
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
export const getCategory = async (id: string) => {
  const result = await apiClients.categories.apiV1CategoriesIdGet({
    id,
  });
  return result.data;
};

/**
 * Update category
 * PUT /api/v1/categories/{id}
 * Modify an existing category
 */
export const updateCategory = async (
  id: string,
  request?: UpdateCategoryRequest,
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
export const deleteCategory = async (id: string) => {
  const result = await apiClients.categories.apiV1CategoriesIdDelete({
    id,
  });
  return result.data;
};

/**
 * Search categories
 * POST /api/v1/categories/search
 * Query categories with filters and pagination
 */
export const searchCategories = async (request?: SearchCategoryRequest) => {
  const result = await apiClients.categories.apiV1CategoriesSearchPost({
    searchCategoryRequest: request,
  });
  return result.data;
};

export const getCategoryMap = async () => {
  const result = await apiClients.categories.apiV1CategoriesCategoryMapGet();

  return result.data;
};
