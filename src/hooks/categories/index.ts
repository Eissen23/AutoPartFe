import {
  getCategoryMap,
  searchCategories,
  type CategorySearchRequest,
} from "#src/apis/categories";
import { useFetch } from "#src/utils/api";

export function useCategoriesQuery(payload: CategorySearchRequest) {
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
