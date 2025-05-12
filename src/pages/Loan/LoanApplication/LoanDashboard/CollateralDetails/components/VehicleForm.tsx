import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";

interface VehicleFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.vehicleType ? "error" : ""}
            help={errors.vehicleType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="car">Car</Select.Option>
                  <Select.Option value="truck">Truck</Select.Option>
                  <Select.Option value="bus">Bus</Select.Option>
                  <Select.Option value="motorcycle">Motorcycle</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ownership"
            required
            validateStatus={errors.vehicleOwnership ? "error" : ""}
            help={errors.vehicleOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleOwnership"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Ownership">
                  <Select.Option value="individual">Individual</Select.Option>
                  <Select.Option value="company">Company</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Supplier"
            required
            validateStatus={errors.vehicleSupplier ? "error" : ""}
            help={errors.vehicleSupplier?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleSupplier"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Supplier" />}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.vehicleCondition ? "error" : ""}
            help={errors.vehicleCondition?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
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

          <Form.Item
            label="Category"
            required
            validateStatus={errors.vehicleCategory ? "error" : ""}
            help={errors.vehicleCategory?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCategory"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Category">
                  <Select.Option value="sedan">Sedan</Select.Option>
                  <Select.Option value="suv">SUV</Select.Option>
                  <Select.Option value="hatchback">Hatchback</Select.Option>
                  <Select.Option value="pickup">Pickup</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Make"
            required
            validateStatus={errors.vehicleMake ? "error" : ""}
            help={errors.vehicleMake?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleMake"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Make" />}
            />
          </Form.Item>
          <Form.Item
            label="Model"
            required
            validateStatus={errors.vehicleModel ? "error" : ""}
            help={errors.vehicleModel?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleModel"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Model" />}
            />
          </Form.Item>

          <Form.Item
            label="Engine No"
            required
            validateStatus={errors.vehicleEngineNo ? "error" : ""}
            help={errors.vehicleEngineNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleEngineNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Engine No" />}
            />
          </Form.Item>

          <Form.Item
            label="Serial No"
            required
            validateStatus={errors.vehicleSerialNo ? "error" : ""}
            help={errors.vehicleSerialNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleSerialNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Serial No" />}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            required
            validateStatus={errors.vehicleDescription ? "error" : ""}
            help={errors.vehicleDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleDescription"
              control={control}
              render={({ field }) => <Input.TextArea {...field} placeholder="Enter Description" />}
            />
          </Form.Item>

          <Form.Item
            label="Market Value"
            required
            validateStatus={errors.vehicleMV ? "error" : ""}
            help={errors.vehicleMV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleMV"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Market Value"
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond No"
            required
            validateStatus={errors.vehicleBondNo ? "error" : ""}
            help={errors.vehicleBondNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleBondNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Bond No" />}
            />
          </Form.Item>

          <Form.Item
            label="Bond Value"
            required
            validateStatus={errors.vehicleBondValue ? "error" : ""}
            help={errors.vehicleBondValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleBondValue"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Bond Value"
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Valued By"
            required
            validateStatus={errors.vehicleValuedBy ? "error" : ""}
            help={errors.vehicleValuedBy?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleValuedBy"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Valued By" />}
            />
          </Form.Item>

          <Form.Item
            label="Date of First Registration"
            required
            validateStatus={errors.vehicleDateOfFirstReg ? "error" : ""}
            help={errors.vehicleDateOfFirstReg?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleDateOfFirstReg"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm; 