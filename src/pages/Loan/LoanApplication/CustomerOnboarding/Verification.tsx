import { Button, Card, Form, Input, Tag } from 'antd'
import React, { useEffect } from 'react'
import useVerificationStore from '../../../../store/verificationStore';
import { formatName, formatSentence } from '../../../../utils/formatterFunctions';
import { ReloadOutlined } from "@ant-design/icons";

interface IBlacklistVerification {
    customerIdx: string;
    customerCNIC: string;
}

const Verification: React.FC<IBlacklistVerification> = ({ customerCNIC, customerIdx }) => {


    const { blacklistDetails, fetchBlacklistByCnic, blLoading } = useVerificationStore()

    const onRefresh = () => {
        fetchBlacklistByCnic(customerCNIC)
    }

    useEffect(() => {
        fetchBlacklistByCnic(customerCNIC)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerCNIC])


    return (
        <Card title={'Blacklist Verification'} loading={blLoading} extra={
            <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
        }>
            <Form>
                <div className="grid grid-cols-2 gap-3">
                    {blacklistDetails?.detail === null ? <Form.Item><b>{blacklistDetails.message}</b></Form.Item> :
                        <>
                            <Form.Item label="Name">
                                <b>{formatName(blacklistDetails?.rejectClientName ?? '-')}</b>
                            </Form.Item>
                            <Form.Item label="CNIC">
                                <b>{customerCNIC}</b>
                            </Form.Item>
                            <Form.Item label="Blacklist Status">
                                {
                                    blacklistDetails?.blacklistStatus === 'REJECT' &&
                                    <Tag color='red'><b>Blacklisted</b></Tag>
                                }
                                {
                                    blacklistDetails?.blacklistStatus === 'APPROVE' &&
                                    <Tag color='green'><b>Not Blacklisted</b></Tag>
                                }
                            </Form.Item>
                            <Form.Item label="Reason">
                                <b>{formatSentence(blacklistDetails?.blacklistReason ?? '-')}</b>
                            </Form.Item>

                        </>}
                </div>
            </Form>
        </Card>
    )
}

export default Verification