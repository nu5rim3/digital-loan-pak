import React, { useState } from "react";
import { Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { CustomerRiskProfilingFormData } from "./types";
import CustomerRiskProfilingModal from "./CustomerRiskProfilingModal";
import DetailsCard from "./DetailsCard";

const CustomerRiskProfiling: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"save" | "update" | "remove">("save");
  const [selectedDetail, setSelectedDetail] = useState<CustomerRiskProfilingFormData | null>(null);
  const [profiles, setProfiles] = useState<CustomerRiskProfilingFormData[]>([]);

  const formMethods = useForm<CustomerRiskProfilingFormData>();

  const openModal = (mode: "save" | "update" | "remove", detail?: CustomerRiskProfilingFormData) => {
    setMode(mode);
    if (detail) {
      setSelectedDetail(detail);
      formMethods.reset(detail);
    } else {
      setSelectedDetail(null);
      formMethods.reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    formMethods.reset();
    setSelectedDetail(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (data: CustomerRiskProfilingFormData) => {
    try {
      if (mode === "save") {
        setProfiles([...profiles, { ...data, id: Date.now() }]);
      } else if (mode === "update" && selectedDetail) {
        setProfiles(profiles.map(profile => 
          profile.id === selectedDetail.id ? { ...data, id: profile.id } : profile
        ));
      }
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleRemove = async () => {
    try {
      if (selectedDetail) {
        setProfiles(profiles.filter(profile => profile.id !== selectedDetail.id));
        closeModal();
      }
    } catch (error) {
      console.error("Error removing profile:", error);
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
          Add Customer Risk Profiling
        </Button>
      </div>

      <div className="my-4">
        {profiles.length === 0 ? (
          <Empty description="No Customer Risk Profiling Added" />
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {profiles.map((profile) => (
              <DetailsCard
                key={profile.id}
                detail={profile}
                onEdit={() => openModal("update", profile)}
                onRemove={() => openModal("remove", profile)}
              />
            ))}
          </div>
        )}
      </div>

      <CustomerRiskProfilingModal
        mode={mode}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        formMethods={formMethods}
        onSubmit={handleFormSubmit}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default CustomerRiskProfiling;
