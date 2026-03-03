import { Card, Typography, Button, Space } from "antd";
import { ProductTable } from "./components";
import { useProducts } from "./hooks";
import type { CategoryNameDto } from "#src/openapi";

const { Title } = Typography;

const MOCK_CATEGORIES: CategoryNameDto[] = [
  { id: "cat-1", name: "Electrical" },
  { id: "cat-2", name: "Braking" },
  { id: "cat-3", name: "Filters" },
];

export default function ProductsPage() {
  const {
    productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
    getProductById,
  } = useProducts();

  const loadingCategories = false;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Products Section */}
      <Card className="mb-6! shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="mb-1!">
              Products
            </Title>
            <p className="text-gray-600 text-sm">
              Manage products and view warehouse stock information
            </p>
          </div>
          <Space>
            <Button
              onClick={() => {
                refetchProducts();
              }}
              loading={isLoadingProducts || loadingCategories}
              size="small"
            >
              Refresh
            </Button>
          </Space>
        </div>
      </Card>

      <ProductTable
        data={productsData || []}
        loading={isLoadingProducts || loadingCategories}
        categoryMap={MOCK_CATEGORIES}
        onExpand={getProductById}
      />
    </div>
  );
}
