import React from "react";
import { Card, Descriptions, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CustomerRiskProfilingFormData } from "./types";

interface DetailsCardProps {
  detail: CustomerRiskProfilingFormData;
  onEdit: () => void;
  onRemove: () => void;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ detail, onEdit, onRemove }) => {
  return (
    <Card
      className="w-full"
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          Edit
        </Button>,
        <Button
          key="delete"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onRemove}
        >
          Delete
        </Button>,
      ]}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Customer Type">
          {detail.customerType}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Channel">
          {detail.deliveryChannel}
        </Descriptions.Item>
        <Descriptions.Item label="Mandate">
          {detail.mandate}
        </Descriptions.Item>
        <Descriptions.Item label="Education Qualification">
          {detail.educationQualification}
        </Descriptions.Item>
        <Descriptions.Item label="Product">
          {detail.product}
        </Descriptions.Item>
        <Descriptions.Item label="Source of Fund">
          {detail.sourceOfFund}
        </Descriptions.Item>
        <Descriptions.Item label="Expected Monthly Credit Turnover">
          {detail.expectedMonthlyCreditTurnover}
        </Descriptions.Item>
        <Descriptions.Item label="Expected Monthly Transaction">
          {detail.expectedMonthlyTransaction}
        </Descriptions.Item>
        <Descriptions.Item label="Geography Location">
          {detail.geographyLocation}
        </Descriptions.Item>
        <Descriptions.Item label="Resident Status">
          {detail.residentStatus}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default DetailsCard; 