import { Table, Button, Space, Popconfirm, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { WarehouseLocationResponse } from "#src/apis/warehouses";

const { Text } = Typography;

interface WarehouseTableProps {
  data: WarehouseLocationResponse[];
  loading: boolean;
  onEdit: (record: WarehouseLocationResponse) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

export default function WarehouseTable({
  data,
  loading,
  onEdit,
  onDelete,
  deleting,
}: WarehouseTableProps) {
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
