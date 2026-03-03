import { useState } from "react";
import type {
  ProductResponse,
  ProductDetailResponse,
} from "#src/apis/products";

const MOCK_PRODUCTS: ProductResponse[] = [
  {
    id: "p-001",
    partNumber: "ALT-1001",
    name: "Alternator Assembly",
    description: "High output alternator for sedans and compact SUVs",
    unitCost: 85.5,
    retailPrice: 129.99,
    categoryId: "cat-1",
  },
  {
    id: "p-002",
    partNumber: "BRK-2204",
    name: "Front Brake Pad Set",
    description: "Ceramic front brake pad set with low dust formulation",
    unitCost: 22.25,
    retailPrice: 44.5,
    categoryId: "cat-2",
  },
  {
    id: "p-003",
    partNumber: "FLT-3340",
    name: "Engine Oil Filter",
    description: "Spin-on oil filter compatible with multiple engine models",
    unitCost: 4.95,
    retailPrice: 9.99,
    categoryId: "cat-3",
  },
];

const MOCK_PRODUCT_DETAILS: Record<string, ProductDetailResponse> = {
  "p-001": {
    id: "p-001",
    partNumber: "ALT-1001",
    name: "Alternator Assembly",
    description: "High output alternator for sedans and compact SUVs",
    unitCost: 85.5,
    retailPrice: 129.99,
    warehouseStocks: [
      {
        id: "ws-1",
        zoneCode: "A",
        aisle: 1,
        shelf: 2,
        bin: "01",
        quantity: 15,
      },
      { id: "ws-2", zoneCode: "C", aisle: 2, shelf: 1, bin: "07", quantity: 8 },
    ],
  },
  "p-002": {
    id: "p-002",
    partNumber: "BRK-2204",
    name: "Front Brake Pad Set",
    description: "Ceramic front brake pad set with low dust formulation",
    unitCost: 22.25,
    retailPrice: 44.5,
    warehouseStocks: [
      {
        id: "ws-3",
        zoneCode: "B",
        aisle: 4,
        shelf: 3,
        bin: "11",
        quantity: 40,
      },
    ],
  },
  "p-003": {
    id: "p-003",
    partNumber: "FLT-3340",
    name: "Engine Oil Filter",
    description: "Spin-on oil filter compatible with multiple engine models",
    unitCost: 4.95,
    retailPrice: 9.99,
    warehouseStocks: [
      {
        id: "ws-4",
        zoneCode: "A",
        aisle: 2,
        shelf: 5,
        bin: "03",
        quantity: 120,
      },
      {
        id: "ws-5",
        zoneCode: "D",
        aisle: 1,
        shelf: 1,
        bin: "02",
        quantity: 65,
      },
    ],
  },
};

export const useProducts = () => {
  const [productsData] = useState<ProductResponse[]>(MOCK_PRODUCTS);
  const [isLoading] = useState(false);

  const getProductById = async (id: string): Promise<ProductDetailResponse> => {
    const detail = MOCK_PRODUCT_DETAILS[id];
    if (detail) {
      return detail;
    }

    return {
      id,
      partNumber: null,
      name: null,
      description: null,
      unitCost: 0,
      retailPrice: 0,
      warehouseStocks: [],
    };
  };

  const refetch = async () => {
    return;
  };

  return {
    productsData,
    isLoading,
    refetch,
    getProductById,
  };
};
