import React, { useEffect } from "react";
import { Modal, Form, Select, Button } from "antd";
import { CustomerRiskProfilingProps } from "./types";
import { PlusOutlined, UndoOutlined } from "@ant-design/icons";

const { Option } = Select;

const CustomerRiskProfilingModal: React.FC<CustomerRiskProfilingProps> = ({
  mode,
  isModalOpen,
  closeModal,
  formMethods,
  onSubmit,
  onRemove,
}) => {
  const [form] = Form.useForm();

  // Initialize form with selected data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const values = formMethods.getValues();
      form.setFieldsValue(values);
    }
  }, [isModalOpen, formMethods, form]);

  const handleSubmit = (values: any) => {
    if (mode === "remove") {
      onRemove?.(values);
    } else {
      onSubmit(values);
    }
    form.resetFields();
  };

  const handleClear = () => {
    form.resetFields();
    formMethods.reset();
  };

  return (
    <Modal
      title={
        mode === "save"
          ? "Add Customer Risk Profiling"
          : mode === "update"
          ? "Update Customer Risk Profiling"
          : "Remove Customer Risk Profiling"
      }
      open={isModalOpen}
      onCancel={() => {
        form.resetFields();
        formMethods.reset();
        closeModal();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="customerType"
            label="Customer Type"
            rules={[{ required: true, message: "Please select customer type" }]}
          >
            <Select
              showSearch
              placeholder="Select customer type"
              optionFilterProp="children"
            >
              <Option value="individual">Individual</Option>
              <Option value="corporate">Corporate</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="deliveryChannel"
            label="Delivery Channel"
            rules={[
              { required: true, message: "Please select delivery channel" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select delivery channel"
              optionFilterProp="children"
            >
              <Option value="branch">Branch</Option>
              <Option value="online">Online</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="mandate"
            label="Mandate"
            rules={[{ required: true, message: "Please select mandate" }]}
          >
            <Select
              showSearch
              placeholder="Select mandate"
              optionFilterProp="children"
            >
              <Option value="single">Single</Option>
              <Option value="joint">Joint</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="educationQualification"
            label="Education Qualification"
            rules={[
              {
                required: true,
                message: "Please select education qualification",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select education qualification"
              optionFilterProp="children"
            >
              <Option value="highSchool">High School</Option>
              <Option value="bachelors">Bachelor's</Option>
              <Option value="masters">Master's</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: "Please select product" }]}
          >
            <Select
              showSearch
              placeholder="Select product"
              optionFilterProp="children"
            >
              <Option value="personalLoan">Personal Loan</Option>
              <Option value="homeLoan">Home Loan</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sourceOfFund"
            label="Source of Fund"
            rules={[
              { required: true, message: "Please select source of fund" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select source of fund"
              optionFilterProp="children"
            >
              <Option value="salary">Salary</Option>
              <Option value="business">Business</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="expectedMonthlyCreditTurnover"
            label="Expected Monthly Credit Turnover"
            rules={[
              {
                required: true,
                message: "Please select expected monthly credit turnover",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select expected monthly credit turnover"
              optionFilterProp="children"
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="expectedMonthlyTransaction"
            label="Expected Monthly Transaction"
            rules={[
              {
                required: true,
                message: "Please select expected monthly transaction",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select expected monthly transaction"
              optionFilterProp="children"
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="geographyLocation"
            label="Geography Location"
            rules={[
              { required: true, message: "Please select geography location" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select geography location"
              optionFilterProp="children"
            >
              <Option value="urban">Urban</Option>
              <Option value="rural">Rural</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="residentStatus"
            label="Resident / Non-Resident"
            rules={[
              { required: true, message: "Please select resident status" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select resident status"
              optionFilterProp="children"
            >
              <Option value="resident">Resident</Option>
              <Option value="nonResident">Non-Resident</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex flex-row-reverse gap-3">
          {mode === "remove" ? (
            <Button
              type="default"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={false}
              danger
            >
              Remove
            </Button>
          ) : (
            <>
              <Button
                type="default"
                onClick={handleClear}
                danger
                icon={<UndoOutlined />}
                disabled={false}
              >
                Clear
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={false}
              >
                {mode === "save" ? "Add" : "Update"}
              </Button>
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default CustomerRiskProfilingModal;
