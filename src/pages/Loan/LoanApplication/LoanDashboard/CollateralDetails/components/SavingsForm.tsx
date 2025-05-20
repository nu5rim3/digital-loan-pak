import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from 'dayjs';

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
            label="Sub Type"
            validateStatus={errors.savingsSubType ? "error" : ""}
            help={errors.savingsSubType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsSubType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Sub Type">
                  <Select.Option value="type1">Type 1</Select.Option>
                  <Select.Option value="type2">Type 2</Select.Option>
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
            label="FD No"
            validateStatus={errors.savingsFDNo ? "error" : ""}
            help={errors.savingsFDNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsFDNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter FD No" />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Amount"
            validateStatus={errors.savingsAmount ? "error" : ""}
            help={errors.savingsAmount?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsAmount"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Amount"
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Maturity Date"
            validateStatus={errors.savingsMaturityDate ? "error" : ""}
            help={errors.savingsMaturityDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsMaturityDate"
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

          <Form.Item 
            label="Company"
            validateStatus={errors.savingsCompany ? "error" : ""}
            help={errors.savingsCompany?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsCompany"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Company">
                  <Select.Option value="company1">Company 1</Select.Option>
                  <Select.Option value="company2">Company 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Description"
            validateStatus={errors.savingsDescription ? "error" : ""}
            help={errors.savingsDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item 
            label="Savings No"
            validateStatus={errors.savingsNo ? "error" : ""}
            help={errors.savingsNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
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
            label="Savings Build Up Value"
            validateStatus={errors.savingsBuildUpValue ? "error" : ""}
            help={errors.savingsBuildUpValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsBuildUpValue"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Build Up Value"
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default SavingsForm; 