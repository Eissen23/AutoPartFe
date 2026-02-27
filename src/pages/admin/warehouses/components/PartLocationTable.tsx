import { Table, Button, Space, Popconfirm, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PartLocationResponse } from "#src/apis/warehouses";

const { Text } = Typography;

interface PartLocationTableProps {
  data: PartLocationResponse[];
  loading: boolean;
  onEdit: (record: PartLocationResponse) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

export default function PartLocationTable({
  data,
  loading,
  onEdit,
  onDelete,
  deleting,
}: PartLocationTableProps) {
  const columns: ColumnsType<PartLocationResponse> = [
    {
      title: "Part ID",
      dataIndex: "partId",
      key: "partId",
      render: (text) => <Text className="font-mono">{text}</Text>,
    },
    {
      title: "Warehouse Location ID",
      dataIndex: "warehouseLocationId",
      key: "warehouseLocationId",
      render: (text) => <Text className="font-mono">{text}</Text>,
    },
    {
      title: "Quantity",
      dataIndex: "quantityAtLocation",
      key: "quantityAtLocation",
      width: 120,
      render: (value: number) => (
        <span className="font-semibold text-gray-700">{value}</span>
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
            title="Delete Part Location"
            description="Are you sure you want to delete this part location?"
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
      scroll={{ x: 700 }}
    />
  );
}
