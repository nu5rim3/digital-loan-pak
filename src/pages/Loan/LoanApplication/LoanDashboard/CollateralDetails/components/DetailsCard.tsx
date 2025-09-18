import React, { useEffect } from "react";
import { Card, Descriptions, Button, Space, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormValues } from "../types";
import dayjs from "dayjs";
// Update the import path below to the correct location of creditStore, for example:
import useCollateralStore from "../../../../../../store/collateralStore";
import { formatCurrency } from "../../../../../../utils/formatterFunctions";

import { getConditionFieldName, getOwnershipFieldName, getSubTypeFieldName, getTypeFieldName, getVehicleCategoryFieldName } from "../../../../../../utils/Common";
// Or, if the correct file is creditStore.ts but in a different folder, adjust accordingly.
// import useCollateralStore from "../../../../store/creditStore";
interface DetailsCardProps {
  data: FormValues;
  securityType: string;
  onUpdate: () => void;
  onDelete: () => void;
  securityTypes: any
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
  isCurrency?: boolean;
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
      { key: "bankGuaranteeOwnershipName", label: "Ownership" },
      { key: "institutionName", label: "Institution" },
      {
        key: "valueOfGuarantee",
        label: "Value of Guarantee",
        isCurrency: true,
      },
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
      { key: "landStockDeedTransferNo", label: "Deed No" },
      { key: "landStockAgreementNo", label: "Agreement No" },
    ],
  },
  "MACHINERY AND EQUIPMENT": {
    fields: [
      { key: "machineryType", label: "Type" },
      { key: "machineryOwnershipName", label: "Ownership" },
      { key: "machinerySupplier", label: "Supplier" },
      { key: "machineryCondition", label: "Condition" },
      { key: "machineryReferenceNo", label: "Reference No" },
    ],
  },
  "PROPERTY MORTGAGE": {
    fields: [
      { key: "propertyType", label: "Type" },
      { key: "propertySubType", label: "Sub Type" },
      { key: "propertyOwnershipName", label: "Ownership" },
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
      { key: "savingsAmount", label: "Amount", isCurrency: true },
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
  securityTypes
}) => {
  const {
    conditionData,
    fetchConditionByCode,
    ownershipsLoading,
    ownershipData,
    fetchOwnershipByCode,
    typesLoading,
    securityCategoryData,
    securityCategoryDataLoading,
    fetchSecurityCategoryByCode,
    subTypesData,
    fetchSubTypeByCode,
    fetchTypeByCode,
    typeByCodeLoading,
    subTypeByCodeLoading,
    typesData,
    fetchVehicleCategoryByCode,
    vehicleCategoryData,
    vehicleCategoryLoading,
    fetchSupplierByCode,
    supplierData,
    supplierDataLoading
  } = useCollateralStore();


useEffect(() => {
  if (data?.landStockSecCategory) {
    fetchSecurityCategoryByCode(data.landStockSecCategory);
  }

   if (data?.machinerySupplier) {
    fetchSupplierByCode(data.machinerySupplier);
  }


  const categoryFieldName = getVehicleCategoryFieldName(securityType);
  const categoryCode = categoryFieldName ? data?.[categoryFieldName] : null

    if (categoryFieldName && categoryCode) {
    fetchVehicleCategoryByCode(categoryFieldName, categoryCode);
  }
  const conditionFieldName = getConditionFieldName(securityType);
  const conditionCode = conditionFieldName ? data?.[conditionFieldName] : null;

  if (conditionFieldName && conditionCode) {
    fetchConditionByCode(conditionFieldName, conditionCode);
  }

  const ownershipFieldName = getOwnershipFieldName(securityType);
  const ownershipCode = ownershipFieldName ? data?.[ownershipFieldName] : null;

  if (ownershipFieldName && ownershipCode) {
    fetchOwnershipByCode(ownershipFieldName, ownershipCode);
  }
}, [ 
 securityType, data

   ]);

  useEffect(() => {
     //below structure used to find the selected security type's code based on description
    //because not passing description from API
  if (!securityTypes.length) return;

  const selectedSecurityTypeCode =  
    securityType === "LEASE"? "V":
    securityTypes.find((item: any) => item.description === securityType)?.code ?? "";

  if (!selectedSecurityTypeCode) return;

  const typeFieldName = getTypeFieldName(securityType);
  const typeCode = typeFieldName ? data?.[typeFieldName] : null;

  if (typeCode && typeFieldName) {
    fetchTypeByCode(typeFieldName,typeCode, selectedSecurityTypeCode);
  }

  const subTypeFieldName = getSubTypeFieldName(securityType);
  const subTypeCode = subTypeFieldName ? data?.[subTypeFieldName] : null;

  if (subTypeCode && subTypeFieldName) {
    fetchSubTypeByCode(subTypeFieldName, subTypeCode , subTypeFieldName === "landStockSubType" ? "F":selectedSecurityTypeCode);
  }
}, [ securityType, data]);


  const renderFieldValue = (field: FieldConfig, data: FormValues): string => {
    const value =
      data[field.key as keyof FormValues] ||
      data[field.fallback as keyof FormValues];

    if (field.isDate && value) {
      return dayjs(value).format("YYYY-MM-DD");
    }
    if (field.isCurrency && value) {
      return formatCurrency(Number(value));
    }

    return String(value || "-");
  };

  const renderDetails = () => {
    const getDescription = (source: any, key: string) =>
      source?.[key]?.description ?? "-";

    const modifiedData = {
      ...data,
      bankGuaranteeOwnershipName: getDescription(ownershipData, "bankGuaranteeOwnership"),
      machineryOwnershipName: getDescription(ownershipData, "machineryOwnership"),
      propertyOwnershipName: getDescription(ownershipData, "propertyOwnership"),
      vehicleOwnership: getDescription(ownershipData, "vehicleOwnership"),

      machineryCondition: getDescription(conditionData, "machineryCondition"),
      vehicleCondition: getDescription(conditionData, "vehicleCondition"),
      leaseCondition: getDescription(conditionData, "leaseCondition"),

      landStockCategory: securityCategoryData?.description ?? "-",
      vehicleCategory: vehicleCategoryData?.vehicleCategory?.description ?? "-",
      leaseCategory: vehicleCategoryData?.leaseCategory?.description ?? "-",

      savingsType: getDescription(typesData, "savingsType"),
      vehicleType: getDescription(typesData, "vehicleType"),
      propertyType: getDescription(typesData, "propertyType"),
      bankGuaranteeType: getDescription(typesData, "bankGuaranteeType"),
      machineryType: getDescription(typesData, "machineryType"),
      landStockType: getDescription(typesData, "landStockType"),
      leaseVehicleType: getDescription(typesData, "leaseVehicleType"),

      propertySubType: getDescription(subTypesData, "propertySubType"),
      landStockSubType: getDescription(subTypesData, "landStockSubType"),
      savingsSubType: getDescription(subTypesData, "savingsSubType"),
      machinerySupplier:supplierData?.supplierName ?? "-",
};

    const config =
      SECURITY_TYPE_CONFIG[securityType as keyof typeof SECURITY_TYPE_CONFIG];

    if (!config) {
      return null;
    }

    return config.fields.map((field) => (
      <Descriptions.Item key={field.key} label={field.label}>
        {renderFieldValue(field, modifiedData)}
      </Descriptions.Item>
    ));
  };

  return (
    <Spin
      spinning={
        ownershipsLoading ||
        typesLoading ||
        securityCategoryDataLoading ||
        typeByCodeLoading ||
        subTypeByCodeLoading ||
        vehicleCategoryLoading ||
        supplierDataLoading
      }
    >
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
    </Spin>
  );
};

export default DetailsCard;
