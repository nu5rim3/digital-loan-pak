import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
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
          <Form.Item label="Type" required>
            <Controller
              name="type"
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

          <Form.Item label="Ownership" required>
            <Controller
              name="ownership"
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

          <Form.Item label="Supplier" required>
            <Controller
              name="supplier"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Supplier" />
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

          <Form.Item label="Vehicle Category" required>
            <Controller
              name="vehicleCategory"
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

          <Form.Item label="Make" required>
            <Controller
              name="make"
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

          <Form.Item label="Model" required>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Model" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine No">
            <Controller
              name="engineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Serial or Chasis No">
            <Controller
              name="serialOrChasisNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Serial or Chasis No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item label="MV">
            <Controller
              name="mv"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter MV" />
              )}
            />
          </Form.Item>

          <Form.Item label="Bond No">
            <Controller
              name="bondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Bond Value">
            <Controller
              name="bondValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond Value" />
              )}
            />
          </Form.Item>

          <Form.Item label="Valued By">
            <Controller
              name="valuedBy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Valued By" />
              )}
            />
          </Form.Item>

          <Form.Item label="Date of 1st Reg">
            <Controller
              name="dateOfFirstReg"
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

export default MachineryForm; 