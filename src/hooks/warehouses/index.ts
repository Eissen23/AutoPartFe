import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type {
  GuidApiResponse,
  SearchWarehouseLocationRequest,
} from "#src/openapi";
import type {
  WarehouseLocationResponse,
  WarehouseLocationDetailResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
  PartLocationResponse,
  PartLocationSearchRequest,
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
  getWarehouseLocation,
} from "#src/apis/warehouses";
import { useFetch, useApiMutation } from "#src/utils/api";

interface PaginatedQueryData<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

function extractPaginatedArrayData<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) {
    return raw as T[];
  }

  if (!raw || typeof raw !== "object") {
    return [];
  }

  const firstLevelData = (raw as Record<string, unknown>).data;

  if (Array.isArray(firstLevelData)) {
    return firstLevelData as T[];
  }

  if (!firstLevelData || typeof firstLevelData !== "object") {
    return [];
  }

  const secondLevelData = (firstLevelData as Record<string, unknown>).data;

  return Array.isArray(secondLevelData) ? (secondLevelData as T[]) : [];
}

function extractPaginatedQueryData<T>(
  raw: unknown,
  fallbackPageNumber = 1,
  fallbackPageSize = 10,
): PaginatedQueryData<T> {
  if (Array.isArray(raw)) {
    return {
      items: raw as T[],
      totalCount: raw.length,
      currentPage: fallbackPageNumber,
      pageSize: fallbackPageSize,
    };
  }

  if (!raw || typeof raw !== "object") {
    return {
      items: [],
      totalCount: 0,
      currentPage: fallbackPageNumber,
      pageSize: fallbackPageSize,
    };
  }

  const firstLevel = raw as Record<string, unknown>;
  const firstLevelData = firstLevel.data;

  if (Array.isArray(firstLevelData)) {
    const totalCount =
      typeof firstLevel.totalCount === "number"
        ? firstLevel.totalCount
        : firstLevelData.length;

    return {
      items: firstLevelData as T[],
      totalCount,
      currentPage:
        typeof firstLevel.currentPage === "number"
          ? firstLevel.currentPage
          : fallbackPageNumber,
      pageSize:
        typeof firstLevel.pageSize === "number"
          ? firstLevel.pageSize
          : fallbackPageSize,
    };
  }

  if (!firstLevelData || typeof firstLevelData !== "object") {
    return {
      items: [],
      totalCount: 0,
      currentPage: fallbackPageNumber,
      pageSize: fallbackPageSize,
    };
  }

  const secondLevel = firstLevelData as Record<string, unknown>;
  const secondLevelData = secondLevel.data;
  const items = Array.isArray(secondLevelData) ? (secondLevelData as T[]) : [];

  return {
    items,
    totalCount:
      typeof secondLevel.totalCount === "number"
        ? secondLevel.totalCount
        : items.length,
    currentPage:
      typeof secondLevel.currentPage === "number"
        ? secondLevel.currentPage
        : fallbackPageNumber,
    pageSize:
      typeof secondLevel.pageSize === "number"
        ? secondLevel.pageSize
        : fallbackPageSize,
  };
}

// Fetch warehouse location
export function useWarehousesQuery(payload?: SearchWarehouseLocationRequest) {
  return useFetch<PaginatedQueryData<WarehouseLocationResponse>>({
    queryKey: ["warehouses", payload],
    queryFn: async () => {
      const raw = await searchWarehouseLocations(payload);
      const parsed = extractPaginatedQueryData<WarehouseLocationResponse>(
        raw,
        payload?.pageNumber,
        payload?.pageSize,
      );

      return {
        data: parsed,
      } as AxiosResponse<PaginatedQueryData<WarehouseLocationResponse>>;
    },
  });
}

// Create warehouse
export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useApiMutation({
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
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  return useApiMutation<
    GuidApiResponse,
    { id: string; data: WarehouseLocationUpdateRequest }
  >({
    mutationFn: async ({ id, data }) =>
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
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useApiMutation<GuidApiResponse, string>({
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
}

export function useWarehouseById(id: string | null | undefined) {
  const warehouseId = id?.trim();

  return useFetch<WarehouseLocationDetailResponse>({
    queryKey: ["warehouse-location", id],
    queryFn: async () => {
      if (!warehouseId) {
        throw new Error("Warehouse id is required");
      }

      const raw = await getWarehouseLocation(warehouseId);
      return {
        data: raw as WarehouseLocationDetailResponse,
      } as AxiosResponse<WarehouseLocationDetailResponse>;
    },
    enabled: !!warehouseId,
  });
}

/**
 * Fetch part locations
 */
export function usePartLocationsQuery(payload?: PartLocationSearchRequest) {
  return useFetch<PartLocationResponse[]>({
    queryKey: ["partLocations", payload],
    queryFn: async () => {
      const raw = await searchPartLocations(payload);
      return {
        data: extractPaginatedArrayData<PartLocationResponse>(raw),
      } as AxiosResponse<PartLocationResponse[]>;
    },
  });
}

export function useCreatePartLocation() {
  const qc = useQueryClient();

  return useApiMutation({
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
}

export function useUpdatePartLocation() {
  const qc = useQueryClient();

  return useApiMutation<
    GuidApiResponse,
    { id: string; data: PartLocationUpdateRequest }
  >({
    mutationFn: async ({ id, data }) =>
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
}

export function useDeletePartLocation() {
  const qc = useQueryClient();

  return useApiMutation<GuidApiResponse, string>({
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
}
