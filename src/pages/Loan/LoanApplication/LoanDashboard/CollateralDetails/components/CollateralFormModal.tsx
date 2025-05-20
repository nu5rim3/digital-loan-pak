import React, { useEffect } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { FormValues, validationSchema } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import VehicleForm from "./VehicleForm";
import BankGuaranteeForm from "./BankGuaranteeForm";
import MachineryForm from "./MachineryForm";
import PropertyMortgageForm from "./PropertyMortgageForm";
import SavingsForm from "./SavingsForm";
import LandStockForm from "./LandStockForm";
import { LeaseProductForm } from "./LeaseProductForm";

interface CollateralFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => void;
  isEdit?: boolean;
  initialData: FormValues | null;
  productCategory: "LOAN" | "LEASE" | null;
}

const CollateralFormModal: React.FC<CollateralFormModalProps> = ({
  open,
  onClose,
  onSave,
  isEdit = false,
  initialData,
  productCategory,
}) => {
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

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({ securityType: "" });
      }
    }
  }, [open, initialData, reset]);

  const securityType = watch("securityType");

  const onSubmit = (data: FormValues) => {
    onSave(data);
  };

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Modal
      title={isEdit ? "Edit Collateral" : "Add Collateral"}
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleFormSubmit}>
          {isEdit ? "Update" : "Add"}
        </Button>,
      ]}
    >
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
                      <Select {...field} placeholder="Select Security Type">
                        <Select.Option value="VEHICLE">Vehicle</Select.Option>
                        <Select.Option value="MACHINERY">Machinery</Select.Option>
                        <Select.Option value="BANK_GUARANTEE">
                          Bank Guarantee
                        </Select.Option>
                        <Select.Option value="PROPERTY_MORTGAGE">
                          Property Mortgage
                        </Select.Option>
                        <Select.Option value="SAVINGS">Savings</Select.Option>
                        <Select.Option value="LAND_STOCK">Land Stock</Select.Option>
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
              <BankGuaranteeForm control={control} errors={errors} />
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
            <LeaseProductForm control={control} errors={errors} /></div>
        )}
      </Form>
    </Modal>
  );
};

export default CollateralFormModal;
