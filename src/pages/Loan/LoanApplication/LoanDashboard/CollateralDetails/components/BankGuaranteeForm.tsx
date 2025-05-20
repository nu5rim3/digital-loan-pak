import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control, useWatch } from "react-hook-form";
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
  const bankGuaranteeType = useWatch({
    control,
    name: "bankGuaranteeType",
  });

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
                  <Select.Option value="LOFIN">Issued by LOFIN</Select.Option>
                  <Select.Option value="ONDEMAND">Ondemand</Select.Option>
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

          {bankGuaranteeType === "LOFIN" && (
            <>
              <Form.Item
                label="FD No"
                validateStatus={errors.fdNo ? "error" : ""}
                help={errors.fdNo?.message}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Controller
                  name="fdNo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter FD No" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="FD Value"
                validateStatus={errors.fdValue ? "error" : ""}
                help={errors.fdValue?.message}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Controller
                  name="fdValue"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      style={{ width: "100%" }}
                      placeholder="Enter FD Value"
                      formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Start Date"
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
                label="Reference No"
                validateStatus={errors.referenceNo ? "error" : ""}
                help={errors.referenceNo?.message}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Controller
                  name="referenceNo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Reference No" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Guarantee Value"
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
                      formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Guaranteed To"
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
            </>
          )}

          {bankGuaranteeType === "ONDEMAND" && (
            <>
              <Form.Item
                label="Institution Name"
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
                label="Date of Expiry"
                validateStatus={errors.dateOfExpiry ? "error" : ""}
                help={errors.dateOfExpiry?.message}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Controller
                  name="dateOfExpiry"
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
                label="Reference No"
                validateStatus={errors.referenceNoOndemand ? "error" : ""}
                help={errors.referenceNoOndemand?.message}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Controller
                  name="referenceNoOndemand"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Reference No" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Value of Guarantee"
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
                      placeholder="Enter Value of Guarantee"
                      formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Renewed By"
                validateStatus={errors.renewedBy ? "error" : ""}
                help={errors.renewedBy?.message}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Controller
                  name="renewedBy"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select Renewed By">
                      <Select.Option value="option1">Option 1</Select.Option>
                      <Select.Option value="option2">Option 2</Select.Option>
                    </Select>
                  )}
                />
              </Form.Item>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankGuaranteeForm;
