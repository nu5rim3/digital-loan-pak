import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from 'dayjs';

interface PropertyMortgageFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const PropertyMortgageForm: React.FC<PropertyMortgageFormProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
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
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="residential">Residential</Select.Option>
                  <Select.Option value="commercial">Commercial</Select.Option>
                  <Select.Option value="industrial">Industrial</Select.Option>
                  <Select.Option value="land">Land</Select.Option>
                </Select>
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
                <Select {...field} placeholder="Select Sub Type">
                  <Select.Option value="apartment">Apartment</Select.Option>
                  <Select.Option value="house">House</Select.Option>
                  <Select.Option value="villa">Villa</Select.Option>
                  <Select.Option value="plot">Plot</Select.Option>
                </Select>
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
                <Select {...field} placeholder="Select Ownership">
                  <Select.Option value="individual">Individual</Select.Option>
                  <Select.Option value="company">Company</Select.Option>
                </Select>
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
                <Select {...field} placeholder="Select Bond Type">
                  <Select.Option value="type1">Type 1</Select.Option>
                  <Select.Option value="type2">Type 2</Select.Option>
                </Select>
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
                <Select {...field} placeholder="Select Property Type">
                  <Select.Option value="type1">Type 1</Select.Option>
                  <Select.Option value="type2">Type 2</Select.Option>
                </Select>
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
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
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
                <Select {...field} placeholder="Select POA">
                  <Select.Option value="yes">Yes</Select.Option>
                  <Select.Option value="no">No</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

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
                <Select {...field} placeholder="Select Company">
                  <Select.Option value="company1">Company 1</Select.Option>
                  <Select.Option value="company2">Company 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

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
                <Select {...field} placeholder="Select Title Insurance">
                  <Select.Option value="yes">Yes</Select.Option>
                  <Select.Option value="no">No</Select.Option>
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
                <Select {...field} placeholder="Select Insurance of Building">
                  <Select.Option value="yes">Yes</Select.Option>
                  <Select.Option value="no">No</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

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
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

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
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
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
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
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
        </div>
      </div>
    </div>
  );
};

export default PropertyMortgageForm;
