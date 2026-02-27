import { useState } from "react";
import { message } from "antd";
import type {
  WarehouseLocationResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
  PartLocationResponse,
  PartLocationCreateRequest,
  PartLocationUpdateRequest,
} from "#src/apis/warehouses";

// Mock data for warehouse locations
const MOCK_WAREHOUSES: WarehouseLocationResponse[] = [
  {
    id: "1",
    zoneCode: "A",
    aisle: 1,
    shelf: 3,
    bin: "01",
    isOverstocked: false,
  },
  {
    id: "2",
    zoneCode: "A",
    aisle: 2,
    shelf: 5,
    bin: "02",
    isOverstocked: true,
  },
  {
    id: "3",
    zoneCode: "B",
    aisle: 1,
    shelf: 2,
    bin: "A1",
    isOverstocked: false,
  },
  {
    id: "4",
    zoneCode: "B",
    aisle: 3,
    shelf: 4,
    bin: "B2",
    isOverstocked: false,
  },
  {
    id: "5",
    zoneCode: "C",
    aisle: 1,
    shelf: 1,
    bin: null,
    isOverstocked: true,
  },
  {
    id: "6",
    zoneCode: null,
    aisle: 5,
    shelf: 2,
    bin: "03",
    isOverstocked: false,
  },
];

// Mock data for part locations
const MOCK_PART_LOCATIONS: PartLocationResponse[] = [
  {
    id: "1",
    partId: "PART-001",
    warehouseLocationId: "1",
    quantityAtLocation: 100,
  },
  {
    id: "2",
    partId: "PART-002",
    warehouseLocationId: "2",
    quantityAtLocation: 50,
  },
  {
    id: "3",
    partId: "PART-003",
    warehouseLocationId: "3",
    quantityAtLocation: 75,
  },
  {
    id: "4",
    partId: "PART-001",
    warehouseLocationId: "4",
    quantityAtLocation: 25,
  },
];

/**
 * Custom hook for managing warehouse locations
 */
export function useWarehouses() {
  const [warehousesData, setWarehousesData] =
    useState<WarehouseLocationResponse[]>(MOCK_WAREHOUSES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.info("Warehouse data refreshed");
    }, 500);
  };

  const createWarehouse = (data: WarehouseLocationCreateRequest) => {
    setIsSubmitting(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newWarehouse: WarehouseLocationResponse = {
          id: Date.now().toString(),
          zoneCode: data?.zoneCode || null,
          aisle: data?.aisle || 0,
          shelf: data?.shelf || 0,
          bin: data?.bin || null,
          isOverstocked: data?.isOverstocked || false,
        };
        setWarehousesData((prev) => [...prev, newWarehouse]);
        message.success("Warehouse location created successfully");
        setIsSubmitting(false);
        resolve();
      }, 500);
    });
  };

  const updateWarehouse = (
    id: string,
    data: WarehouseLocationUpdateRequest,
  ) => {
    setIsSubmitting(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setWarehousesData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  zoneCode: data?.zoneCode ?? item.zoneCode,
                  aisle: data?.aisle ?? item.aisle,
                  shelf: data?.shelf ?? item.shelf,
                  bin: data?.bin ?? item.bin,
                  isOverstocked: data?.isOverstocked ?? item.isOverstocked,
                }
              : item,
          ),
        );
        message.success("Warehouse location updated successfully");
        setIsSubmitting(false);
        resolve();
      }, 500);
    });
  };

  const deleteWarehouse = (id: string) => {
    setIsDeleting(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setWarehousesData((prev) => prev.filter((item) => item.id !== id));
        message.success("Warehouse location deleted successfully");
        setIsDeleting(false);
        resolve();
      }, 500);
    });
  };

  return {
    warehousesData,
    isLoading,
    isSubmitting,
    isDeleting,
    refetch,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
}

/**
 * Custom hook for managing part locations
 */
export function usePartLocations() {
  const [partLocationsData, setPartLocationsData] =
    useState<PartLocationResponse[]>(MOCK_PART_LOCATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.info("Part location data refreshed");
    }, 500);
  };

  const createPartLocation = (data: PartLocationCreateRequest) => {
    setIsSubmitting(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newPartLocation: PartLocationResponse = {
          id: Date.now().toString(),
          partId: data?.partId || "",
          warehouseLocationId: data?.warehouseLocationId || "",
          quantityAtLocation: data?.quantityAtLocation || 0,
        };
        setPartLocationsData((prev) => [...prev, newPartLocation]);
        message.success("Part location created successfully");
        setIsSubmitting(false);
        resolve();
      }, 500);
    });
  };

  const updatePartLocation = (id: string, data: PartLocationUpdateRequest) => {
    setIsSubmitting(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPartLocationsData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  partId: data?.partId ?? item.partId,
                  warehouseLocationId:
                    data?.warehouseLocationId ?? item.warehouseLocationId,
                  quantityAtLocation:
                    data?.quantityAtLocation ?? item.quantityAtLocation,
                }
              : item,
          ),
        );
        message.success("Part location updated successfully");
        setIsSubmitting(false);
        resolve();
      }, 500);
    });
  };

  const deletePartLocation = (id: string) => {
    setIsDeleting(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPartLocationsData((prev) => prev.filter((item) => item.id !== id));
        message.success("Part location deleted successfully");
        setIsDeleting(false);
        resolve();
      }, 500);
    });
  };

  return {
    partLocationsData,
    isLoading,
    isSubmitting,
    isDeleting,
    refetch,
    createPartLocation,
    updatePartLocation,
    deletePartLocation,
  };
}
