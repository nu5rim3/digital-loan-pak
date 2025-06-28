import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control, useWatch } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";
import { message } from "antd";

interface VehicleFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

// Function to submit vehicle data to the API
export const submitVehicle = async (
  data: FormValues,
  appraisalId: string,
  isEdit: boolean = false
): Promise<boolean> => {
  try {
    const {
      id,
      vehicleType,
      vehicleOwnership,
      vehicleSupplier,
      vehicleCondition,
      vehicleCategory,
      vehicleMake,
      vehicleModel,
      vehicleEngineNo,
      vehicleChassisNo,
      vehicleDescription,
      vehicleRegistrationNo,
      vehicleMV,
      vehicleFSV,
      vehicleYearManufacture,
      vehicleDateOfFirstReg,
      vehicleRegBookNo,
      vehicleBookReceivedDate,
      vehicleCRReleasedDate,
      vehicleInsuranceCompany,
      vehicleReferenceNo,
    } = data;

    // Format dates to strings for API
    const formatDate = (date: Date | undefined) => {
      return date ? dayjs(date).format('YYYY-MM-DD') : undefined;
    };

    // Prepare payload for API
    const payload = {
      appraisalId,
      vehicleType: vehicleType || "",
      vehicleSecCategory: "Main Security", // Default value
      vehicleSecType: "VEHICLE", // Default value
      ownership: vehicleOwnership || "",
      supplier: vehicleSupplier || "",
      condition: vehicleCondition || "",
      category: vehicleCategory || "",
      make: vehicleMake || "",
      model: vehicleModel || "",
      enginNo: vehicleEngineNo,
      chasisNo: vehicleChassisNo,
      regNo: vehicleRegistrationNo,
      desc: vehicleDescription,
      yearOfManufacture: vehicleYearManufacture,
      marketValue: vehicleMV,
      foreSaleValue: vehicleFSV,
      dateOfFirstReg: formatDate(vehicleDateOfFirstReg),
      regBookNo: vehicleRegBookNo,
      bookReceivedDate: formatDate(vehicleBookReceivedDate),
      crReleasedDate: formatDate(vehicleCRReleasedDate),
      insuCompany: vehicleInsuranceCompany,
      refNo: vehicleReferenceNo,
    };

    console.log(`${isEdit ? 'Updating' : 'Saving'} vehicle with payload:`, payload);

    let response;
    if (isEdit && id) {
      response = await useCollateralStore.getState().updateVehicle(id, payload);
      message.success("Vehicle updated successfully");
    } else {
      response = await useCollateralStore.getState().saveVehicle(payload);
      message.success("Vehicle saved successfully");
    }

    console.log(`Vehicle ${isEdit ? 'update' : 'save'} response:`, response);
    return true;
  } catch (error) {
    console.error(`Error ${isEdit ? 'updating' : 'saving'} vehicle:`, error);
    message.error(`Failed to ${isEdit ? 'update' : 'save'} vehicle`);
    return false;
  }
};

