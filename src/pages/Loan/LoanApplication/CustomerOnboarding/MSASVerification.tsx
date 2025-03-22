import { Button, Card, Form, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import useVerificationStore from '../../../../store/verificationStore';
import { ReloadOutlined } from "@ant-design/icons";
import { getApprovalStatus, getVerificationStatus } from '../../../../utils/formatterFunctions';

interface IMSASVerification {
    customerIdx: string;
    customerCNIC: string;
    setApprovalStatus: (status: string) => void;
}

const MSASVerification: React.FC<IMSASVerification> = ({ customerIdx, setApprovalStatus }) => {

    const { msasLoading, msasDetails, fetchMSASByIdx } = useVerificationStore()
    const [verfication, setVerfication] = useState({
        isNameVerify: false,
        isCnicVerify: false
    })
    const onRefresh = () => {
        fetchMSASByIdx(customerIdx)
    }

    useEffect(() => {
        fetchMSASByIdx(customerIdx)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerIdx])

    console.log('msasDetails : ', msasDetails);

    useEffect(() => {
        setVerfication(getVerificationStatus(msasDetails?.rules ?? []))
        setApprovalStatus(getApprovalStatus(msasDetails?.rules ?? []))
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
                                <Form.Item label="Name">
                                    <b>{msasDetails.clientele.fullName ?? '-'}</b>
                                    <Tag color={verfication.isNameVerify ? 'red' : 'green'} className='ml-3'><b>{verfication.isNameVerify ? 'Not Verified' : 'Verified'}</b></Tag>
                                </Form.Item>
                                <Form.Item label="CNIC">
                                    <b>{msasDetails.clientele.identificationNumber ?? '-'}</b>
                                    <Tag color={verfication.isCnicVerify ? 'red' : 'green'} className='ml-3'><b>{verfication.isCnicVerify ? 'Not Verified' : 'Verified'}</b></Tag>
                                </Form.Item>
                                <Form.Item label="Contact Number">
                                    <b>{msasDetails.clientele.contactNumber ?? '-'}</b>
                                </Form.Item>
                            </>
                    }
                </div>
            </Form>
        </Card>
    )
}

export default MSASVerification