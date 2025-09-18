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

interface PropertyMortgageFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
  securityType?: IBaseItem;
  setValue?: (name: keyof FormValues, value: any) => void;
}

export const submitPropertyMortgage = async (
  data: FormValues,
  appraisalId: string,
  isEdit: boolean = false
): Promise<boolean> => {
  try {
    const {
      id,
      propertyType,
      propertySubType,
      propertyOwnership,
      propertyBondType,
      propertyPropertyType,
      propertyBondNo,
      propertyBondDate,
      propertyDeedNo,
      propertyBondValue,
      propertySurveyPlanNo,
      propertyPOA,
      propertyPOANumber,
      propertyCompany,
      propertyLawyerName,
      propertyTitleInsurance,
      propertyInsuranceOfBuilding,
      propertyInsuranceValue,
      propertyMarketValue,
      propertyFSV,
      propertyLotNo,
      propertyInsuranceCompany,
      propertyReferenceNo,
      securityCategory
    } = data;

    const payload = {
      appraisalId,
      mortgageType: propertyType || "",
      mortgageSubType: propertySubType || "",
      mortgageOwnership: propertyOwnership || "",
      mortgageBondType: propertyBondType || "",
      mortgagePropertyType: propertyPropertyType || "",
      mortgageBondNo: propertyBondNo || "",
      mortgageBondDate: propertyBondDate || "",
      mortgageDeedNo: propertyDeedNo || "",
      mortgageBondValue: propertyBondValue
        ? parseFloat(propertyBondValue)
        : undefined,
      mortgageSurveyPlanNo: propertySurveyPlanNo || "",
      mortgagePoa: propertyPOA || "",
      mortgagePoaNo: propertyPOANumber || "",
      mortgageCompany: propertyCompany || "",
      mortgageLawyerName: propertyLawyerName || "",
      mortgageTitleInsurance: propertyTitleInsurance || "",
      mortgageInsOfBuilding: propertyInsuranceOfBuilding || "",
      mortgageInsuranceValue: propertyInsuranceValue
        ? parseFloat(propertyInsuranceValue)
        : undefined,
      mortgageMarketValue: propertyMarketValue
        ? parseFloat(propertyMarketValue)
        : undefined,
      mortgageFsv: propertyFSV ? parseFloat(propertyFSV) : undefined,
      mortgageLotNo: propertyLotNo || "",
      mortgageInsuranceCompany: propertyInsuranceCompany,
      mortgageReferenceNo: propertyReferenceNo,
      mortgageSecCategory: securityCategory || "M",
      mortgageSecType: "Primary",
      securityCategory: securityCategory || "M"
     
    };

    if (isEdit && id) {
      await useCollateralStore.getState().updatePropertyMortgage(id, payload);
      message.success("Property mortgage updated successfully");
    } else {
      await useCollateralStore.getState().savePropertyMortgage(payload);
      message.success("Property mortgage saved successfully");
    }
    return true;
  } catch (error) {
    console.error(
      `Error ${isEdit ? "updating" : "saving"} property mortgage:`,
      error
    );
    message.error(`Failed to ${isEdit ? "update" : "save"} property mortgage`);
    return false;
  }
};

