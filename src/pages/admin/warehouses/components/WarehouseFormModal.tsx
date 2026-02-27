import { Modal, Form, Input, InputNumber, Switch } from "antd";
import { useEffect } from "react";
import type {
  WarehouseLocationResponse,
  WarehouseLocationCreateRequest,
  WarehouseLocationUpdateRequest,
} from "#src/apis/warehouses";

interface WarehouseFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (
    values: WarehouseLocationCreateRequest | WarehouseLocationUpdateRequest,
  ) => Promise<void>;
  editingWarehouse: WarehouseLocationResponse | null;
  loading: boolean;
}

interface FormValues {
  zoneCode?: string;
  aisle?: number;
  shelf?: number;
  bin?: string;
  isOverstocked?: boolean;
}

export default function WarehouseFormModal({
  open,
  onCancel,
  onSubmit,
  editingWarehouse,
  loading,
}: WarehouseFormModalProps) {
  const [form] = Form.useForm<FormValues>();
  const isEditing = !!editingWarehouse;

  useEffect(() => {
    if (open) {
      if (editingWarehouse) {
        // Set form values when editing
        form.setFieldsValue({
          zoneCode: editingWarehouse.zoneCode || undefined,
          aisle: editingWarehouse.aisle,
          shelf: editingWarehouse.shelf,
          bin: editingWarehouse.bin || undefined,
          isOverstocked: editingWarehouse.isOverstocked || false,
        });
      } else {
        // Reset form when creating new
        form.resetFields();
      }
    }
  }, [open, editingWarehouse, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let submitData:
        | WarehouseLocationCreateRequest
        | WarehouseLocationUpdateRequest;

      if (isEditing) {
        submitData = {
          id: editingWarehouse.id,
          zoneCode: values.zoneCode || null,
          aisle: values.aisle || null,
          shelf: values.shelf || null,
          bin: values.bin || null,
          isOverstocked: values.isOverstocked || null,
        } as WarehouseLocationUpdateRequest;
      } else {
        submitData = {
          zoneCode: values.zoneCode || null,
          aisle: values.aisle,
          shelf: values.shelf,
          bin: values.bin || null,
          isOverstocked: values.isOverstocked || false,
        } as WarehouseLocationCreateRequest;
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
          {isEditing ? "Edit Warehouse Location" : "Add New Warehouse Location"}
        </span>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={isEditing ? "Update" : "Create"}
      cancelText="Cancel"
      confirmLoading={loading}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          isOverstocked: false,
        }}
      >
        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">
              Zone Code
            </label>
          }
          name="zoneCode"
          rules={[
            {
              max: 50,
              message: "Zone code cannot exceed 50 characters",
            },
          ]}
        >
          <Input
            placeholder="e.g., A, B, C-1"
            size="large"
            className="rounded"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">Aisle</label>
            }
            name="aisle"
            rules={[
              {
                required: true,
                message: "Aisle is required",
              },
              {
                type: "number",
                min: 0,
                message: "Aisle must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 1"
              size="large"
              className="w-full rounded"
              min={0}
            />
          </Form.Item>

          <Form.Item
            label={
              <label className="text-sm font-medium text-gray-700">Shelf</label>
            }
            name="shelf"
            rules={[
              {
                required: true,
                message: "Shelf is required",
              },
              {
                type: "number",
                min: 0,
                message: "Shelf must be a positive number",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g., 3"
              size="large"
              className="w-full rounded"
              min={0}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">Bin</label>
          }
          name="bin"
          rules={[
            {
              max: 50,
              message: "Bin cannot exceed 50 characters",
            },
          ]}
        >
          <Input
            placeholder="e.g., 01, 02, A1"
            size="large"
            className="rounded"
          />
        </Form.Item>

        <Form.Item
          label={
            <label className="text-sm font-medium text-gray-700">
              Overstocked
            </label>
          }
          name="isOverstocked"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
