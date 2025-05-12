import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface PropertyMortgageFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const PropertyMortgageForm: React.FC<PropertyMortgageFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Property Mortgage Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Type" required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="residential">Residential</Select.Option>
                  <Select.Option value="commercial">Commercial</Select.Option>
                  <Select.Option value="industrial">Industrial</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Ownership" required>
            <Controller
              name="ownership"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Ownership">
                  <Select.Option value="individual">Individual</Select.Option>
                  <Select.Option value="company">Company</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Sub Type" required>
            <Controller
              name="subType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Sub Type">
                  <Select.Option value="apartment">Apartment</Select.Option>
                  <Select.Option value="house">House</Select.Option>
                  <Select.Option value="plot">Plot</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Bond Type" required>
            <Controller
              name="bondType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Bond Type">
                  <Select.Option value="registered">Registered</Select.Option>
                  <Select.Option value="unregistered">Unregistered</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Property Type" required>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Property Type">
                  <Select.Option value="residential">Residential</Select.Option>
                  <Select.Option value="commercial">Commercial</Select.Option>
                  <Select.Option value="industrial">Industrial</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Property Address" required>
            <Controller
              name="propertyAddress"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Property Address" />
              )}
            />
          </Form.Item>

          <Form.Item label="Loan Agreement No" required>
            <Controller
              name="loanAgreementNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Loan Agreement No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Loan Reference No" required>
            <Controller
              name="loanReferenceNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Loan Reference No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Property Value" required>
            <Controller
              name="propertyValue"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Property Value" />
              )}
            />
          </Form.Item>

          <Form.Item label="MV" required>
            <Controller
              name="mv"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter MV" />
              )}
            />
          </Form.Item>

          <Form.Item label="CR Number" required>
            <Controller
              name="crNumber"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter CR Number" />
              )}
            />
          </Form.Item>

          <Form.Item label="Sale Price" required>
            <Controller
              name="salePrice"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Sale Price" />
              )}
            />
          </Form.Item>

          <Form.Item label="FSV" required>
            <Controller
              name="fsv"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter FSV" />
              )}
            />
          </Form.Item>

          <Form.Item label="Municipality" required>
            <Controller
              name="municipality"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Municipality" />
              )}
            />
          </Form.Item>

          <Form.Item label="Date of Reg" required>
            <Controller
              name="dateOfReg"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default PropertyMortgageForm; 