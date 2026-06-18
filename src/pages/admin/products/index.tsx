import { Card, Typography, Button, Space, Input } from "antd";
import { ProductFormModal, ProductTable } from "./components";
import { useMemo, useState } from "react";
import {
  useCreateProduct,
  useDeleteProduct,
  useProductQuery,
  useUpdateProduct,
} from "#src/hooks/product";
import { useCategoryMap } from "#src/hooks/categories";
import { extractApiResponseMeta } from "#src/utils/queries";
import type {
  CreateProductRequest,
  ProductDto,
  SearchProductRequest,
  UpdateProductRequest,
} from "#src/openapi";

const { Title } = Typography;

export default function ProductsPage() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [searchParams, setSearchParams] = useState<SearchProductRequest>({
    pageNumber: 1,
    pageSize: 10,
  });

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useProductQuery(searchParams);
  const { data: categoryMap, isLoading: loadingCategories } = useCategoryMap();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const productsMeta = useMemo(
    () =>
      extractApiResponseMeta(
        productsData?.meta,
        searchParams.pageNumber ?? 1,
        searchParams.pageSize ?? 10,
      ),
    [productsData?.meta, searchParams.pageNumber, searchParams.pageSize],
  );

  const paginationCurrentPage = productsMeta.currentPage;
  const paginationPageSize = productsMeta.pageSize;
  const paginationTotal = productsMeta.totalCount;

  const data = productsData?.data ?? [];
  const searchKeyword = searchParams?.advanceSearches?.keyword ?? "";

  const applyFilters = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
  };

  const resetFilters = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: 1,
      advanceSearches: undefined,
      advanceFilter: undefined,
    }));
  };

  const handleSubmitProduct = async (
    values: CreateProductRequest | UpdateProductRequest,
  ) => {
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id!,
        data: values as UpdateProductRequest,
      });
    } else {
      createMutation.mutate(values as CreateProductRequest);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (record: ProductDto) => {
    setEditingProduct(record);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: page,
      pageSize,
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="mb-6! shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            allowClear
            value={searchKeyword}
            placeholder="Search by zone code or bin"
            onChange={(event) => {
              const value = event.target.value;
              const trimmed = value.trim();

              setSearchParams((prev) => ({
                ...prev,
                pageNumber: 1,
                advanceSearches: trimmed
                  ? {
                      fields: ["zoneCode", "bin"],
                      keyword: value,
                    }
                  : undefined,
              }));
            }}
            onPressEnter={applyFilters}
          />

          <div className="flex gap-2">
            <Button type="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button onClick={resetFilters}>Reset</Button>
          </div>
        </div>
      </Card>

      {/* Products Section */}
      <Card className="mb-6! shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="mb-1!">
              Products
            </Title>
            <p className="text-gray-600 text-sm">
              Manage products and view warehouse stock information
            </p>
          </div>
          <Space>
            <Button type="primary" onClick={handleAddProduct}>
              Create Product
            </Button>
            <Button
              onClick={() => {
                refetchProducts();
              }}
              loading={isLoadingProducts || loadingCategories}
              size="medium"
            >
              Refresh
            </Button>
          </Space>
        </div>
      </Card>

      <ProductTable
        data={data || []}
        loading={isLoadingProducts || loadingCategories}
        categoryMap={categoryMap || []}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        deleting={deleteMutation.isPending}
        currentPage={paginationCurrentPage}
        pageSize={paginationPageSize}
        total={paginationTotal}
        onPaginationChange={handlePaginationChange}
      />

      <ProductFormModal
        open={showProductModal}
        onCancel={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        editingProduct={editingProduct}
        loading={createMutation.isPending || updateMutation.isPending}
        categoryMap={categoryMap || []}
      />
    </div>
  );
}
