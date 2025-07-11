import React, { useEffect, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Spin,
} from "antd";
import { Controller, Control, useWatch } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";

interface IBaseItem {
  code: string;
  description: string;
  status?: string;
}

interface BankGuaranteeFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
  appraisalId?: string;
  onSubmitSuccess?: () => void;
  securityType?: IBaseItem;
}

const prepareBankGuaranteeData = (
  formData: FormValues,
  appraisalId: string
) => {
  const isLOFIN = formData.bankGuaranteeType === "Issued by LOLC";
  const isOnDemand = formData.bankGuaranteeType === "On Demand";

  const payload = {
    appraisalId: appraisalId,
    type: formData.bankGuaranteeType,
    ownership: formData.bankGuaranteeOwnership,
    bankGuaranteeSecCategory: "Main Security",
    bankGuaranteeSecType: "BANK GUARANTEE",
  } as any;

  if (isLOFIN) {
    payload.fdNo = formData.fdNo || null;
    payload.fdValue = formData.fdValue || null;
    payload.startDate = formData.startDate || null;
    payload.expiryDate = formData.expiryDate || null;
    payload.referenceNo = formData.referenceNo || null;
    payload.guaranteeValue = formData.guaranteeValue || null;
    payload.guaranteeTo = formData.guaranteedTo || null;
  }

  if (isOnDemand) {
    payload.institutionName = formData.institutionName || null;
    payload.expiryDate = formData.expiryDate || null;
    payload.referenceNo = formData.referenceNoOndemand || null;
    payload.valueOfGuarantee = formData.valueOfGuarantee || null;
    payload.renewedBy = formData.renewedBy || null;
    payload.insuCompany = formData.bankInsuranceCompany || null;
    payload.insuRefNo = formData.bankReferenceNo || null;
  }
  return payload;
};

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
    insuranceCompanies,
    insuranceCompaniesLoading,
    fetchTypes,
    fetchOwnerships,
    fetchBondRenewals,
    fetchInsuranceCompanies,
    savingBankGuarantee,
  } = useCollateralStore();

  const bgId = useWatch({
    control,
    name: "id",
  });

  const bankGuaranteeType = useWatch({
    control,
    name: "bankGuaranteeType",
  });

  const isEditMode = !!bgId;
  const dataFetched = useRef(false);
  const isLOFIN = bankGuaranteeType === "Issued by LOLC";
  const isOnDemand = bankGuaranteeType === "On Demand";

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes("B");
      fetchOwnerships();
      fetchBondRenewals();
      fetchInsuranceCompanies();
      dataFetched.current = true;
    }
  }, [fetchTypes, fetchOwnerships, fetchBondRenewals, fetchInsuranceCompanies]);

  const getOptions = (
    arr: any[],
    labelKey: string = "description",
    valueKey: string = "description"
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
          {isEditMode ? `Edit Bank Guarantee` : "New Bank Guarantee"}
        </h3>
        <Spin spinning={savingBankGuarantee}>
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="id"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

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
                    showSearch
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
                    showSearch
                    placeholder="Select Ownership"
                    loading={bankGuaranteeOwnershipsLoading}
                    options={getOptions(bankGuaranteeOwnerships)}
                  />
                )}
              />
            </Form.Item>

            {isLOFIN && (
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
                          field.onChange(
                            date ? date.format("YYYY-MM-DD") : null
                          );
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
                          field.onChange(
                            date ? date.format("YYYY-MM-DD") : null
                          );
                        }}
                        disabledDate={(current) => {
                          return current && current < dayjs().startOf("day");
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
                    rules={{
                      validate: (value) => {
                        if (isLOFIN) {
                          const fdValue = Number(useWatch({ control, name: 'fdValue' }));
                          if (value && fdValue && Number(value) > fdValue) {
                            return 'Guarantee Value cannot exceed FD Value';
                          }
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        style={{ width: "100%" }}
                        placeholder="Enter Guarantee Value"
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

            {isOnDemand && (
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
                          field.onChange(
                            date ? date.format("YYYY-MM-DD") : null
                          );
                        }}
                        disabledDate={(current) => {
                          // Disable dates before today
                          return current && current < dayjs().startOf("day");
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
                        showSearch
                        placeholder="Select Renewed By"
                        loading={bondRenewalsLoading}
                        options={getOptions(bondRenewals)}
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item label="Insurance Company">
                  <Controller
                    name="bankInsuranceCompany"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        showSearch
                        placeholder="Select Insurance Company"
                        loading={insuranceCompaniesLoading}
                        options={getOptions(insuranceCompanies)}
                      />
                    )}
                  />
                </Form.Item>
              </>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export const submitBankGuarantee = async (
  formData: FormValues,
  appraisalId: string = "",
  isEdit: boolean = false
) => {
  if (!appraisalId) {
    console.error("No appraisalId provided");
    message.error("Cannot submit Bank Guarantee without appraisal ID");
    return null;
  }

  try {
    const store = useCollateralStore.getState();
    const payload = prepareBankGuaranteeData(formData, appraisalId);

    let response;
    if (isEdit && formData.id) {
      const bankGuaranteeId = formData.id;
      response = await store.updateBankGuarantee(bankGuaranteeId, payload);
      message.success("Bank Guarantee updated successfully");
    } else {
      response = await store.saveBankGuarantee(payload);
      message.success("Bank Guarantee added successfully");
    }

    const result = response?.data || response;
    return result;
  } catch (error) {
    console.error("Error submitting bank guarantee:", error);
    const errorMsg = isEdit
      ? "Failed to update Bank Guarantee"
      : "Failed to add Bank Guarantee";
    message.error(
      errorMsg +
        ": " +
        (error instanceof Error ? error.message : "Unknown error")
    );
    return null;
  }
};

export default BankGuaranteeForm;
