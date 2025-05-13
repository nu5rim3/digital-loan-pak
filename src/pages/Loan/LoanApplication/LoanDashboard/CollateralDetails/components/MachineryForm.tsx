import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from 'dayjs';

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
          >
            <Controller
              name="machinerySupplier"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Supplier" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.machineryCondition ? "error" : ""}
            help={errors.machineryCondition?.message}
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
            label="Vehicle Category"
            required
            validateStatus={errors.machineryCategory ? "error" : ""}
            help={errors.machineryCategory?.message}
          >
            <Controller
              name="machineryCategory"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Vehicle Category">
                  <Select.Option value="heavy">Heavy</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="light">Light</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Make"
            required
            validateStatus={errors.machineryMake ? "error" : ""}
            help={errors.machineryMake?.message}
          >
            <Controller
              name="machineryMake"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Make">
                  <Select.Option value="caterpillar">Caterpillar</Select.Option>
                  <Select.Option value="komatsu">Komatsu</Select.Option>
                  <Select.Option value="hitachi">Hitachi</Select.Option>
                  <Select.Option value="volvo">Volvo</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Model"
            required
            validateStatus={errors.machineryModel ? "error" : ""}
            help={errors.machineryModel?.message}
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
            label="Serial or Chasis No"
            validateStatus={errors.machinerySerialNo ? "error" : ""}
            help={errors.machinerySerialNo?.message}
          >
            <Controller
              name="machinerySerialNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Serial or Chasis No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.machineryDescription ? "error" : ""}
            help={errors.machineryDescription?.message}
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
            label="MV"
            validateStatus={errors.machineryMV ? "error" : ""}
            help={errors.machineryMV?.message}
          >
            <Controller
              name="machineryMV"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter MV" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond No"
            validateStatus={errors.machineryBondNo ? "error" : ""}
            help={errors.machineryBondNo?.message}
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
          >
            <Controller
              name="machineryBondValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond Value" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Valued By"
            validateStatus={errors.machineryValuedBy ? "error" : ""}
            help={errors.machineryValuedBy?.message}
          >
            <Controller
              name="machineryValuedBy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Valued By" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Date of 1st Reg"
            validateStatus={errors.machineryDateOfFirstReg ? "error" : ""}
            help={errors.machineryDateOfFirstReg?.message}
          >
            <Controller
              name="machineryDateOfFirstReg"
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
        </div>
      </div>
    </div>
  );
};

export default MachineryForm; 