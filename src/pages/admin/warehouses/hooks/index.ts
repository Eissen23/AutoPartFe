import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { GuidApiResponse } from "#src/openapi";
import type {
  WarehouseLocationResponse,
  WarehouseLocationDetailResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
  PartLocationResponse,
  PartLocationCreateRequest,
  PartLocationUpdateRequest,
} from "#src/apis/warehouses";
import {
  createWarehouseLocation,
  updateWarehouseLocation,
  deleteWarehouseLocation,
  searchWarehouseLocations,
  createPartLocation as createPartLocationApi,
  updatePartLocation as updatePartLocationApi,
  deletePartLocation as deletePartLocationApi,
  searchPartLocations,
} from "#src/apis/warehouses";
import { useFetch, useApiMutation } from "#src/utils/api";

/**
 * Custom hook for managing warehouse locations
 */
export function useWarehouses() {
  const qc = useQueryClient();

  // Fetch all warehouse locations
  const {
    data: warehousesData = [],
    isLoading,
    error: fetchError,
    refetch,
  } = useFetch<WarehouseLocationResponse[]>({
    queryKey: ["warehouses"],
    queryFn: async () =>
      ({
        data: await searchWarehouseLocations(),
      }) as AxiosResponse<WarehouseLocationResponse[]>,
  });

  // Create warehouse mutation
  const { mutate: createWarehouse, isPending: isSubmitting } = useApiMutation({
    mutationFn: async (data: WarehouseLocationCreateRequest) =>
      ({
        data: await createWarehouseLocation(data),
      }) as AxiosResponse<GuidApiResponse>,
    onSuccess: () => {
      message.success("Warehouse location created successfully");
      qc.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: () => {
      message.error("Failed to create warehouse location");
    },
  });

  // Update warehouse mutation
  const { mutate: updateWarehouse } = useApiMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: WarehouseLocationUpdateRequest;
    }) =>
      ({
        data: await updateWarehouseLocation(id, data),
      }) as AxiosResponse<GuidApiResponse>,
    onSuccess: () => {
      message.success("Warehouse location updated successfully");
      qc.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: () => {
      message.error("Failed to update warehouse location");
    },
  });

  // Delete warehouse mutation
  const { mutate: deleteWarehouse, isPending: isDeleting } = useApiMutation<
    GuidApiResponse,
    string
  >({
    mutationFn: async (id: string) =>
      ({
        data: await deleteWarehouseLocation({ id }),
      }) as AxiosResponse<GuidApiResponse>,
    onSuccess: () => {
      message.success("Warehouse location deleted successfully");
      qc.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: () => {
      message.error("Failed to delete warehouse location");
    },
  });

  // Get warehouse details by ID
  const getWarehouseById = async (
    id: string,
  ): Promise<WarehouseLocationDetailResponse> => {
    try {
      const response = await searchWarehouseLocations();
      return Array.isArray(response) && response.length > 0
        ? (response[0] as WarehouseLocationDetailResponse)
        : {
            id,
            zoneCode: null,
            aisle: 0,
            shelf: 0,
            bin: null,
            isOverstocked: false,
            existingPart: [],
          };
    } catch {
      return {
        id,
        zoneCode: null,
        aisle: 0,
        shelf: 0,
        bin: null,
        isOverstocked: false,
        existingPart: [],
      };
    }
  };

  return {
    warehousesData,
    isLoading,
    isSubmitting,
    isDeleting,
    error: fetchError,
    refetch,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
}

/**
 * Custom hook for managing part locations
 */
export function usePartLocations() {
  const qc = useQueryClient();

  // Fetch all part locations
  const {
    data: partLocationsData = [],
    isLoading,
    error: fetchError,
    refetch,
  } = useFetch<PartLocationResponse[]>({
    queryKey: ["partLocations"],
    queryFn: async () =>
      ({
        data: await searchPartLocations(),
      }) as AxiosResponse<PartLocationResponse[]>,
  });

  // Create part location mutation
  const { mutate: createPartLocation, isPending: isSubmitting } =
    useApiMutation({
      mutationFn: async (data: PartLocationCreateRequest) =>
        ({
          data: await createPartLocationApi(data),
        }) as AxiosResponse<GuidApiResponse>,
      onSuccess: () => {
        message.success("Part location created successfully");
        qc.invalidateQueries({ queryKey: ["partLocations"] });
      },
      onError: () => {
        message.error("Failed to create part location");
      },
    });

  // Update part location mutation
  const { mutate: updatePartLocation } = useApiMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: PartLocationUpdateRequest;
    }) =>
      ({
        data: await updatePartLocationApi(id, data),
      }) as AxiosResponse<GuidApiResponse>,
    onSuccess: () => {
      message.success("Part location updated successfully");
      qc.invalidateQueries({ queryKey: ["partLocations"] });
    },
    onError: () => {
      message.error("Failed to update part location");
    },
  });

  // Delete part location mutation
  const { mutate: deletePartLocation, isPending: isDeleting } = useApiMutation<
    GuidApiResponse,
    string
  >({
    mutationFn: async (id: string) =>
      ({
        data: await deletePartLocationApi({ id }),
      }) as AxiosResponse<GuidApiResponse>,
    onSuccess: () => {
      message.success("Part location deleted successfully");
      qc.invalidateQueries({ queryKey: ["partLocations"] });
    },
    onError: () => {
      message.error("Failed to delete part location");
    },
  });

  return {
    partLocationsData,
    isLoading,
    isSubmitting,
    isDeleting,
    error: fetchError,
    refetch,
    createPartLocation,
    updatePartLocation,
    deletePartLocation,
  };
}
