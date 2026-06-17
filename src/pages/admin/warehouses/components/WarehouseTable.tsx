import { useState } from "react";
import { Table, Button, Space, Popconfirm, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {} from "#src/apis/warehouses";
import { useWarehouseById } from "#src/hooks/warehouses";
import type { ExistingPart, WarehouseLocationDto } from "#src/openapi";

const { Text } = Typography;

interface WarehouseTableProps {
  data: WarehouseLocationDto[];
  loading: boolean;
  onEdit: (record: WarehouseLocationDto) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

function ExpandedPartsTable({ warehouseId }: { warehouseId: string }) {
  const { data: details, isLoading } = useWarehouseById(warehouseId);

  // Show loader while details query is in flight for the expanded row.
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading part locations...
      </div>
    );
  }

  const parts = details?.data?.existingPart || [];

  if (parts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No parts found at this warehouse location
      </div>
    );
  }

  const partLocationColumns: ColumnsType<ExistingPart> = [
    {
      title: "Part Number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text) => (
        <Text className="font-mono text-sm">{text || "-"}</Text>
      ),
    },
    {
      title: "Part Name",
      dataIndex: "partName",
      key: "partName",
      render: (text) => <Text className="text-sm">{text || "-"}</Text>,
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
      columns={partLocationColumns}
      dataSource={parts}
      rowKey="id"
      pagination={false}
      size="small"
      className="ml-8"
    />
  );
}

export default function WarehouseTable({
  data,
  loading,
  onEdit,
  onDelete,
  deleting,
  currentPage,
  pageSize,
  total,
  onPaginationChange,
}: WarehouseTableProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const handleExpand = (expanded: boolean, record: WarehouseLocationDto) => {
    if (!record.id) {
      return;
    }

    setExpandedRowKeys((prev) =>
      expanded
        ? [...new Set([...prev, record.id!])]
        : prev.filter((key) => key !== record.id),
    );
  };

  const expandedRowRender = (record: WarehouseLocationDto) => {
    if (!record.id) {
      return null;
    }

    return <ExpandedPartsTable warehouseId={record.id} />;
  };

  const columns: ColumnsType<WarehouseLocationDto> = [
    {
      title: "Zone Code",
      dataIndex: "zoneCode",
      key: "zoneCode",
      render: (text) => <Text>{text || "-"}</Text>,
      width: 150,
    },
    {
      title: "Aisle",
      dataIndex: "aisle",
      key: "aisle",
      width: 100,
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Shelf",
      dataIndex: "shelf",
      key: "shelf",
      width: 100,
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Bin",
      dataIndex: "bin",
      key: "bin",
      width: 100,
      render: (text) => <Text>{text || "-"}</Text>,
    },
    {
      title: "Overstocked",
      dataIndex: "isOverstocked",
      key: "isOverstocked",
      width: 50,
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {value ? "Yes" : "No"}
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
            title="Delete Warehouse"
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
      scroll={{ x: 900 }}
    />
  );
}
