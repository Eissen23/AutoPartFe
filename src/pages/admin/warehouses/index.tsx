import { useState } from "react";
import { Button, Typography, Card } from "antd";
import type {
  WarehouseLocationResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
  PartLocationResponse,
  PartLocationCreateRequest,
  PartLocationUpdateRequest,
} from "#src/apis/warehouses";
import {
  WarehouseTable,
  WarehouseFormModal,
  PartLocationTable,
  PartLocationFormModal,
} from "./components";
import { useWarehouses, usePartLocations } from "./hooks";

const { Title } = Typography;

export default function WarehousesPage() {
  // Warehouse state
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<WarehouseLocationResponse | null>(null);

  // Part Location state
  const [isPartLocationModalOpen, setIsPartLocationModalOpen] = useState(false);
  const [editingPartLocation, setEditingPartLocation] =
    useState<PartLocationResponse | null>(null);

  // Custom hooks
  const {
    warehousesData,
    isLoading: isLoadingWarehouses,
    isSubmitting: isSubmittingWarehouse,
    isDeleting: isDeletingWarehouse,
    refetch: refetchWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useWarehouses();

  const {
    partLocationsData,
    isLoading: isLoadingPartLocations,
    isSubmitting: isSubmittingPartLocation,
    isDeleting: isDeletingPartLocation,
    refetch: refetchPartLocations,
    createPartLocation,
    updatePartLocation,
    deletePartLocation,
  } = usePartLocations();

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
      await updateWarehouse(
        editingWarehouse.id!,
        values as WarehouseLocationUpdateRequest,
      );
    } else {
      await createWarehouse(values as WarehouseLocationCreateRequest);
    }
    setIsWarehouseModalOpen(false);
    setEditingWarehouse(null);
  };

  const handleCancelWarehouse = () => {
    setIsWarehouseModalOpen(false);
    setEditingWarehouse(null);
  };

  // Part Location handlers
  const handleAddPartLocation = () => {
    setEditingPartLocation(null);
    setIsPartLocationModalOpen(true);
  };

  const handleEditPartLocation = (record: PartLocationResponse) => {
    setEditingPartLocation(record);
    setIsPartLocationModalOpen(true);
  };

  const handleDeletePartLocation = (id: string) => {
    deletePartLocation(id);
  };

  const handleSubmitPartLocation = async (
    values: PartLocationCreateRequest | PartLocationUpdateRequest,
  ) => {
    if (editingPartLocation) {
      await updatePartLocation(
        editingPartLocation.id!,
        values as PartLocationUpdateRequest,
      );
    } else {
      await createPartLocation(values as PartLocationCreateRequest);
    }
    setIsPartLocationModalOpen(false);
    setEditingPartLocation(null);
  };

  const handleCancelPartLocation = () => {
    setIsPartLocationModalOpen(false);
    setEditingPartLocation(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-2 gap-6">
        {/* Warehouse Section */}
        <div>
          <Card className="mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <Title level={3} className="mb-1!">
                  Warehouse Locations
                </Title>
                <p className="text-gray-600 text-sm">
                  Manage warehouse locations
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
                  + Add
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
          />
        </div>

        {/* Part Location Section */}
        <div>
          <Card className="mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <Title level={3} className="mb-1!">
                  Part Locations
                </Title>
                <p className="text-gray-600 text-sm">Manage part inventory</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => refetchPartLocations()}
                  loading={isLoadingPartLocations}
                  size="small"
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  onClick={handleAddPartLocation}
                  className="bg-green-600 hover:bg-green-700"
                  size="small"
                >
                  + Add
                </Button>
              </div>
            </div>
          </Card>

          <PartLocationTable
            data={partLocationsData || []}
            loading={isLoadingPartLocations}
            onEdit={handleEditPartLocation}
            onDelete={handleDeletePartLocation}
            deleting={isDeletingPartLocation}
          />
        </div>
      </div>

      {/* Modals */}
      <WarehouseFormModal
        open={isWarehouseModalOpen}
        onCancel={handleCancelWarehouse}
        onSubmit={handleSubmitWarehouse}
        editingWarehouse={editingWarehouse}
        loading={isSubmittingWarehouse}
      />

      <PartLocationFormModal
        open={isPartLocationModalOpen}
        onCancel={handleCancelPartLocation}
        onSubmit={handleSubmitPartLocation}
        editingPartLocation={editingPartLocation}
        loading={isSubmittingPartLocation}
      />
    </div>
  );
}
