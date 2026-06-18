import { Descriptions, Empty, Modal, Spin, Typography } from "antd";
import { useCategoryById } from "#src/hooks/categories";

const { Text } = Typography;

interface CategoryDetailModalProps {
  open: boolean;
  categoryId: string | null;
  onCancel: () => void;
}

function renderValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return <Text type="secondary">-</Text>;
  }

  return <Text>{String(value)}</Text>;
}

export default function CategoryDetailModal({
  open,
  categoryId,
  onCancel,
}: CategoryDetailModalProps) {
  const { data, isLoading } = useCategoryById(categoryId);

  return (
    <Modal
      title={<span className="text-xl font-semibold">Category Details</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnHidden
    >
      {isLoading ? (
        <div className="py-10 text-center">
          <Spin />
        </div>
      ) : !data ? (
        <Empty description="No category details found" />
      ) : (
        <Descriptions bordered column={1} size="middle" className="mt-4">
          <Descriptions.Item label="ID">
            {renderValue(data.id)}
          </Descriptions.Item>
          <Descriptions.Item label="Category Code">
            {renderValue(data.categoryCode)}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {renderValue(data.name)}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {renderValue(data.description)}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {renderValue(
              typeof data.type === "number" ? `Type ${data.type}` : undefined,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Default Markup Percentage">
            {renderValue(
              typeof data.defaultMarkupPercentage === "number"
                ? `${data.defaultMarkupPercentage}%`
                : undefined,
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
