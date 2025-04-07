import React, { useEffect, useState } from 'react'
import { Form, Button, Card, Empty } from "antd";
import { useParams } from 'react-router-dom';
import { IStakeholder } from '../../../../../store/stakeholderStore';
import useWitnessStore from '../../../../../store/witnessStore';
import CommonModal from '../../../../../components/common/modal/commonModal';
import CreateWitness from '../../../../Users/Witnesses/CreateWitness';
import { PlusOutlined } from '@ant-design/icons'

interface IWitnessDetails {
    formDetails?: IStakeholder[];
}

const WitnessDetails: React.FC<IWitnessDetails> = ({ formDetails }) => {

    const { appId } = useParams();
    const [openModal, setOpenModal] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { witnesses, fetchWitnessByAppId } = useWitnessStore();

    useEffect(() => {
        fetchWitnessByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])


    // const navigate = useNavigate();

    console.log("Form details", formDetails);

    console.log('witnesses : ', witnesses);

    const onClickCreate = () => {
        setOpenModal(true)
    }

    if (formDetails?.length === 0) {
        return (
            <div>
                <Empty description={<span>Witnesses are not available. Please create a witness.</span>} children={<Button type="primary" onClick={onClickCreate} icon={<PlusOutlined />}>Add Witness</Button>} />
            </div>
        )
    }

    return (
        <div>

            {
                formDetails && formDetails?.length > 0 && (
                    <div className='flex flex-col gap-3'>
                        <div className='flex justify-end'>
                            <Button type="primary" onClick={onClickCreate} icon={<PlusOutlined />}>Add Witness</Button>
                        </div>
                        <div className='grid grid-cols-4 gap-3'>
                            {
                                formDetails.map((witness, index) => (
                                    <Button key={index} type='primary' onClick={() => { setSelectedIndex(index) }}>
                                        Witness {index + 1}
                                    </Button>
                                ))
                            }
                        </div>

                        {
                            selectedIndex >= 0 && (
                                <div>
                                    <Card title={`Witness ${selectedIndex + 1}`}>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <Form.Item label="First Name">
                                                {formDetails[selectedIndex].stkCusName ?? '-'}
                                            </Form.Item>
                                            <Form.Item label="Last Name">
                                                {formDetails[selectedIndex].currentResPlace ?? '-'}
                                            </Form.Item>
                                            <Form.Item label="CNIC">
                                                {formDetails[selectedIndex].stkCNic}
                                            </Form.Item>
                                            <Form.Item label="Contact Number">
                                                {formDetails[selectedIndex]?.currentResPlace ?? '-'}
                                            </Form.Item>
                                        </div>
                                    </Card>
                                </div>
                            )
                        }


                        {/* {
                            formDetails.map((witness, index) => (
                                <Card key={index} title={`Witness ${index + 1}`} className='mb-3'>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <Form.Item label="First Name">
                                            {witness.stkCusName ?? '-'}
                                        </Form.Item>
                                        <Form.Item label="Last Name">
                                            {witness.currentResPlace ?? '-'}
                                        </Form.Item>
                                        <Form.Item label="CNIC">
                                            {witness.stkCNic}
                                        </Form.Item>
                                        <Form.Item label="Contact Number">
                                            {witness?.currentResPlace ?? '-'}
                                        </Form.Item>
                                    </div>
                                </Card>
                            ))
                        } */}
                    </div>
                )
            }
            <CommonModal open={openModal} onClose={() => setOpenModal(false)} title={'Add Wintess'} size='large' footer={true}>
                <CreateWitness appId={appId ?? ''} />
            </CommonModal>
        </div>
    )
}

export default WitnessDetails