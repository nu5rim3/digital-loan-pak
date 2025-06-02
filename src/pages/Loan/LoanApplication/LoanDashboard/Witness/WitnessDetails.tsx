import React, { useEffect, useState } from 'react'
import { Button, Card, Empty, Descriptions } from "antd";
import { useParams } from 'react-router-dom';
import useStakeholderStore, { IStakeholder } from '../../../../../store/stakeholderStore';
import useWitnessStore from '../../../../../store/witnessStore';
import CommonModal from '../../../../../components/common/modal/commonModal';
import CreateWitness from '../../../../Users/Witnesses/CreateWitness';
import { PlusOutlined, EditOutlined, QrcodeOutlined } from '@ant-design/icons'
import ContactDetailsCard from '../../../../../components/common/stakeHolder/ContactDetailsCard';
import AddressDetailsCard from '../../../../../components/common/stakeHolder/AddressDetailsCard';
import NADRAModal from '../../../../../components/common/modal/NADRAModal';

interface IWitnessDetails {
    formDetails?: IStakeholder[];
}

const WitnessDetails: React.FC<IWitnessDetails> = ({ formDetails }) => {
    const [nadraModalOpen, setNadraModalOpen] = useState(false)
    const { appId } = useParams();
    const [openModal, setOpenModal] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mode, setMode] = useState('create')

    const { fetchWitnessByAppId } = useWitnessStore();
    const { fetchStackholderByAppId } = useStakeholderStore()

    useEffect(() => {
        fetchWitnessByAppId(appId ?? '')
        fetchStackholderByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId, openModal])


    // const navigate = useNavigate();

    const onClickUpdate = () => {
        setOpenModal(true)
        setMode('update')
    }

    const onClickCreate = () => {
        setOpenModal(true)
        setMode('create')
        setSelectedIndex(0)
    }

    if (formDetails?.length === 0) {
        return (
            <div>
                <Empty description={<span>Witnesses are not available. Please create a witness.</span>} children={<Button type="primary" onClick={() => setOpenModal(true)} icon={<PlusOutlined />}>Add Witness</Button>} />

                <CommonModal open={openModal} onClose={() => setOpenModal(false)} title={'Add Witness'} size='large' footer={true}>
                    <CreateWitness appId={appId ?? ''} mode='create' onClose={() => setOpenModal(false)} />
                </CommonModal>
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
                                formDetails.map((_, index) => (
                                    <Button key={index} type='primary' onClick={() => { setSelectedIndex(index) }}>
                                        Witness {index + 1}
                                    </Button>
                                ))
                            }
                        </div>

                        {
                            selectedIndex >= 0 && (
                                <div className='flex flex-col gap-3'>
                                    <Card title={`Witness ${selectedIndex + 1}`
                                    }
                                        extra={
                                            <div className='grid grid-cols-2 gap-2'>
                                                <Button type="default" onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />}>Scan QR</Button>
                                                <Button type="default" onClick={onClickUpdate} icon={<EditOutlined />}>Update Details</Button>
                                            </div>
                                        }
                                    >
                                        <Descriptions column={5}>
                                            <Descriptions.Item label="Title">{formDetails[selectedIndex].stkTitle ?? '-'}</Descriptions.Item>
                                            <Descriptions.Item label="Full Name">{formDetails[selectedIndex].stkCusName ?? '-'}</Descriptions.Item>
                                            <Descriptions.Item label="Surname Name">{formDetails[selectedIndex].stkSurName ?? '-'}</Descriptions.Item>
                                            <Descriptions.Item label="Initials">{formDetails[selectedIndex].stkInitials ?? '-'}</Descriptions.Item>
                                            <Descriptions.Item label="CNIC">{formDetails[selectedIndex].stkCNic ?? '-'}</Descriptions.Item>
                                        </Descriptions>
                                    </Card>

                                    <ContactDetailsCard stkId={formDetails[selectedIndex].idx ?? ''} subTitle={`Witness ${selectedIndex + 1}`} />

                                    <AddressDetailsCard stkId={formDetails[selectedIndex].idx ?? ''} subTitle={`Witness ${selectedIndex + 1}`} />
                                    <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} cliIdx={formDetails[selectedIndex].idx ?? ''} />
                                </div>
                            )
                        }
                    </div>
                )
            }
            <CommonModal open={openModal} onClose={() => setOpenModal(false)} title={'Add Witness'} size='large' footer={true}>
                {
                    mode === 'update' ? <CreateWitness appId={appId ?? ''} mode={mode} onClose={() => setOpenModal(false)} witnessDetails={formDetails && formDetails[selectedIndex]} /> : <CreateWitness appId={appId ?? ''} mode={mode} onClose={() => setOpenModal(false)} />
                }
            </CommonModal>
        </div>
    )
}

export default WitnessDetails