import { Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import ExceptionalApproval from './ExceptionalApproval';
import NADRAModal from '../../../../components/common/modal/NADRAModal';
import OTPModal from '../../../../components/common/modal/OTPModal';
import { QrcodeOutlined, CaretLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import useLoanStore from '../../../../store/loanStore';
import CRIBDetails from '../../../../components/common/verification/CRIBDetails';
import ECIBDetails from '../../../../components/common/verification/ECIBDetails';
import MSASVerification from '../../../../components/common/verification/MSASVerification';
import BlacklistVerification from '../../../../components/common/verification/BlacklistVerification';
import FormDetails from '../../../../components/common/verification/FormDetails';
// import ViewDetails from '../../../../components/common/verification/ViewDetails';
import { getStatusByName, TRule } from '../../../../utils/MSASActionFunctions';
import { mainURL } from '../../../../App';
// import useGuarantorStore from '../../../../store/guarantorStore';

const GuarantorOnboarding: React.FC = () => {
    // const { guarantor, fetchGuarantorByAppId } = useGuarantorStore()
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [nadraModalOpen, setNadraModalOpen] = useState(false)
    const [guarantorIdx, setGuarantorIdx] = useState<string | undefined>('');//CLI0000000000001, CLI0000000103821
    const [guarantorCNIC, setGuarantorCNIC] = useState<string | undefined>('');//CLI0000000001537 - 61101-2920780-9 - 37101-9830957-9
    const [approvalStatus, setApprovalStatus] = useState('PENDING');
    const [otpVerification, setOtpVerification] = useState('P');
    const [msasTrigger, setMsasTrigger] = useState(0);
    const [ruleStatus, setRuleStatus] = useState<TRule[]>([]);

    const { loan } = useLoanStore();

    const { state } = useLocation();

    const navigate = useNavigate();


    const { appId } = state as { appId: string };

    const approval = () => {

        if (otpVerification !== 'Y') {
            setOtpModalOpen(true)
        } else {
            navigate(`${mainURL}/loan/application/${appId ?? ''}`)
        }
    }

    const triggerMSAS = () => {
        setMsasTrigger(msasTrigger + 1)
    }

    useEffect(() => {
        setOtpVerification(getStatusByName('RUL_CLI_OTP_VERIFICATION', ruleStatus))

    }, [ruleStatus])

    useEffect(() => {
        if (appId === undefined) {
            navigate(-1)
        }
        // fetchGuarantorByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loan, appId])


    return (
        <>
            <div className='flex flex-col gap-3'>


                {/* {guarantor === null ?
                    <FormDetails setIdx={setGuarantorIdx} setCNIC={setGuarantorCNIC} setApprovalStatus={setApprovalStatus} type='G' />
                    :
                    <ViewDetails type='G' setIdx={setGuarantorIdx} setCnic={setGuarantorCNIC} />
                } */}

                <FormDetails setIdx={setGuarantorIdx} setCNIC={setGuarantorCNIC} setApprovalStatus={setApprovalStatus} type='G' appId={appId ?? ''} />


                {
                    guarantorIdx && <MSASVerification idx={guarantorIdx ?? ''} cnic={guarantorCNIC ?? ''} setApprovalStatus={setApprovalStatus} key={msasTrigger} setRuleStatus={setRuleStatus} />
                }

                {
                    guarantorCNIC && <BlacklistVerification idx={guarantorIdx ?? ''} cnic={guarantorCNIC ?? ''} />
                }

                {
                    guarantorCNIC && <CRIBDetails idx={guarantorIdx ?? ''} cnic={''} />//guarantorCNIC ?? 
                }

                {
                    guarantorIdx && <ECIBDetails idx={guarantorIdx ?? ''} cnic={guarantorCNIC ?? ''} />
                }

                {
                    approvalStatus === 'SPECIAL_APPROVAL' && <ExceptionalApproval setOtpModalOpen={approval} setNadraModalOpen={() => setNadraModalOpen(true)} />
                }

                {
                    approvalStatus === 'APPROVE' &&
                    <>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type="primary" loading={false} onClick={approval} icon={<CheckCircleOutlined />}>Approval</Button>
                            <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />}>Scan QR</Button>
                        </div>
                    </>
                }

                {
                    approvalStatus === 'INVALID' &&
                    <>
                        <Tag color='red' className='text-center'>Cannot proceed {guarantorIdx ?? ''} is not valid</Tag>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                        </div>
                    </>
                }

                {
                    approvalStatus === 'CLOSE' &&
                    <>
                        <Tag color='red' className='text-center'>Cannot proceed {guarantorIdx ?? ''} is not valid</Tag>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                        </div>
                    </>
                }

                {
                    approvalStatus === 'REFRESH' &&
                    <>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type="primary" loading={false} onClick={triggerMSAS} icon={<CheckCircleOutlined />}>Retry MSAS</Button>
                        </div>
                    </>
                }

                {
                    approvalStatus === 'PENDING' &&
                    <>

                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                        </div>
                    </>
                }

            </div >
            {
                guarantorIdx !== '' &&
                <>
                    <OTPModal visible={otpModalOpen} onCancel={() => setOtpModalOpen(false)} idx={guarantorIdx ?? ''} onCompleted={() => navigate(`${appId}`)} />
                    <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} cliIdx={guarantorIdx ?? ''} />
                </>
            }

        </>
    )
}

export default GuarantorOnboarding;