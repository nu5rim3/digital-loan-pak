import React from "react";
import { Form, Input, Select, DatePicker, Checkbox } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";

interface LeaseProductFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

export const LeaseProductForm: React.FC<LeaseProductFormProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Equipment Details</h3>
        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="Equipment Type" required>
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Equipment Type">
                  <Select.Option value="vehicle">Vehicle</Select.Option>
                  <Select.Option value="machinery">Machinery</Select.Option>
                  <Select.Option value="equipment">Equipment</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Cost" required>
            <Controller
              name="vehicleMV"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Enter Cost" />
              )}
            />
          </Form.Item>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="Supplier Code" required>
            <Controller
              name="vehicleSupplier"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Supplier Code" />
              )}
            />
          </Form.Item>

          <Form.Item label="Equipment Name" required>
            <Controller
              name="vehicleDescription"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Equipment Name" />
              )}
            />
          </Form.Item>

          <Form.Item label="Condition" required>
            <Controller
              name="vehicleCondition"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Condition">
                  <Select.Option value="new">New</Select.Option>
                  <Select.Option value="used">Used</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Category" required>
            <Controller
              name="vehicleCategory"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Category">
                  <Select.Option value="vehicle">Vehicle</Select.Option>
                  <Select.Option value="machinery">Machinery</Select.Option>
                  <Select.Option value="equipment">Equipment</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Vehicle Type" required>
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Vehicle Type">
                  <Select.Option value="car">Car</Select.Option>
                  <Select.Option value="truck">Truck</Select.Option>
                  <Select.Option value="van">Van</Select.Option>
                  <Select.Option value="bus">Bus</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Manufacturer" required>
            <Controller
              name="vehicleMake"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Manufacturer">
                  <Select.Option value="toyota">Toyota</Select.Option>
                  <Select.Option value="honda">Honda</Select.Option>
                  <Select.Option value="suzuki">Suzuki</Select.Option>
                  <Select.Option value="mitsubishi">Mitsubishi</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Model" required>
            <Controller
              name="vehicleModel"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Model" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine Capacity CC" required>
            <Controller
              name="vehicleEngineNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter Engine Capacity CC"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine Capacity HP" required>
            <Controller
              name="vehicleSerialNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter Engine Capacity HP"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine No" required>
            <Controller
              name="vehicleEngineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Chasis No" required>
            <Controller
              name="vehicleSerialNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Chasis No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Vehicle No" required>
            <Controller
              name="vehicleBondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Vehicle No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Province" required>
            <Controller
              name="vehicleOwnership"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Province">
                  <Select.Option value="punjab">Punjab</Select.Option>
                  <Select.Option value="sindh">Sindh</Select.Option>
                  <Select.Option value="kpk">KPK</Select.Option>
                  <Select.Option value="balochistan">Balochistan</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Book No" required>
            <Controller
              name="vehicleBondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration Book No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Date" required>
            <Controller
              name="vehicleDateOfFirstReg"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Duplicate Key">
            <Controller
              name="vehicleValuedBy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value === "true"}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? "true" : "false")
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Only Working Key Available">
            <Controller
              name="vehicleValuedBy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value === "true"}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? "true" : "false")
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Only Internal Values MV">
            <Controller
              name="vehicleMV"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Only Internal Values MV" />
              )}
            />
          </Form.Item>

          <Form.Item label="Only Internal Values FSV">
            <Controller
              name="vehicleBondValue"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Only Internal Values FSV"
                />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};
