import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control, useWatch } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";
import { message } from "antd";

interface IBaseItem {
  code: string;
  description: string;
  status?: string;
}

interface SavingsFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
  securityType?: IBaseItem;
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
      securityCategory
    } = data;

    // Prepare payload for API
    const payload = {
      appraisalId,
      type: savingsType || "",
      ownership: savingsOwnership || "",
      savingsNo: savingsNo,
      fdNo: savingsFDNo,
      amount: savingsAmount ? parseFloat(savingsAmount) : undefined,
      maturityDate: savingsMaturityDate
        ? dayjs(savingsMaturityDate).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      company: savingsCompany,
      description: savingsDescription,
      savingsBuildValue: savingsBuildUpValue,
      subType: savingsSubType,
      insuCompany: "",
      refNo: "",
      savingsSecCategory: "Main Security",
      savingsSecType: "Fixed Deposits and Savings",
      securityCategory: securityCategory 
    };

    if (isEdit && id) {
      await useCollateralStore.getState().updateSavings(id, payload);
      message.success("Savings updated successfully");
    } else {
      await useCollateralStore.getState().saveSavings(payload);
      message.success("Savings saved successfully");
    }
    return true;
  } catch (error) {
    console.error(`Error ${isEdit ? "updating" : "saving"} savings:`, error);
    message.error(`Failed to ${isEdit ? "update" : "save"} savings`);
    return false;
  }
};

const SavingsForm: React.FC<SavingsFormProps> = ({
  control,
  errors,
  securityType,
}) => {
  const {
    types: savingsTypes,
    typesLoading: savingsTypesLoading,
    subTypes: savingsSubTypes,
    subTypesLoading: savingsSubTypesLoading,
    ownerships: savingsOwnerships,
    ownershipsLoading: savingsOwnershipsLoading,
    companies: savingsCompanies,
    companiesLoading: savingsCompaniesLoading,
    fetchTypes,
    fetchSubTypes,
    fetchOwnerships,
    fetchCompanies,
  } = useCollateralStore();

  const dataFetched = useRef(false);
  const savingsId = useWatch({
    control,
    name: "id",
  });
  const isEditMode = !!savingsId;

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes(securityType?.code || "");
      fetchSubTypes(securityType?.code || "");
      fetchOwnerships();
      fetchCompanies();
      dataFetched.current = true;
    }
  }, [fetchTypes, fetchOwnerships]);

  const getOptions = (
    arr: any[],
    labelKey: string = "description",
    valueKey: string = "code"
  ) =>
    arr
      .filter((item) => (item.status ? item.status === "A" : true))
      .map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {isEditMode
            ? `Edit Fixed Deposits and Savings Details`
            : "New Fixed Deposits and Savings Details"}
        </h3>
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
                  showSearch
                  placeholder="Select Type"
                  loading={savingsTypesLoading}
                  options={getOptions(
                    savingsTypes,
                    "description",
                    "code"
                  )}
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
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Type"
                  loading={savingsSubTypesLoading}
                  options={getOptions(
                    savingsSubTypes,
                    "description",
                    "code"
                  )}
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
                  showSearch
                  placeholder="Select Ownership"
                  loading={savingsOwnershipsLoading}
                  options={getOptions(
                    savingsOwnerships,
                    "description",
                    "code"
                  )}
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
            required
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
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
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
            required
            validateStatus={errors.savingsCompany ? "error" : ""}
            help={errors.savingsCompany?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="savingsCompany"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Company"
                  loading={savingsCompaniesLoading}
                  options={getOptions(
                    savingsCompanies,
                    "description",
                    "description"
                  )}
                />
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
            label="Saving Build Up Value"
            validateStatus={errors.savingsBuildUpValue ? "error" : ""}
            help={errors.savingsBuildUpValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
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
        </div>
      </div>
    </div>
  );
};

export default SavingsForm;
