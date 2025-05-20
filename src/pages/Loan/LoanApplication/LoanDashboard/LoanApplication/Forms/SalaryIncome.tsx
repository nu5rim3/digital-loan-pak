import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, Form, Input, Select } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatName, formatPhoneNumber, formatSentence } from '../../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../../store/commonStore';
import useCreditStore, { ISalaryIncome } from '../../../../../../store/creditStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
    SaveOutlined,
    UndoOutlined,
    CaretLeftOutlined,
} from '@ant-design/icons';

interface ISalaryIncomeForm {
    sourceOfIncome: string
    resetSourceOfIncome: () => void
    mode: 'save' | 'update'
    updateData: ISalaryIncome | null
}

const schema = yup.object().shape({
    profession: yup.string().required('Profession is required'),
    sourceOfIncome: yup.string().required('Source of Income is required'),
    purposeOfLoan: yup.string().required('Purpose of Loan is required'),
    employer: yup.string().required('Employer is required'),
    typeOfBusiness: yup.string().required('Type of Business is required'),
    designation: yup.string().required('Designation is required'),
    currEmpPeriod: yup.string().required('Current Employment Period is required'),
    empAddress: yup.string().required('Employment Address is required'),
    typeOfJob: yup.string().required('Type of Job is required'),
    natureOfEmp: yup.string().required('Nature of Employment is required'),
    contactNo: yup.string().required('Phone Number is required').test('len', 'Phone Number must be 11 characters', val => val?.length === 11),
    residenceOrWorking: yup.string().required('Residence or Working is required'),
    proofOfSalary: yup.string().required('Proof of Salary is required'),
    repeatCustomer: yup.string(),
});

