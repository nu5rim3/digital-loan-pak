import { Button, Card, Descriptions, Empty, Form, Input, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useLoanStore, { ILiability } from '../../../../../store/loanStore';
import CommonModal from '../../../../../components/common/modal/commonModal';
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { formatCurrency, formatSentence } from '../../../../../utils/formatterFunctions';

const schema = yup.object().shape({
    institutionName: yup.string().required('Institution Name is required'),
    loanNature: yup.string().required('Loan Nature is required'),
    outstandingAmount: yup.string().required('Outstanding Amount is required'),
})
const LiabilityAffidavitForm: React.FC = () => {


    const { appId } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<ILiability | null>(null);

    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const { liabilitie, liabilityLoading, fetchLiabilities, addLiability, updateLiability, deleteLiability } = useLoanStore()

    const openModal = (mode: 'save' | 'update' | 'remove', details: ILiability | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('institutionName', details.institutionName ?? '');
            setValue('loanNature', details.loanNature);
            setValue('outstandingAmount', details.outstandingAmount);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: ILiability) => {
        if (mode === 'update') {
            updateLiability(selectedDetail?.idx ?? '', data).finally(closeModal);
        } else if (mode === 'save') {
            addLiability({
                appIdx: appId ?? '',
                liabilities: [data]
            }).finally(closeModal);
        } else if (mode === 'remove') {
            deleteLiability(selectedDetail?.idx ?? '').finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchLiabilities(appId ?? '')
        }
    }, [isModalOpen, fetchLiabilities, appId])

    return (
        <>

            <div className='flex justify-end pb-3'>
                <Tag color="red" className='text-sm flex items-center'>
                    <b>Total Outstanding Amount: {formatCurrency(Number(liabilitie?.totalAmount))}</b>
                </Tag>

                <Button type="primary" onClick={() => openModal('save')} icon={<PlusOutlined />}>
                    Add Liability Details
                </Button>
            </div>
            {liabilityLoading ?
                <div className='flex flex-1 justify-center' >
                    <Empty description={"Loading Liability Details..."} />
                </div> :
                <>
                    {liabilitie?.liabilities?.length > 0 ?
                        <div className='grid grid-cols-4 gap-4'>
                            {liabilitie.liabilities?.map((item, index) => (
                                <DetailsCard key={index} detail={item} onEdit={() => openModal('update', item)} onRemove={() => openModal('remove', item)} />
                            ))}
                        </div> :
                        <div className='flex flex-1 justify-center' >
                            <Empty description={"No Liability Details Available"} />
                        </div>
                    }
                </>
            }

            <CommonModal
                footer={true}
                open={isModalOpen}
                onClose={closeModal}
                title={`${formatSentence(mode)} Liability Affidavit Details`}
                size="large"
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-3 gap-4 pt-5">
                        <Form.Item label="Institution Name" validateStatus={errors.institutionName ? 'error' : ''} help={errors.institutionName?.message} required>
                            <Controller
                                name="institutionName"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Institution Name" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label="Loan Nature" validateStatus={errors.loanNature ? 'error' : ''} help={errors.loanNature?.message} required>
                            <Controller
                                name="loanNature"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Loan Nature" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label="Outstanding Amount" validateStatus={errors.outstandingAmount ? 'error' : ''} help={errors.outstandingAmount?.message} required>
                            <Controller
                                name="outstandingAmount"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Outstanding Amount" />
                                )}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={liabilityLoading} icon={mode === 'remove' ? <DeleteOutlined /> : <SaveOutlined />} danger={mode === 'remove'}>
                            {formatSentence(mode)}
                        </Button>
                        <Button type="default" onClick={closeModal}>Cancel</Button>
                    </div>
                </Form>

            </CommonModal>
        </>
    )
}

const DetailsCard: React.FC<{ detail: ILiability; onEdit: () => void; onRemove: () => void; }> = ({ detail, onEdit, onRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Institution Name">{detail.institutionName}</Descriptions.Item>
            <Descriptions.Item label="Loan Nature">{detail.loanNature}</Descriptions.Item>
            <Descriptions.Item label="Outstanding Amount">{formatCurrency(Number(detail.outstandingAmount))}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default LiabilityAffidavitForm