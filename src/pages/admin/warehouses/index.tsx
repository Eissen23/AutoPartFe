import { useState } from "react";
import { Button, Typography, Card, Input, Select } from "antd";
import type {
  WarehouseLocationResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
  WarehouseLocationSearchRequest,
} from "#src/apis/warehouses";
import { WarehouseTable, WarehouseFormModal } from "./components";
import {
  useCreateWarehouse,
  useDeleteWarehouse,
  useUpdateWarehouse,
  useWarehousesQuery,
} from "#src/hooks/warehouses";

const { Title } = Typography;

export default function WarehousesPage() {
  // Warehouse state
  const [searchParams, setSearchParams] =
    useState<WarehouseLocationSearchRequest>({
      pageNumber: 1,
      pageSize: 10,
    });

  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<WarehouseLocationResponse | null>(null);

  const {
    data: warehousesResult,
    isLoading: isLoadingWarehouses,
    refetch: refetchWarehouses,
  } = useWarehousesQuery(searchParams);

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const warehousesData = warehousesResult?.items || [];
  const paginationCurrentPage =
    warehousesResult?.currentPage || searchParams?.pageNumber || 1;
  const paginationPageSize =
    warehousesResult?.pageSize || searchParams?.pageSize || 10;
  const paginationTotal = warehousesResult?.totalCount || 0;

  const searchKeyword = searchParams?.advanceSearches?.keyword ?? "";
  const overstockFilter: "all" | "true" | "false" =
    searchParams?.advanceFilter?.field === "isOverstocked"
      ? searchParams?.advanceFilter.value === true
        ? "true"
        : "false"
      : "all";

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

  // Warehouse handlers
  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setIsWarehouseModalOpen(true);
  };

  const handleEditWarehouse = (record: WarehouseLocationResponse) => {
    setEditingWarehouse(record);
    setIsWarehouseModalOpen(true);
  };

  const handleDeleteWarehouse = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmitWarehouse = async (
    values: WarehouseLocationCreateRequest | WarehouseLocationUpdateRequest,
  ) => {
    if (editingWarehouse) {
      updateMutation.mutate({
        id: editingWarehouse.id!,
        data: values as WarehouseLocationUpdateRequest,
      });
    } else {
      createMutation.mutate(values as WarehouseLocationCreateRequest);
    }
    setIsWarehouseModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleCancelWarehouse = () => {
    setIsWarehouseModalOpen(false);
    setEditingWarehouse(null);
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
      {/* Warehouse Section */}
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
          <Select
            value={overstockFilter}
            onChange={(value: "all" | "true" | "false") => {
              setSearchParams((prev) => ({
                ...prev,
                pageNumber: 1,
                advanceFilter:
                  value === "all"
                    ? undefined
                    : {
                        field: "isOverstocked",
                        operator: "eq",
                        value: value === "true",
                      },
              }));
            }}
            options={[
              { label: "All stock states", value: "all" },
              { label: "Overstocked only", value: "true" },
              { label: "Not overstocked", value: "false" },
            ]}
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
              Warehouse Locations
            </Title>
            <p className="text-gray-600 text-sm">
              Manage warehouse locations and view part inventory
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => refetchWarehouses()}
              loading={isLoadingWarehouses}
              size="medium"
            >
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={handleAddWarehouse}
              className="bg-blue-600 hover:bg-blue-700"
              size="medium"
            >
              + Add Warehouse
            </Button>
          </div>
        </div>
      </Card>

      <WarehouseTable
        data={warehousesData}
        loading={isLoadingWarehouses}
        onEdit={handleEditWarehouse}
        onDelete={handleDeleteWarehouse}
        deleting={deleteMutation.isPending}
        currentPage={paginationCurrentPage}
        pageSize={paginationPageSize}
        total={paginationTotal}
        onPaginationChange={handlePaginationChange}
      />

      {/* Modals */}
      <WarehouseFormModal
        open={isWarehouseModalOpen}
        onCancel={handleCancelWarehouse}
        onSubmit={handleSubmitWarehouse}
        editingWarehouse={editingWarehouse}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
