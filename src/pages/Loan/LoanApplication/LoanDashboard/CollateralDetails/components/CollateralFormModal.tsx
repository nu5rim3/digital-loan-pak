import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, message, Spin } from "antd";
import { Controller, useForm } from "react-hook-form";
import { FormValues, validationSchema, LeaseProductFormValues, leaseProductValidationSchema } from "../types";
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
  } = useCollateralStore();

  const [submitting, setSubmitting] = useState(false);

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
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ securityType: "" });
        if (productCategory !== "Lease" || isEdit) {
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
    }
  }, [open, initialData, reset, resetLeaseForm, productCategory, isEdit]);

  const securityType = watch("securityType");
  const securityCategory = watch("securityCategory");


  useEffect(() => {
    if (securityCategory === "OTHER_SECURITY") {
      reset({
        securityCategory: "OTHER_SECURITY",
        securityType: "",
      });
    }
  }, [securityCategory, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const validAppraisalId = appraisalId || "";

      if (!validAppraisalId) {
        message.error("Cannot save: No appraisal ID available");
        return;
      }

      setSubmitting(true);

      if (data.securityType === "VEHICLE") {
        const response = await submitVehicle(data, validAppraisalId, isEdit);
        if (response) {
          onSave(data);
        } else {
        }
      }
      else if (data.securityType === "BANK_GUARANTEE") {
        const response = await submitBankGuarantee(
          data,
          validAppraisalId,
          isEdit
        );
        if (response) {
          onSave(data);
        } else {
        }
      }
      else if (data.securityType === "LAND_STOCK") {
        const response = await submitLandStock(data, validAppraisalId, isEdit);
        if (response) {
          onSave(data);
        } else {
        }
      }
      else if (data.securityType === "MACHINERY") {
        const response = await submitMachinery(data, validAppraisalId, isEdit);
        if (response) {
          onSave(data);
        } else {
        }
      }
      else if (data.securityType === "PROPERTY_MORTGAGE") {
        const response = await submitPropertyMortgage(
          data,
          validAppraisalId,
          isEdit
        );
        if (response) {
          onSave(data);
        } else {
        }
      }
      else if (data.securityType === "SAVINGS") {
        const response = await submitSavings(data, validAppraisalId, isEdit);
        if (response) {
          onSave(data);
        } else {
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

      const response = await submitLease(data, validAppraisalId, isEdit);

      if (response) {
        onSave({ securityType: "LEASE", id: data.id });
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
        spinning={isLoading || isSaving}
        tip={isLoading ? "Loading details..." : "Saving data..."}
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
                            disabled={isSaving}
                          >
                            <Select.Option value="VEHICLE">
                              Vehicle
                            </Select.Option>
                            <Select.Option value="MACHINERY">
                              Machinery
                            </Select.Option>
                            <Select.Option value="BANK_GUARANTEE">
                              Bank Guarantee
                            </Select.Option>
                            <Select.Option value="PROPERTY_MORTGAGE">
                              Property Mortgage
                            </Select.Option>
                            <Select.Option value="SAVINGS">
                              Savings
                            </Select.Option>
                            <Select.Option value="LAND_STOCK">
                              Land Stock
                            </Select.Option>
                          </Select>
                        )}
                      />
                    </Form.Item>
                  )}
                </div>
              </div>

              {securityCategory === "MAIN_SECURITY" && securityType === "VEHICLE" && (
                <VehicleForm control={control} errors={errors} />
              )}

              {securityCategory === "MAIN_SECURITY" && securityType === "BANK_GUARANTEE" && (
                <BankGuaranteeForm
                  control={control}
                  errors={errors}
                  appraisalId={validAppraisalId}
                  onSubmitSuccess={() => onClose()}
                />
              )}

              {securityCategory === "MAIN_SECURITY" && securityType === "MACHINERY" && (
                <MachineryForm control={control} errors={errors} />
              )}

              {securityCategory === "MAIN_SECURITY" && securityType === "PROPERTY_MORTGAGE" && (
                <PropertyMortgageForm control={control} errors={errors} />
              )}

              {securityCategory === "MAIN_SECURITY" && securityType === "SAVINGS" && (
                <SavingsForm control={control} errors={errors} />
              )}

              {securityCategory === "MAIN_SECURITY" && securityType === "LAND_STOCK" && (
                <LandStockForm control={control} errors={errors} />
              )}
            </>
          ) : (
            <div className="mt-5">
              <LeaseProductForm control={leaseControl} errors={leaseErrors} setValue={setLeaseValue} />
            </div>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default CollateralFormModal;
