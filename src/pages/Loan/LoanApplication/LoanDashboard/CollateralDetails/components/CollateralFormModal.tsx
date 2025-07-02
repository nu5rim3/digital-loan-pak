import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form, Select, Button, message, Spin } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  FormValues,
  createValidationSchema,
  LeaseProductFormValues,
  leaseProductValidationSchema,
} from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import VehicleForm, { submitVehicle } from "./VehicleForm";
import BankGuaranteeForm, { submitBankGuarantee } from "./BankGuaranteeForm";
import MachineryForm, { submitMachinery } from "./MachineryForm";
import PropertyMortgageForm, {
  submitPropertyMortgage,
} from "./PropertyMortgageForm";
import SavingsForm, { submitSavings } from "./SavingsForm";
import LandStockForm, { submitLandStock } from "./LandStockForm";
import { LeaseProductForm, submitLease } from "./LeaseProductForm";
import useCollateralStore from "../../../../../../store/collateralStore";

interface CollateralFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => void;
  isEdit?: boolean;
  initialData: FormValues | null;
  productCategory: "Loan" | "Lease" | null;
  appraisalId?: string;
  isLoading?: boolean;
}

// Utility function to get security type codes dynamically
const getSecurityTypeCode = (
  securityTypes: any[],
  description: string
): string | undefined => {
  return securityTypes.find((st) => st.description === description)?.code;
};

