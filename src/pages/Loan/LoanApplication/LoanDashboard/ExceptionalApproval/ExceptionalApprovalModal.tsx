import { Button, Form, Select } from "antd";
import { Controller, UseFormReturn } from "react-hook-form";
import { ExceptionalApprovalFormData, ExceptionalApprovalPersonResponse, ExceptionalApprovalRole } from "./types";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import CommonModal from "../../../../../components/common/modal/commonModal";
import useApprovalStore from "../../../../../store/approvalStore";
import { PlusOutlined, UndoOutlined } from "@ant-design/icons";

interface ExceptionalApprovalModalProps {
  mode: "save" | "update" | "remove";
  isModalOpen: boolean;
  closeModal: () => void;
  formMethods: UseFormReturn<ExceptionalApprovalFormData>;
  onSubmit: (data: ExceptionalApprovalFormData) => void;
}


const ExceptionalApprovalModal: React.FC<ExceptionalApprovalModalProps> = ({
  mode,
  isModalOpen,
  closeModal,
  formMethods,
  onSubmit,
}) => {
  const {
    exceptionalApprovalCategories = [],
    exceptionalApprovalCategoriesLoading = false,
    fetchExceptionalApprovalCategories,
    ExceptionalApprovalPerson = null,
    ExceptionalApprovalPersonLoading = false,
    fetchExceptionalApprovalPerson,
    appraisalApprovalLoading,
  } = useApprovalStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = formMethods;

  const selectedCategory = watch("exceptionalApprovalCategory");

  useEffect(() => {
    fetchExceptionalApprovalCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchExceptionalApprovalPerson(selectedCategory);
    }
  }, [selectedCategory, fetchExceptionalApprovalPerson]);

  const handleClear = () => {
    reset();
  };

  const getApprovalPersonOptions = () => {
    if (
      !ExceptionalApprovalPerson ||
      !Array.isArray(
        (ExceptionalApprovalPerson as ExceptionalApprovalPersonResponse)
          ?.exceptionalApprovalRoles
      )
    ) {
      return [];
    }

    const roles = (
      ExceptionalApprovalPerson as ExceptionalApprovalPersonResponse
    ).exceptionalApprovalRoles;
    if (!roles || roles.length === 0) {
      return [];
    }

    return roles
      .filter(
        (role: ExceptionalApprovalRole) =>
          role?.status === "A" && role?.role?.status === "A"
      )
      .map((role: ExceptionalApprovalRole) => ({
        label:
          role?.role?.roleName || role?.role?.description || "Unknown Role",
        value: role?.role?.code || "",
      }))
      .filter((option) => option.value);
  };

  const getCategoryOptions = () => {
    if (!Array.isArray(exceptionalApprovalCategories)) {
      return [];
    }

    return exceptionalApprovalCategories
      .filter((item) => item?.status === "A")
      .map((item) => ({
        label: item?.description || "Unknown Category",
        value: item?.code || "",
      }))
      .filter((option) => option.value);
  };

  return (
    <CommonModal
      title={`${
        mode === "save" ? "Add" : mode === "update" ? "Update" : "Remove"
      } Term Deposit`}
      centered={true}
      footer={true}
      open={isModalOpen}
      onClose={closeModal}
      size="large"
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={"Exceptional Approval Category"}
            validateStatus={errors.exceptionalApprovalCategory ? "error" : ""}
            help={errors.exceptionalApprovalCategory?.message}
            required
          >
            <Controller
              name="exceptionalApprovalCategory"
              control={control}
              render={({ field }) => {
                const options = getCategoryOptions();

                return (
                  <Select
                    {...field}
                    placeholder="Select Exceptional Method"
                    loading={exceptionalApprovalCategoriesLoading}
                    options={options}
                    disabled={mode === "remove"}
                  />
                );
              }}
            />
          </Form.Item>

          <Form.Item
            label={"Approve Person"}
            validateStatus={errors.approvePerson ? "error" : ""}
            help={errors.approvePerson?.message}
            required
          >
            <Controller
              name="approvePerson"
              control={control}
              render={({ field }) => {
                const options = getApprovalPersonOptions();

                return (
                  <Select
                    {...field}
                    placeholder="Select Approve Person"
                    loading={ExceptionalApprovalPersonLoading}
                    options={options}
                    disabled={!selectedCategory || mode === "remove"}
                  />
                );
              }}
            />
          </Form.Item>

          <div className="">
            <Form.Item
              label="Comment"
              validateStatus={errors.remark ? "error" : ""}
              help={errors.remark?.message}
              required
            >
              <Controller
                name="remark"
                control={control}
                render={({ field }) => (
                  <TextArea {...field} disabled={mode === "remove"} />
                )}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex flex-row-reverse gap-3">
          {mode === "remove" ? (
            <Button
              type="default"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={appraisalApprovalLoading}
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
                disabled={appraisalApprovalLoading}
              >
                Clear
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={appraisalApprovalLoading}
              >
                {mode === "save" ? "Add" : "Update"}
              </Button>
            </>
          )}
        </div>
      </Form>
    </CommonModal>
  );
};

export default ExceptionalApprovalModal; 