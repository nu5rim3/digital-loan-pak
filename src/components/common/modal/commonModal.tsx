import React from "react";
import { Modal } from "antd";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title: string;
  size?: "small" | "medium" | "large" | "xlarge";
  footer: boolean;
  centered?: boolean;
}

const sizeMap = {
  small: 400,
  medium: 600,
  large: 800,
  xlarge: 1400,
};

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  children,
  title,
  size = "medium",
  footer = null,
  centered,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      destroyOnClose
      title={title}
      width={sizeMap[size]}
      footer={footer ? null : undefined}
      centered={centered ?? false}
    >
      {children}
    </Modal>
  );
};

export default CommonModal;
