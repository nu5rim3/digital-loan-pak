import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from 'dayjs';

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
          <Form.Item
            label="Type"
            required
            validateStatus={errors.landStockType ? "error" : ""}
            help={errors.landStockType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="land">Land</Select.Option>
                  <Select.Option value="stock">Stock</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Sub Type"
            validateStatus={errors.landStockSubType ? "error" : ""}
            help={errors.landStockSubType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockSubType"
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
            validateStatus={errors.landStockOwnership ? "error" : ""}
            help={errors.landStockOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockOwnership"
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
            label="Market Value"
            required
            validateStatus={errors.landStockMarketValue ? "error" : ""}
            help={errors.landStockMarketValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockMarketValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Market Value" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="FSV"
            required
            validateStatus={errors.landStockFSV ? "error" : ""}
            help={errors.landStockFSV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockFSV"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter FSV" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond No"
            validateStatus={errors.landStockBondNo ? "error" : ""}
            help={errors.landStockBondNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockBondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Deed Transfer No"
            validateStatus={errors.landStockDeedTransferNo ? "error" : ""}
            help={errors.landStockDeedTransferNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockDeedTransferNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Deed Transfer No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Agreement No"
            validateStatus={errors.landStockAgreementNo ? "error" : ""}
            help={errors.landStockAgreementNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockAgreementNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Agreement No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Lawyer Name"
            validateStatus={errors.landStockLawyerName ? "error" : ""}
            help={errors.landStockLawyerName?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockLawyerName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Lawyer Name" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.landStockDescription ? "error" : ""}
            help={errors.landStockDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            required
            validateStatus={errors.landStockCategory ? "error" : ""}
            help={errors.landStockCategory?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockCategory"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Category">
                  <Select.Option value="category1">Category 1</Select.Option>
                  <Select.Option value="category2">Category 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Security Date"
            required
            validateStatus={errors.landStockSecurityDate ? "error" : ""}
            help={errors.landStockSecurityDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockSecurityDate"
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
            label="Security Type"
            required
            validateStatus={errors.landStockSecurityType ? "error" : ""}
            help={errors.landStockSecurityType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockSecurityType"
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
        </div>
      </div>
    </div>
  );
};

export default LandStockForm; 