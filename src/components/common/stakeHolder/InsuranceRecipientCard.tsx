import { Button, Card, Collapse, Descriptions, Empty, Typography } from 'antd'
import React, { useState } from 'react'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'

interface IInsuranceRecipientCard {
    stkId?: string
}

const { Title } = Typography;

const recipientDetails = [
    {
        "idx": "REC0000000000001",
        "recipientName": "Muza Ali",
        "relationship": "5",
        "cNicNo": "34546-4546484-9",
        "phoneNo": "03051832829",
        "status": "A",
        "createdBy": "RUKHSANA.NAZ",
        "creationDate": "2022-03-25",
        "lastModifiedBy": "RUKHSANA.NAZ",
        "lastModifiedDate": "2022-03-25"
    }
]

const InsuranceRecipientCard: React.FC<IInsuranceRecipientCard> = ({ stkId }) => {

    const [openModal, setOpenModal] = useState(false)

    const onClickEdit = (item: any) => {
        // Handle edit action here
        console.log('Edit item:', item);
    }
    const onClickCreate = () => {
        // Handle create action here
        console.log('Create new item');
    }

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                className='w-full'
                items={[
                    {
                        key: '1',
                        label: `Insurance Recipient / Nominee Details`,
                        children: (
                            <>
                                <div className='flex justify-end pb-3'>
                                    <Button type="primary" onClick={() => { }} icon={<PlusOutlined />}>
                                        Add Insurance Recipient
                                    </Button>
                                </div>
                                {recipientDetails?.length > 0 ?
                                    <div className='grid grid-cols-4 gap-4'>
                                        {recipientDetails?.map((item, index) => (
                                            <Card key={index} styles={{
                                                header: { display: 'none' },
                                                body: { padding: '0px', paddingInline: '15px', paddingBlock: '10px' },
                                            }}>
                                                <div className='flex justify-end'>
                                                    <Button type='default' size='small' className='ml-3' icon={<EditOutlined />} onClick={() => onClickEdit(item)} />
                                                </div>
                                                <Descriptions column={1}>
                                                    <Descriptions.Item label="Recipient Name">{item.recipientName}</Descriptions.Item>
                                                    <Descriptions.Item label="CNIC">{item.cNicNo}</Descriptions.Item>
                                                    <Descriptions.Item label="Contact Number">{item.phoneNo}</Descriptions.Item>
                                                    <Descriptions.Item label="Relationship">{item.relationship}</Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                        ))}
                                    </div> :
                                    <div className='flex flex-1 justify-center' >
                                        <Empty description={"No Contact Details Available"} />
                                    </div>
                                }
                            </>
                        ),
                    },
                ]}
            />
        </>
    )
}

export default InsuranceRecipientCard