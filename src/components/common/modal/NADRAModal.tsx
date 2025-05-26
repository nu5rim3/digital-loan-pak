import React, { useEffect } from 'react';
import { Divider, Modal, Spin } from 'antd';
import useStakeholderStore from '../../../store/stakeholderStore';


interface NADRAModalProps {
    cliIdx: string;
    open: boolean;
    onCancel: () => void;
}

const NADRAModal: React.FC<NADRAModalProps> = ({ cliIdx, open, onCancel }) => {

    const { qrdetails, qrdetailsLoading, getQRDetailsByStkId } = useStakeholderStore()

    useEffect(() => {
        if (cliIdx !== '' && cliIdx !== undefined && open) {
            getQRDetailsByStkId(cliIdx)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cliIdx, open])

    return (
        <Modal
            open={open}
            title="QR Verification"
            onCancel={onCancel}
            // onOk={onCancel}
            footer={null}
        >
            <Divider>Scan the QR code below to get verification</Divider>
            {/* Place your QR code component here */}
            <div className='flex justify-center'>
                <Spin spinning={qrdetailsLoading} size='small'>
                    <img src={qrdetails?.qrImageUrl} alt="QR Code" />
                </Spin>
            </div>
        </Modal>
    );
};

export default NADRAModal;