import React from "react";
import { Form, Input, Select } from "antd";
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
          <Form.Item 
            label="Type" 
            required
            validateStatus={errors.savingsType ? "error" : ""}
            help={errors.savingsType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsType"
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

          <Form.Item 
            label="Ownership" 
            required
            validateStatus={errors.savingsOwnership ? "error" : ""}
            help={errors.savingsOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsOwnership"
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
            label="Savings No" 
            required
            validateStatus={errors.savingsNo ? "error" : ""}
            help={errors.savingsNo?.message}
          >
            <Controller
              name="savingsNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Savings No" />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Build Up Value" 
            required
            validateStatus={errors.savingsBuildUpValue ? "error" : ""}
            help={errors.savingsBuildUpValue?.message}
          >
            <Controller
              name="savingsBuildUpValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Build Up Value" />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Amount" 
            required
            validateStatus={errors.savingsAmount ? "error" : ""}
            help={errors.savingsAmount?.message}
          >
            <Controller
              name="savingsAmount"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Amount" />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Matching One" 
            required
            validateStatus={errors.savingsMatchingOne ? "error" : ""}
            help={errors.savingsMatchingOne?.message}
          >
            <Controller
              name="savingsMatchingOne"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Matching One" />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Company" 
            required
            validateStatus={errors.savingsCompany ? "error" : ""}
            help={errors.savingsCompany?.message}
          >
            <Controller
              name="savingsCompany"
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