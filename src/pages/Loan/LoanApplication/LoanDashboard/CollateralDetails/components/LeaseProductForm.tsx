import React, { useEffect, useRef } from "react";
import { Form, Input, Select, DatePicker, InputNumber } from "antd";
import { Control, Controller, useWatch } from "react-hook-form";
import { LeaseProductFormValues } from "../types";
import dayjs from "dayjs";
import useCollateralStore from "../../../../../../store/collateralStore";
import useCommonStore from "../../../../../../store/commonStore";
import { message } from "antd";

interface LeaseProductFormProps {
  control: Control<LeaseProductFormValues>;
  errors: Record<string, any>;
  setValue?: (name: keyof LeaseProductFormValues, value: any) => void;
}

export const submitLease = async (
  data: LeaseProductFormValues,
  appraisalId: string,
  isEdit: boolean = false
): Promise<boolean> => {
  try {
    const {
      id,
      equipmentType,
      equipmentCost,
      supplierCode,
      equipmentName,
      condition,
      category,
      depreciationCode,
      vehicleType,
      manufacturer,
      model,
      engineCapacityCC,
      engineCapacityHP,
      engineNo,
      chassisNo,
      duplicateKey,
      vehicleNo,
      registrationDate,
      registrationBookNo,
      registrationYear,
      internalMV,
      internalFSV,
      insuranceCompany,
      referenceNo,
      province,
    } = data;

    const formatDate = (date: Date | undefined) => {
      return date ? dayjs(date).format("YYYY-MM-DD") : undefined;
    };

    const payload = {
      appraisalId,
      leaseEquipType: equipmentType || "E",
      leaseCost: equipmentCost || "0",
      leaseSupplierCode: supplierCode || "",
      leaseEquipName: equipmentName || "",
      leaseCondition: condition || "",
      leaseCategory: category || "",
      leaseDepreciationCode: depreciationCode || "",
      leaseVehiType: vehicleType || "",
      leaseManufacture: manufacturer || "",
      leaseVehiModel: model || "",
      leaseEnginCapacityCC: engineCapacityCC || "",
      leaseEnginCapacityHP: engineCapacityHP || "",
      enginNo: engineNo,
      chasisNo: chassisNo,
      duplicateKey,
      leaseModel: model,
      leaseVehiNo: vehicleNo,
      leaseRegBookNo: registrationBookNo,
      leaseRegDate: formatDate(registrationDate),
      leaseRegYear: registrationYear,
      marketValue: internalMV || "0",
      foreSaleValue: internalFSV || "0",
      leaseProvince: province,
      insuCompany: insuranceCompany,
      refNo: referenceNo,
    };

    let response;

    if (isEdit && id) {
      await useCollateralStore.getState().updateLease(id, payload);
      message.success("Lease updated successfully");
    } else {
      await useCollateralStore.getState().saveLease(payload);
      message.success("Lease saved successfully");
    }
    return true;
  } catch (error) {
    message.error(`Failed to ${isEdit ? "update" : "save"} lease`);
    return false;
  }
};

