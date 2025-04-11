import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Select, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import CommonModal from '../modal/commonModal'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { formatPhoneNumber } from '../../../utils/formatterFunctions'
import useStakeholderStore from '../../../store/stakeholderStore'

const schema = yup.object().shape({
    phoneNoType: yup.string().required("Contact Type is required"),
    phoneNo: yup.string().required("Contact Number is required"),
    status: yup.string().default('A'),
});

interface IContactDetailsCard {
    stkId: string;
    subTitle?: string;
    stakeHolderType?: 'C' | 'G' | 'W' | "BI"
}

const ContactDetailsCard: React.FC<IContactDetailsCard> = ({ stkId, subTitle, stakeHolderType }) => {

    const [openModal, setOpenModal] = useState(false)
    const [selectedConId, setSelectedConId] = useState('');
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            status: 'A'
        }
    });

    const { stakeholder, contactDetails, contactDetailsLoading, addContactDetail, fetchContactDetailsByStkId, updateContactDetail, inActivateContactDetail } = useStakeholderStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        if (mode === 'edit') {
            updateContactDetail(selectedConId ?? '', data).finally(() => {
                reset()
                setOpenModal(false)
            })
        } else if (mode === 'create') {
            addContactDetail(stkId ?? '', [data]).finally(() => {
                reset()
                setOpenModal(false)
            })
        } else if (mode === 'remove') {
            inActivateContactDetail(selectedConId).finally(() => {
                reset()
                setOpenModal(false)
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickEdit = (item: any) => {
        setMode('edit')
        setOpenModal(true)
        setSelectedConId(item.idx ?? '')
        setValue("phoneNoType", item.phoneNoType)
        setValue("phoneNo", item.phoneNo)
        setValue("status", item.status)
    }

    const onClickCreate = () => {
        setOpenModal(true)
        setMode('create')
        setSelectedConId('')
        reset()
    }

    useEffect(() => {
        if (!openModal) {
            fetchContactDetailsByStkId(stkId ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeholder, openModal, stkId, stakeHolderType])

    if (contactDetailsLoading) {
        return (
            <Card className='flex justify-center'>
                <Empty description={"Loading Contact Details..."} />
            </Card>
        )
    }

    if (contactDetails?.length === 0) {
        return (
            <Card className='flex justify-center'>
                <Empty description={"No Contact Details Available"}
                    children={<Button type="primary" onClick={() => setOpenModal(true)} icon={<PlusOutlined />}>Add Contact</Button>} />
                <CommonModal
                    footer={true}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    title={`${mode === 'create' ? 'Create' : 'Update'} Contact`}
                    size='medium'

                >
                    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-2 gap-4 pt-5'>

                            <Form.Item label={'Contact Type'} validateStatus={errors.phoneNoType ? "error" : ""} help={errors.phoneNoType?.message} required>
                                <Controller
                                    control={control}
                                    name="phoneNoType"
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Select Contact Type" options={[
                                            { label: 'Mobile', value: 'Mobile' },
                                            { label: 'Home', value: 'Home' }
                                        ]} />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label={'Contact Number'} validateStatus={errors.phoneNo ? "error" : ""} help={errors.phoneNo?.message} required>
                                <Controller
                                    control={control}
                                    name="phoneNo"
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Enter Contact Number"
                                            maxLength={11} // Max length considering dashes
                                            onChange={(e) => {
                                                const formatted = formatPhoneNumber(e.target.value);
                                                setValue("phoneNo", formatted, { shouldValidate: true });
                                            }}
                                        />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={field.value === 'A'}
                                                onChange={(checked) => {
                                                    setValue("status", checked ? 'A' : 'I')
                                                    setMode('remove')
                                                }} />
                                            <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    )}
                                />
                            </Form.Item>


                        </div>

                        <div className='flex justify-end gap-3'>
                            <Button type="primary" htmlType='submit' loading={contactDetailsLoading}>{mode === 'create' ? 'Save' : 'Update'}</Button>
                            <Button type="default" onClick={() => setOpenModal(false)}>Cancel</Button>

                        </div>
                    </Form>
                </CommonModal>
            </Card>
        )
    }

    return (
        <>
            <Collapse
                size='small'
                defaultActiveKey={['1']}
                items={[{
                    key: 1,
                    label: `Contact Details${subTitle !== undefined ? ': ' + subTitle : ''}`,
                    // extra: <Button type="primary" className='mr-3' icon={<PlusOutlined />} onClick={onClickCreate}>Add Contact</Button>,
                    children:
                        <>
                            <div className='flex justify-end pb-3'>
                                <Button type="primary" onClick={onClickCreate} icon={<PlusOutlined />}>Add Contact</Button>
                            </div>
                            {contactDetails?.length > 0 ?
                                <div className='grid grid-cols-4 gap-4'>
                                    {contactDetails?.map((item, index) => (
                                        <Card key={index} styles={{
                                            header: { display: 'none' },
                                            body: { padding: '0px', paddingInline: '15px', paddingBlock: '10px' },
                                        }}>
                                            <div className='flex justify-end'>
                                                <Button type='default' size='small' className='ml-3' icon={<EditOutlined />} disabled={item.phoneNoType === 'OTP Phone Number'} onClick={() => onClickEdit(item)} />
                                            </div>
                                            <Descriptions column={1}>
                                                <Descriptions.Item label="Contact Type">{item.phoneNoType}</Descriptions.Item>
                                                <Descriptions.Item label="Contact Number">{item.phoneNo}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    ))}
                                </div> :
                                <div className='flex flex-1 justify-center' >
                                    <Empty description={"No Contact Details Available"} />
                                </div>
                            }</>
                }]}
            />

            <CommonModal
                footer={true}
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={`${mode === 'create' ? 'Create' : 'Update'} Contact`}
                size='medium'

            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-4 pt-5'>

                        <Form.Item label={'Contact Type'} validateStatus={errors.phoneNoType ? "error" : ""} help={errors.phoneNoType?.message} required>
                            <Controller
                                control={control}
                                name="phoneNoType"
                                render={({ field }) => (
                                    <Select {...field} placeholder="Select Contact Type" options={[
                                        { label: 'Mobile', value: 'Mobile' },
                                        { label: 'Home', value: 'Home' }
                                    ]} />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Contact Number'} validateStatus={errors.phoneNo ? "error" : ""} help={errors.phoneNo?.message} required>
                            <Controller
                                control={control}
                                name="phoneNo"
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Contact Number"
                                        maxLength={11} // Max length considering dashes
                                        onChange={(e) => {
                                            const formatted = formatPhoneNumber(e.target.value);
                                            setValue("phoneNo", formatted, { shouldValidate: true });
                                        }}
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <div className='flex items-center gap-2'>
                                        <Switch
                                            checked={field.value === 'A'}
                                            onChange={(checked) => {
                                                setValue("status", checked ? 'A' : 'I')
                                                setMode('remove')
                                            }} />
                                        <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
                                    </div>
                                )}
                            />
                        </Form.Item>


                    </div>

                    <div className='flex justify-end gap-3'>
                        <Button type="primary" htmlType='submit' loading={contactDetailsLoading}>{mode === 'create' ? 'Save' : 'Update'}</Button>
                        <Button type="default" onClick={() => setOpenModal(false)}>Cancel</Button>

                    </div>
                </Form>
            </CommonModal>
        </>
    )
}

export default ContactDetailsCard