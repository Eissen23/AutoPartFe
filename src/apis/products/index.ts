import type {
  ProductDetailDto,
  ProductDto,
  ProductDtoPaginatedResponse,
  ProductsApiApiV1ProductsIdDeleteRequest,
  ProductsApiApiV1ProductsIdGetRequest,
  ProductsApiApiV1ProductsIdPutRequest,
  ProductsApiApiV1ProductsPostRequest,
  ProductsApiApiV1ProductsSearchPostRequest,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

// ===========================
// Types - Product Request Objects
// ===========================

/**
 * Product - Create Request
 * API request for creating a new product
 */
export type ProductCreateRequest =
  ProductsApiApiV1ProductsPostRequest["createProductRequest"];

/**
 * Product - Get Request
 * API request for retrieving a specific product
 */
export type ProductGetRequest = ProductsApiApiV1ProductsIdGetRequest;

/**
 * Product - Update Request
 * API request for updating an existing product
 */
export type ProductUpdateRequest =
  ProductsApiApiV1ProductsIdPutRequest["updateProductRequest"];

/**
 * Product - Delete Request
 * API request for deleting a product
 */
export type ProductDeleteRequest = ProductsApiApiV1ProductsIdDeleteRequest;

/**
 * Product - Search Request
 * API request for searching products
 */
export type ProductSearchRequest =
  ProductsApiApiV1ProductsSearchPostRequest["searchProductRequest"];

// ===========================
// Types - Product Response Objects
// ===========================

/**
 * Product response
 * Contains product details
 */
export type ProductResponse = ProductDto;

/**
 * Product response
 * Contains product details
 */
export type ProductDetailResponse = ProductDetailDto;

/**
 * Paginated products response
 * List of products with pagination info
 */
export type ProductListResponse = ProductDtoPaginatedResponse;

// ===========================
// Product Functions
// ===========================

/**
 * Create a new product
 * POST /api/v1/products
 * Add a new product to the system
 */
export const createProduct = async (request?: ProductCreateRequest) => {
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
export const getProduct = async (request: ProductGetRequest) => {
  const result = await apiClients.products.apiV1ProductsIdGet(request);
  return result.data;
};

/**
 * Update product
 * PUT /api/v1/products/{id}
 * Modify an existing product
 */
export const updateProduct = async (
  id: string,
  request?: ProductUpdateRequest,
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
export const deleteProduct = async (request: ProductDeleteRequest) => {
  const result = await apiClients.products.apiV1ProductsIdDelete(request);
  return result.data;
};

/**
 * Search products
 * POST /api/v1/products/search
 * Query products with filters and pagination
 */
export const searchProducts = async (request?: ProductSearchRequest) => {
  const result = await apiClients.products.apiV1ProductsSearchPost({
    searchProductRequest: request,
  });
  return result.data;
};