export const LeaseProductForm: React.FC<LeaseProductFormProps> = ({
  control,
  errors,
  setValue,
}) => {
  const {
    suppliers,
    suppliersLoading,
    insuranceCompanies,
    insuranceCompaniesLoading,
    conditions,
    conditionsLoading,
    vehicleCategories,
    vehicleCategoriesLoading,
    depreciationRates,
    fetchingDepreciationRates,
    types: vehicleTypes,
    typesLoading: vehicleTypesLoading,
    makes: vehicleMakes,
    makesLoading: vehicleMakesLoading,
    models: vehicleModels,
    modelsLoading: vehicleModelsLoading,
    fetchSuppliers,
    fetchConditions,
    fetchInsuranceCompanies,
    fetchDepreciationRates,
    fetchVehicleCategories,
    fetchTypes,
    fetchMakes,
    fetchModels,
  } = useCollateralStore();

  const { trialCalculationData } = useCommonStore();

  const dataFetched = useRef(false);
  const selectedMake = useWatch({
    control,
    name: "manufacturer",
  });

  useEffect(() => {
    if (!dataFetched.current) {
      fetchSuppliers();
      fetchConditions();
      fetchVehicleCategories();
      fetchDepreciationRates();
      fetchInsuranceCompanies();
      fetchTypes("V");
      fetchMakes();
      dataFetched.current = true;
    }
  }, [
    fetchSuppliers,
    fetchConditions,
    fetchVehicleCategories,
    fetchDepreciationRates,
    fetchInsuranceCompanies,
    fetchMakes,
  ]);

  // Set default values from trialCalculationData when component loads
  useEffect(() => {
    if (trialCalculationData && setValue) {
      if (trialCalculationData.insuranceVE) {
        const equipmentTypeLabel =
          trialCalculationData.insuranceVE === "V" ? "Vehicle" : "Equipment";
        setValue("equipmentType", equipmentTypeLabel);
      }

      if (trialCalculationData.cost) {
        setValue("equipmentCost", trialCalculationData.cost.toString());
      }
    }
  }, [trialCalculationData, setValue]);

  // Check if we have default values to determine if fields should be disabled
  const hasDefaultEquipmentType = trialCalculationData?.insuranceVE;
  const hasDefaultEquipmentCost =
    trialCalculationData?.cost &&
    trialCalculationData.cost !== 0 &&
    trialCalculationData.cost !== "0";

  useEffect(() => {
    if (selectedMake) {
      fetchModels(selectedMake);
    }
  }, [selectedMake, fetchModels]);

  const condition = useWatch({
    control,
    name: "condition",
  });

  const isSecondHand = condition === "used";

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
        <h3 className="text-lg font-semibold mb-4">Lease Details</h3>

        <div className="grid grid-cols-4 gap-4">
          <Form.Item
            label="Equipment Type"
            required
            validateStatus={errors.equipmentType ? "error" : ""}
            help={errors.equipmentType?.message}
          >
            <Controller
              name="equipmentType"
              disabled={!!hasDefaultEquipmentType}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Equipment Type" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Equipment Cost"
            required
            validateStatus={errors.equipmentCost ? "error" : ""}
            help={errors.equipmentCost?.message}
          >
            <Controller
              name="equipmentCost"
              disabled={!!hasDefaultEquipmentCost}
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Cost"
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Form.Item
            label="Supplier Code"
            required
            validateStatus={errors.supplierCode ? "error" : ""}
            help={errors.supplierCode?.message}
          >
            <Controller
              name="supplierCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Supplier"
                  loading={suppliersLoading}
                  options={getOptions(suppliers, "businessType", "code")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Equipment Name"
            required
            validateStatus={errors.equipmentName ? "error" : ""}
            help={errors.equipmentName?.message}
          >
            <Controller
              name="equipmentName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Equipment Name" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.condition ? "error" : ""}
            help={errors.condition?.message}
          >
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Condition"
                  loading={conditionsLoading}
                  options={getOptions(conditions, "description", "description")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            required
            validateStatus={errors.category ? "error" : ""}
            help={errors.category?.message}
          >
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Category"
                  loading={vehicleCategoriesLoading}
                  options={getOptions(
                    vehicleCategories,
                    "description",
                    "description"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Depreciation Code"
            required
            validateStatus={errors.depreciationCode ? "error" : ""}
            help={errors.depreciationCode?.message}
          >
            <Controller
              name="depreciationCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Category"
                  loading={fetchingDepreciationRates}
                  options={getOptions(
                    depreciationRates,
                    "description",
                    "description"
                  )}
                />
              )}
            />
          </Form.Item>
        </div>

        <h3 className="text-lg font-semibold mb-4 mt-6">Vehicle Details</h3>
        <div className="grid grid-cols-4 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.vehicleType ? "error" : ""}
            help={errors.vehicleType?.message}
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
                  options={getOptions(
                    vehicleTypes,
                    "description",
                    "description"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Manufacturer"
            required
            validateStatus={errors.manufacturer ? "error" : ""}
            help={errors.manufacturer?.message}
          >
            <Controller
              name="manufacturer"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Make"
                  loading={vehicleMakesLoading}
                  options={getOptions(
                    vehicleMakes,
                    "description",
                    "description"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Model"
            required
            validateStatus={errors.model ? "error" : ""}
            help={errors.model?.message}
          >
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select Model"
                  loading={vehicleModelsLoading}
                  options={getOptions(
                    vehicleModels,
                    "description",
                    "description"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Engine Capacity CC"
            required
            validateStatus={errors.engineCapacityCC ? "error" : ""}
            help={errors.engineCapacityCC?.message}
          >
            <Controller
              name="engineCapacityCC"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Enter CC" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Engine Capacity HP"
            required
            validateStatus={errors.engineCapacityHP ? "error" : ""}
            help={errors.engineCapacityHP?.message}
          >
            <Controller
              name="engineCapacityHP"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="Enter HP" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine No" required={isSecondHand}>
            <Controller
              name="engineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Chassis No" required={isSecondHand}>
            <Controller
              name="chassisNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Chassis No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Vehicle No" required={isSecondHand}>
            <Controller
              name="vehicleNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Vehicle No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Date" required={isSecondHand}>
            <Controller
              name="registrationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Duplicate Key">
            <Controller
              name="duplicateKey"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Duplicate Key" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Book No">
            <Controller
              name="registrationBookNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration Book No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Year">
            <Controller
              name="registrationYear"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  picker="year"
                  format="YYYY"
                  value={field.value ? dayjs(field.value, "YYYY") : null}
                  onChange={(date) =>
                    field.onChange(date ? date.format("YYYY") : "")
                  }
                  placeholder="Select Registration Year"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Only Internal Values MV">
            <Controller
              name="internalMV"
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

          <Form.Item label="Only Internal Values FSV">
            <Controller
              name="internalFSV"
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
            label="Insurance Company"
            required
            validateStatus={errors.insuranceCompany ? "error" : ""}
            help={errors.insuranceCompany?.message}
          >
            <Controller
              name="insuranceCompany"
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
                    "description"
                  )}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Reference No"
            required
            validateStatus={errors.referenceNo ? "error" : ""}
            help={errors.referenceNo?.message}
          >
            <Controller
              name="referenceNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Province">
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Province" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};
