import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker, Spin } from "antd";
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

interface LandStockFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
  appraisalId?: string;
  onSubmitSuccess?: () => void;
  securityType?: IBaseItem;
}

const prepareLandStockData = (formData: FormValues, appraisalId: string) => {
  return {
    appraisalId: appraisalId,
    landStockType: formData.landStockType || "",
    landStockSubType: formData.landStockSubType || undefined,
    landStockOwnership: formData.landStockOwnership || "",
    landStockMarketValue: parseFloat(formData.landStockMarketValue as string) || undefined,
    landStockFsv: parseFloat(formData.landStockFSV as string) || undefined,
    landStockBondNo: formData.landStockBondNo || undefined,
    landStockDeedTransferNo: formData.landStockDeedTransferNo || undefined,
    landStockAgreementNo: formData.landStockAgreementNo || undefined,
    landStockLawyerName: formData.landStockLawyerName || undefined,
    landStockDescription: formData.landStockDescription || undefined,
    landStockSecDate: formData.landStockSecurityDate ?
      dayjs(formData.landStockSecurityDate).format("YYYY-MM-DD") : undefined,
    landStockSecType: "Primary"
  };
};

const LandStockForm: React.FC<LandStockFormProps> = ({
  control,
  errors,
}) => {
  const {
    types: landStockTypes,
    typesLoading: landStockTypesLoading,
    subTypes: landStockSubTypes,
    subTypesLoading: landStockSubTypesLoading,
    ownerships: landStockOwnerships,
    ownershipsLoading: landStockOwnershipsLoading,
    fetchTypes,
    fetchSubTypes,
    fetchOwnerships,
    fetchSecurityCategories,
    savingLandStock,
  } = useCollateralStore();

  const dataFetched = useRef(false);
  const landStockId = useWatch({
    control,
    name: "id",
  });
  const isEditMode = !!landStockId;

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes("F");
      fetchSubTypes("F");
      fetchOwnerships();
      fetchSecurityCategories();
      dataFetched.current = true;
    }
  }, [
    fetchTypes,
    fetchOwnerships,
    fetchSecurityCategories,
  ]);

  const getOptions = (
    arr: any[],
    labelKey: string = "description",
    valueKey: string = "code"
  ) =>
    arr
      .filter((item) => item.status ? item.status === "A" : true)
      .map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {isEditMode ? `Edit Land Stock` : "New Land Stock"}
        </h3>
        <Spin spinning={savingLandStock}>
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="id"
              control={control}
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />

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
                    showSearch
                    placeholder="Select Type"
                    loading={landStockTypesLoading}
                    options={getOptions(landStockTypes, "description", "description")}
                  />
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
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select Type"
                    loading={landStockSubTypesLoading}
                    options={getOptions(landStockSubTypes, "description", "description")}
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
                    showSearch
                    placeholder="Select Ownership"
                    loading={landStockOwnershipsLoading}
                    options={getOptions(landStockOwnerships, "description", "description")}
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
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
                      field.onChange(date ? date.format("YYYY-MM-DD") : undefined);
                    }}
                  />
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
          </div>
        </Spin>
      </div>
    </div>
  );
};

// Function to submit land stock data to the API
export const submitLandStock = async (formData: FormValues, appraisalId: string = "", isEdit: boolean = false) => {
  if (!appraisalId) {
    console.error("No appraisalId provided");
    message.error("Cannot submit Land Stock without appraisal ID");
    return null;
  }

  try {
    const store = useCollateralStore.getState();
    const payload = prepareLandStockData(formData, appraisalId);

    let response;
    if (isEdit && formData.id) {
      const landStockId = formData.id;
      response = await store.updateLandStock(landStockId, payload);
      message.success("Land Stock updated successfully");
    } else {
      response = await store.saveLandStock(payload);
      message.success("Land Stock added successfully");
    }

    // Extract the data if it's in a nested structure
    const result = response?.data || response;
    return result;
  } catch (error) {
    console.error("Error submitting land stock:", error);
    const errorMsg = isEdit ? "Failed to update Land Stock" : "Failed to add Land Stock";
    message.error(errorMsg + ": " + (error instanceof Error ? error.message : "Unknown error"));
    return null;
  }
};

export default LandStockForm;
