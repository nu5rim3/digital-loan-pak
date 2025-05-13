import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from 'dayjs';

interface BankGuaranteeFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const BankGuaranteeForm: React.FC<BankGuaranteeFormProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Guarantee Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.bankGuaranteeType ? "error" : ""}
            help={errors.bankGuaranteeType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="bankGuaranteeType"
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

          <Form.Item
            label="Ownership"
            required
            validateStatus={errors.bankGuaranteeOwnership ? "error" : ""}
            help={errors.bankGuaranteeOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="bankGuaranteeOwnership"
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
            label="Institution Name"
            required
            validateStatus={errors.institutionName ? "error" : ""}
            help={errors.institutionName?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="institutionName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Institution Name" />
              )}
            />
          </Form.Item>
          
          <Form.Item
            label="Start Date"
            required
            validateStatus={errors.startDate ? "error" : ""}
            help={errors.startDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="startDate"
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
            label="Expiry Date"
            required
            validateStatus={errors.expiryDate ? "error" : ""}
            help={errors.expiryDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="expiryDate"
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
            label="Reference No (Institution)"
            required
            validateStatus={errors.referenceNoInstitution ? "error" : ""}
            help={errors.referenceNoInstitution?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="referenceNoInstitution"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Reference No (Individual)"
            required
            validateStatus={errors.referenceNoIndividual ? "error" : ""}
            help={errors.referenceNoIndividual?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="referenceNoIndividual"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Value of Guarantee"
            required
            validateStatus={errors.valueOfGuarantee ? "error" : ""}
            help={errors.valueOfGuarantee?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="valueOfGuarantee"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Value"
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Guaranteed To"
            required
            validateStatus={errors.guaranteedTo ? "error" : ""}
            help={errors.guaranteedTo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="guaranteedTo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Guaranteed To" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Guarantee Value"
            required
            validateStatus={errors.guaranteeValue ? "error" : ""}
            help={errors.guaranteeValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="guaranteeValue"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Guarantee Value"
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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

export default BankGuaranteeForm;
