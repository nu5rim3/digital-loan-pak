import React from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface MachineryFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const MachineryForm: React.FC<MachineryFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Machinery Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.machineryType ? "error" : ""}
            help={errors.machineryType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="construction">Construction</Select.Option>
                  <Select.Option value="agricultural">Agricultural</Select.Option>
                  <Select.Option value="industrial">Industrial</Select.Option>
                  <Select.Option value="mining">Mining</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ownership"
            required
            validateStatus={errors.machineryOwnership ? "error" : ""}
            help={errors.machineryOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryOwnership"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Ownership">
                  <Select.Option value="owned">Owned</Select.Option>
                  <Select.Option value="leased">Leased</Select.Option>
                  <Select.Option value="financed">Financed</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Supplier"
            required
            validateStatus={errors.machinerySupplier ? "error" : ""}
            help={errors.machinerySupplier?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machinerySupplier"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Supplier">
                  <Select.Option value="supplier1">Supplier 1</Select.Option>
                  <Select.Option value="supplier2">Supplier 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.machineryDescription ? "error" : ""}
            help={errors.machineryDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Market Value"
            required
            validateStatus={errors.machineryMV ? "error" : ""}
            help={errors.machineryMV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryMV"
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
            label="FSV"
            required
            validateStatus={errors.machineryFSV ? "error" : ""}
            help={errors.machineryFSV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryFSV"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter FSV"
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Model"
            validateStatus={errors.machineryModel ? "error" : ""}
            help={errors.machineryModel?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryModel"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Model" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Engine No"
            validateStatus={errors.machineryEngineNo ? "error" : ""}
            help={errors.machineryEngineNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryEngineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Serial No/Chassis No"
            required
            validateStatus={errors.machinerySerialNo ? "error" : ""}
            help={errors.machinerySerialNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machinerySerialNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Serial No/Chassis No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.machineryCondition ? "error" : ""}
            help={errors.machineryCondition?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryCondition"
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
            label="Bond No"
            validateStatus={errors.machineryBondNo ? "error" : ""}
            help={errors.machineryBondNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryBondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond Value"
            validateStatus={errors.machineryBondValue ? "error" : ""}
            help={errors.machineryBondValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryBondValue"
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
            validateStatus={errors.machineryValuedBy ? "error" : ""}
            help={errors.machineryValuedBy?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryValuedBy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Valued By" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default MachineryForm; 