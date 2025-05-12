import React, { useState, useEffect } from "react";
import { Button, App, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FormValues, CollateralDetailsProps, validationSchema } from "./types";
import DetailsCard from "./components/DetailsCard";
import CollateralFormModal from "./components/CollateralFormModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from 'uuid';

const CollateralDetails: React.FC<CollateralDetailsProps> = () => {
  const [formData, setFormData] = useState<FormValues[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormValues | null>(null);

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      securityType: "",
    }
  });

  useEffect(() => {
    if (shouldCloseModal) {
      closeModal();
      setShouldCloseModal(false);
    }
  }, [formData, shouldCloseModal]);

  const openModal = (mode: "save" | "update", data?: FormValues) => {
    setIsEditing(mode === "update");
    if (data) {
      setEditingId(data.id || null);
      setCurrentFormData(data);
      formMethods.reset(data);
    } else {
      setEditingId(null);
      setCurrentFormData(null);
      formMethods.reset({ securityType: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    formMethods.reset({ securityType: "" });
    setEditingId(null);
    setCurrentFormData(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting data:", data);
      
      if (isEditing && editingId) {
        const updatedFormData = formData.map(item => 
          item.id === editingId ? { ...data, id: editingId } : item
        );
        setFormData(updatedFormData);
        console.log("Updated form data:", updatedFormData);
      } else {
        const newData = { ...data, id: uuidv4() };
        const updatedData = [...formData, newData];
        setFormData(updatedData);
        console.log("Added new data:", updatedData);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save collateral details:", error);
    }
  };

  const handleUpdate = (index: number) => {
    const dataToEdit = formData[index];
    openModal("update", dataToEdit);
  };

  const handleDelete = (index: number) => {
    const newData = formData.filter((_, i) => i !== index);
    setFormData(newData);
  };

  return (
    <App>
      <div>
        <div className="flex justify-end mb-6">
          <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal("save")}>
            Add Collateral
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {formData.map((data, index) => (
            <Col xs={24} sm={12} md={8} key={data.id || index}>
              <DetailsCard
                data={data}
                securityType={data.securityType || ""}
                onUpdate={() => handleUpdate(index)}
                onDelete={() => handleDelete(index)}
              />
            </Col>
          ))}
        </Row>

        <CollateralFormModal
          open={isModalOpen}
          onClose={closeModal}
          onSave={handleSubmit}
          isEdit={isEditing}
          initialData={currentFormData}
        />
      </div>
    </App>
  );
};

export default CollateralDetails;
