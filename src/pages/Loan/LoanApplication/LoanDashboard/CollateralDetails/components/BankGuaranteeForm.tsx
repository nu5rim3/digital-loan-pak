import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface BankGuaranteeFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const BankGuaranteeForm: React.FC<BankGuaranteeFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Bank Guarantee Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Type" required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="performance">Performance</Select.Option>
                  <Select.Option value="bid">Bid</Select.Option>
                  <Select.Option value="advance">Advance</Select.Option>
                  <Select.Option value="retention">Retention</Select.Option>
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

          <Form.Item label="Start Date" required>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="Expiry Date" required>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="Reference No (Institution)" required>
            <Controller
              name="referenceNoInstitution"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Reference No (Individual)" required>
            <Controller
              name="referenceNoIndividual"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Value of Guarantee" required>
            <Controller
              name="valueOfGuarantee"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Value of Guarantee" />
              )}
            />
          </Form.Item>

          <Form.Item label="Guaranteed To" required>
            <Controller
              name="guaranteedTo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Guaranteed To" />
              )}
            />
          </Form.Item>

          <Form.Item label="Guarantee Value" required>
            <Controller
              name="guaranteeValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Guarantee Value" />
              )}
            />
          </Form.Item>

          <Form.Item label="Institution Name" required>
            <Controller
              name="institutionName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Institution Name" />
              )}
            />
          </Form.Item>

          <Form.Item label="Date of Expiry" required>
            <Controller
              name="dateOfExpiry"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="Renewed By" required>
            <Controller
              name="renewedBy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Renewed By" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default BankGuaranteeForm; 