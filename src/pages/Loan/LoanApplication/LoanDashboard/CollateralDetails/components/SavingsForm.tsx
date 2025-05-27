import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";

interface SavingsFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const SavingsForm: React.FC<SavingsFormProps> = ({ control, errors }) => {
  const {
    types: savingsTypes,
    typesLoading: savingsTypesLoading,
    ownerships: savingsOwnerships,
    ownershipsLoading: savingsOwnershipsLoading,
    fetchTypes,
    fetchOwnerships,
  } = useCollateralStore();

  const dataFetched = useRef(false);

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes('savings');
      fetchOwnerships();
      dataFetched.current = true;
    }
  }, [fetchTypes, fetchOwnerships]);

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
                <Select
                  {...field}
                  placeholder="Select Type"
                  loading={savingsTypesLoading}
                  options={getOptions(savingsTypes)}
                />
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
                <Select
                  {...field}
                  placeholder="Select Ownership"
                  loading={savingsOwnershipsLoading}
                  options={getOptions(savingsOwnerships)}
                />
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
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                <Input {...field} placeholder="Enter Company" />
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
            label="Build Up Value"
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

export default SavingsForm; 