const SalaryIncome: React.FC<ISalaryIncomeForm> = ({ sourceOfIncome, resetSourceOfIncome, mode, updateData }) => {
    const { appId } = useParams()
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema)
    });
    const { repeatCustomers, repeatCustomersLoading,
        salary, salaryLoading, distanceForResidenceOrWork, distanceForResidenceOrWorkLoading,
        jobs, jobsLoading, natureOfEmployment, natureOfEmploymentLoading, natureOfBusiness, natureOfBusinessLoading,
        facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchNatureOfBusiness, fetchNatureOfEmployment,
        fetchJobs, fetchDistanceForResidenceOrWork, fetchSalary, fetchRepeatCustomersWithProdCode } = useCommonStore()

    const { salaryIncomeLoading, product, fetchProduct, addSalaryIncome, updateSalaryIncome } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        if (mode === 'save') {
            addSalaryIncome(appId ?? '', data).finally(() => navigate(-1))
        } else if (mode === 'update') {
            const _data = { ...updateData, ...data }
            updateSalaryIncome(appId ?? '', _data).finally(() => navigate(-1))
        }
    }

    useEffect(() => {
        fetchFacilityPurpose()
        setValue('sourceOfIncome', sourceOfIncome)
        fetchProduct(appId ?? '')
        fetchNatureOfBusiness()
        fetchNatureOfEmployment()
        fetchJobs()
        const productCode = product?.pTrhdLType ?? ''
        if (product?.pTrhdLType) {
            fetchDistanceForResidenceOrWork(productCode)
            fetchSalary(productCode)
            fetchRepeatCustomersWithProdCode(productCode)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRestFrom = () => {
        reset()
        resetSourceOfIncome()
    }


    useEffect(() => {
        if (mode === 'update' && updateData) {
            setValue('profession', updateData.profession)
            setValue('sourceOfIncome', updateData.sourceOfIncome)
            setValue('purposeOfLoan', updateData.purposeOfLoan)
            setValue('employer', updateData.employer)
            setValue('typeOfBusiness', updateData.typeOfBusiness)
            setValue('designation', updateData.designation)
            setValue('currEmpPeriod', updateData.currEmpPeriod)
            setValue('empAddress', updateData.empAddress)
            setValue('typeOfJob', updateData.typeOfJob)
            setValue('natureOfEmp', updateData.natureOfEmp)
            setValue('contactNo', updateData.contactNo)
            setValue('residenceOrWorking', updateData.residenceOrWorking)
            setValue('proofOfSalary', updateData.proofOfSalary)
            setValue('repeatCustomer', updateData.repeatCustomer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])

    return (
        <Card size='small' title={"Salary Income Details"}>
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
                    <Form.Item label="Employer Name" name="employerName" validateStatus={errors.employer ? 'error' : ''} help={errors.employer?.message} required>
                        <Controller
                            name="employer"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Employer"
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Business Type" name="employerAddress" validateStatus={errors.typeOfBusiness ? 'error' : ''} help={errors.typeOfBusiness?.message} required>
                        <Controller
                            name="typeOfBusiness"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select a Nature of Business"
                                    loading={natureOfBusinessLoading}
                                    options={natureOfBusiness.map((item) => ({ label: item.description, value: item.description }))}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Designation" name="designation" validateStatus={errors.designation ? 'error' : ''} help={errors.designation?.message} required>
                        <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Designation"
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Current Employment Period" name="currEmpPeriod" validateStatus={errors.currEmpPeriod ? 'error' : ''} help={errors.currEmpPeriod?.message} required>
                        <Controller
                            name="currEmpPeriod"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Current Employment Period"
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Employer Address" name="empAddress" validateStatus={errors.empAddress ? 'error' : ''} help={errors.empAddress?.message} required>
                        <Controller
                            name="empAddress"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Employer Address"
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Type of Job" name="typeOfJob" validateStatus={errors.typeOfJob ? 'error' : ''} help={errors.typeOfJob?.message} required>
                        <Controller
                            name="typeOfJob"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select Type of Job"
                                    loading={jobsLoading}
                                    options={jobs.map((item) => ({ label: item.description, value: item.description }))}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Nature of Employment" name="natureOfEmp" validateStatus={errors.natureOfEmp ? 'error' : ''} help={errors.natureOfEmp?.message} required>
                        <Controller
                            name="natureOfEmp"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select Nature of Employment"
                                    loading={natureOfEmploymentLoading}
                                    options={natureOfEmployment.map((item) => ({ label: item.description, value: item.description }))}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Contact No" name="contactNo" validateStatus={errors.contactNo ? 'error' : ''} help={errors.contactNo?.message} required>
                        <Controller
                            name="contactNo"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Contact No"
                                    maxLength={11}
                                    onChange={(e) => setValue('contactNo', formatPhoneNumber(e.target.value), { shouldValidate: true })}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Residence Or Working" name="residenceOrWorking" validateStatus={errors.residenceOrWorking ? 'error' : ''} help={errors.residenceOrWorking?.message} required>
                        <Controller
                            name="residenceOrWorking"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select Residence or Working"
                                    loading={distanceForResidenceOrWorkLoading}
                                    options={distanceForResidenceOrWork.map((item) => ({ label: item.description, value: item.description }))}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Proof of Salary" name="proofOfSalary" validateStatus={errors.proofOfSalary ? 'error' : ''} help={errors.proofOfSalary?.message} required>
                        <Controller
                            name="proofOfSalary"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select Proof of Salary"
                                    loading={salaryLoading}
                                    options={salary.map((item) => ({ label: item.description, value: item.description }))}
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
                </div>
                <div className='pt-5'>
                    <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                    <Button type='primary' className='ml-3' htmlType='submit' icon={<SaveOutlined />} loading={salaryIncomeLoading}>
                        {formatSentence(mode)} Salary
                    </Button>
                    <Button type='default' className='ml-3' danger icon={<UndoOutlined />} onClick={onRestFrom}>
                        Reset
                    </Button>
                </div>
            </Form>
        </Card>
    )
}

export default SalaryIncome