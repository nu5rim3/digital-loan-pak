import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, Form, Input, InputNumber, Select, } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatName, formatSentence } from '../../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../../store/commonStore';
import useCreditStore, { IBusinessIncome } from '../../../../../../store/creditStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
    UndoOutlined,
    CaretLeftOutlined,
    SaveOutlined
} from '@ant-design/icons';
import ContactInput from '../../../../../../components/common/inputs/ContactInput';

interface IBusinessIncomeProps {
    sourceOfIncome: string
    resetSourceOfIncome: () => void
    mode: 'save' | 'update'
    updateData: IBusinessIncome | null
}

const schema = yup.object().shape({
    profession: yup.string().required('Profession is required'),
    sourceOfIncome: yup.string().required('Source of Income is required'),
    purposeOfLoan: yup.string().required('Purpose of Facility is required'),
    bnsName: yup.string().required('Business Name is required').matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    natureOfBns: yup.string().required('Nature of Business is required'),
    bnsAddress: yup.string().required('Business Address is required'),
    phoneNo: yup.string().required('Contact Number is required').matches(/^[0-9]{11}$/, 'Contact Number must be 11 digits'),
    description: yup.string().required('Description is required'),
    prevExpInBns: yup.string().required('Previous Experience in Business is required'),
    ownOfBnsPlace: yup.string().required('Ownership of Business Place is required'),
    costOfBns: yup.string().required('Business Asset and Stock is required'),
    // bnsRatings: yup.string().required('Business Ratings is required'),
    repeatCustomer: yup.string().required('Repeat Customer is required'),
})

const BusinessIncome: React.FC<IBusinessIncomeProps> = ({ resetSourceOfIncome, sourceOfIncome, mode, updateData }) => {

    const { appId } = useParams()
    const navigate = useNavigate()

    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const { businessOwnership, businessOwnershipLoading, repeatCustomers, repeatCustomersLoading,
        natureOfBusiness, natureOfBusinessLoading,
        facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchBusinessOwnership,
        fetchRepeatCustomers } = useCommonStore()

    const { saveBusinessIncome, resetBusinessIncomeList, updateBusinessIncome } = useCreditStore()

    const onSubmit = (data: IBusinessIncome) => {
        if (mode === 'save') {
            saveBusinessIncome(appId ?? '', data).finally(() => {
                resetSourceOfIncome()
                navigate(-1)
            })
        } else if (mode === 'update') {
            const _data = { ...updateData, ...data }
            updateBusinessIncome(updateData?.idx ?? '', _data).finally(() => {
                resetSourceOfIncome()
                navigate(-1)
            })
        }
    }


    useEffect(() => {
        setValue('sourceOfIncome', sourceOfIncome)
        fetchBusinessOwnership()
        fetchRepeatCustomers()
        fetchFacilityPurpose()
        resetBusinessIncomeList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    useEffect(() => {
        if (mode === 'update' && updateData) {
            setValue('profession', updateData.profession)
            setValue('sourceOfIncome', sourceOfIncome)
            setValue('purposeOfLoan', updateData.purposeOfLoan)
            setValue('bnsName', updateData.bnsName)
            setValue('natureOfBns', updateData.natureOfBns)
            setValue('prevExpInBns', updateData.prevExpInBns)
            setValue('ownOfBnsPlace', updateData.ownOfBnsPlace)
            setValue('costOfBns', updateData.costOfBns)
            setValue('phoneNo', updateData.phoneNo)
            setValue('repeatCustomer', updateData.repeatCustomer)
            // setValue('bnsRatings', updateData.bnsRatings)
            setValue('bnsAddress', updateData.bnsAddress)
            setValue('description', updateData.description)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])




    return (
        <>
            <div className='flex flex-col gap-3'>
                <Card title={"Business Income Details"} size='small'>
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
                            <Form.Item label="Purpose of Facility" name="purposeOfLoan" validateStatus={errors.purposeOfLoan ? 'error' : ''} help={errors.purposeOfLoan?.message} required>
                                <Controller
                                    name="purposeOfLoan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Purpose of Facility"
                                            loading={facilityPurposeLoading}
                                            options={
                                                facilityPurpose.map((item) => ({ label: formatName(item.code), value: item.code }))
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Source of Income" name="sourceOfIncome" validateStatus={errors.sourceOfIncome ? 'error' : ''} help={errors.sourceOfIncome?.message} required>
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
                            <Form.Item label="Nature of Business" name="natureOfBns" validateStatus={errors.natureOfBns ? 'error' : ''} help={errors.natureOfBns?.message} required>
                                <Controller
                                    name="natureOfBns"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Nature of Business"
                                            loading={natureOfBusinessLoading}
                                            options={natureOfBusiness.map((item) => ({ label: item.description, value: item.code }))}
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
                                                { label: '8 Years', value: '8Y' },
                                                { label: '9 Years', value: '9Y' },
                                                { label: '10 Years', value: '10Y' },
                                                { label: '10 Years +', value: '10Y+' },

                                            ]}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Ownership of Business Place" name="ownOfBnsPlace" validateStatus={errors.ownOfBnsPlace ? 'error' : ''} help={errors.ownOfBnsPlace?.message} required>
                                <Controller
                                    name="ownOfBnsPlace"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Ownership of Business Place"
                                            loading={businessOwnershipLoading}
                                            options={businessOwnership.map((item) => ({ label: item.description, value: item.code }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Business Asset and Stock" name="costOfBns" validateStatus={errors.costOfBns ? 'error' : ''} help={errors.costOfBns?.message} required>
                                <Controller
                                    name="costOfBns"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            className='w-full'
                                            {...field}
                                            placeholder="Business Asset and Stock"
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

                            <Form.Item label="Contact Number" name="phoneNo" validateStatus={errors.phoneNo ? 'error' : ''} help={errors.phoneNo?.message} required>
                                <Controller
                                    name="phoneNo"
                                    control={control}
                                    render={({ field }) => (
                                        <ContactInput
                                            {...field}
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
                                            options={repeatCustomers.map((item) => ({ label: item.description, value: item.code }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            {/* Removed - Not in the DOC */}
                            {/* <Form.Item label="Business Ratings" name="bnsRatings" validateStatus={errors.bnsRatings ? 'error' : ''} help={errors.bnsRatings?.message} required>
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
                            </Form.Item> */}
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
                            <Form.Item label="Description of Business" name="description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message} required>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input.TextArea
                                            {...field}
                                            placeholder="Description of Business"
                                        />
                                    )}
                                />
                            </Form.Item>

                        </div>
                        <div className='flex'>
                            <Button type='default' icon={<CaretLeftOutlined />} onClick={() => navigate(-1)} className='mr-2'>
                                Back
                            </Button>
                            <Button type='primary' icon={<SaveOutlined />} htmlType='submit'>
                                {formatSentence(mode)} Business
                            </Button>
                            <Button type='default' className='ml-2' icon={<UndoOutlined />} onClick={() => reset()} danger>
                                Reset
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </>

    )
}

export default BusinessIncome