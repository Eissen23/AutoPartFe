import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";
import type {
  PartLocationResponse,
  PartLocationCreateRequest,
  PartLocationUpdateRequest,
} from "#src/apis/warehouses";

interface PartLocationFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (
    values: PartLocationCreateRequest | PartLocationUpdateRequest,
  ) => Promise<void>;
  editingPartLocation: PartLocationResponse | null;
  loading: boolean;
}

interface FormValues {
  partId?: string;
  warehouseLocationId?: string;
  quantityAtLocation?: number;
}

export default function PartLocationFormModal({
  open,
  onCancel,
  onSubmit,
  editingPartLocation,
  loading,
}: PartLocationFormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const isEditing = !!editingPartLocation;

  useEffect(() => {
    if (open) {
      if (editingPartLocation) {
        // Set form values when editing
        form.setFieldsValue({
          partId: editingPartLocation.partId || undefined,
          warehouseLocationId:
            editingPartLocation.warehouseLocationId || undefined,
          quantityAtLocation: editingPartLocation.quantityAtLocation,
        });
      } else {
        // Reset form when creating new
        form.resetFields();
      }
    }
  }, [open, editingPartLocation, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let submitData: PartLocationCreateRequest | PartLocationUpdateRequest;

      if (isEditing) {
        submitData = {
          id: editingPartLocation.id,
          partId: values.partId,
          warehouseLocationId: values.warehouseLocationId,
          quantityAtLocation: values.quantityAtLocation,
        } as PartLocationUpdateRequest;
      } else {
        submitData = {
          partId: values.partId,
          warehouseLocationId: values.warehouseLocationId,
          quantityAtLocation: values.quantityAtLocation || 0,
        } as PartLocationCreateRequest;
      }

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
          {isEditing ? "Edit Part Location" : "Add New Part Location"}
        </span>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isEditing ? "Update" : "Create"}
      cancelText="Cancel"
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          quantityAtLocation: 0,
        }}
      >
        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">Part ID</label>
          }
          name="partId"
          rules={[
            {
              required: true,
              message: "Part ID is required",
            },
          ]}
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
              Warehouse Location ID
            </label>
          }
          name="warehouseLocationId"
          rules={[
            {
              required: true,
              message: "Warehouse Location ID is required",
            },
          ]}
        >
          <Input
            placeholder="e.g., 1, 2, 3"
            size="large"
            className="rounded font-mono"
          />
        </Form.Item>

        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">
              Quantity at Location
            </label>
          }
          name="quantityAtLocation"
          rules={[
            {
              required: true,
              message: "Quantity is required",
            },
            {
              type: "number",
              min: 0,
              message: "Quantity must be a positive number",
            },
          ]}
        >
          <InputNumber
            placeholder="e.g., 100"
            size="large"
            className="w-full rounded"
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