const VehicleForm: React.FC<VehicleFormProps> = ({ control, errors }) => {
  const {
    types: vehicleTypes,
    typesLoading: vehicleTypesLoading,
    ownerships: vehicleOwnerships,
    ownershipsLoading: vehicleOwnershipsLoading,
    suppliers: vehicleSuppliers,
    suppliersLoading: vehicleSuppliersLoading,
    conditions: vehicleConditions,
    conditionsLoading: vehicleConditionsLoading,
    vehicleCategories,
    vehicleCategoriesLoading,
    makes: vehicleMakes,
    makesLoading: vehicleMakesLoading,
    models: vehicleModels,
    modelsLoading: vehicleModelsLoading,
    insuranceCompanies,
    insuranceCompaniesLoading,
    fetchTypes,
    fetchVehicleCategories,
    fetchOwnerships,
    fetchSuppliers,
    fetchConditions,
    fetchSecurityCategories,
    fetchMakes,
    fetchModels,
    fetchInsuranceCompanies,
  } = useCollateralStore();

  const dataFetched = useRef(false);
  const selectedMake = useWatch({
    control,
    name: "vehicleMake",
  });

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes("V");
      fetchVehicleCategories();
      fetchOwnerships();
      fetchSuppliers();
      fetchConditions();
      fetchSecurityCategories();
      fetchMakes();
      fetchInsuranceCompanies();
      dataFetched.current = true;
    }
  }, [
    fetchTypes,
    fetchVehicleCategories(),
    fetchOwnerships,
    fetchSuppliers,
    fetchConditions,
    fetchSecurityCategories,
    fetchMakes,
    fetchInsuranceCompanies,
  ]);

  useEffect(() => {
    if (selectedMake) {
      fetchModels(selectedMake);
    }
  }, [selectedMake, fetchModels]);

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
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.vehicleType ? "error" : ""}
            help={errors.vehicleType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Type"
                  loading={vehicleTypesLoading}
                  options={getOptions(vehicleTypes)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ownership"
            required
            validateStatus={errors.vehicleOwnership ? "error" : ""}
            help={errors.vehicleOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleOwnership"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Ownership"
                  loading={vehicleOwnershipsLoading}
                  options={getOptions(vehicleOwnerships)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Supplier"
            required
            validateStatus={errors.vehicleSupplier ? "error" : ""}
            help={errors.vehicleSupplier?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleSupplier"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Supplier"
                  loading={vehicleSuppliersLoading}
                  options={getOptions(vehicleSuppliers, "businessType", "code")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.vehicleCondition ? "error" : ""}
            help={errors.vehicleCondition?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCondition"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Condition"
                  loading={vehicleConditionsLoading}
                  options={getOptions(vehicleConditions)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            required
            validateStatus={errors.vehicleCategory ? "error" : ""}
            help={errors.vehicleCategory?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCategory"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Category"
                  loading={vehicleCategoriesLoading}
                  options={getOptions(vehicleCategories)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Make"
            required
            validateStatus={errors.vehicleMake ? "error" : ""}
            help={errors.vehicleMake?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleMake"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Make"
                  loading={vehicleMakesLoading}
                  options={getOptions(vehicleMakes, "description", "code")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Model"
            required
            validateStatus={errors.vehicleModel ? "error" : ""}
            help={errors.vehicleModel?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleModel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Model"
                  loading={vehicleModelsLoading}
                  options={getOptions(vehicleModels)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Engine No"
            validateStatus={errors.vehicleEngineNo ? "error" : ""}
            help={errors.vehicleEngineNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleEngineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Chassis No"
            validateStatus={errors.vehicleChassisNo ? "error" : ""}
            help={errors.vehicleChassisNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleChassisNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Chassis No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Registration No"
            validateStatus={errors.vehicleRegistrationNo ? "error" : ""}
            help={errors.vehicleRegistrationNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleRegistrationNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Year of Manufacture"
            validateStatus={errors.vehicleYearManufacture ? "error" : ""}
            help={errors.vehicleYearManufacture?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleYearManufacture"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Year of Manufacture" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="MV"
            validateStatus={errors.vehicleMV ? "error" : ""}
            help={errors.vehicleMV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleMV"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter MV"
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
            validateStatus={errors.vehicleFSV ? "error" : ""}
            help={errors.vehicleFSV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleFSV"
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
            label="Date of 1st Reg"
            validateStatus={errors.vehicleDateOfFirstReg ? "error" : ""}
            help={errors.vehicleDateOfFirstReg?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleDateOfFirstReg"
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
            label="Reg Book No"
            validateStatus={errors.vehicleRegBookNo ? "error" : ""}
            help={errors.vehicleRegBookNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleRegBookNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reg Book No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Book Received Date"
            validateStatus={errors.vehicleBookReceivedDate ? "error" : ""}
            help={errors.vehicleBookReceivedDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleBookReceivedDate"
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
            label="CR Released Date"
            validateStatus={errors.vehicleCRReleasedDate ? "error" : ""}
            help={errors.vehicleCRReleasedDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCRReleasedDate"
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

          <Form.Item label="Insurance Company">
            <Controller
              name="vehicleInsuranceCompany"
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

          <Form.Item label="Reference No">
            <Controller
              name="vehicleReferenceNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.vehicleDescription ? "error" : ""}
            help={errors.vehicleDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleDescription"
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

export default VehicleForm;
