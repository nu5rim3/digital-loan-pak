import React from "react";
import { Card, Descriptions, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormValues } from "../types";
import dayjs from "dayjs";

interface DetailsCardProps {
  data: FormValues;
  securityType: string;
  onUpdate: () => void;
  onDelete: () => void;
}

const toTitleCase = (text: string): string => {
  const minorWords = [
    "and",
    "or",
    "the",
    "a",
    "an",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
  ];

  const words = text.toLowerCase().split(" ");

  return words
    .map((word, index) => {
      if (
        index === 0 ||
        index === words.length - 1 ||
        !minorWords.includes(word)
      ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
};

interface FieldConfig {
  key: string;
  label: string;
  fallback?: string;
  isDate?: boolean;
}

interface SecurityTypeConfig {
  fields: FieldConfig[];
}

const SECURITY_TYPE_CONFIG: Record<string, SecurityTypeConfig> = {
  VEHICLE: {
    fields: [
      { key: "vehicleType", label: "Type" },
      { key: "vehicleCategory", label: "Category" },
      { key: "vehicleOwnership", label: "Ownership" },
      { key: "vehicleCondition", label: "Condition" },
      { key: "vehicleReferenceNo", label: "Reference No" },
    ],
  },
  "BANK GUARANTEE": {
    fields: [
      { key: "bankGuaranteeType", label: "Type" },
      { key: "bankGuaranteeOwnership", label: "Ownership" },
      { key: "institutionName", label: "Institution" },
      { key: "valueOfGuarantee", label: "Value of Guarantee" },
      {
        key: "referenceNo",
        label: "Reference No",
        fallback: "referenceNoOndemand",
      },
    ],
  },
  "LAND STOCKS": {
    fields: [
      { key: "landStockType", label: "Type" },
      { key: "landStockSubType", label: "Sub Type" },
      { key: "landStockCategory", label: "Category" },
      { key: "landStockOwnership", label: "Deed No" },
      { key: "landStockAgreementNo", label: "Agreement No" },
    ],
  },
  "MACHINERY AND EQUIPMENT": {
    fields: [
      { key: "machineryType", label: "Type" },
      { key: "machineryOwnership", label: "Ownership" },
      { key: "machinerySupplier", label: "Supplier" },
      { key: "machineryCondition", label: "Condition" },
      { key: "machineryReferenceNo", label: "Reference No" },
    ],
  },
  "PROPERTY MORTGAGE": {
    fields: [
      { key: "propertyType", label: "Type" },
      { key: "propertySubType", label: "Sub Type" },
      { key: "propertyOwnership", label: "Ownership" },
      { key: "propertyBondNo", label: "Bond No" },
      { key: "propertyReferenceNo", label: "Reference No" },
    ],
  },
  "FIXED DEPOSITS AND SAVINGS": {
    fields: [
      { key: "savingsType", label: "Type" },
      { key: "savingsSubType", label: "Sub Type" },
      { key: "savingsNo", label: "Account No" },
      { key: "savingsFDNo", label: "FD No" },
      { key: "savingsAmount", label: "Amount" },
    ],
  },
  LEASE: {
    fields: [
      { key: "leaseEquipType", label: "Equipment Type" },
      { key: "leaseCategory", label: "Category" },
      { key: "leaseCondition", label: "Condition" },
      { key: "leaseVehicleType", label: "Vehicle Type" },
      { key: "leaseReferenceNo", label: "Reference No" },
    ],
  },
} as const;

const DetailsCard: React.FC<DetailsCardProps> = ({
  data,
  securityType,
  onUpdate,
  onDelete,
}) => {
  const renderFieldValue = (field: FieldConfig, data: FormValues): string => {
    const value =
      data[field.key as keyof FormValues] ||
      data[field.fallback as keyof FormValues];

    if (field.isDate && value) {
      return dayjs(value).format("YYYY-MM-DD");
    }

    return String(value || "-");
  };

  const renderDetails = () => {
    const config =
      SECURITY_TYPE_CONFIG[securityType as keyof typeof SECURITY_TYPE_CONFIG];

    if (!config) {
      return null;
    }

    return config.fields.map((field) => (
      <Descriptions.Item key={field.key} label={field.label}>
        {renderFieldValue(field, data)}
      </Descriptions.Item>
    ));
  };

  return (
    <Card
      title={toTitleCase(securityType)}
      extra={
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={onUpdate} />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
          />
        </Space>
      }
    >
      <Descriptions column={1}>{renderDetails()}</Descriptions>
    </Card>
  );
};

export default DetailsCard;
