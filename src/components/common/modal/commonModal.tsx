import React from 'react';
import { Modal } from 'antd';

interface CommonModalProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title: string;
    size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
    small: 400,
    medium: 600,
    large: 800,
};

const CommonModal: React.FC<CommonModalProps> = ({ open, onClose, children, title, size = 'medium' }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={onClose}
            destroyOnClose
            title={title}
            width={sizeMap[size]}
        >
            {children}
        </Modal>
    );
};

export default CommonModal;