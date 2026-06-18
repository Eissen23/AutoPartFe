import { useMemo, useState } from "react";
import { Button, Card, Input, Space, Typography } from "antd";
import {
  useCategoriesQuery,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "#src/hooks/categories";
import type {
  CategoryDto,
  CreateCategoryRequest,
  SearchCategoryRequest,
  UpdateCategoryRequest,
} from "#src/openapi";
import { extractApiResponseMeta } from "#src/utils/queries";
import {
  CategoryDetailModal,
  CategoryFormModal,
  CategoryTable,
} from "#src/components/categories";

const { Title } = Typography;

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useState<SearchCategoryRequest>({
    pageNumber: 1,
    pageSize: 10,
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(
    null,
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const {
    data: categoriesResult,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useCategoriesQuery(searchParams);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categoriesMeta = useMemo(
    () =>
      extractApiResponseMeta(
        categoriesResult?.meta,
        searchParams.pageNumber ?? 1,
        searchParams.pageSize ?? 10,
      ),
    [categoriesResult?.meta, searchParams.pageNumber, searchParams.pageSize],
  );

  const categoriesData = categoriesResult?.data ?? [];
  const paginationCurrentPage = categoriesMeta.currentPage;
  const paginationPageSize = categoriesMeta.pageSize;
  const paginationTotal = categoriesMeta.totalCount;

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

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleViewCategory = (record: CategoryDto) => {
    if (!record.id) {
      return;
    }

    setSelectedCategoryId(record.id);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCategoryId(null);
  };

  const handleEditCategory = (record: CategoryDto) => {
    setEditingCategory(record);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmitCategory = async (
    values: CreateCategoryRequest | UpdateCategoryRequest,
  ) => {
    if (editingCategory?.id) {
      updateMutation.mutate({
        id: editingCategory.id,
        data: values as UpdateCategoryRequest,
      });
    } else {
      createMutation.mutate(values as CreateCategoryRequest);
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCancelCategory = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
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
            placeholder="Search by category code, name or description"
            onChange={(event) => {
              const value = event.target.value;
              const trimmed = value.trim();

              setSearchParams((prev) => ({
                ...prev,
                pageNumber: 1,
                advanceSearches: trimmed
                  ? {
                      fields: ["categoryCode", "name", "description"],
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

      <Card className="mb-6! shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="mb-1!">
              Categories
            </Title>
            <p className="text-gray-600 text-sm">
              Manage product categories and review category details
            </p>
          </div>
          <Space>
            <Button
              onClick={() => refetchCategories()}
              loading={isLoadingCategories}
              size="middle"
            >
              Refresh
            </Button>
            <Button type="primary" onClick={handleAddCategory} size="middle">
              Create Category
            </Button>
          </Space>
        </div>
      </Card>

      <CategoryTable
        data={categoriesData}
        loading={isLoadingCategories}
        onView={handleViewCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        deleting={deleteMutation.isPending}
        currentPage={paginationCurrentPage}
        pageSize={paginationPageSize}
        total={paginationTotal}
        onPaginationChange={handlePaginationChange}
      />

      <CategoryFormModal
        open={isCategoryModalOpen}
        onCancel={handleCancelCategory}
        onSubmit={handleSubmitCategory}
        editingCategory={editingCategory}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <CategoryDetailModal
        open={isDetailModalOpen}
        categoryId={selectedCategoryId}
        onCancel={handleCloseDetailModal}
      />
    </div>
  );
}