const CollateralFormModal: React.FC<CollateralFormModalProps> = ({
  open,
  onClose,
  onSave,
  isEdit = false,
  initialData,
  productCategory,
  appraisalId,
  isLoading = false,
}) => {
  const validAppraisalId = appraisalId;

  const {
    savingBankGuarantee,
    updatingBankGuarantee,
    savingLandStock,
    updatingLandStock,
    savingMachinery,
    updatingMachinery,
    savingPropertyMortgage,
    updatingPropertyMortgage,
    savingSavings,
    updatingSavings,
    savingVehicle,
    updatingVehicle,
    savingLease,
    updatingLease,
    securityTypes,
    securityTypesLoading,
    fetchSecurityTypes,
  } = useCollateralStore();

  const [submitting, setSubmitting] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const isSaving =
    savingBankGuarantee ||
    updatingBankGuarantee ||
    savingLandStock ||
    updatingLandStock ||
    savingMachinery ||
    updatingMachinery ||
    savingPropertyMortgage ||
    updatingPropertyMortgage ||
    savingSavings ||
    updatingSavings ||
    savingVehicle ||
    updatingVehicle ||
    savingLease ||
    updatingLease ||
    submitting;

  const memoizedValidationSchema = useMemo(() => {
    return createValidationSchema(securityTypes);
  }, [securityTypes]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(memoizedValidationSchema),
    defaultValues: {
      securityType: "",
    },
    mode: "onChange",
  });

  const {
    control: leaseControl,
    handleSubmit: handleLeaseSubmit,
    formState: { errors: leaseErrors },
    reset: resetLeaseForm,
    setValue: setLeaseValue,
  } = useForm<LeaseProductFormValues>({
    defaultValues: {
      equipmentCost: "",
      equipmentType: "",
      supplierCode: "",
      equipmentName: "",
      condition: "",
      category: "",
      depreciationCode: "",
      vehicleType: "",
      manufacturer: "",
      model: "",
      engineCapacityCC: "",
      engineCapacityHP: "",
      insuranceCompany: "",
      referenceNo: "",
    },
    resolver: yupResolver(leaseProductValidationSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open && productCategory === "Loan") {
      fetchSecurityTypes();
    }
  }, [open, productCategory, fetchSecurityTypes]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        if (productCategory === "Loan" && securityTypesLoading) {
          setFormInitialized(false);
          return;
        }

        if (productCategory === "Lease" && initialData) {
          // Map FormValues to LeaseProductFormValues format
          const leaseFormData: LeaseProductFormValues = {
            id: initialData.id,
            equipmentType: initialData.leaseEquipType || "",
            equipmentCost: initialData.leaseCost || "",
            supplierCode: initialData.leaseSupplierCode || "",
            equipmentName: initialData.leaseEquipName || "",
            condition: initialData.leaseCondition || "",
            category: initialData.leaseCategory || "",
            depreciationCode: initialData.leaseDepreciationCode || "",
            vehicleType: initialData.leaseVehicleType || "",
            manufacturer: initialData.leaseManufacturer || "",
            model: initialData.leaseModel || "",
            engineCapacityCC: initialData.leaseEngineCapacityCC || "",
            engineCapacityHP: initialData.leaseEngineCapacityHP || "",
            engineNo: initialData.leaseEngineNo || "",
            chassisNo: initialData.leaseChassisNo || "",
            vehicleNo: initialData.leaseVehicleNo || "",
            registrationDate: initialData.leaseRegistrationDate,
            duplicateKey: initialData.leaseDuplicateKey || "",
            registrationBookNo: initialData.leaseRegistrationBookNo || "",
            registrationYear: initialData.leaseRegistrationYear || "",
            internalMV: initialData.leaseMV || "",
            internalFSV: initialData.leaseFSV || "",
            province: initialData.leaseProvince || "",
            insuranceCompany: initialData.leaseInsuranceCompany || "",
            referenceNo: initialData.leaseReferenceNo || "",
          };
          resetLeaseForm(leaseFormData);
        } else {
          reset(initialData);
        }
        setFormInitialized(true);
      } else {
        reset({ securityType: "" });
        setFormInitialized(true);
        if (productCategory === "Lease") {
          resetLeaseForm({
            equipmentCost: "",
            equipmentType: "",
            supplierCode: "",
            equipmentName: "",
            condition: "",
            category: "",
            depreciationCode: "",
            vehicleType: "",
            manufacturer: "",
            model: "",
            engineCapacityCC: "",
            engineCapacityHP: "",
            insuranceCompany: "",
            referenceNo: "",
          });
        }
      }
    } else {
      setFormInitialized(false);
    }
  }, [
    open,
    initialData,
    reset,
    resetLeaseForm,
    productCategory,
    isEdit,
    securityTypesLoading,
  ]);

  const securityType = watch("securityType");
  const securityCategory = watch("securityCategory");
  const selectedSecurityType = securityTypes.find(
    (st) => st.code === securityType || st.description === securityType
  );

  useEffect(() => { }, [securityType]);

  useEffect(() => {
    if (securityCategory === "OTHER_SECURITY" && formInitialized) {
      reset({
        securityCategory: "OTHER_SECURITY",
        securityType: "",
      });
    }
  }, [securityCategory, reset, formInitialized]);

  const onSubmit = async (data: FormValues) => {
    try {
      const validAppraisalId = appraisalId || "";

      if (!validAppraisalId) {
        message.error("Cannot save: No appraisal ID available");
        return;
      }

      setSubmitting(true);

      const selectedSecurityType = securityTypes.find(
        (st) =>
          st.code === data.securityType || st.description === data.securityType
      );

      // Dynamic form submission based on security type
      if (selectedSecurityType) {
        let response = null;

        // Use a more flexible approach that doesn't rely on hardcoded strings
        switch (selectedSecurityType.code) {
          case getSecurityTypeCode(securityTypes, "VEHICLE"):
            response = await submitVehicle(data, validAppraisalId, isEdit);
            break;
          case getSecurityTypeCode(securityTypes, "BANK GUARANTEE"):
            response = await submitBankGuarantee(
              data,
              validAppraisalId,
              isEdit
            );
            break;
          case getSecurityTypeCode(securityTypes, "LAND STOCKS"):
            response = await submitLandStock(data, validAppraisalId, isEdit);
            break;
          case getSecurityTypeCode(securityTypes, "MACHINERY AND EQUIPMENT"):
            response = await submitMachinery(data, validAppraisalId, isEdit);
            break;
          case getSecurityTypeCode(securityTypes, "PROPERTY MORTGAGE"):
            response = await submitPropertyMortgage(
              data,
              validAppraisalId,
              isEdit
            );
            break;
          case getSecurityTypeCode(securityTypes, "FIXED DEPOSITS AND SAVINGS"):
            response = await submitSavings(data, validAppraisalId, isEdit);
            break;
          default:
            console.warn(
              `Unknown security type: ${selectedSecurityType.description}`
            );
            onSave(data);
            return;
        }

        if (response) {
          onSave(data);
        }
      } else {
        onSave(data);
      }
    } catch (error) {
      console.error("Failed to save collateral details:", error);
      message.error("Failed to save collateral details");
    } finally {
      setSubmitting(false);
    }
  };

  const onLeaseSubmit = async (data: LeaseProductFormValues) => {
    try {
      const validAppraisalId = appraisalId || "";

      if (!validAppraisalId) {
        message.error("Cannot save: No appraisal ID available");
        return;
      }

      setSubmitting(true);

      // Ensure the id is included when editing
      const leaseData = {
        ...data,
        id: isEdit && initialData?.id ? initialData.id : data.id,
      };

      const response = await submitLease(leaseData, validAppraisalId, isEdit);

      if (response) {
        onSave({ securityType: "LEASE", id: leaseData.id });
        onClose();
      }
    } catch (error) {
      console.error("Failed to save lease product details:", error);
      message.error("Failed to save lease product details");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = () => {
    if (productCategory === "Loan") {
      handleSubmit(onSubmit)();
    } else if (productCategory === "Lease") {
      handleLeaseSubmit(onLeaseSubmit)();
    } else {
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Collateral" : "Add Collateral"}
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            handleFormSubmit();
          }}
          loading={isSaving}
          disabled={isSaving}
        >
          {isEdit ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Spin
        spinning={
          isLoading ||
          isSaving ||
          (productCategory === "Loan" && securityTypesLoading)
        }
        tip={
          isLoading
            ? "Loading details..."
            : securityTypesLoading
              ? "Loading security types..."
              : "Saving data..."
        }
      >
        <Form layout="vertical" className="space-y-6">
          {productCategory === "Loan" ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label="Category"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Controller
                      name="securityCategory"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          showSearch
                          placeholder="Select Category"
                          disabled={false}
                        >
                          <Select.Option value="MAIN_SECURITY">
                            Main Security
                          </Select.Option>
                          <Select.Option value="OTHER_SECURITY">
                            Other Security
                          </Select.Option>
                        </Select>
                      )}
                    />
                  </Form.Item>

                  {securityCategory === "MAIN_SECURITY" && (
                    <Form.Item
                      label="Security Type"
                      required
                      validateStatus={errors.securityType ? "error" : ""}
                      help={errors.securityType?.message}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <Controller
                        name="securityType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            showSearch
                            placeholder="Select Security Type"
                            disabled={isSaving || securityTypesLoading}
                            loading={securityTypesLoading}
                          >
                            {securityTypes.map((securityType) => (
                              <Select.Option
                                key={securityType.code}
                                value={securityType.code}
                              >
                                {securityType.description}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                    </Form.Item>
                  )}
                </div>
              </div>

              {securityCategory === "MAIN_SECURITY" &&
                selectedSecurityType &&
                (isEdit ? formInitialized : true) && (
                  <>
                    {selectedSecurityType.description === "VEHICLE" && (
                      <VehicleForm
                        control={control}
                        errors={errors}
                        securityType={selectedSecurityType}
                      />
                    )}

                    {selectedSecurityType.description === "BANK GUARANTEE" && (
                      <BankGuaranteeForm
                        control={control}
                        errors={errors}
                        appraisalId={validAppraisalId}
                        onSubmitSuccess={() => onClose()}
                        securityType={selectedSecurityType}
                      />
                    )}

                    {selectedSecurityType.description ===
                      "MACHINERY AND EQUIPMENT" && (
                        <MachineryForm
                          control={control}
                          errors={errors}
                          securityType={selectedSecurityType}
                        />
                      )}

                    {selectedSecurityType.description ===
                      "PROPERTY MORTGAGE" && (
                        <PropertyMortgageForm
                          control={control}
                          errors={errors}
                          securityType={selectedSecurityType}
                        />
                      )}

                    {selectedSecurityType.description ===
                      "FIXED DEPOSITS AND SAVINGS" && (
                        <SavingsForm
                          control={control}
                          errors={errors}
                          securityType={selectedSecurityType}
                        />
                      )}

                    {selectedSecurityType.description === "LAND STOCKS" && (
                      <LandStockForm
                        control={control}
                        errors={errors}
                        securityType={selectedSecurityType}
                      />
                    )}
                  </>
                )}
            </>
          ) : (
            <div className="mt-5">
              <LeaseProductForm
                control={leaseControl}
                errors={leaseErrors}
                setValue={setLeaseValue}
              />
            </div>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default CollateralFormModal;
