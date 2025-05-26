import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller, useWatch } from "react-hook-form";
import { LeaseProductFormValues } from "../types";
import dayjs from "dayjs";

interface LeaseProductFormProps {
  control: Control<LeaseProductFormValues>;
  errors: Record<string, any>;
}

export const LeaseProductForm: React.FC<LeaseProductFormProps> = ({
  control,
}) => {
  const condition = useWatch({
    control,
    name: "condition",
  });

  const isSecondHand = condition === "used";

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Equipment Details</h3>

        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="Equipment Type">
            <Controller
              name="equipmentType"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled placeholder="Equipment Type" />
              )}
            />
          </Form.Item>

          <Form.Item label="Equipment Cost">
            <Controller
              name="equipmentCost"
              control={control}
              render={({ field }) => (
                <Input {...field} disabled type="number" placeholder="Enter Cost" />
              )}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="Supplier Code" required>
            <Controller
              name="supplierCode"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Supplier Code">
                  <Select.Option value="supplier1">Supplier 1</Select.Option>
                  <Select.Option value="supplier2">Supplier 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Equipment Name" required>
            <Controller
              name="equipmentName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Equipment Name" />
              )}
            />
          </Form.Item>

          <Form.Item label="Condition" required>
            <Controller
              name="condition"
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
              name="category"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Category">
                  <Select.Option value="category1">Category 1</Select.Option>
                  <Select.Option value="category2">Category 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Depreciation Code" required>
            <Controller
              name="depreciationCode"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Depreciation Code">
                  <Select.Option value="code1">Code 1</Select.Option>
                  <Select.Option value="code2">Code 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>
        </div>

        <h3 className="text-lg font-semibold mb-4 mt-6">Vehicle Details</h3>
        <div className="grid grid-cols-4 gap-4">
          <Form.Item label="Type" required>
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
              name="manufacturer"
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
              name="model"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Model" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine Capacity CC" required>
            <Controller
              name="engineCapacityCC"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Enter CC" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine Capacity HP" required>
            <Controller
              name="engineCapacityHP"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Enter HP" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine No" required={isSecondHand}>
            <Controller
              name="engineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Chassis No" required={isSecondHand}>
            <Controller
              name="chassisNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Chassis No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Vehicle No" required={isSecondHand}>
            <Controller
              name="vehicleNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Vehicle No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Date" required={isSecondHand}>
            <Controller
              name="registrationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Duplicate Key">
            <Controller
              name="duplicateKey"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Duplicate Key" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Book No">
            <Controller
              name="registrationBookNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration Book No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Year">
            <Controller
              name="registrationYear"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration Year" />
              )}
            />
          </Form.Item>

          <Form.Item label="Only Internal Values MV">
            <Controller
              name="internalMV"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Internal Values MV" />
              )}
            />
          </Form.Item>

          <Form.Item label="Only Internal Values FSV">
            <Controller
              name="internalFSV"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Internal Values FSV" />
              )}
            />
          </Form.Item>

          <Form.Item label="Insurance Company" required>
            <Controller
              name="insuranceCompany"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Insurance Company">
                  <Select.Option value="company1">Company 1</Select.Option>
                  <Select.Option value="company2">Company 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Reference No" required>
            <Controller
              name="referenceNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};
