import { Button, Card, Form, Typography, Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import useCommonStore from '../../../store/commonStore';
import useVerificationStore from '../../../store/verificationStore';
import CommonModal from '../modal/commonModal';

interface IECIBDetails {
    idx: string;
    cnic: string;
}

const ECIBDetails: React.FC<IECIBDetails> = ({ idx, cnic }) => {

    const { ecibDetails, ecibLoading, fetchECIBById } = useVerificationStore()
    const { ecibReportUrl, fetchECIBReport } = useCommonStore()
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchECIBById(idx)
        fetchECIBReport(cnic)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cnic])

    const onRefresh = () => {
        fetchECIBById(idx)
    }

    if (ecibDetails === null) {
        return (
            <Card title={'Extrenal CIB Details'} loading={ecibLoading} extra={
                <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
            }>
                <Empty description={<span><b>No data found</b></span>} />
            </Card>
        )
    }

    return (
        <>
            <Card title={'Extrenal CIB Details'} loading={ecibLoading} extra={
                <>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => setOpenModal(true)} disabled={ecibDetails !== null}>View Report</Button>
                    <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
                </>
            }>
                <Form>
                    <div className="grid grid-cols-3 gap-3">
                        {ecibDetails !== null &&
                            <>
                                <Form.Item label="Clientele Index">
                                    <b>{ecibDetails.clienteleIdx ?? '-'}</b>
                                </Form.Item>
                                <Form.Item label="Credit History">
                                    <b>{ecibDetails.creditHistory ?? '-'}</b>
                                </Form.Item>
                                <Form.Item label="Outstanding Loan">
                                    <b>{ecibDetails.outstandingLoan ?? '-'}</b>
                                </Form.Item>
                                <Form.Item label="Status">
                                    <b>{ecibDetails.status ?? '-'}</b>
                                </Form.Item>
                            </>}
                    </div>
                </Form>
            </Card>
            <CommonModal open={openModal} onClose={() => setOpenModal(false)} title={'ECIB Details'} size='xlarge' footer={true}>
                <>
                    {
                        ecibReportUrl === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                            <Typography.Text>
                                Report not found for given CNIC
                            </Typography.Text>
                        } /> :

                            <iframe
                                src={ecibReportUrl ?? undefined}
                                width="100%"
                                height="600px"
                                style={{ border: "none" }}
                            />
                    }
                </>
            </CommonModal>
        </>
    )
}

export default ECIBDetails;