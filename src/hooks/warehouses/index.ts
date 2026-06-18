import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "#src/utils/message";
import type {
  CreatePartLocationRequest,
  CreateWarehouseLocationRequest,
  SearchPartLocationRequest,
  SearchWarehouseLocationRequest,
  UpdatePartLocationRequest,
  UpdateWarehouseLocationRequest,
} from "#src/openapi";
import type {} from "#src/apis/warehouses";
import {
  createWarehouseLocation,
  updateWarehouseLocation,
  deleteWarehouseLocation,
  searchWarehouseLocations,
  createPartLocation as createPartLocationApi,
  updatePartLocation as updatePartLocationApi,
  deletePartLocation as deletePartLocationApi,
  searchPartLocations,
  getWarehouseLocation,
} from "#src/apis/warehouses";
import { useFetch, useApiMutation } from "#src/utils/api";

// Fetch warehouse location
export function useWarehousesQuery(payload?: SearchWarehouseLocationRequest) {
  return useFetch({
    queryKey: ["warehouses", payload],
    queryFn: async () => {
      const raw = await searchWarehouseLocations(payload);

      return raw;
    },
    staleTime: 1000 * 60,
  });
}

// Create warehouse
export function useCreateWarehouse() {
  const qc = useQueryClient();
  const message = useMessage();
  return useApiMutation({
    mutationFn: async (data: CreateWarehouseLocationRequest) => ({
      data: await createWarehouseLocation(data),
    }),
    onSuccess: () => {
      message.success("Warehouse location created successfully");
      qc.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: () => {
      message.error("Failed to create warehouse location");
    },
  });
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  const message = useMessage();
  return useApiMutation({
    mutationFn: async (payload: {
      id: string;
      data: UpdateWarehouseLocationRequest;
    }) => ({
      data: await updateWarehouseLocation(payload.id, payload.data),
    }),
    onSuccess: (_data, variable) => {
      message.success("Warehouse location updated successfully");
      qc.invalidateQueries({ queryKey: ["warehouses"] });
      qc.invalidateQueries({ queryKey: ["warehouse", variable.id] });
    },
    onError: () => {
      message.error("Failed to update warehouse location");
    },
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  const message = useMessage();
  return useApiMutation({
    mutationFn: async (id: string) => ({
      data: await deleteWarehouseLocation(id),
    }),
    onSuccess: () => {
      message.success("Warehouse location deleted successfully");
      qc.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: () => {
      message.error("Failed to delete warehouse location");
    },
  });
}

export function useWarehouseById(id: string | null | undefined) {
  const warehouseId = id?.trim();

  return useFetch({
    queryKey: ["warehouse", id],
    queryFn: async () => {
      if (!warehouseId) {
        throw new Error("Warehouse id is required");
      }

      const raw = await getWarehouseLocation(warehouseId);
      return {
        data: raw.data,
      };
    },
    enabled: !!warehouseId,
  });
}

/**
 * Fetch part locations
 */
export function usePartLocationsQuery(payload?: SearchPartLocationRequest) {
  return useFetch({
    queryKey: ["part-locations", payload],
    queryFn: async () => {
      const raw = await searchPartLocations(payload);
      return {
        data: raw.data,
      };
    },
    staleTime: 1000 * 60,
  });
}

export function useCreatePartLocation() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (data: CreatePartLocationRequest) => ({
      data: await createPartLocationApi(data),
    }),
    onSuccess: () => {
      message.success("Part location created successfully");
      qc.invalidateQueries({ queryKey: ["part-locations"] });
    },
    onError: () => {
      message.error("Failed to create part location");
    },
  });
}

export function useUpdatePartLocation() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (payload: {
      id: string;
      data: UpdatePartLocationRequest;
    }) => ({ data: await updatePartLocationApi(payload.id, payload.data) }),
    onSuccess: () => {
      message.success("Part location updated successfully");
      qc.invalidateQueries({ queryKey: ["part-locations"] });
    },
    onError: () => {
      message.error("Failed to update part location");
    },
  });
}

export function useDeletePartLocation() {
  const qc = useQueryClient();
  const message = useMessage();

  return useApiMutation({
    mutationFn: async (id: string) => ({
      data: await deletePartLocationApi(id),
    }),
    onSuccess: () => {
      message.success("Part location deleted successfully");
      qc.invalidateQueries({ queryKey: ["part-locations"] });
    },
    onError: () => {
      message.error("Failed to delete part location");
    },
  });
}
