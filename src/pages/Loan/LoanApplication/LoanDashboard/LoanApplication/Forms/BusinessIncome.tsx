import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, Descriptions, Empty, Form, Input, InputNumber, Select, } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatName, formatPhoneNumber, formatSentence } from '../../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../../store/commonStore';
import useCreditStore, { IBusinessIncome } from '../../../../../../store/creditStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
    SaveOutlined,
    UndoOutlined,
    CaretLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

interface IBusinessIncomeProps {
    sourceOfIncome: string
    resetSourceOfIncome: () => void
}

const schema = yup.object().shape({
    profession: yup.string().required('Profession is required'),
    sourceOfIncome: yup.string().required('Source of Income is required'),
    purposeOfLoan: yup.string().required('Purpose of Loan is required'),
    bnsName: yup.string().required('Business Name is required'),
    natureOfBns: yup.string().required('Nature of Business is required'),
    bnsAddress: yup.string().required('Business Address is required'),
    phoneNo: yup.string().required('Phone Number is required').matches(/^[0-9]{11}$/, 'Phone Number must be 11 digits'),
    description: yup.string().required('Description is required'),
    prevExpInBns: yup.string().required('Previous Experience in Business is required'),
    ownOfBnsPlace: yup.string().required('Ownership of Business Place is required'),
    costOfBns: yup.string().required('Cost of Business is required'),
    bnsRatings: yup.string().required('Business Ratings is required'),
    repeatCustomer: yup.string().required('Repeat Customer is required'),
})

const initialValues: IBusinessIncome = {
    profession: '',
    sourceOfIncome: 'Business Income',
    purposeOfLoan: '',
    bnsName: '',
    natureOfBns: '',
    bnsAddress: '',
    phoneNo: '',
    description: '',
    prevExpInBns: '',
    ownOfBnsPlace: '',
    costOfBns: '0.00',
    bnsRatings: '',
    repeatCustomer: ''
}

