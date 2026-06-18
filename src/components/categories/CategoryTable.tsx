import { Button, Popconfirm, Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CategoryDto } from "#src/openapi";
import { Eye, SquarePen, Trash } from "lucide-react";

const { Text } = Typography;

interface CategoryTableProps {
  data: CategoryDto[];
  loading: boolean;
  onView: (record: CategoryDto) => void;
  onEdit: (record: CategoryDto) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

const truncateText = (
  text: string | null | undefined,
  maxLength: number = 80,
) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const formatTypeLabel = (type: number | undefined) => {
  if (typeof type !== "number") {
    return "-";
  }

  return `Type ${type}`;
};

const formatMarkup = (value: number | undefined) => {
  if (typeof value !== "number") {
    return "-";
  }

  return `${value}%`;
};

export default function CategoryTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  deleting,
  currentPage,
  pageSize,
  total,
  onPaginationChange,
}: CategoryTableProps) {
  const columns: ColumnsType<CategoryDto> = [
    {
      title: "Category Code",
      dataIndex: "categoryCode",
      key: "categoryCode",
      width: 160,
      render: (text: string | null | undefined) => (
        <Text className="font-mono text-sm">{text || "-"}</Text>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (text: string | null | undefined) => (
        <Text className="font-medium">{text || "-"}</Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 320,
      render: (text: string | null | undefined) => (
        <Text className="text-gray-600 text-xs">{truncateText(text, 80)}</Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (value: number | undefined) => <Text>{formatTypeLabel(value)}</Text>,
    },
    {
      title: "Default Markup",
      dataIndex: "defaultMarkupPercentage",
      key: "defaultMarkupPercentage",
      width: 160,
      align: "right",
      render: (value: number | undefined) => (
        <span className="font-semibold text-gray-700">{formatMarkup(value)}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_, record) => {
        const hasId = !!record.id;

        return (
          <div className="flex gap-1">
            <Tooltip title="View details">
              <Button
                type="link"
                onClick={() => onView(record)}
                disabled={!hasId}
                className="text-slate-600 hover:text-slate-700"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>

            <Tooltip title="Edit category">
              <Button
                type="link"
                onClick={() => onEdit(record)}
                disabled={!hasId}
                className="text-blue-600 hover:text-blue-700"
              >
                <SquarePen className="w-4 h-4" />
              </Button>
            </Tooltip>

            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => {
                if (record.id) {
                  onDelete(record.id);
                }
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true, loading: deleting }}
              disabled={!hasId}
            >
              <Tooltip title="Delete category">
                <Button type="link" danger loading={deleting} disabled={!hasId}>
                  <Trash className="w-4 h-4" />
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPaginationChange,
        showTotal: (count, range) => `${range[0]}-${range[1]} of ${count} items`,
      }}
      className="bg-white rounded-lg shadow"
      scroll={{ x: 1100 }}
    />
  );
}
