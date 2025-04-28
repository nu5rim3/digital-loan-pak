import { Breadcrumb, Button, Card, Form, Input, Select } from 'antd'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useCommonStore from '../../../../../store/commonStore'
import { formatName } from '../../../../../utils/formatterFunctions'
import {
    // PlusOutlined,
    //  EditOutlined, 
    SaveOutlined,
    FileTextOutlined,
    UndoOutlined,
    CaretLeftOutlined
} from '@ant-design/icons';
import { schema } from './FormLoanAppliactionSchema'
import useCreditStore from '../../../../../store/creditStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'


const FormLoanAppliaction: React.FC = () => {

    const { appId } = useParams()
    const { pathname } = useLocation()
    const cleanUrl = pathname.replace('/loan-application', '')
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema),
    });

    const { businessOwnership, businessOwnershipLoading, repeatCustomers, repeatCustomersLoading, salary, salaryLoading, distanceForResidenceOrWork, distanceForResidenceOrWorkLoading, jobs, jobsLoading, natureOfEmployment, natureOfEmploymentLoading, natureOfBusiness, natureOfBusinessLoading, facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchNatureOfBusiness, fetchNatureOfEmployment, fetchJobs, fetchDistanceForResidenceOrWork, fetchSalary, fetchRepeatCustomersWithProdCode, fetchBusinessOwnership, fetchRepeatCustomers } = useCommonStore()
    const { product, fetchProduct } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log(data);
    }

    useEffect(() => {
        fetchFacilityPurpose()
        fetchProduct(appId ?? '')
    }, [])

    const sourceOfIncome = watch('sourceOfIncome')

    useEffect(() => {
        if (sourceOfIncome === 'Salary Income') {
            fetchNatureOfBusiness()
            fetchNatureOfEmployment()
            fetchJobs()
            if (product?.pTrhdLType) {
                fetchDistanceForResidenceOrWork(product?.pTrhdLType ?? '')
                fetchSalary(product?.pTrhdLType ?? '')
                fetchRepeatCustomersWithProdCode(product?.pTrhdLType ?? '')
            }
        }

        if (sourceOfIncome === 'Business Income') {
            fetchBusinessOwnership()
            fetchRepeatCustomers()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOfIncome, product?.pTrhdLType])



    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        title: 'Home',
                    },
                    {
                        title: <a onClick={() => navigate(cleanUrl)}>Loan Dashboard</a>,
                    },
                    {
                        title: 'Loan Application',
                    },
                ]}
            />
            <div className='pt-5'>
                <Card
                    title="Loan Application"
                >
                    <Form
                        layout='vertical'
                        onFinish={handleSubmit(onSubmit)}
                    >
                        <div className='grid grid-cols-3 gap-3'>
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
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Source of Income"
                                            options={
                                                [
                                                    { label: 'Agricultural Income', value: 'Agricultural Income' },
                                                    { label: 'Business Income', value: 'Business Income' },
                                                    { label: 'Rental Income', value: 'Rental Income' },
                                                    { label: 'Salary Income', value: 'Salary Income' },
                                                    { label: 'Live Stock Income', value: 'Live Stock Income' }
                                                ]
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>
                        </div>
                        {sourceOfIncome === 'Business Income' && (
                            <Card title={"Business Details"} size='small'>
                                <div className='grid grid-cols-4 gap-3'>
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
                                    {/* costOfBns */}
                                    <Form.Item label="Cost Of Business" name="costOfBns" validateStatus={errors.costOfBns ? 'error' : ''} help={errors.costOfBns?.message} required>
                                        <Controller
                                            name="costOfBns"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Cost Of Business"
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
                                    <Form.Item label="Description" name="description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message} required>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <Input.TextArea
                                                    {...field}
                                                    placeholder="Description"
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
                                                />
                                            )}
                                        />
                                    </Form.Item>

                                </div>
                            </Card>
                        )}
                        {sourceOfIncome === 'Agricultural Income' && (
                            <Card title={"Agricultural  Details"} size='small'>
                                <div className='grid grid-cols-4 gap-3'>
                                    <Form.Item label="Borrower District" name="borrowerDistrict" validateStatus={errors.borrowerDistrict ? 'error' : ''} help={errors.borrowerDistrict?.message} required>
                                        <Controller
                                            name="borrowerDistrict"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Borrower District"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Sowodo" name="sowodo" validateStatus={errors.sowodo ? 'error' : ''} help={errors.sowodo?.message} required>
                                        <Controller
                                            name="sowodo"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Sowodo"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                            </Card>
                        )}
                        {sourceOfIncome === 'Salary Income' && (
                            <Card title={"Salary Details"} size='small'>
                                <div className='grid grid-cols-4 gap-3'>
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
                                    <Form.Item label="Current Empyment Period" name="currEmpPeriod" validateStatus={errors.currEmpPeriod ? 'error' : ''} help={errors.currEmpPeriod?.message} required>
                                        <Controller
                                            name="currEmpPeriod"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Current Empyment Period"
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
                                    <Form.Item label="Type Of Job" name="typeOfJob" validateStatus={errors.typeOfJob ? 'error' : ''} help={errors.typeOfJob?.message} required>
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
                                    <Form.Item label="Nature Of Employment" name="natureOfEmp" validateStatus={errors.natureOfEmp ? 'error' : ''} help={errors.natureOfEmp?.message} required>
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
                                    <Form.Item label="Proof Of Salary" name="proofOfSalary" validateStatus={errors.proofOfSalary ? 'error' : ''} help={errors.proofOfSalary?.message} required>
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
                            </Card>
                        )}

                        <div className='pt-5'>
                            <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                            <Button type='primary' className='ml-3' htmlType='submit' icon={<SaveOutlined />}>
                                Submit
                            </Button>
                            <Button type='default' className='ml-3' danger icon={<UndoOutlined />} onClick={() => reset()}>
                                Reset
                            </Button>
                            <Button type='link' className='ml-3' icon={<FileTextOutlined />} onClick={() => { }}>
                                Add Other Income Details
                            </Button>

                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default FormLoanAppliaction