import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface SavingsFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const SavingsForm: React.FC<SavingsFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Savings Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Type" required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="fixed">Fixed</Select.Option>
                  <Select.Option value="recurring">Recurring</Select.Option>
                  <Select.Option value="current">Current</Select.Option>
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
                  <Select.Option value="joint">Joint</Select.Option>
                  <Select.Option value="company">Company</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Savings No" required>
            <Controller
              name="savingsNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Savings No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Savings Build Up Value" required>
            <Controller
              name="savingsBuildUpValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Savings Build Up Value" />
              )}
            />
          </Form.Item>

          <Form.Item label="Amount" required>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Amount" />
              )}
            />
          </Form.Item>

          <Form.Item label="Matching One" required>
            <Controller
              name="matchingOne"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Matching One" />
              )}
            />
          </Form.Item>

          <Form.Item label="Company" required>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Company" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default SavingsForm; 