const PropertyMortgageForm: React.FC<PropertyMortgageFormProps> = ({
  control,
  errors,
  securityType,
  setValue,
}) => {
  const {
    types: propertyTypes,
    typesLoading: propertyTypesLoading,
    subTypes: propertySubTypes,
    subTypesLoading: propertySubTypesLoading,
    ownerships: propertyOwnerships,
    ownershipsLoading: propertyOwnershipsLoading,
    bondTypes: propertyBondTypes,
    bondTypesLoading: propertyBondTypesLoading,
    propertyTypes: propertyPropertyTypes,
    propertyTypesLoading: propertyPropertyTypesLoading,
    companies: propertyCompanies,
    companiesLoading: propertyCompaniesLoading,
    insuranceCompanies,
    insuranceCompaniesLoading,
    fetchTypes,
    fetchSubTypes,
    fetchOwnerships,
    fetchBondTypes,
    fetchPropertyTypes,
    fetchCompanies,
    fetchInsuranceCompanies,
  } = useCollateralStore();

  const dataFetched = useRef(false);
  const propertyMortgageId = useWatch({
    control,
    name: "id",
  });
  const isEditMode = !!propertyMortgageId;

  const propertyPOA = useWatch({
    control,
    name: "propertyPOA",
  });
  const propertyInsuranceOfBuilding = useWatch({
    control,
    name: "propertyInsuranceOfBuilding",
  });

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes(securityType?.code || "");
      fetchSubTypes(securityType?.code || "");
      fetchOwnerships();
      fetchBondTypes();
      fetchPropertyTypes();
      fetchCompanies();
      fetchInsuranceCompanies();
      dataFetched.current = true;
    }
  }, [
    fetchTypes,
    fetchOwnerships,
    fetchBondTypes,
    fetchPropertyTypes,
    fetchCompanies,
    fetchInsuranceCompanies,
  ]);

  useEffect(() => {
    if (propertyPOA !== "1" && setValue) {
      setValue("propertyPOANumber", "");
      setValue("propertyCompany", "");
    }
  }, [propertyPOA, setValue]);

  useEffect(() => {
    if (propertyInsuranceOfBuilding !== "1" && setValue) {
      setValue("propertyInsuranceValue", "");
    }
  }, [propertyInsuranceOfBuilding, setValue]);

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
          {isEditMode ? `Edit Property Mortgage` : "New Property Mortgage"}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.propertyType ? "error" : ""}
            help={errors.propertyType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Type"
                  loading={propertyTypesLoading}
                  options={getOptions(
                    propertyTypes,
                    "description",
                    "code"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Sub Type"
            required
            validateStatus={errors.propertySubType ? "error" : ""}
            help={errors.propertySubType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertySubType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Type"
                  loading={propertySubTypesLoading}
                  options={getOptions(
                    propertySubTypes,
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
            validateStatus={errors.propertyOwnership ? "error" : ""}
            help={errors.propertyOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyOwnership"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Ownership"
                  loading={propertyOwnershipsLoading}
                  options={getOptions(propertyOwnerships, "description", "code")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond Type"
            required
            validateStatus={errors.propertyBondType ? "error" : ""}
            help={errors.propertyBondType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyBondType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Bond Type"
                  loading={propertyBondTypesLoading}
                  options={getOptions(propertyBondTypes)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Property Type"
            required
            validateStatus={errors.propertyPropertyType ? "error" : ""}
            help={errors.propertyPropertyType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyPropertyType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Property Type"
                  loading={propertyPropertyTypesLoading}
                  options={getOptions(propertyPropertyTypes)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond No"
            required
            validateStatus={errors.propertyBondNo ? "error" : ""}
            help={errors.propertyBondNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyBondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond Date"
            required
            validateStatus={errors.propertyBondDate ? "error" : ""}
            help={errors.propertyBondDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyBondDate"
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
            label="Deed No/Grant No/Title Certificate No"
            required
            validateStatus={errors.propertyDeedNo ? "error" : ""}
            help={errors.propertyDeedNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyDeedNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Deed No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond Value"
            required
            validateStatus={errors.propertyBondValue ? "error" : ""}
            help={errors.propertyBondValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyBondValue"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Bond Value"
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
            label="Survey Plan No"
            required
            validateStatus={errors.propertySurveyPlanNo ? "error" : ""}
            help={errors.propertySurveyPlanNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertySurveyPlanNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Survey Plan No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="POA"
            required
            validateStatus={errors.propertyPOA ? "error" : ""}
            help={errors.propertyPOA?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyPOA"
              control={control}
              render={({ field }) => (
                <Select {...field} showSearch placeholder="Select POA">
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          {propertyPOA === "1" && (
            <Form.Item
              label="POA Number"
              required
              validateStatus={errors.propertyPOANumber ? "error" : ""}
              help={errors.propertyPOANumber?.message}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Controller
                name="propertyPOANumber"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter POA Number" />
                )}
              />
            </Form.Item>
          )}

          {propertyPOA === "1" && (
            <Form.Item
              label="Company"
              required
              validateStatus={errors.propertyCompany ? "error" : ""}
              help={errors.propertyCompany?.message}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Controller
                name="propertyCompany"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select Company"
                    loading={propertyCompaniesLoading}
                    options={getOptions(propertyCompanies)}
                  />
                )}
              />
            </Form.Item>
          )}

          <Form.Item
            label="Lawyer Name"
            required
            validateStatus={errors.propertyLawyerName ? "error" : ""}
            help={errors.propertyLawyerName?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyLawyerName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Lawyer Name" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Title Insurance"
            required
            validateStatus={errors.propertyTitleInsurance ? "error" : ""}
            help={errors.propertyTitleInsurance?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyTitleInsurance"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Title Insurance"
                >
                  <Select.Option value="Y">Yes</Select.Option>
                  <Select.Option value="N">No</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Insurance of Building"
            required
            validateStatus={errors.propertyInsuranceOfBuilding ? "error" : ""}
            help={errors.propertyInsuranceOfBuilding?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyInsuranceOfBuilding"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Insurance of Building"
                >
                  <Select.Option value="1">Yes</Select.Option>
                  <Select.Option value="0">No</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          {propertyInsuranceOfBuilding === "yes" && (
            <Form.Item
              label="Insurance Value"
              required
              validateStatus={errors.propertyInsuranceValue ? "error" : ""}
              help={errors.propertyInsuranceValue?.message}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Controller
                name="propertyInsuranceValue"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: "100%" }}
                    placeholder="Enter Insurance Value"
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
          )}

          <Form.Item
            label="Market Value"
            required
            validateStatus={errors.propertyMarketValue ? "error" : ""}
            help={errors.propertyMarketValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyMarketValue"
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
            label="FSV"
            required
            validateStatus={errors.propertyFSV ? "error" : ""}
            help={errors.propertyFSV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyFSV"
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
            label="LOT No"
            required
            validateStatus={errors.propertyLotNo ? "error" : ""}
            help={errors.propertyLotNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="propertyLotNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter LOT No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Insurance Company">
            <Controller
              name="propertyInsuranceCompany"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Insurance Company"
                  loading={insuranceCompaniesLoading}
                  options={getOptions(
                    insuranceCompanies,
                    "description",
                    "code"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Reference No">
            <Controller
              name="propertyReferenceNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PropertyMortgageForm;
