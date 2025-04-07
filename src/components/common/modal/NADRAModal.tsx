import React from 'react';
import { Divider, Modal, QRCode } from 'antd';


interface NADRAModalProps {
    open: boolean;
    onCancel: () => void;
}

const NADRAModal: React.FC<NADRAModalProps> = ({ open, onCancel }) => {
    return (
        <Modal
            open={open}
            title="QR Verification"
            onCancel={onCancel}
            onOk={onCancel}
        >
            <Divider>Scan the QR code below to get verification</Divider>
            {/* Place your QR code component here */}
            <div className='flex justify-center'>

                <QRCode size={200} value={'https://google.com'} />
            </div>
        </Modal>
    );
};

export default NADRAModal;