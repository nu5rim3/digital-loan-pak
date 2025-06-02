import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, message, Spin } from "antd";
import { Controller, useForm } from "react-hook-form";
import { FormValues, validationSchema, LeaseProductFormValues } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import VehicleForm, { submitVehicle } from "./VehicleForm";
import BankGuaranteeForm, { submitBankGuarantee } from "./BankGuaranteeForm";
import MachineryForm, { submitMachinery } from "./MachineryForm";
import PropertyMortgageForm, { submitPropertyMortgage } from "./PropertyMortgageForm";
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
  productCategory: "LOAN" | "LEASE" | null;
  appraisalId?: string;
  isLoading?: boolean;
}

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
  // Make sure we have a valid appraisalId
  const validAppraisalId = appraisalId;
  
  // Get loading states from the store
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
  } = useCollateralStore();
  
  // Add state to track form submission loading
  const [submitting, setSubmitting] = useState(false);
  
  // Determine if any API is currently saving or updating data
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
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
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
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
        // If we're editing a lease product, we would need to reset the lease form too
        // This would require mapping the lease data from initialData to LeaseProductFormValues format
      } else {
        reset({ securityType: "" });
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
  }, [open, initialData, reset, resetLeaseForm]);

  const securityType = watch("securityType");

  const onSubmit = async (data: FormValues) => {
    try {
      // Make sure we have a valid appraisalId
      const validAppraisalId = appraisalId || "";
      
      if (!validAppraisalId) {
        message.error("Cannot save: No appraisal ID available");
        return;
      }
      
      setSubmitting(true);
      
      // If the security type is VEHICLE, use the vehicle submit function
      if (data.securityType === "VEHICLE") {
        console.log("Submitting Vehicle with appraisalId:", validAppraisalId, data);
        const response = await submitVehicle(data, validAppraisalId, isEdit);
        if (response) {
          // Don't need to show success message here as it's already shown in submitVehicle
          // Still call onSave to update UI
          onSave(data);
        } else {
          // Error message is already shown in submitVehicle
        }
      }
      // If the security type is BANK_GUARANTEE, use the special submit function
      else if (data.securityType === "BANK_GUARANTEE") {
        console.log("Submitting Bank Guarantee with appraisalId:", validAppraisalId, data);
        const response = await submitBankGuarantee(data, validAppraisalId, isEdit);
        if (response) {
          // Don't need to show success message here as it's already shown in submitBankGuarantee
          // Still call onSave to update UI
          onSave(data);
        } else {
          // Error message is already shown in submitBankGuarantee
        }
      } 
      // If the security type is LAND_STOCK, use the land stock submit function
      else if (data.securityType === "LAND_STOCK") {
        console.log("Submitting Land Stock with appraisalId:", validAppraisalId, data);
        const response = await submitLandStock(data, validAppraisalId, isEdit);
        if (response) {
          // Don't need to show success message here as it's already shown in submitLandStock
          // Still call onSave to update UI
          onSave(data);
        } else {
          // Error message is already shown in submitLandStock
        }
      }
      // If the security type is MACHINERY, use the machinery submit function
      else if (data.securityType === "MACHINERY") {
        console.log("Submitting Machinery Equipment with appraisalId:", validAppraisalId, data);
        const response = await submitMachinery(data, validAppraisalId, isEdit);
        if (response) {
          // Don't need to show success message here as it's already shown in submitMachinery
          // Still call onSave to update UI
          onSave(data);
        } else {
          // Error message is already shown in submitMachinery
        }
      }
      // If the security type is PROPERTY_MORTGAGE, use the property mortgage submit function
      else if (data.securityType === "PROPERTY_MORTGAGE") {
        console.log("Submitting Property Mortgage with appraisalId:", validAppraisalId, data);
        const response = await submitPropertyMortgage(data, validAppraisalId, isEdit);
        if (response) {
          // Don't need to show success message here as it's already shown in submitPropertyMortgage
          // Still call onSave to update UI
          onSave(data);
        } else {
          // Error message is already shown in submitPropertyMortgage
        }
      }
      // If the security type is SAVINGS, use the savings submit function
      else if (data.securityType === "SAVINGS") {
        console.log("Submitting Savings with appraisalId:", validAppraisalId, data);
        const response = await submitSavings(data, validAppraisalId, isEdit);
        if (response) {
          // Don't need to show success message here as it's already shown in submitSavings
          // Still call onSave to update UI
          onSave(data);
        } else {
          // Error message is already shown in submitSavings
        }
      }
      else {
        // For other security types, just use the regular onSave function
        onSave(data);
      }
    } catch (error) {
      console.error("Failed to save collateral details:", error);
      message.error("Failed to save collateral details");
    } finally {
      setSubmitting(false);
    }
  };

  // New function to handle lease product form submission
  const onLeaseSubmit = async (data: LeaseProductFormValues) => {
    try {
      // Make sure we have a valid appraisalId
      const validAppraisalId = appraisalId || "";
      
      if (!validAppraisalId) {
        message.error("Cannot save: No appraisal ID available");
        return;
      }
      
      setSubmitting(true);
      
      console.log("Submitting Lease Product with appraisalId:", validAppraisalId, data);
      const response = await submitLease(data, validAppraisalId, isEdit);
      if (response) {
        // Call onSave to update UI
        onSave({ securityType: "LEASE", id: data.id });
      }
    } catch (error) {
      console.error("Failed to save lease product details:", error);
      message.error("Failed to save lease product details");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = () => {
    if (productCategory === "LOAN") {
      handleSubmit(onSubmit)();
    } else if (productCategory === "LEASE") {
      handleLeaseSubmit(onLeaseSubmit)();
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
          onClick={handleFormSubmit}
          loading={isSaving}
          disabled={isSaving}
        >
          {isEdit ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Spin spinning={isLoading || isSaving} tip={isLoading ? "Loading details..." : "Saving data..."}>
        <Form layout="vertical" className="space-y-6">
          {productCategory === "LOAN" ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label="Category"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input value="Individual" disabled className="bg-gray-50" />
                  </Form.Item>

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
                        <Select {...field} placeholder="Select Security Type" disabled={isSaving}>
                          <Select.Option value="VEHICLE">Vehicle</Select.Option>
                          <Select.Option value="MACHINERY">
                            Machinery
                          </Select.Option>
                          <Select.Option value="BANK_GUARANTEE">
                            Bank Guarantee
                          </Select.Option>
                          <Select.Option value="PROPERTY_MORTGAGE">
                            Property Mortgage
                          </Select.Option>
                          <Select.Option value="SAVINGS">Savings</Select.Option>
                          <Select.Option value="LAND_STOCK">
                            Land Stock
                          </Select.Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </div>
              </div>

              {securityType === "VEHICLE" && (
                <VehicleForm control={control} errors={errors} />
              )}

              {securityType === "BANK_GUARANTEE" && (
                <BankGuaranteeForm 
                  control={control} 
                  errors={errors} 
                  appraisalId={validAppraisalId}
                  onSubmitSuccess={() => onClose()}
                />
              )}

              {securityType === "MACHINERY" && (
                <MachineryForm control={control} errors={errors} />
              )}

              {securityType === "PROPERTY_MORTGAGE" && (
                <PropertyMortgageForm control={control} errors={errors} />
              )}

              {securityType === "SAVINGS" && (
                <SavingsForm control={control} errors={errors} />
              )}

              {securityType === "LAND_STOCK" && (
                <LandStockForm control={control} errors={errors} />
              )}
            </>
          ) : (
            <div className="mt-5">
              <LeaseProductForm control={leaseControl} errors={leaseErrors} />
            </div>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default CollateralFormModal;
