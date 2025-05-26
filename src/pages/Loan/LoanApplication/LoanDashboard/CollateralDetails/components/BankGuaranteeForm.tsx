import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";

interface BankGuaranteeFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const BankGuaranteeForm: React.FC<BankGuaranteeFormProps> = ({
  control,
  errors,
}) => {
  const {
    types: bankGuaranteeTypes,
    typesLoading: bankGuaranteeTypesLoading,
    ownerships: bankGuaranteeOwnerships,
    ownershipsLoading: bankGuaranteeOwnershipsLoading,
    bondRenewals,
    bondRenewalsLoading,
    fetchTypes,
    fetchOwnerships,
    fetchBondRenewals,
  } = useCollateralStore();

  const dataFetched = useRef(false);

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes('bank-guarantee');
      fetchOwnerships();
      fetchBondRenewals();
      dataFetched.current = true;
    }
  }, [fetchTypes, fetchOwnerships, fetchBondRenewals]);

  const getOptions = (arr: any[]) =>
    arr
      .filter((item) => item.status === "A")
      .map((item) => ({
        label: item.description,
        value: item.code,
      }));

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
                <Select
                  {...field}
                  placeholder="Select Type"
                  loading={bankGuaranteeTypesLoading}
                  options={getOptions(bankGuaranteeTypes)}
                />
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
                <Select
                  {...field}
                  placeholder="Select Ownership"
                  loading={bankGuaranteeOwnershipsLoading}
                  options={getOptions(bankGuaranteeOwnerships)}
                />
              )}
            />
          </Form.Item>

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
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                <Select
                  {...field}
                  placeholder="Select Renewed By"
                  loading={bondRenewalsLoading}
                  options={getOptions(bondRenewals)}
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
