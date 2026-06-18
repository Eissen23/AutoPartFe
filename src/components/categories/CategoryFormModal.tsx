import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";
import type {
  CategoryDto,
  CreateCategoryRequest,
  SystemType,
  UpdateCategoryRequest,
} from "#src/openapi";
import { SystemType as SystemTypeValues } from "#src/openapi";

interface CategoryFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (
    values: CreateCategoryRequest | UpdateCategoryRequest,
  ) => Promise<void>;
  editingCategory: CategoryDto | null;
  loading: boolean;
}

interface FormValues {
  categoryCode?: string;
  name?: string;
  description?: string;
  type?: SystemType;
  defaultMarkupPercentage?: number;
}

const systemTypeOptions = (Object.values(SystemTypeValues) as SystemType[]).map(
  (value) => ({
    value,
    label: `Type ${value}`,
  }),
);

export default function CategoryFormModal({
  open,
  onCancel,
  onSubmit,
  editingCategory,
  loading,
}: CategoryFormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const isEditing = !!editingCategory;

  useEffect(() => {
    if (open) {
      if (editingCategory) {
        form.setFieldsValue({
          categoryCode: editingCategory.categoryCode || undefined,
          name: editingCategory.name || undefined,
          description: editingCategory.description || undefined,
          type: editingCategory.type,
          defaultMarkupPercentage: editingCategory.defaultMarkupPercentage,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingCategory, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const submitData: CreateCategoryRequest | UpdateCategoryRequest = {
        categoryCode: values.categoryCode || null,
        name: values.name || null,
        description: values.description || null,
        type: values.type,
        defaultMarkupPercentage: values.defaultMarkupPercentage,
      };

      await onSubmit(submitData);
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {isEditing ? "Edit Category" : "Create Category"}
        </span>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isEditing ? "Update" : "Create"}
      cancelText="Cancel"
      confirmLoading={loading}
      width={700}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">
                Category Code
              </label>
            }
            name="categoryCode"
            rules={[{ required: true, message: "Category code is required" }]}
          >
            <Input
              placeholder="e.g., CAT-001"
              size="large"
              className="rounded font-mono"
            />
          </Form.Item>

          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>
            }
            name="name"
            rules={[{ required: true, message: "Category name is required" }]}
          >
            <Input
              placeholder="e.g., Braking System"
              size="large"
              className="rounded"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
          }
          name="description"
        >
          <Input.TextArea
            placeholder="Describe this category"
            rows={3}
            className="rounded"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<label className="text-sm font-medium text-gray-700">Type</label>}
            name="type"
            rules={[{ required: true, message: "Category type is required" }]}
          >
            <Select
              size="large"
              placeholder="Select category type"
              options={systemTypeOptions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">
                Default Markup Percentage
              </label>
            }
            name="defaultMarkupPercentage"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Markup percentage must be at least 0",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 15"
              size="large"
              min={0}
              precision={2}
              className="w-full rounded"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
