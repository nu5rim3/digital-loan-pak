import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface LandStockFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const LandStockForm: React.FC<LandStockFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Land/Stock Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Type" required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="land">Land</Select.Option>
                  <Select.Option value="stock">Stock</Select.Option>
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
                  <Select.Option value="individual">Individual</Select.Option>
                  <Select.Option value="company">Company</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Deed Transfer No" required>
            <Controller
              name="deedTransferNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Deed Transfer No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Agreement No" required>
            <Controller
              name="agreementNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Agreement No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Lessor Name" required>
            <Controller
              name="lessorName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Lessor Name" />
              )}
            />
          </Form.Item>

          <Form.Item label="Security Date" required>
            <Controller
              name="securityDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="Security Type" required>
            <Controller
              name="securityType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Security Type">
                  <Select.Option value="mortgage">Mortgage</Select.Option>
                  <Select.Option value="pledge">Pledge</Select.Option>
                  <Select.Option value="hypothecation">Hypothecation</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Description" required>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item label="Bond No" required>
            <Controller
              name="bondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Market Value" required>
            <Controller
              name="marketValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Market Value" />
              )}
            />
          </Form.Item>

          <Form.Item label="FSV" required>
            <Controller
              name="fsv"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter FSV" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default LandStockForm; 