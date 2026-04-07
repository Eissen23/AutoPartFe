export interface PaginatedQueryData<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function extractPaginatedArrayData<T>(raw: unknown): T[] {
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

export function extractPaginatedQueryData<T>(
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
