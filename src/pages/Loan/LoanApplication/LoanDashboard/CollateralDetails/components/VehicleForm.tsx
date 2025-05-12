import React from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

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
          <Form.Item label="Type" required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Type">
                  <Select.Option value="car">Car</Select.Option>
                  <Select.Option value="truck">Truck</Select.Option>
                  <Select.Option value="van">Van</Select.Option>
                  <Select.Option value="bus">Bus</Select.Option>
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
                  <Select.Option value="owned">Owned</Select.Option>
                  <Select.Option value="leased">Leased</Select.Option>
                  <Select.Option value="financed">Financed</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Supplier" required>
            <Controller
              name="supplier"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Supplier" />
              )}
            />
          </Form.Item>

          <Form.Item label="Condition" required>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Condition">
                  <Select.Option value="new">New</Select.Option>
                  <Select.Option value="used">Used</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Vehicle Category" required>
            <Controller
              name="vehicleCategory"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select Vehicle Category">
                  <Select.Option value="passenger">Passenger</Select.Option>
                  <Select.Option value="commercial">Commercial</Select.Option>
                  <Select.Option value="industrial">Industrial</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Make" required>
            <Controller
              name="make"
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

          <Form.Item label="Model" required>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Model" />
              )}
            />
          </Form.Item>

          <Form.Item label="Engine No">
            <Controller
              name="engineNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Engine No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Serial or Chasis No">
            <Controller
              name="serialOrChasisNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Serial or Chasis No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} placeholder="Enter Description" />
              )}
            />
          </Form.Item>

          <Form.Item label="MV">
            <Controller
              name="mv"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter MV" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration No">
            <Controller
              name="registrationNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Year of Manufacture">
            <Controller
              name="yearOfManufacture"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Year of Manufacture" />
              )}
            />
          </Form.Item>

          <Form.Item label="Registration Book No">
            <Controller
              name="registrationBookNo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Registration Book No" />
              )}
            />
          </Form.Item>

          <Form.Item label="Book Received Date">
            <Controller
              name="bookReceivedDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="CR Released Date">
            <Controller
              name="crReleasedDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="Valued By">
            <Controller
              name="valuedBy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter Valued By" />
              )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm; 