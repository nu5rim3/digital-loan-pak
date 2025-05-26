import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";

interface LandStockFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const LandStockForm: React.FC<LandStockFormProps> = ({ control, errors }) => {
  const {
    types: landStockTypes,
    typesLoading: landStockTypesLoading,
    ownerships: landStockOwnerships,
    ownershipsLoading: landStockOwnershipsLoading,
    securityTypes: landStockSecurityTypes,
    securityTypesLoading: landStockSecurityTypesLoading,
    securityCategories: landStockCategories,
    securityCategoriesLoading: landStockCategoriesLoading,
    fetchTypes,
    fetchOwnerships,
    fetchSecurityTypes,
    fetchSecurityCategories,
  } = useCollateralStore();

  const dataFetched = useRef(false);

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes('land-stock');
      fetchOwnerships();
      fetchSecurityTypes();
      fetchSecurityCategories();
      dataFetched.current = true;
    }
  }, [fetchTypes, fetchOwnerships, fetchSecurityTypes, fetchSecurityCategories]);

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
                <Select
                  {...field}
                  placeholder="Select Type"
                  loading={landStockTypesLoading}
                  options={getOptions(landStockTypes)}
                />
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
                <Select
                  {...field}
                  placeholder="Select Ownership"
                  loading={landStockOwnershipsLoading}
                  options={getOptions(landStockOwnerships)}
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
                <Select
                  {...field}
                  placeholder="Select Security Type"
                  loading={landStockSecurityTypesLoading}
                  options={getOptions(landStockSecurityTypes)}
                />
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
                <Select
                  {...field}
                  placeholder="Select Category"
                  loading={landStockCategoriesLoading}
                  options={getOptions(landStockCategories)}
                />
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
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Market Value"
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
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
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter FSV"
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
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
            label="Deed/Transfer No"
            validateStatus={errors.landStockDeedTransferNo ? "error" : ""}
            help={errors.landStockDeedTransferNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="landStockDeedTransferNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Deed/Transfer No" />
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
            label="Security Date"
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
        </div>
      </div>
    </div>
  );
};

export default LandStockForm; 