import { Button } from 'antd';
import React, { useState } from 'react'
import CRIBDetails from './CRIBDetails';
import CustomerDetails from './CustomerDetails';
import ExceptionalApproval from './ExceptionalApproval';
import Verification from './Verification';
import NADRAModal from '../../../../components/common/modal/NADRAModal';
import OTPModal from '../../../../components/common/modal/OTPModal';
import MSASVerification from './MSASVerification';
import { QrcodeOutlined, CaretLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ECIBDetails from './ECIBDetails';
import { useNavigate } from 'react-router-dom';

const CustomerOnboarding: React.FC = () => {
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [nadraModalOpen, setNadraModalOpen] = useState(false)
    const [customerIdx, setCustomerIdx] = useState('');//CLI0000000000001
    const [customerCNIC, setCustomerCNIC] = useState('');//CLI0000000001537 - 61101-2920780-9
    const [approvalStatus, setApprovalStatus] = useState('');

    const navigate = useNavigate();

    return (
        <>
            <div className='flex flex-col gap-3'>
                <div>
                    <CustomerDetails setCustomerIdx={setCustomerIdx} setCustomerCNIC={setCustomerCNIC} setApprovalStatus={setApprovalStatus} />
                </div>

                {
                    customerIdx && <MSASVerification customerIdx={customerIdx} customerCNIC={customerCNIC} setApprovalStatus={setApprovalStatus} />
                }

                {
                    customerCNIC && <Verification customerIdx={customerIdx} customerCNIC={customerCNIC} />
                }

                {
                    customerCNIC && <CRIBDetails customerIdx={customerIdx} customerCNIC={customerCNIC} />
                }

                {
                    customerIdx && <ECIBDetails customerIdx={customerIdx} customerCNIC={customerCNIC} />
                }

                {
                    approvalStatus === 'SPECIAL_APPROVAL' && <ExceptionalApproval />
                }

                {
                    approvalStatus === 'APPROVE' &&
                    <>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type="primary" loading={false} onClick={() => setOtpModalOpen(true)} icon={<CheckCircleOutlined />}>Approval</Button>
                            <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />}>View NADRA QR</Button>
                        </div>
                    </>
                }

            </div>
            <OTPModal visible={otpModalOpen} onCancel={() => setOtpModalOpen(false)} />
            <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} />
        </>
    )
}

export default CustomerOnboarding;