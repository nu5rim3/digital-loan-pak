import React from "react";
import { Form, Input, InputNumber, Select, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";
import { FormValues } from "../types";
import dayjs from 'dayjs';

interface VehicleFormProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Type"
            required
            validateStatus={errors.vehicleType ? "error" : ""}
            help={errors.vehicleType?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="car">Car</Select.Option>
                  <Select.Option value="truck">Truck</Select.Option>
                  <Select.Option value="bus">Bus</Select.Option>
                  <Select.Option value="motorcycle">Motorcycle</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ownership"
            required
            validateStatus={errors.vehicleOwnership ? "error" : ""}
            help={errors.vehicleOwnership?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleOwnership"
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
            label="Supplier"
            required
            validateStatus={errors.vehicleSupplier ? "error" : ""}
            help={errors.vehicleSupplier?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleSupplier"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Supplier">
                  <Select.Option value="supplier1">Supplier 1</Select.Option>
                  <Select.Option value="supplier2">Supplier 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            required
            validateStatus={errors.vehicleCondition ? "error" : ""}
            help={errors.vehicleCondition?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCondition"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Condition">
                  <Select.Option value="new">New</Select.Option>
                  <Select.Option value="used">Used</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Vehicle Category"
            required
            validateStatus={errors.vehicleCategory ? "error" : ""}
            help={errors.vehicleCategory?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCategory"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Category">
                  <Select.Option value="sedan">Sedan</Select.Option>
                  <Select.Option value="suv">SUV</Select.Option>
                  <Select.Option value="hatchback">Hatchback</Select.Option>
                  <Select.Option value="pickup">Pickup</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Make"
            required
            validateStatus={errors.vehicleMake ? "error" : ""}
            help={errors.vehicleMake?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleMake"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Make">
                  <Select.Option value="toyota">Toyota</Select.Option>
                  <Select.Option value="honda">Honda</Select.Option>
                  <Select.Option value="suzuki">Suzuki</Select.Option>
                  <Select.Option value="mitsubishi">Mitsubishi</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Model"
            required
            validateStatus={errors.vehicleModel ? "error" : ""}
            help={errors.vehicleModel?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleModel"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Model">
                  <Select.Option value="model1">Model 1</Select.Option>
                  <Select.Option value="model2">Model 2</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Engine No"
            validateStatus={errors.vehicleEngineNo ? "error" : ""}
            help={errors.vehicleEngineNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleEngineNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Engine No" />}
            />
          </Form.Item>

          <Form.Item
            label="Chassis No"
            validateStatus={errors.vehicleChassisNo ? "error" : ""}
            help={errors.vehicleChassisNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleChassisNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Chassis No" />}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            validateStatus={errors.vehicleDescription ? "error" : ""}
            help={errors.vehicleDescription?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleDescription"
              control={control}
              render={({ field }) => <Input.TextArea {...field} placeholder="Enter Description" />}
            />
          </Form.Item>

          <Form.Item
            label="Registration No"
            validateStatus={errors.vehicleRegistrationNo ? "error" : ""}
            help={errors.vehicleRegistrationNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleRegistrationNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Registration No" />}
            />
          </Form.Item>

          <Form.Item
            label="Year of Manufacture"
            validateStatus={errors.vehicleYearManufacture ? "error" : ""}
            help={errors.vehicleYearManufacture?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleYearManufacture"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Year of Manufacture" />}
            />
          </Form.Item>

          <Form.Item
            label="MV"
            validateStatus={errors.vehicleMV ? "error" : ""}
            help={errors.vehicleMV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleMV"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Enter MV"
                  formatter={(value) => `Rs ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/Rs\s?|(,*)/g, "")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="FSV"
            validateStatus={errors.vehicleFSV ? "error" : ""}
            help={errors.vehicleFSV?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleFSV"
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
            label="Date of 1st Reg"
            validateStatus={errors.vehicleDateOfFirstReg ? "error" : ""}
            help={errors.vehicleDateOfFirstReg?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleDateOfFirstReg"
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
            label="Reg Book No"
            validateStatus={errors.vehicleRegBookNo ? "error" : ""}
            help={errors.vehicleRegBookNo?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleRegBookNo"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Reg Book No" />}
            />
          </Form.Item>

          <Form.Item
            label="Book Received Date"
            validateStatus={errors.vehicleBookReceivedDate ? "error" : ""}
            help={errors.vehicleBookReceivedDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleBookReceivedDate"
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
            label="CR Released Date"
            validateStatus={errors.vehicleCRReleasedDate ? "error" : ""}
            help={errors.vehicleCRReleasedDate?.message}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Controller
              name="vehicleCRReleasedDate"
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
        </div>
      </div>
    </div>
  );
};

export default VehicleForm; 