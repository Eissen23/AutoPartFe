import { useState } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  ProductResponse,
  ProductDetailResponse,
} from "#src/apis/products";
import type { CategoryNameDto, WarehouseStockDto } from "#src/openapi";

const { Text } = Typography;

interface ProductTableProps {
  data: ProductResponse[];
  loading: boolean;
  categoryMap: CategoryNameDto[];
  onExpand?: (id: string) => Promise<ProductDetailResponse>;
}

const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50,
) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function ProductTable({
  data,
  loading,
  categoryMap,
  onExpand,
}: ProductTableProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [expandedData, setExpandedData] = useState<
    Record<string, ProductDetailResponse>
  >({});
  const [expandLoading, setExpandLoading] = useState<Record<string, boolean>>(
    {},
  );

  const handleExpand = async (expanded: boolean, record: ProductResponse) => {
    if (expanded && onExpand && record.id) {
      setExpandLoading({ ...expandLoading, [record.id]: true });
      try {
        const details = await onExpand(record.id);
        setExpandedData({ ...expandedData, [record.id]: details });
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setExpandLoading({ ...expandLoading, [record.id]: false });
      }
    }
  };

  // Inner table columns for warehouse stocks
  const warehouseStockColumns: ColumnsType<WarehouseStockDto> = [
    {
      title: "Zone Code",
      dataIndex: "zoneCode",
      key: "zoneCode",
      render: (text) => (
        <Text className="font-mono text-sm">{text || "-"}</Text>
      ),
    },
    {
      title: "Aisle",
      dataIndex: "aisle",
      key: "aisle",
      width: 80,
      align: "center",
      render: (value: number | null) => <Text>{value ?? "-"}</Text>,
    },
    {
      title: "Shelf",
      dataIndex: "shelf",
      key: "shelf",
      width: 80,
      align: "center",
      render: (value: number | null) => <Text>{value ?? "-"}</Text>,
    },
    {
      title: "Bin",
      dataIndex: "bin",
      key: "bin",
      width: 100,
      render: (text) => <Text>{text || "-"}</Text>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (value: number | null) => (
        <span className="font-semibold text-gray-700">{value ?? 0}</span>
      ),
    },
  ];

  // Expandable row render
  const expandedRowRender = (record: ProductResponse) => {
    const details = expandedData[record.id!];
    const isLoading = expandLoading[record.id!];

    if (isLoading) {
      return (
        <div className="p-4 text-center text-gray-500">
          Loading warehouse stock information...
        </div>
      );
    }

    const stocks = details?.warehouseStocks || [];

    if (stocks.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No warehouse stock records found
        </div>
      );
    }

    return (
      <Table
        columns={warehouseStockColumns}
        dataSource={stocks}
        rowKey="id"
        pagination={false}
        size="small"
        className="ml-8"
      />
    );
  };

  const columns: ColumnsType<ProductResponse> = [
    {
      title: "Part Number",
      dataIndex: "partNumber",
      key: "partNumber",
      width: 120,
      render: (text) => (
        <Text className="font-mono text-sm font-medium">{text || "-"}</Text>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <Text className="font-medium">{text || "-"}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text) => (
        <Text className="text-gray-600 text-xs">{truncateText(text, 50)}</Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      width: 150,
      render: (categoryId: string) => {
        const category = categoryMap.find((ct) => ct.id === categoryId);
        return <Text>{category?.name || "-"}</Text>;
      },
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      width: 120,
      align: "right",
      render: (value: number) => (
        <span className="font-semibold text-gray-700">
          ${value?.toFixed(2) ?? "0.00"}
        </span>
      ),
    },
    {
      title: "Retail Price",
      dataIndex: "retailPrice",
      key: "retailPrice",
      width: 120,
      align: "right",
      render: (value: number | null) => (
        <span className="font-semibold text-gray-700">
          ${value?.toFixed(2) ?? "0.00"}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      expandable={{
        expandedRowRender,
        onExpand: handleExpand,
        expandedRowKeys,
        onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      className="bg-white rounded-lg shadow"
      scroll={{ x: 1200 }}
    />
  );
}
