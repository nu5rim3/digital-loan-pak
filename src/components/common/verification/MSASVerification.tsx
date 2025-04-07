import { Button, Card, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { ReloadOutlined } from "@ant-design/icons";
import useVerificationStore from '../../../store/verificationStore';
import { getApprovalStatus, getVerificationStatus, TRule } from '../../../utils/MSASActionFunctions';
import StatusTag from '../tags/StatusTag';

interface IMSASVerification {
    idx: string;
    cnic: string;
    setApprovalStatus: (status: string) => void;
    setRuleStatus: (rules: TRule[]) => void;
}

const MSASVerification: React.FC<IMSASVerification> = ({ idx, setApprovalStatus, setRuleStatus }) => {

    const { msasLoading, msasDetails, fetchMSASByIdx } = useVerificationStore()
    const [verfication, setVerfication] = useState<{ name: string; status: string; }[]>([])
    const onRefresh = () => {
        fetchMSASByIdx(idx)
    }

    useEffect(() => {
        fetchMSASByIdx(idx)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx])

    useEffect(() => {
        setVerfication(getVerificationStatus(msasDetails?.rules ?? []))
        setApprovalStatus(getApprovalStatus(msasDetails?.rules ?? []))
        setRuleStatus(msasDetails?.rules ?? [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [msasDetails])


    return (
        <Card title={'MSAS Verification'} loading={msasLoading} extra={
            <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
        }>
            <Form>
                <div className="grid grid-cols-3 gap-3">
                    {
                        msasDetails === null ?
                            <Form.Item><b>Data not found for given clientele idx</b></Form.Item>
                            :
                            <>
                                {
                                    verfication.map((verify, idx) => (
                                        <Form.Item key={idx} label={verify.name}>
                                            <StatusTag status={verify.status ?? 'P'} />
                                        </Form.Item>
                                    ))
                                }
                            </>
                    }
                </div>
            </Form>
        </Card>
    )
}

export default MSASVerification