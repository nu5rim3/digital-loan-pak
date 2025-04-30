import { Button, Card, Descriptions, Empty, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AddRecordsModal from "./AddRecordsModal";
import useApprovalStore from "../../../../../store/approvalStore";
import { useParams } from "react-router-dom";

interface ExceptionalApprovalFormData {
  exceptionalApprovalCategory: string;
  approvePerson: string;
  remark: string;
}

interface ExceptionalApprovalRecord {
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

interface ExceptionalApprovalPersonResponse {
  code: string;
  description: string;
  status: string;
  exceptionalApprovalRoles: Array<{
    role: {
      code: string;
      description: string;
      status: string;
      roleName: string;
    };
    description: string;
    status: string;
  }>;
}

const schema = yup.object().shape({
  exceptionalApprovalCategory: yup
    .string()
    .required("Exceptional Approval Method is required"),
  approvePerson: yup.string().required("Approve Person is required"),
  remark: yup.string().required("Comment is required"),
});

interface ExceptionalApprovalProps {}

const DetailsCard: React.FC<{
  detail: ExceptionalApprovalRecord;
  onEdit: () => void;
  onRemove: () => void;
  dataArray: any[];
}> = ({ detail, onEdit, onRemove, dataArray }) => (
  <Card>
    <div className="flex justify-end gap-1">
      <Button
        type="default"
        size="small"
        icon={<EditOutlined />}
        onClick={onEdit}
      />
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

const ExceptionalApproval: React.FC<ExceptionalApprovalProps> = () => {
  const { appId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"save" | "update" | "remove">("save");
  const [selectedDetail, setSelectedDetail] =
    useState<ExceptionalApprovalRecord | null>(null);

  const {
    fetchApprovals,
    approvals,
    approvalsLoading,
    exceptionalApprovalCategories,
    ExceptionalApprovalPerson,
    requestExceptionalApproval,
    appraisalApprovalLoading,
    deleteApproval,
  } = useApprovalStore();

  const formMethods = useForm<ExceptionalApprovalFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      exceptionalApprovalCategory: "",
      approvePerson: "",
      remark: "",
    },
  });

  useEffect(() => {
    if (appId) {
      fetchApprovals(appId);
    }
  }, [appId, fetchApprovals]);

  const openModal = (
    mode: "save" | "update" | "remove",
    details: ExceptionalApprovalRecord | null = null
  ) => {
    setMode(mode);
    setSelectedDetail(details);
    setIsModalOpen(true);

    if (mode === "save") {
      formMethods.reset({
        exceptionalApprovalCategory: "",
        approvePerson: "",
        remark: "",
      });
    } else if (details) {
      formMethods.reset({
        exceptionalApprovalCategory: details.category || "",
        approvePerson: details.roleCode || "",
        remark: details.remark || "",
      });
    }
  };

  const closeModal = () => {
    formMethods.reset();
    setSelectedDetail(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (data: ExceptionalApprovalFormData) => {
    if (mode === "save" && appId) {
      const selectedCategory = exceptionalApprovalCategories.find(
        (cat) => cat.code === data.exceptionalApprovalCategory
      );

      const approvalPerson =
        ExceptionalApprovalPerson as unknown as ExceptionalApprovalPersonResponse;
      const selectedRole = approvalPerson?.exceptionalApprovalRoles?.find(
        (role) => role.role.code === data.approvePerson
      );

      const payload = {
        appraisalIdx: appId,
        type: "N/A",
        category: data.exceptionalApprovalCategory,
        remark: data.remark,
        roleCode: data.approvePerson,
        role: selectedRole?.role.roleName || "",
        categoryDec: selectedCategory?.description || "",
      };

      await requestExceptionalApproval(payload);
      await fetchApprovals(appId);
      closeModal();
    } else if (mode === "remove" && selectedDetail?.idx && appId) {
      await deleteApproval(selectedDetail.idx);
      await fetchApprovals(appId);
      closeModal();
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal("save")}
        >
          Add Exceptional Approval
        </Button>
      </div>

      <Spin spinning={approvalsLoading}>
        <div className="my-4">
          {approvals.length === 0 ? (
            <Empty description="No Exceptional Approvals Added" />
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {approvals.map((record) => (
                <DetailsCard
                  key={record.idx}
                  detail={record}
                  onEdit={() => openModal("update", record)}
                  onRemove={() => openModal("remove", record)}
                  dataArray={[]}
                />
              ))}
            </div>
          )}
        </div>

        <AddRecordsModal
          mode={mode}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          formMethods={formMethods}
          onSubmit={handleFormSubmit}
        />
      </Spin>
    </div>
  );
};

export default ExceptionalApproval;
