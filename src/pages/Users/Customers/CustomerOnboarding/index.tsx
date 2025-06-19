import { Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import ExceptionalApproval from './ExceptionalApproval';
import NADRAModal from '../../../../components/common/modal/NADRAModal';
import OTPModal from '../../../../components/common/modal/OTPModal';
import { QrcodeOutlined, CaretLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useCustomerStore from '../../../../store/customerStore';
import useLoanStore from '../../../../store/loanStore';
import CRIBDetails from '../../../../components/common/verification/CRIBDetails';
import ECIBDetails from '../../../../components/common/verification/ECIBDetails';
import MSASVerification from '../../../../components/common/verification/MSASVerification';
import BlacklistVerification from '../../../../components/common/verification/BlacklistVerification';
import FormDetails from '../../../../components/common/verification/FormDetails';
import ViewDetails from '../../../../components/common/verification/ViewDetails';
import { getStatusByName, TRule } from '../../../../utils/MSASActionFunctions';
import { mainURL } from '../../../../App';

const CustomerOnboarding: React.FC = () => {
    const { customer } = useCustomerStore()
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [nadraModalOpen, setNadraModalOpen] = useState(false)
    const [customerIdx, setCustomerIdx] = useState<string | undefined>(customer?.idx ?? '');//CLI0000000000001, CLI0000000103821
    const [customerCNIC, setCustomerCNIC] = useState<string | undefined>(customer?.identificationNumber ?? '');//CLI0000000001537 - 61101-2920780-9 - 37101-9830957-9
    const [approvalStatus, setApprovalStatus] = useState('PENDING');
    const [otpVerification, setOtpVerification] = useState('P');
    const [msasTrigger, setMsasTrigger] = useState(0);
    const [ruleStatus, setRuleStatus] = useState<TRule[]>([]);
    // const [NADRAStatus, setNADRAStatus] = useState<string | null>();
    // const [OtpStatus, setOtpStatus] = useState<string | null>();

    const { loan } = useLoanStore();

    const navigate = useNavigate();

    const approval = () => {

        if (otpVerification !== 'Y') {
            setOtpModalOpen(true)
        } else {
            navigate(`${mainURL}/loan/application/${loan?.idx ?? ''}`)
        }
    }

    const triggerMSAS = () => {
        setMsasTrigger(msasTrigger + 1)
    }

    useEffect(() => {
        // setNADRAStatus(getStatusByName('RUL_BIOMETRIC_VERIFICATION', ruleStatus))
        setOtpVerification(getStatusByName('RUL_CLI_OTP_VERIFICATION', ruleStatus))

    }, [ruleStatus])

    useEffect(() => {
        if (loan?.idx === undefined) {
            navigate(-1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loan])

    return (
        <>
            <div className='flex flex-col gap-3'>


                {customer === null ?
                    <FormDetails setIdx={setCustomerIdx} setCNIC={setCustomerCNIC} setApprovalStatus={setApprovalStatus} type='C' />
                    :
                    <ViewDetails type='C' setIdx={setCustomerIdx} setCnic={setCustomerCNIC} />
                }
                {/* have to after verification is done */}
                {
                    customerIdx && <MSASVerification idx={customerIdx ?? ''} cnic={customerCNIC ?? ''} setApprovalStatus={setApprovalStatus} key={msasTrigger} setRuleStatus={setRuleStatus} />
                }

                {
                    customerCNIC && <BlacklistVerification idx={customerIdx ?? ''} cnic={customerCNIC ?? ''} setApprovalStatus={setApprovalStatus} />
                }

                {
                    customerCNIC && <CRIBDetails idx={customerIdx ?? ''} cnic={customerCNIC ?? ''} fullName={customer?.fullName ?? ''} />
                }

                {
                    customerIdx && <ECIBDetails idx={customerIdx ?? ''} cnic={customerCNIC ?? ''} />
                }

                {
                    approvalStatus === 'SPECIAL_APPROVAL' && <ExceptionalApproval setOtpModalOpen={approval} setNadraModalOpen={() => setNadraModalOpen(true)} otpVerification={otpVerification} idx={customerIdx ?? ''} appId={loan?.idx ?? ''} />
                }

                {
                    approvalStatus === 'APPROVE' &&
                    <>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type="primary" loading={false} onClick={approval} icon={<CheckCircleOutlined />} hidden={otpVerification === 'Y'}>Approval</Button>
                            <Button type='primary' onClick={() => {
                                navigate(`${mainURL}/loan/application/${loan?.idx ?? ''}`)
                            }} icon={<QrcodeOutlined />} hidden={otpVerification === 'P'}>Calculate TC</Button>
                            <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />} >Scan QR</Button>
                        </div>
                    </>
                }

                {
                    approvalStatus === 'INVALID' &&
                    <>
                        <Tag color='red' className='text-center'><b>Cannot apply loan for {customerCNIC ?? ''} as it is not valid</b></Tag>
                        <div className='flex gap-3'>
                            <Button onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                        </div>
                    </>
                }

                {
                    approvalStatus === 'CLOSE' &&
                    <>
                        <Tag color='red' className='text-center'><b>Cannot apply loan for {customerCNIC ?? ''} as it is not valid</b></Tag>
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
                customerIdx !== '' &&
                <>
                    <OTPModal visible={otpModalOpen} onCancel={() => setOtpModalOpen(false)} idx={customerIdx ?? ''} onCompleted={triggerMSAS} resetUser={() => {
                        setCustomerIdx('')
                        setCustomerCNIC('')
                    }} />
                    <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} cliIdx={customerIdx ?? ''} />
                </>
            }

        </>
    )
}

export default CustomerOnboarding;