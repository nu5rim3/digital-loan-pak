import { Button, Card, Form, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import useVerificationStore from '../../../../store/verificationStore';
import { ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import CommonModal from '../../../../components/common/modal/commonModal';
import useCommonStore from '../../../../store/commonStore';
import { Empty } from 'antd';

interface IECIBDetails {
    customerIdx: string;
    customerCNIC: string;
}

const ECIBDetails: React.FC<IECIBDetails> = ({ customerIdx, customerCNIC }) => {

    const { ecibDetails, ecibLoading, fetchECIBById } = useVerificationStore()
    const { ecibReportUrl, fetchECIBReport } = useCommonStore()
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchECIBById(customerIdx)
        fetchECIBReport(customerCNIC)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerCNIC])

    const onRefresh = () => {
        fetchECIBById(customerIdx)
    }



    console.log('ecibDetails : ', ecibDetails);

    return (
        <>
            <Card title={'Extrenal CIB Details'} loading={ecibLoading} extra={
                <>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => setOpenModal(true)}>View Report</Button>
                    <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
                </>
            }>
                <Form>
                    <div className="grid grid-cols-3 gap-3">
                        {ecibDetails === null ? <Form.Item><b>Data not found for given clientele idx</b></Form.Item> :
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
            <CommonModal open={openModal} onClose={() => setOpenModal(false)} title={'ECIB Details'} size='large'>
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