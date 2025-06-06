import { Button, Card, Empty, Form, Tag } from 'antd'
import React, { useEffect } from 'react'
import { ReloadOutlined } from "@ant-design/icons";
import useVerificationStore from '../../../store/verificationStore';
import { formatName, formatSentence, dateFormats } from '../../../utils/formatterFunctions';

interface IBlacklistVerification {
    idx: string;
    cnic: string;
}

const BlacklistVerification: React.FC<IBlacklistVerification> = ({ cnic }) => {


    const { blacklistDetails, fetchBlacklistByCnic, blLoading } = useVerificationStore()

    const onRefresh = () => {
        fetchBlacklistByCnic(cnic)
    }

    useEffect(() => {
        fetchBlacklistByCnic(cnic)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cnic])

    if (blacklistDetails?.detail === null) {
        return (
            <Card title={'Blacklist Verification'} loading={blLoading} extra={
                <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
            }>
                <Empty description={<span><b>Unable to find matching record</b></span>} />
            </Card>
        )
    }

    return (
        <Card title={'Blacklist Verification'} loading={blLoading} extra={
            <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
        }>
            <Form>
                <div className="grid grid-cols-2 gap-3">
                    {blacklistDetails?.detail !== null &&
                        <>
                            <Form.Item label="Name">
                                <b>{formatName(blacklistDetails?.rejectClientName ?? '-')}</b>
                            </Form.Item>
                            <Form.Item label="CNIC">
                                <b>{cnic}</b>
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
                            <Form.Item label="Blacklisted Date">
                                <b>{dateFormats(blacklistDetails?.blacklistedDate ?? '-', 'YYYY-MM-DD')}</b>
                            </Form.Item>
                            <Form.Item label="Blacklisted By">
                                <b>{blacklistDetails?.blacklistedUser ?? '-'}</b>
                            </Form.Item>

                        </>}
                </div>
            </Form>
        </Card>
    )
}

export default BlacklistVerification;