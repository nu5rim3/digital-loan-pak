import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, Descriptions, Empty, Form, Select, Spin, Switch } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonModal from '../modal/commonModal';
import useStakeholderStore, { IContactDetails } from '../../../store/stakeholderStore';
import ContactInput from '../inputs/ContactInput';

const schema = yup.object().shape({
    phoneNoType: yup.string().required('Contact Type is required'),
    phoneNo: yup.string().required('Contact Number is required').matches(/^[0-9]{11}$/, 'Contact Number must be 11 digits'),
    status: yup.string().default('A'),
});

interface IContactDetailsCard {
    stkId: string;
    subTitle?: string;
}

const ContactDetailsCard: React.FC<IContactDetailsCard> = ({ stkId, subTitle }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const [selectedContact, setSelectedContact] = useState<IContactDetails | null>(null);

    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: 'A' },
    });

    const { contactDetails, contactDetailsLoading, fetchContactDetailsByStkId, addContactDetail, updateContactDetail, inActivateContactDetail } = useStakeholderStore();
    const openModal = (mode: 'create' | 'edit', contact: IContactDetails | null = null) => {
        setMode(mode);
        setSelectedContact(contact);
        setIsModalOpen(true);
        if (contact) {
            setValue('phoneNoType', contact.phoneNoType);
            setValue('phoneNo', contact.phoneNo);
            setValue('status', contact.status ?? 'I');
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IContactDetails) => {
        if (mode === 'edit') {
            updateContactDetail(selectedContact?.idx ?? '', data).finally(closeModal);
        } else if (mode === 'create') {
            addContactDetail(stkId, [data]).finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchContactDetailsByStkId(stkId);
        }
    }, [stkId, isModalOpen, fetchContactDetailsByStkId]);

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[{
                    key: '1',
                    label: `Contact Details${subTitle ? `: ${subTitle}` : ''}`,
                    children: (
                        <>
                            <div className="flex justify-end pb-3">
                                <Button type="primary" onClick={() => openModal('create')} icon={<PlusOutlined />}>
                                    Add Contact
                                </Button>
                            </div>
                            {contactDetailsLoading ? (
                                <Spin spinning={contactDetailsLoading}>
                                    <Empty description="Loading Contact Details..." />
                                </Spin>
                            ) : contactDetails?.length ? (
                                <div className="grid grid-cols-4 gap-4">
                                    {contactDetails.map((item, index) => (
                                        <DetailsCard key={index} detail={item} onEdit={() => openModal('edit', item)} onDelete={() => inActivateContactDetail(item.idx ?? '').finally(() => fetchContactDetailsByStkId(stkId))} />
                                    ))}
                                </div>
                            ) : (
                                <Spin spinning={contactDetailsLoading}>
                                    <Empty description="No Contact Details Available" />
                                </Spin>
                            )}
                        </>
                    ),
                }]}
            />

            <CommonModal
                footer={true}
                open={isModalOpen}
                onClose={closeModal}
                title={`${mode === 'create' ? 'Create' : 'Update'} Contact`}
                size="medium"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4 pt-5">
                        <Form.Item
                            label="Contact Type"
                            validateStatus={errors.phoneNoType ? 'error' : ''}
                            help={errors.phoneNoType?.message}
                            required
                        >
                            <Controller
                                control={control}
                                name="phoneNoType"
                                render={({ field }) => (
                                    <Select {...field} placeholder="Select Contact Type" options={[
                                        { label: 'Mobile', value: 'MN' },
                                        { label: 'Office', value: 'ON' },
                                        { label: 'Fixed Line', value: 'FN' },
                                        { label: 'Additional Phone Number', value: 'APN' },
                                    ]} />
                                )}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Contact Number"
                            validateStatus={errors.phoneNo ? 'error' : ''}
                            help={errors.phoneNo?.message}
                            required
                        >
                            <Controller
                                control={control}
                                name="phoneNo"
                                render={({ field }) => (
                                    <ContactInput
                                        {...field}
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={field.value === 'A'}
                                            onChange={(checked) => {
                                                setValue('status', checked ? 'A' : 'I')
                                                setMode('remove')
                                            }}
                                        />
                                        <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
                                    </div>
                                )}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={contactDetailsLoading} icon={<SaveOutlined />}>
                            {mode === 'create' ? 'Save' : 'Update'}
                        </Button>
                        <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
                        <Button type="default" onClick={closeModal}>Cancel</Button>
                    </div>
                </Form>
            </CommonModal>
        </>
    );
};

const DetailsCard: React.FC<{ detail: IContactDetails; onEdit: () => void, onDelete: () => void }> = ({ detail, onEdit, onDelete }) => (
    <Card>
        <div className="flex justify-end">
            <Button type="default" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete()} className='mr-1' />
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} disabled={detail.phoneNoType === 'OTP Phone Number'} />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Contact Type">{detail.phoneNoType === 'MN' && 'Mobile'}{detail.phoneNoType === 'ON' && 'Office'}{detail.phoneNoType === 'FN' && 'Fixed Number'}{detail.phoneNoType === 'APN' && 'Additional Phone Number'}</Descriptions.Item>
            <Descriptions.Item label="Contact Number">{detail.phoneNo}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default ContactDetailsCard;