const BusinessIncome: React.FC<IBusinessIncomeProps> = ({ resetSourceOfIncome, sourceOfIncome }) => {

    const { appId } = useParams()
    const navigate = useNavigate()
    const [mode, setMode] = useState<'add' | 'update' | 'remove'>('add');
    const [selectedDetail, setSelectedDetail] = useState<IBusinessIncome | null>(null);

    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const { businessOwnership, businessOwnershipLoading, repeatCustomers, repeatCustomersLoading,
        natureOfBusiness, natureOfBusinessLoading,
        facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchBusinessOwnership,
        fetchRepeatCustomers } = useCommonStore()

    const { businessIncomeLoading, businessIncomeList, addBusinessIncome, removeBusinessIncome, updateBusinessIncomeList, saveBusinessIncome, loadBusinessIncomeList, resetBusinessIncomeList } = useCreditStore()

    const onSubmit = (data: IBusinessIncome) => {
        if (mode === 'update' && selectedDetail) {
            updateBusinessIncomeList(selectedDetail._idx ?? '', data).finally(() => loadBusinessIncomeList())
            setMode('add')
        } else if (mode === 'add') {
            const _data = { ...data, _idx: uuidv4() }
            addBusinessIncome(_data).finally(() => loadBusinessIncomeList())
        }
        onFormRest()
    }

    const onFormRest = () => {
        reset(initialValues)
        setMode('add')
    }

    const onReset = () => {
        resetSourceOfIncome()
        reset(initialValues)
        setMode('add')
    }

    const onSubmitList = () => {
        saveBusinessIncome(appId ?? '', businessIncomeList).finally(() => {
            resetSourceOfIncome()
            reset(initialValues)
            setMode('add')
            navigate(-1)
            resetBusinessIncomeList()
        })
    }

    const onClickEditItem = (detail: IBusinessIncome) => {
        setMode('update')
        setSelectedDetail(detail)
        reset(detail);
    }


    useEffect(() => {
        setValue('sourceOfIncome', sourceOfIncome)
        fetchBusinessOwnership()
        fetchRepeatCustomers()
        fetchFacilityPurpose()
        resetBusinessIncomeList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])



    return (
        <>
            <div className='flex flex-col gap-3'>
                <Card title={"Business Details"} size='small'>
                    <Form layout='vertical' className='w-full' onFinish={handleSubmit(onSubmit)}>
                        <div className='grid grid-cols-4 gap-3'>
                            <Form.Item label="Profession" name="profession" validateStatus={errors.profession ? 'error' : ''} help={errors.profession?.message} required>
                                <Controller
                                    name="profession"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Profession"
                                            options={
                                                [{ label: 'Salaried', value: 'Salaried' },
                                                { label: 'Own Business', value: 'Own Business' },
                                                { label: 'Agriculture', value: 'Agriculture' },
                                                { label: 'Housewife', value: 'Housewife' },
                                                { label: 'Student', value: 'Student' }]
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Purpose Of Loan" name="purposeOfLoan" validateStatus={errors.purposeOfLoan ? 'error' : ''} help={errors.purposeOfLoan?.message} required>
                                <Controller
                                    name="purposeOfLoan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Purpose of Loan"
                                            loading={facilityPurposeLoading}
                                            options={
                                                facilityPurpose.map((item) => ({ label: formatName(item.code), value: item.code }))
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Source Of Income" name="sourceOfIncome" validateStatus={errors.sourceOfIncome ? 'error' : ''} help={errors.sourceOfIncome?.message} required>
                                <Controller
                                    name="sourceOfIncome"
                                    control={control}
                                    disabled
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Source of Income"
                                            options={
                                                [
                                                    { label: 'Agricultural Income', value: 'Agricultural Income' },
                                                    { label: 'Business Income', value: 'Business Income' },
                                                    { label: 'Salary Income', value: 'Salary Income' },
                                                    { label: 'Live Stock Income', value: 'Live Stock Income' }
                                                ]
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Business Name" name="bnsName" validateStatus={errors.bnsName ? 'error' : ''} help={errors.bnsName?.message} required>
                                <Controller
                                    name="bnsName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Business Name"
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Nature Of Business" name="natureOfBns" validateStatus={errors.natureOfBns ? 'error' : ''} help={errors.natureOfBns?.message} required>
                                <Controller
                                    name="natureOfBns"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Nature of Business"
                                            loading={natureOfBusinessLoading}
                                            options={natureOfBusiness.map((item) => ({ label: item.description, value: item.description }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Previous Experience In Business" name="prevExpInBns" validateStatus={errors.prevExpInBns ? 'error' : ''} help={errors.prevExpInBns?.message} required>
                                <Controller
                                    name="prevExpInBns"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Previous Experience In Business"
                                            options={[
                                                // add up to 10 years
                                                { label: '1 Year', value: '1Y' },
                                                { label: '2 Years', value: '2Y' },
                                                { label: '3 Years', value: '3Y' },
                                                { label: '4 Years', value: '4Y' },
                                                { label: '5 Years', value: '5Y' },
                                                { label: '6 Years', value: '6Y' },
                                                { label: '7 Years', value: '7Y' },
                                            ]}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Own Of Business Place" name="ownOfBnsPlace" validateStatus={errors.ownOfBnsPlace ? 'error' : ''} help={errors.ownOfBnsPlace?.message} required>
                                <Controller
                                    name="ownOfBnsPlace"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Own of Business Place"
                                            loading={businessOwnershipLoading}
                                            options={businessOwnership.map((item) => ({ label: item.description, value: item.description }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Cost Of Business" name="costOfBns" validateStatus={errors.costOfBns ? 'error' : ''} help={errors.costOfBns?.message} required>
                                <Controller
                                    name="costOfBns"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            className='w-full'
                                            {...field}
                                            placeholder="Cost Of Business"
                                            defaultValue='0'
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                            }
                                            parser={(value) =>
                                                value ? parseFloat(value.replace(/[^0-9.]/g, '')).toFixed(2) : ''
                                            }
                                            step={0.01}
                                            min={0}
                                            stringMode
                                            prefix="Rs."
                                        />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item label="Phone Number" name="phoneNo" validateStatus={errors.phoneNo ? 'error' : ''} help={errors.phoneNo?.message} required>
                                <Controller
                                    name="phoneNo"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Phone Number"
                                            maxLength={11}
                                            onChange={(e) => setValue('phoneNo', formatPhoneNumber(e.target.value), { shouldValidate: true })}
                                        />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item label="Repeat Customer" name="repeatCustomer" validateStatus={errors.repeatCustomer ? 'error' : ''} help={errors.repeatCustomer?.message} required>
                                <Controller
                                    name="repeatCustomer"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Repeat Customer"
                                            loading={repeatCustomersLoading}
                                            options={repeatCustomers.map((item) => ({ label: item.description, value: item.description }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Business Ratings" name="bnsRatings" validateStatus={errors.bnsRatings ? 'error' : ''} help={errors.bnsRatings?.message} required>
                                <Controller
                                    name="bnsRatings"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Business Ratings"
                                            type='number'
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Business Address" name="bnsAddress" validateStatus={errors.bnsAddress ? 'error' : ''} help={errors.bnsAddress?.message} required>
                                <Controller
                                    name="bnsAddress"
                                    control={control}
                                    render={({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Business Address"
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Description Of Business" name="description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message} required>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Description Of Business"
                                        />
                                    )}
                                />
                            </Form.Item>

                        </div>
                        <div className='flex'>
                            <Button type='primary' icon={<PlusOutlined />} htmlType='submit'>
                                {formatSentence(mode)} Business
                            </Button>
                            <Button type='default' className='ml-2' icon={<UndoOutlined />} onClick={onFormRest} danger>
                                Reset
                            </Button>
                        </div>
                    </Form>
                </Card>
                <Card size='small' title={<span>Business Details List</span>}>
                    {
                        businessIncomeList.length === 0 ? <Empty description='No Business Details Found' /> :
                            <div className='grid grid-cols-3 gap-3'>
                                {
                                    businessIncomeList.map((detail, index) => (
                                        <BusinessDetailsCard key={index} detail={detail} onEdit={() => onClickEditItem(detail)} onRemove={() => removeBusinessIncome(index)} />
                                    ))
                                }
                            </div>
                    }
                </Card>

                <div className='flex justify-start'>
                    <Button type='default' icon={<CaretLeftOutlined />} onClick={() => navigate(-1)} className='ml-2'>
                        Back
                    </Button>
                    <Button type='primary' icon={<SaveOutlined />} onClick={onSubmitList} className='ml-2' loading={businessIncomeLoading} disabled={businessIncomeList.length === 0}>
                        Save Business Income List
                    </Button>
                    <Button type='default' icon={<UndoOutlined />} onClick={onReset} className='ml-2' danger>
                        Reset
                    </Button>
                </div>
            </div>
        </>

    )
}

const BusinessDetailsCard: React.FC<{ detail: IBusinessIncome; onEdit: () => void; onRemove: () => void; }> = ({ detail, onEdit, onRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Business Name">{detail.bnsName}</Descriptions.Item>
            <Descriptions.Item label="Business Phone">{detail.phoneNo}</Descriptions.Item>
            <Descriptions.Item label="Nature Of Business">{detail.natureOfBns}</Descriptions.Item>
            <Descriptions.Item label="Business Ratings">{detail.bnsRatings}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default BusinessIncome