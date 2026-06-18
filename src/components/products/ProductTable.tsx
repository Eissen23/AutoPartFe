import { useState } from "react";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  CategoryNameDto,
  ProductDto,
  WarehouseStockDto,
} from "#src/openapi";
import { useProductById } from "#src/hooks/product";

const { Text } = Typography;

interface ProductTableProps {
  data: ProductDto[];
  loading: boolean;
  categoryMap: CategoryNameDto[];
  onEdit: (record: ProductDto) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

function ExpandTable({ productId }: { productId: string }) {
  const { data: detailData, isLoading } = useProductById(productId);

  // Show loader while details query is in flight for the expanded row.
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading product stock...
      </div>
    );
  }

  const stock = detailData?.warehouseStocks || [];

  if (stock.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No stock found of this product
      </div>
    );
  }

  const columns: ColumnsType<WarehouseStockDto> = [
    {
      title: "Zone Code",
      dataIndex: "zoneCode",
      key: "zoneCode",
      width: 80,
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

  return (
    <Table
      columns={columns}
      dataSource={stock}
      rowKey="id"
      pagination={false}
      size="small"
      className="ml-8"
    />
  );
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
  onEdit,
  onDelete,
  deleting,
  currentPage,
  pageSize,
  total,
  onPaginationChange,
}: ProductTableProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleExpand = async (expanded: boolean, record: ProductDto) => {
    if (!record.id) {
      return;
    }

    setExpandedRowKeys((prev) =>
      expanded
        ? [...new Set([...prev, record.id!])]
        : prev.filter((key) => key !== record.id),
    );
  };

  // Inner table columns for warehouse stocks

  // Expandable row render
  const expandedRowRender = (record: ProductDto) => {
    if (!record.id) {
      return null;
    }

    return <ExpandTable productId={record.id} />;
  };

  const columns: ColumnsType<ProductDto> = [
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
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            onClick={() => onEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Product?"
            description="Are you sure you want to delete this warehouse location?"
            onConfirm={() => onDelete(record.id!)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true, loading: deleting }}
          >
            <Button type="link" danger loading={deleting}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
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
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPaginationChange,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      className="bg-white rounded-lg shadow"
      scroll={{ x: 1200 }}
    />
  );
}
