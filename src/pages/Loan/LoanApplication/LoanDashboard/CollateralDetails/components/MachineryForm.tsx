import React, { useEffect, useRef } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import useCollateralStore from "../../../../../../store/collateralStore";
import { message } from "antd";

interface MachineryFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

// Function to submit machinery data to the API
export const submitMachinery = async (
  data: FormValues, 
  appraisalId: string, 
  isEdit: boolean = false
): Promise<boolean> => {
  try {
    const {
      id,
      machineryType,
      machineryOwnership,
      machinerySupplier,
      machineryCondition,
      machineryModel,
      machineryEngineNo,
      machinerySerialNo,
      machineryDescription,
      machineryBondNo,
      machineryBondValue,
      machineryMV,
      machineryFSV,
      machineryValuedBy,
      machineryInsuranceCompany,
      machineryReferenceNo,
    } = data;

    // Prepare payload for API
    const payload = {
      appraisalId,
      type: machineryType || "",
      ownership: machineryOwnership || "",
      supplier: machinerySupplier || "",
      condition: machineryCondition || "",
      model: machineryModel,
      engineNo: machineryEngineNo,
      serialChasisNo: machinerySerialNo || "",
      description: machineryDescription,
      bondNo: machineryBondNo,
      bondValue: machineryBondValue,
      marketValue: machineryMV ? parseFloat(machineryMV) : undefined,
      fsv: machineryFSV ? parseFloat(machineryFSV) : undefined,
      valuedBy: machineryValuedBy,
      insuCompany: machineryInsuranceCompany,
      refNo: machineryReferenceNo,
      machineryEquipSecCategory: "Main Security", // Default value
      machineryEquipSecType: "MACHINERY AND EQUIPMENT" // Default value
    };

    console.log(`${isEdit ? 'Updating' : 'Saving'} machinery equipment with payload:`, payload);

    let response;
    if (isEdit && id) {
      response = await useCollateralStore.getState().updateMachinery(id, payload);
      message.success("Machinery equipment updated successfully");
    } else {
      response = await useCollateralStore.getState().saveMachinery(payload);
      message.success("Machinery equipment saved successfully");
    }

    console.log(`Machinery equipment ${isEdit ? 'update' : 'save'} response:`, response);
    return true;
  } catch (error) {
    console.error(`Error ${isEdit ? 'updating' : 'saving'} machinery equipment:`, error);
    message.error(`Failed to ${isEdit ? 'update' : 'save'} machinery equipment`);
    return false;
  }
};

const MachineryForm: React.FC<MachineryFormProps> = ({ control, errors }) => {
  const {
    types: machineryTypes,
    typesLoading: machineryTypesLoading,
    ownerships: machineryOwnerships,
    ownershipsLoading: machineryOwnershipsLoading,
    suppliers: machinerySuppliers,
    suppliersLoading: machinerySuppliersLoading,
    conditions: machineryConditions,
    conditionsLoading: machineryConditionsLoading,
    insuranceCompanies,
    insuranceCompaniesLoading,
    fetchTypes,
    fetchOwnerships,
    fetchSuppliers,
    fetchConditions,
    fetchSecurityCategories,
    fetchInsuranceCompanies,
  } = useCollateralStore();

  const dataFetched = useRef(false);

  useEffect(() => {
    if (!dataFetched.current) {
      fetchTypes("machinery");
      fetchOwnerships();
      fetchSuppliers();
      fetchConditions();
      fetchSecurityCategories();
      fetchInsuranceCompanies();
      dataFetched.current = true;
    }
  }, [
    fetchTypes,
    fetchOwnerships,
    fetchSuppliers,
    fetchConditions,
    fetchSecurityCategories,
    fetchInsuranceCompanies,
  ]);

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
        <h3 className="text-lg font-semibold mb-4">Machinery Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.machineryType ? "error" : ""}
            help={errors.machineryType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Type"
                  loading={machineryTypesLoading}
                  options={getOptions(machineryTypes)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ownership"
            required
            validateStatus={errors.machineryOwnership ? "error" : ""}
            help={errors.machineryOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryOwnership"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Ownership"
                  loading={machineryOwnershipsLoading}
                  options={getOptions(machineryOwnerships)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Supplier"
            required
            validateStatus={errors.machinerySupplier ? "error" : ""}
            help={errors.machinerySupplier?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machinerySupplier"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Supplier"
                  loading={machinerySuppliersLoading}
                  options={getOptions(machinerySuppliers)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.machineryCondition ? "error" : ""}
            help={errors.machineryCondition?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryCondition"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Condition"
                  loading={machineryConditionsLoading}
                  options={getOptions(machineryConditions)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.machineryDescription ? "error" : ""}
            help={errors.machineryDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Market Value"
            required
            validateStatus={errors.machineryMV ? "error" : ""}
            help={errors.machineryMV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryMV"
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
            validateStatus={errors.machineryFSV ? "error" : ""}
            help={errors.machineryFSV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryFSV"
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
            label="Model"
            validateStatus={errors.machineryModel ? "error" : ""}
            help={errors.machineryModel?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryModel"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Model" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Engine No"
            validateStatus={errors.machineryEngineNo ? "error" : ""}
            help={errors.machineryEngineNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryEngineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Serial No/Chassis No"
            required
            validateStatus={errors.machinerySerialNo ? "error" : ""}
            help={errors.machinerySerialNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machinerySerialNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Serial No/Chassis No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond No"
            validateStatus={errors.machineryBondNo ? "error" : ""}
            help={errors.machineryBondNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryBondNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Bond No" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bond Value"
            validateStatus={errors.machineryBondValue ? "error" : ""}
            help={errors.machineryBondValue?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryBondValue"
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
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Valued By"
            validateStatus={errors.machineryValuedBy ? "error" : ""}
            help={errors.machineryValuedBy?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="machineryValuedBy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Valued By" />
              )}
            />
          </Form.Item>

          <Form.Item label="Insurance Company">
            <Controller
              name="machineryInsuranceCompany"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Insurance Company"
                  loading={insuranceCompaniesLoading}
                  options={getOptions(insuranceCompanies)}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Reference No">
            <Controller
              name="machineryReferenceNo"
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

export default MachineryForm;
