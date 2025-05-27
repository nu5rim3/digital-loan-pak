import React from "react";
import { Card, Descriptions, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormValues } from "../types";
import dayjs from 'dayjs';

interface DetailsCardProps {
  data: FormValues;
  securityType: string;
  onUpdate: () => void;
  onDelete: () => void;
}

const DetailsCard: React.FC<DetailsCardProps> = ({
  data,
  securityType,
  onUpdate,
  onDelete,
}) => {
  const renderDetails = () => {
    switch (securityType) {
      case "VEHICLE":
        return (
          <>
            <Descriptions.Item label="Type">{data.vehicleType}</Descriptions.Item>
            <Descriptions.Item label="Make">{data.vehicleMake}</Descriptions.Item>
            <Descriptions.Item label="Model">{data.vehicleModel}</Descriptions.Item>
            <Descriptions.Item label="Engine No">{data.vehicleEngineNo}</Descriptions.Item>
            <Descriptions.Item label="Serial No">{data.vehicleChassisNo}</Descriptions.Item>
            <Descriptions.Item label="Market Value">{data.vehicleMV}</Descriptions.Item>
          </>
        );
      case "MACHINERY":
        return (
          <>
            <Descriptions.Item label="Type">{data.machineryType}</Descriptions.Item>
            <Descriptions.Item label="Model">{data.machineryModel}</Descriptions.Item>
            <Descriptions.Item label="Engine No">{data.machineryEngineNo}</Descriptions.Item>
            <Descriptions.Item label="Serial No">{data.machinerySerialNo}</Descriptions.Item>
            <Descriptions.Item label="Market Value">{data.machineryMV}</Descriptions.Item>
          </>
        );
      case "BANK_GUARANTEE":
        return (
          <>
            <Descriptions.Item label="Type">{data.bankGuaranteeType}</Descriptions.Item>
            <Descriptions.Item label="Institution">{data.institutionName}</Descriptions.Item>
            <Descriptions.Item label="Value">{data.guaranteeValue}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{dayjs(data.startDate).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="Expiry Date">{dayjs(data.expiryDate).format('YYYY-MM-DD')}</Descriptions.Item>
          </>
        );
      case "PROPERTY_MORTGAGE":
        return (
          <>
            <Descriptions.Item label="Type">{data.propertyType}</Descriptions.Item>
            <Descriptions.Item label="Market Value">{data.propertyMarketValue}</Descriptions.Item>
            <Descriptions.Item label="FSV">{data.propertyFSV}</Descriptions.Item>
          </>
        );
      case "SAVINGS":
        return (
          <>
            <Descriptions.Item label="Type">{data.savingsType}</Descriptions.Item>
            <Descriptions.Item label="Account No">{data.savingsNo}</Descriptions.Item>
            <Descriptions.Item label="Amount">{data.savingsAmount}</Descriptions.Item>
            <Descriptions.Item label="Build Up Value">{data.savingsBuildUpValue}</Descriptions.Item>
            <Descriptions.Item label="Company">{data.savingsCompany}</Descriptions.Item>
          </>
        );
      case "LAND_STOCK":
        return (
          <>
            <Descriptions.Item label="Type">{data.landStockType}</Descriptions.Item>
            <Descriptions.Item label="Deed No">{data.landStockDeedTransferNo}</Descriptions.Item>
            <Descriptions.Item label="Agreement No">{data.landStockAgreementNo}</Descriptions.Item>
            <Descriptions.Item label="Market Value">{data.landStockMarketValue}</Descriptions.Item>
            <Descriptions.Item label="FSV">{data.landStockFSV}</Descriptions.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      title={`${securityType.charAt(0) + securityType.slice(1).toLowerCase().replace('_', ' ')} Details`}
      extra={
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={onUpdate}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
          />
        </Space>
      }
    >
      <Descriptions column={1}>
        {renderDetails()}
      </Descriptions>
    </Card>
  );
};

export default DetailsCard; 