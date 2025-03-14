import { Button } from 'antd';
import React, { useState } from 'react'
import CRIBDetails from './CRIBDetails';
import CustomerDetails from './CustomerDetails';
import ExceptionalApproval from './ExceptionalApproval';
import Verification from './Verification';
import NADRAModal from '../../../../components/common/modal/NADRAModal';
import OTPModal from '../../../../components/common/modal/OTPModal';
import MSASVerification from './MSASVerification';
import { QrcodeOutlined } from '@ant-design/icons';

const CustomerOnboarding: React.FC = () => {
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [nadraModalOpen, setNadraModalOpen] = useState(false)
    return (
        <>
            <div className='flex flex-col gap-3'>
                <div>
                    <CustomerDetails />
                </div>
                <div>
                    <MSASVerification />
                </div>
                <div>
                    <Verification />
                </div>
                <div>
                    <CRIBDetails />
                </div>
                <div>
                    <ExceptionalApproval />
                </div>
                <div className='flex gap-3'>
                    <Button type="primary" loading={false} onClick={() => setOtpModalOpen(true)}>Approval</Button>
                    <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />}>View NADRA QR</Button>
                </div>

            </div>
            <OTPModal visible={otpModalOpen} onCancel={() => setOtpModalOpen(false)} />
            <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} />
        </>
    )
}

export default CustomerOnboarding;