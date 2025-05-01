import { Button, Card, Descriptions, Empty, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DetailsCard from "./DetailsCard";
import ExceptionalApprovalModal from "./ExceptionalApprovalModal";
import useApprovalStore from "../../../../../store/approvalStore";
import { useParams } from "react-router-dom";
import { ExceptionalApprovalFormData, ExceptionalApprovalRecord, ExceptionalApprovalPersonResponse, schema } from "./types";

interface ExceptionalApprovalProps {}

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
              {approvals.map((detail) => (
                <DetailsCard
                  key={detail.idx}
                  detail={detail}
                  onEdit={() => openModal("update", detail)}
                  onRemove={() => openModal("remove", detail)}
                  dataArray={approvals}
                />
              ))}
            </div>
          )}
        </div>

        <ExceptionalApprovalModal
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
