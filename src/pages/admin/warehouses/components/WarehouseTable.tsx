import { useState } from "react";
import { Table, Button, Space, Popconfirm, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  WarehouseLocationResponse,
  WarehouseLocationDetailResponse,
  ExistingPartResponse,
} from "#src/apis/warehouses";

const { Text } = Typography;

interface WarehouseTableProps {
  data: WarehouseLocationResponse[];
  loading: boolean;
  onEdit: (record: WarehouseLocationResponse) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
  onExpand?: (id: string) => Promise<WarehouseLocationDetailResponse>;
}

export default function WarehouseTable({
  data,
  loading,
  onEdit,
  onDelete,
  deleting,
  onExpand,
}: WarehouseTableProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [expandedData, setExpandedData] = useState<
    Record<string, WarehouseLocationDetailResponse>
  >({});
  const [expandLoading, setExpandLoading] = useState<Record<string, boolean>>(
    {},
  );

  const handleExpand = async (
    expanded: boolean,
    record: WarehouseLocationResponse,
  ) => {
    if (expanded && onExpand && record.id) {
      setExpandLoading({ ...expandLoading, [record.id]: true });
      try {
        const details = await onExpand(record.id);
        setExpandedData({ ...expandedData, [record.id]: details });
      } catch (error) {
        console.error("Failed to load warehouse details:", error);
      } finally {
        setExpandLoading({ ...expandLoading, [record.id]: false });
      }
    }
  };

  // Inner table columns for part locations
  const partLocationColumns: ColumnsType<ExistingPartResponse> = [
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

  // Expandable row render
  const expandedRowRender = (record: WarehouseLocationResponse) => {
    const details = expandedData[record.id!];
    const isLoading = expandLoading[record.id!];

    if (isLoading) {
      return (
        <div className="p-4 text-center text-gray-500">
          Loading part locations...
        </div>
      );
    }

    const parts = details?.existingPart || [];

    if (parts.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No parts found at this warehouse location
        </div>
      );
    }

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
  };
  const columns: ColumnsType<WarehouseLocationResponse> = [
    {
      title: "Zone Code",
      dataIndex: "zoneCode",
      key: "zoneCode",
      render: (text) => <Text>{text || "-"}</Text>,
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
      render: (text) => <Text>{text || "-"}</Text>,
    },
    {
      title: "Overstocked",
      dataIndex: "isOverstocked",
      key: "isOverstocked",
      width: 120,
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
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      className="bg-white rounded-lg shadow"
      scroll={{ x: 900 }}
    />
  );
}
