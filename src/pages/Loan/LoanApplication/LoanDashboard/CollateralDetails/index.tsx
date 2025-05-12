import React from "react";
import { Form, Select, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, FormValues, CollateralDetailsProps } from "./types";
import VehicleForm from "./components/VehicleForm";
import MachineryForm from "./components/MachineryForm";
import SavingsForm from "./components/SavingsForm";
import BankGuaranteeForm from "./components/BankGuaranteeForm";
import LandStockForm from "./components/LandStockForm";
import PropertyMortgageForm from "./components/PropertyMortgageForm";
import { LeaseProductForm } from "./components/LeaseProductForm";

const CollateralDetails: React.FC<CollateralDetailsProps> = ({
  productCategory = "LOAN",
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      productCategory,
    },
  });

  const securityType = watch("securityType");

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const renderLoanProductForm = () => {
    switch (securityType) {
      case "VEHICLE":
        return <VehicleForm control={control} errors={errors} />;
      case "MACHINERY_AND_EQUIPMENT":
        return <MachineryForm control={control} errors={errors} />;
      case "SAVINGS":
        return <SavingsForm control={control} errors={errors} />;
      case "BANK_GUARANTEE":
        return <BankGuaranteeForm control={control} errors={errors} />;
      case "LAND_STOCK":
        return <LandStockForm control={control} errors={errors} />;
      case "PROPERTY_MORTGAGE":
        return <PropertyMortgageForm control={control} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      {productCategory === "LOAN" && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Basic Info</h3>
          <div className="grid grid-cols-3 gap-4">
            <Form.Item label="Category">
              <Input value={"Individual"} disabled />
            </Form.Item>

            <Form.Item label="Security Type" required>
              <Controller
                name="securityType"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select Security Type">
                    <Select.Option value="VEHICLE">Vehicle</Select.Option>
                    <Select.Option value="MACHINERY_AND_EQUIPMENT">
                      Machinery and Equipment
                    </Select.Option>
                    <Select.Option value="SAVINGS">Savings</Select.Option>
                    <Select.Option value="BANK_GUARANTEE">
                      Bank Guarantee
                    </Select.Option>
                    <Select.Option value="LAND_STOCK">Land Stock</Select.Option>
                    <Select.Option value="PROPERTY_MORTGAGE">
                      Property Mortgage
                    </Select.Option>
                  </Select>
                )}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {productCategory === "LEASE" ? (
        <LeaseProductForm control={control} errors={errors} />
      ) : (
        renderLoanProductForm()
      )}
    </Form>
  );
};

export default CollateralDetails;
