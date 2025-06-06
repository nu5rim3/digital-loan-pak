import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";
import { message } from "antd";

interface SavingsFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

// Function to submit savings data to the API
export const submitSavings = async (
  data: FormValues,
  appraisalId: string,
  isEdit: boolean = false
): Promise<boolean> => {
  try {
    const {
      id,
      savingsType,
      savingsSubType,
      savingsOwnership,
      savingsNo,
      savingsFDNo,
      savingsAmount,
      savingsMaturityDate,
      savingsCompany,
      savingsDescription,
      savingsBuildUpValue,
    } = data;

    // Prepare payload for API
    const payload = {
      appraisalId,
      type: savingsType || "",
      ownership: savingsOwnership || "",
      savingsNo: savingsNo,
      fdNo: savingsFDNo,
      amount: savingsAmount ? parseFloat(savingsAmount) : undefined,
      maturityDate: savingsMaturityDate,
      company: savingsCompany,
      description: savingsDescription,
      savingsBuildValue: savingsBuildUpValue,
      subType: savingsSubType,
      // These fields aren't in the form yet, but we'll include them in the API payload
      insuCompany: undefined,
      refNo: undefined,
      savingsSecCategory: "Main Security", // Default value
      savingsSecType: "Fixed Deposits and Savings" // Default value
    };

    console.log(`${isEdit ? 'Updating' : 'Saving'} savings with payload:`, payload);

    let response;
    if (isEdit && id) {
      response = await useCollateralStore.getState().updateSavings(id, payload);
      message.success("Savings updated successfully");
    } else {
      response = await useCollateralStore.getState().saveSavings(payload);
      message.success("Savings saved successfully");
    }

    console.log(`Savings ${isEdit ? 'update' : 'save'} response:`, response);
    return true;
  } catch (error) {
    console.error(`Error ${isEdit ? 'updating' : 'saving'} savings:`, error);
    message.error(`Failed to ${isEdit ? 'update' : 'save'} savings`);
    return false;
  }
};

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
      fetchTypes("savings");
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
            label="Sub Type"
            validateStatus={errors.propertySubType ? "error" : ""}
            help={errors.propertySubType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsSubType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Sub Type">
                  <Select.Option value="apartment">Apartment</Select.Option>
                  <Select.Option value="house">House</Select.Option>
                  <Select.Option value="villa">Villa</Select.Option>
                  <Select.Option value="plot">Plot</Select.Option>
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
