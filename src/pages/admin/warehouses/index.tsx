import { useState } from "react";
import { Button, Typography, Card } from "antd";
import type {
  WarehouseLocationResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
} from "#src/apis/warehouses";
import { WarehouseTable, WarehouseFormModal } from "./components";
import { useWarehouses } from "./hooks";

const { Title } = Typography;

export default function WarehousesPage() {
  // Warehouse state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<WarehouseLocationResponse | null>(null);

  // Custom hooks
  const {
    warehousesData,
    isLoading: isLoadingWarehouses,
    isSubmitting: isSubmittingWarehouse,
    isDeleting: isDeletingWarehouse,
    refetch: refetchWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useWarehouses();

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
    deleteWarehouse(id);
  };

  const handleSubmitWarehouse = async (
    values: WarehouseLocationCreateRequest | WarehouseLocationUpdateRequest,
  ) => {
    if (editingWarehouse) {
      updateWarehouse({
        id: editingWarehouse.id!,
        data: values as WarehouseLocationUpdateRequest,
      });
    } else {
      createWarehouse(values as WarehouseLocationCreateRequest);
    }
    setIsWarehouseModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleCancelWarehouse = () => {
    setIsWarehouseModalOpen(false);
    setEditingWarehouse(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Warehouse Section */}
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
              size="small"
            >
              Refresh
            </Button>
            <Button
              type="primary"
              onClick={handleAddWarehouse}
              className="bg-blue-600 hover:bg-blue-700"
              size="small"
            >
              + Add Warehouse
            </Button>
          </div>
        </div>
      </Card>

      <WarehouseTable
        data={warehousesData || []}
        loading={isLoadingWarehouses}
        onEdit={handleEditWarehouse}
        onDelete={handleDeleteWarehouse}
        deleting={isDeletingWarehouse}
        onExpand={getWarehouseById}
      />

      {/* Modals */}
      <WarehouseFormModal
        open={isWarehouseModalOpen}
        onCancel={handleCancelWarehouse}
        onSubmit={handleSubmitWarehouse}
        editingWarehouse={editingWarehouse}
        loading={isSubmittingWarehouse}
      />
    </div>
  );
}
