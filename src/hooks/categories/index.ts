import { getCategoryMap, searchCategories } from "#src/apis/categories";
import type { SearchCategoryRequest } from "#src/openapi";
import { useFetch } from "#src/utils/api";

export function useCategoriesQuery(payload: SearchCategoryRequest) {
  return useFetch({
    queryKey: ["categories", payload],
    queryFn: async () => {
      const result = await searchCategories(payload);
      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}

export function useCategoryMap() {
  return useFetch({
    queryKey: ["categories-map"],
    queryFn: async () => {
      const result = await getCategoryMap();
      return result?.data;
    },
    staleTime: 1000 * 60,
  });
}
