import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";
import type {
  CategoryNameDto,
  CreateProductRequest,
  ProductDto,
  UpdateProductRequest,
} from "#src/openapi";

interface ProductFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (
    values: CreateProductRequest | UpdateProductRequest,
  ) => Promise<void>;
  editingProduct: ProductDto | null;
  loading: boolean;
  categoryMap: CategoryNameDto[];
}

interface FormValues {
  partNumber?: string;
  name?: string;
  description?: string;
  unitCost?: number;
  retailPrice?: number;
  categoryId?: string;
}

export default function ProductFormModal({
  open,
  onCancel,
  onSubmit,
  editingProduct,
  loading,
  categoryMap,
}: ProductFormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const isEditing = !!editingProduct;

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          partNumber: editingProduct.partNumber || undefined,
          name: editingProduct.name || undefined,
          description: editingProduct.description || undefined,
          unitCost: editingProduct.unitCost ?? undefined,
          retailPrice: editingProduct.retailPrice ?? undefined,
          categoryId: editingProduct.categoryId || undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingProduct, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const submitData: CreateProductRequest | UpdateProductRequest = {
        partNumber: values.partNumber || null,
        name: values.name || null,
        description: values.description || null,
        unitCost: values.unitCost,
        retailPrice: values.retailPrice ?? null,
        categoryId: values.categoryId || null,
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
          {isEditing ? "Edit Product" : "Create Product"}
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
                Part Number
              </label>
            }
            name="partNumber"
            rules={[{ required: true, message: "Part number is required" }]}
          >
            <Input
              placeholder="e.g., PART-001"
              size="large"
              className="rounded font-mono"
            />
          </Form.Item>

          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">
                Product Name
              </label>
            }
            name="name"
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input
              placeholder="e.g., Brake Pad"
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
            placeholder="Describe this product"
            rows={3}
            className="rounded"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">
                Unit Cost
              </label>
            }
            name="unitCost"
            rules={[
              { required: true, message: "Unit cost is required" },
              {
                type: "number",
                min: 0,
                message: "Unit cost must be at least 0",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 20"
              size="large"
              min={0}
              precision={2}
              className="w-full rounded"
            />
          </Form.Item>

          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">
                Retail Price
              </label>
            }
            name="retailPrice"
            rules={[
              {
                type: "number",
                min: 0,
                message: "Retail price must be at least 0",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 29.99"
              size="large"
              min={0}
              precision={2}
              className="w-full rounded"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
          }
          name="categoryId"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Select
            size="large"
            placeholder="Select category"
            options={categoryMap.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
