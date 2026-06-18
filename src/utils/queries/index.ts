export interface ApiResponseMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function extractApiResponseMeta(
  meta: unknown,
  fallbackPageNumber = 1,
  fallbackPageSize = 10,
): ApiResponseMeta {
  if (!isObjectRecord(meta)) {
    return {
      currentPage: fallbackPageNumber,
      totalPages: 0,
      totalCount: 0,
      pageSize: fallbackPageSize,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  return {
    currentPage: toNumber(meta.currentPage, fallbackPageNumber),
    totalPages: toNumber(meta.totalPages, 0),
    totalCount: toNumber(meta.totalCount, 0),
    pageSize: toNumber(meta.pageSize, fallbackPageSize),
    hasPreviousPage: toBoolean(meta.hasPreviousPage, false),
    hasNextPage: toBoolean(meta.hasNextPage, false),
  };
}
