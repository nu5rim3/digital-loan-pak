import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonModal from '../modal/commonModal';
import { formatPhoneNumber, formatCNIC, formatSentence } from '../../../utils/formatterFunctions';
import useStakeholderStore, { IRecipient } from '../../../store/stakeholderStore';
import useCommonStore from '../../../store/commonStore';
import { getDescriptionByFamilyCode } from '../../../utils/stakholderFunction';

interface IInsuranceRecipientCard {
    stkId: string
}

const schema = yup.object().shape({
    recipientName: yup.string().required('Recipent Name is required'),
    relationship: yup.string().required('Relationship is required'),
    cNicNo: yup.string().required('CNIC is required'),
    phoneNo: yup.string().required('Phone Number is required').test('len', 'Phone Number must be 11 characters', val => val?.length === 11),
});

const InsuranceRecipientCard: React.FC<IInsuranceRecipientCard> = ({ stkId }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const [selectedDetail, setSelectedDetail] = useState<IRecipient | null>(null);

    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const { relationshipLoading, relationship, fetchRelationship } = useCommonStore();
    const { recipients, recipientLoading, fetchRecipientByStkId, addRecipient, updateRecipient } = useStakeholderStore();

    const openModal = (mode: 'create' | 'edit', recipent: IRecipient | null = null) => {
        setMode(mode);
        setSelectedDetail(recipent);
        setIsModalOpen(true);
        if (recipent) {
            setValue('recipientName', recipent.recipientName ?? '');
            setValue('relationship', recipent.relationship);
            setValue('cNicNo', recipent.cNicNo);
            setValue('phoneNo', formatPhoneNumber(recipent.phoneNo));

        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IRecipient) => {
        if (mode === 'edit') {
            updateRecipient(selectedDetail?.idx ?? '', data).finally(closeModal);
        } else if (mode === 'create') {
            addRecipient(stkId, data).finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchRecipientByStkId(stkId ?? '');
        } else {
            fetchRelationship();
        }
    }, [stkId, isModalOpen, fetchRecipientByStkId, fetchRelationship]);



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
                                    <Button type="primary" onClick={() => openModal('create')} icon={<PlusOutlined />}>
                                        Add Insurance Recipient
                                    </Button>
                                </div>
                                {recipientLoading ?
                                    <div className='flex flex-1 justify-center' >
                                        <Empty description={"Loading Recipient Details..."} />
                                    </div> :
                                    <>
                                        {recipients?.length > 0 ?
                                            <div className='grid grid-cols-4 gap-4'>
                                                {recipients?.map((item, index) => (
                                                    <DetailsCard key={index} detail={item} onEdit={() => openModal('edit', item)} />
                                                ))}
                                            </div> :
                                            <div className='flex flex-1 justify-center' >
                                                <Empty description={"No Recipient Details Available"} />
                                            </div>
                                        }
                                    </>
                                }

                            </>
                        ),
                    },
                ]}
            />

            <CommonModal
                footer={true}
                open={isModalOpen}
                onClose={closeModal}
                title={`${mode === 'create' ? 'Create' : 'Update'} Recipient`}
                size="medium"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-3'>
                        <Form.Item label="Recipient Name" validateStatus={errors.recipientName ? 'error' : ''} help={errors.recipientName?.message}>
                            <Controller
                                name="recipientName"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Recipient Name" />}
                            />
                        </Form.Item>
                        <Form.Item label="CNIC" validateStatus={errors.cNicNo ? 'error' : ''} help={errors.cNicNo?.message}>
                            <Controller
                                name="cNicNo"
                                control={control}
                                render={({ field }) => <Input {...field}
                                    maxLength={15} // Max length considering dashes
                                    placeholder="xxxxx-xxxxxxx-x"
                                    onChange={(e) => {
                                        const formatted = formatCNIC(e.target.value);
                                        setValue("cNicNo", formatted, { shouldValidate: true });
                                    }}
                                />}
                            />
                        </Form.Item>
                        <Form.Item label="Contact Number" validateStatus={errors.phoneNo ? 'error' : ''} help={errors.phoneNo?.message}>
                            <Controller
                                name="phoneNo"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter Contact Number"
                                        maxLength={11}
                                        onChange={(e) => setValue('phoneNo', formatPhoneNumber(e.target.value), { shouldValidate: true })}
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Relationship" validateStatus={errors.relationship ? 'error' : ''} help={errors.relationship?.message}>
                            <Controller
                                name="relationship"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Select Relationship" loading={relationshipLoading} options={relationship.map(item => ({ label: formatSentence(item.description), value: item.code }))} />
                                )}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={relationshipLoading} icon={<SaveOutlined />}>
                            {mode === 'create' ? 'Save' : 'Update'}
                        </Button>
                        <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
                        <Button type="default" onClick={closeModal}>Cancel</Button>

                    </div>
                </Form>
            </CommonModal>
        </>
    )
}

const DetailsCard: React.FC<{ detail: IRecipient; onEdit: () => void }> = ({ detail, onEdit }) => (
    <Card>
        <div className="flex justify-end">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Recipient Name">{detail.recipientName}</Descriptions.Item>
            <Descriptions.Item label="CNIC">{detail.cNicNo}</Descriptions.Item>
            <Descriptions.Item label="Contact Number">{detail.phoneNo}</Descriptions.Item>
            <Descriptions.Item label="Relationship">{getDescriptionByFamilyCode(detail.relationship)}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default InsuranceRecipientCard