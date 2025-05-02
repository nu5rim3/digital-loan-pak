import { Button, Card, Descriptions } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

export interface ExceptionalApprovalRecord {
  idx: string;
  appraisalIdx: string;
  type: string;
  category: string;
  categoryDec: string;
  remark: string;
  roleCode: string;
  role: string;
  status: string;
  createdBy: string;
  creationDate: number;
  lastModifiedBy: string;
  lastModifiedDate: number;
  actionPerson: string | null;
  actionDate: number | null;
  comments: string | null;
}

interface DetailsCardProps {
  detail: ExceptionalApprovalRecord;
  onEdit: () => void;
  onRemove: () => void;
  dataArray: any[];
}

const DetailsCard: React.FC<DetailsCardProps> = ({ detail, onRemove }) => (
  <Card>
    <div className="flex justify-end gap-1">
      <Button
        type="default"
        size="small"
        icon={<DeleteOutlined />}
        onClick={onRemove}
        danger
      />
    </div>
    <Descriptions column={1}>
      <Descriptions.Item label="Approval Category">
        {detail.categoryDec ?? "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Approve Person">
        {detail.role ?? "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Comment">
        {detail.remark ?? "-"}
      </Descriptions.Item>
    </Descriptions>
  </Card>
);

export default DetailsCard;
