import type {
  CreateProductRequest,
  SearchProductRequest,
  UpdateProductRequest,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

/**
 * Create a new product
 * POST /api/v1/products
 * Add a new product to the system
 */
export const createProduct = async (request?: CreateProductRequest) => {
  const result = await apiClients.products.apiV1ProductsPost({
    createProductRequest: request,
  });
  return result.data;
};

/**
 * Get product by ID
 * GET /api/v1/products/{id}
 * Retrieve details of a specific product
 */
export const getProduct = async (id: string) => {
  const result = await apiClients.products.apiV1ProductsIdGet({
    id: id,
  });
  return result.data;
};

/**
 * Update product
 * PUT /api/v1/products/{id}
 * Modify an existing product
 */
export const updateProduct = async (
  id: string,
  request?: UpdateProductRequest,
) => {
  const result = await apiClients.products.apiV1ProductsIdPut({
    id,
    updateProductRequest: request,
  });
  return result.data;
};

/**
 * Delete product
 * DELETE /api/v1/products/{id}
 * Remove a product from the system
 */
export const deleteProduct = async (id: string) => {
  const result = await apiClients.products.apiV1ProductsIdDelete({
    id,
  });
  return result.data;
};

/**
 * Search products
 * POST /api/v1/products/search
 * Query products with filters and pagination
 */
export const searchProducts = async (request?: SearchProductRequest) => {
  const result = await apiClients.products.apiV1ProductsSearchPost({
    searchProductRequest: request,
  });
  return result.data;
};
