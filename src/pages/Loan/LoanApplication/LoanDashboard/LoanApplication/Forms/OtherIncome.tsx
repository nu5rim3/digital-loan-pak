import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, Form, Input, Select } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatName, formatSentence } from '../../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../../store/commonStore';
import useCreditStore, { IOtherIncome } from '../../../../../../store/creditStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
    SaveOutlined,
    UndoOutlined,
    CaretLeftOutlined,
} from '@ant-design/icons';

interface IOtherIncomeProps {
    sourceOfIncome: string
    resetSourceOfIncome: () => void
    mode: 'save' | 'update'
    updateData: IOtherIncome | null
}

const schema = yup.object().shape({
    profession: yup.string().required('Profession is required'),
    sourceOfIncome: yup.string().required('Source of income is required'),
    purposeOfLoan: yup.string().required('Purpose of loan is required'),
    incomeCategory: yup.string().required('Income category is required'),
    description: yup.string().required('Description is required'),
});

const OtherIncome: React.FC<IOtherIncomeProps> = ({ sourceOfIncome, resetSourceOfIncome, mode, updateData }) => {

    const { appId } = useParams()
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema)
    });

    const { facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose } = useCommonStore()
    const { otherIncomeLoading, addOtherIncome, updateOtherIncome } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (mode === 'save') {
            addOtherIncome(appId ?? '', data).finally(() => {
                onRest()
                navigate(-1)
            })
        }
        else if (mode === 'update') {
            const _data = { ...updateData, ...data }
            updateOtherIncome(updateData?.idx ?? '', _data).finally(() => {
                onRest()
                navigate(-1)
            })
        }
    }

    useEffect(() => {
        setValue('sourceOfIncome', sourceOfIncome)
        fetchFacilityPurpose()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    const onRest = () => {
        reset()
        resetSourceOfIncome()
    }

    useEffect(() => {
        if (mode === 'update' && updateData) {
            setValue('profession', updateData.profession)
            setValue('sourceOfIncome', updateData.sourceOfIncome)
            setValue('purposeOfLoan', updateData.purposeOfLoan)
            setValue('incomeCategory', updateData.incomeCategory)
            setValue('description', updateData.description)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])


    return (
        <Card size='small' title={"Other Income Details"}>
            <Form layout='vertical' onFinish={handleSubmit(onSubmit)} >
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
                    <Form.Item label="Purpose of Loan" name="purposeOfLoan" validateStatus={errors.purposeOfLoan ? 'error' : ''} help={errors.purposeOfLoan?.message} required>
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
                    {/* incomeCategory */}
                    <Form.Item label="Income Category" name="incomeCategory" validateStatus={errors.incomeCategory ? 'error' : ''} help={errors.incomeCategory?.message} required>
                        <Controller
                            name="incomeCategory"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Income Category"
                                />
                            )}
                        />
                    </Form.Item>
                    {/* description */}
                    <Form.Item label="Description" name="description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message} required>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input.TextArea
                                    {...field}
                                    placeholder="Enter Description"
                                />
                            )}
                        />
                    </Form.Item>
                </div>
                <div className='pt-5'>
                    <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                    <Button type='primary' className='ml-3' htmlType='submit' icon={<SaveOutlined />} loading={otherIncomeLoading}>
                        {formatSentence(mode)} Other Income
                    </Button>
                    <Button type='default' className='ml-3' danger icon={<UndoOutlined />} onClick={onRest}>
                        Reset
                    </Button>
                </div>
            </Form>
        </Card>
    )
}

export default OtherIncome