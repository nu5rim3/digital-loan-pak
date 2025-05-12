import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

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
            label="Ownership"
            required
            validateStatus={errors.propertyOwnership ? "error" : ""}
            help={errors.propertyOwnership?.message}
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
            label="Location"
            required
            validateStatus={errors.propertyLocation ? "error" : ""}
            help={errors.propertyLocation?.message}
          >
            <Controller
              name="propertyLocation"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Location" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Area"
            required
            validateStatus={errors.propertyArea ? "error" : ""}
            help={errors.propertyArea?.message}
          >
            <Controller
              name="propertyArea"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Area" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Municipality"
            required
            validateStatus={errors.municipality ? "error" : ""}
            help={errors.municipality?.message}
          >
            <Controller
              name="municipality"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Municipality" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Market Value"
            required
            validateStatus={errors.propertyMarketValue ? "error" : ""}
            help={errors.propertyMarketValue?.message}
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
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="FSV"
            required
            validateStatus={errors.propertyFSV ? "error" : ""}
            help={errors.propertyFSV?.message}
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
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Property Value"
            required
            validateStatus={errors.propertyValue ? "error" : ""}
            help={errors.propertyValue?.message}
          >
            <Controller
              name="propertyValue"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter Property Value"
                  formatter={(value) =>
                    `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            required
            validateStatus={errors.propertyDescription ? "error" : ""}
            help={errors.propertyDescription?.message}
          >
            <Controller
              name="propertyDescription"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            required
            validateStatus={errors.propertyAddress ? "error" : ""}
            help={errors.propertyAddress?.message}
          >
            <Controller
              name="propertyAddress"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Address" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PropertyMortgageForm;
