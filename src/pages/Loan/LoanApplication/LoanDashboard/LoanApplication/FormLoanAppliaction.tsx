import { Breadcrumb, Button, Card, Form, Input, InputNumber, Select } from 'antd'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useCommonStore from '../../../../../store/commonStore'
import { formatName, getDistrict } from '../../../../../utils/formatterFunctions'
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
import UnderConstruction from '../../../../UnderConstroction'


const FormLoanAppliaction: React.FC = () => {

    const { appId } = useParams()
    const { pathname } = useLocation()
    const cleanUrl = pathname.replace('/loan-application', '')
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit, reset, watch, setValue } = useForm({
        resolver: yupResolver(schema), defaultValues: {
            acresOwned: '0'
            , acresRented: '0'
        }
    });

    const { businessOwnership, businessOwnershipLoading, repeatCustomers, repeatCustomersLoading, salary, salaryLoading, distanceForResidenceOrWork, distanceForResidenceOrWorkLoading, jobs, jobsLoading, natureOfEmployment, natureOfEmploymentLoading, natureOfBusiness, natureOfBusinessLoading, facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchNatureOfBusiness, fetchNatureOfEmployment, fetchJobs, fetchDistanceForResidenceOrWork, fetchSalary, fetchRepeatCustomersWithProdCode, fetchBusinessOwnership, fetchRepeatCustomers, fetchOwnership } = useCommonStore()
    const { product, fetchProduct } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log(data);
    }

    useEffect(() => {
        fetchFacilityPurpose()
        fetchProduct(appId ?? '')
    }, [])

    const sourceOfIncome = watch('sourceOfIncome') // 'Agricultural Income'

    // watch('sourceOfIncome')

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
        if (sourceOfIncome === 'Agricultural Income') {
            if (product?.pTrhdLType) {
                fetchOwnership(product?.pTrhdLType ?? '')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOfIncome, product?.pTrhdLType])

    const acresOwned = watch('acresOwned');
    const acresRented = watch('acresRented');

    const loanLimitRabi = watch('loanLimitRabi');
    const loanLimitKharif = watch('loanLimitKharif');

    useEffect(() => {
        const owned = parseFloat(acresOwned ?? '') || 0;
        const rented = parseFloat(acresRented ?? '') || 0;
        setValue('acresTotal', (owned + rented).toString());
    }, [acresOwned, acresRented, setValue]);

    useEffect(() => {
        const rabi = parseFloat(loanLimitRabi ?? '') || 0;
        const kharif = parseFloat(loanLimitKharif ?? '') || 0;
        setValue('loanLimitTotal', (rabi + kharif).toString());
    }, [loanLimitRabi, loanLimitKharif, setValue]);



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

                                <div className='flex flex-col gap-3'>
                                    <Card size='small' title={
                                        // <Typography.Title type='secondary' level={5}>
                                        <span className='text-gray-600'>Nature Of The Borrower</span>
                                        // {/* </Typography.Title> */}
                                    }>
                                        <div className='grid grid-cols-3 gap-3'>
                                            <Form.Item label="Nature Of The Borrower" name="natureOfTheBorrower" validateStatus={errors.natureOfTheBorrower ? 'error' : ''} help={errors.natureOfTheBorrower?.message} required>
                                                <Controller
                                                    name="natureOfTheBorrower"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Nature of Borrower"
                                                            options={
                                                                [
                                                                    { label: 'Owner', value: 'OWNER' },
                                                                    { label: 'Tenant /Shared Cropper', value: 'TENANTCROPPER' },
                                                                    { label: 'Owner-Cum-Tenant', value: 'OWNERTENANT' }
                                                                ]
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Farm Cultivation" name="ownOfLand" validateStatus={errors.ownOfLand ? 'error' : ''} help={errors.ownOfLand?.message} required>
                                                <Controller
                                                    name="ownOfLand"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Farm Cultivation"
                                                            loading={businessOwnershipLoading}
                                                            options={businessOwnership.map((item) => ({ label: item.description, value: item.description }))}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Ownership Of Land" name="ownOfLand" validateStatus={errors.ownOfLand ? 'error' : ''} help={errors.ownOfLand?.message} required>
                                                <Controller
                                                    name="ownOfLand"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Ownership Of Land"
                                                            options={[
                                                                { label: 'Owned', value: 'OWNED' },
                                                                { label: 'Rented', value: 'RENTED' },
                                                                { label: 'Family Owned', value: 'FAMILY' },
                                                                { label: 'Leased', value: 'LEASED' }
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>

                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>Land Owner's Information</span>}>
                                        <div className='grid grid-cols-4 gap-3'>
                                            <Form.Item label="Full Name">
                                                <Controller
                                                    name="ownName"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Full Name"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="CNIC Number">
                                                <Controller
                                                    name="borrowerDistrict"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="CNIC Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Contact Number">
                                                <Controller
                                                    name="borrowerDistrict"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Contact Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Address">
                                                <Controller
                                                    name="borrowerDistrict"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input.TextArea
                                                            {...field}
                                                            placeholder="Address"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                    <Card size='small' title={<span className='text-gray-600'>Cultivated Land Area (in acres)</span>}>
                                        <div className='grid grid-cols-3 gap-3'>

                                            <Form.Item label="Acres Owned" name="acresOwned" validateStatus={errors.acresOwned ? 'error' : ''} help={errors.acresOwned?.message} required>
                                                <Controller
                                                    name="acresOwned"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Acres Owned"
                                                            defaultValue='0'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Acres Rented" name="acresRented" validateStatus={errors.acresRented ? 'error' : ''} help={errors.acresRented?.message} required>
                                                <Controller
                                                    name="acresRented"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Acres Rented"
                                                            defaultValue='0'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Total Acres" name="totalAcres" validateStatus={errors.acresTotal ? 'error' : ''} help={errors.acresTotal?.message} required>
                                                <Controller
                                                    name="acresTotal"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Total Acres"
                                                            defaultValue='0'
                                                            readOnly
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                        </div>
                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>Location of land</span>}>
                                        <div className='grid grid-cols-3 gap-3'>
                                            <Form.Item label="Location of Owned Land" name="ownLandLoc" validateStatus={errors.ownLandLoc ? 'error' : ''} help={errors.ownLandLoc?.message} required>
                                                <Controller
                                                    name="ownLandLoc"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Location of Owned Land"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Location of Rented Land" name="rentedLandLoc" validateStatus={errors.rentedLandLoc ? 'error' : ''} help={errors.rentedLandLoc?.message} required>
                                                <Controller
                                                    name="rentedLandLoc"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Location of Rented Land"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Location District" name="district" validateStatus={errors.district ? 'error' : ''} help={errors.district?.message} required>
                                                <Controller
                                                    name="district"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select a District"
                                                            options={getDistrict()} // Replace with your district options
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>

                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>Crop Details</span>}>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className='w-full'>
                                                <Card size='small' title={<span className='text-gray-600'>Rabi Crop Details</span>}>
                                                    <div className='grid grid-cols-1 gap-3'>
                                                        <Form.Item label="Rabi Crop Name" name="rabiCrop" validateStatus={errors.rabiCrop ? 'error' : ''} help={errors.rabiCrop?.message} required>
                                                            <Controller
                                                                name="rabiCrop"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Rabi Crop Name"
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Acres Of Rabi" name="acresOfRabi" validateStatus={errors.acresOfRabi ? 'error' : ''} help={errors.acresOfRabi?.message} required>
                                                            <Controller
                                                                name="acresOfRabi"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <InputNumber
                                                                        className='w-full'
                                                                        {...field}
                                                                        placeholder="Acres Of Rabi"
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Rabi Harvesting Date" name="rabiHarvestingDate" validateStatus={errors.rabiHarvestingDate ? 'error' : ''} help={errors.rabiHarvestingDate?.message} required>
                                                            <Controller
                                                                name="rabiHarvestingDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Rabi Harvesting Date"
                                                                        type='date'
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Rabi Cultivation Date" name="rabiCultivationDate" validateStatus={errors.rabiCultivationDate ? 'error' : ''} help={errors.rabiCultivationDate?.message} required>
                                                            <Controller
                                                                name="rabiCultivationDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Rabi Cultivation Date"
                                                                        type='date'
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Card>
                                            </div>
                                            <div className='w-full'>
                                                <Card size='small' title={<span className='text-gray-600'>Kharif Crop Details</span>}>
                                                    <div className='grid grid-cols-1 gap-3'>
                                                        <Form.Item label="Kharif Crop Name" name="kharifCrop" validateStatus={errors.kharifCrop ? 'error' : ''} help={errors.kharifCrop?.message} required>
                                                            <Controller
                                                                name="kharifCrop"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Kharif Crop Name"
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Acres Of Kharif" name="acresOfKharif" validateStatus={errors.acresOfKharif ? 'error' : ''} help={errors.acresOfKharif?.message} required>
                                                            <Controller
                                                                name="acresOfKharif"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <InputNumber
                                                                        className='w-full'
                                                                        {...field}
                                                                        placeholder="Acres Of Kharif"
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Kharif Harvesting Date" name="kharifHarvestingDate" validateStatus={errors.kharifHarvestingDate ? 'error' : ''} help={errors.kharifHarvestingDate?.message} required>
                                                            <Controller
                                                                name="kharifHarvestingDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Kharif Harvesting Date"
                                                                        type='date'
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Kharif Cultivation Date" name="kharifCultivationDate" validateStatus={errors.kharifCultivationDate ? 'error' : ''} help={errors.kharifCultivationDate?.message} required>
                                                            <Controller
                                                                name="kharifCultivationDate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Kharif Cultivation Date"
                                                                        type='date'
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-3 gap-3 mt-4'>

                                            <Form.Item label="Khasra Number" name="khasra" validateStatus={errors.khasra ? 'error' : ''} help={errors.khasra?.message} required>
                                                <Controller
                                                    name="khasra"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Khasra Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Khewat Number" name="khewat" validateStatus={errors.khewat ? 'error' : ''} help={errors.khewat?.message} required>
                                                <Controller
                                                    name="khewat"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Khewat Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Khtoni Number" name="khtoni" validateStatus={errors.khtoni ? 'error' : ''} help={errors.khtoni?.message} required>
                                                <Controller
                                                    name="khtoni"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Khtoni Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>SBP Indicative Loan Limit (Per Acre)</span>}>
                                        <div className='grid grid-cols-3 gap-3'>

                                            <Form.Item label="Rabi Land" name="loanLimitRabi" validateStatus={errors.loanLimitRabi ? 'error' : ''} help={errors.loanLimitRabi?.message} required>
                                                <Controller
                                                    name="loanLimitRabi"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Rabi Land"
                                                            defaultValue='0'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Khari Land" name="loanLimitKharif" validateStatus={errors.loanLimitKharif ? 'error' : ''} help={errors.loanLimitKharif?.message} required>
                                                <Controller
                                                    name="loanLimitKharif"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Khari Land"
                                                            defaultValue='0'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Total Land" name="loanLimitTotal" validateStatus={errors.loanLimitTotal ? 'error' : ''} help={errors.loanLimitTotal?.message} required>
                                                <Controller
                                                    name="loanLimitTotal"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Total Land"
                                                            defaultValue='0'
                                                            readOnly
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                        </div>
                                    </Card>

                                    <Card size='small' title={<span>Crops to be Cultivated</span>}>
                                        <div className='grid grid-cols-3 gap-3'>

                                            <Form.Item label="Crops To Be Cultivated" name="cropsToBeCult" validateStatus={errors.cropsToBeCult ? 'error' : ''} help={errors.cropsToBeCult?.message} required>
                                                <Controller
                                                    name="cropsToBeCult"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Crops To Be Cultivated"
                                                            mode='multiple'
                                                            options={
                                                                [
                                                                    { label: 'Wheat', value: 'Wheat' },
                                                                    { label: 'Rice', value: 'Rice' },
                                                                    { label: 'Sugarcane', value: 'Sugarcane' },
                                                                    { label: 'Cotton', value: 'Cotton' },
                                                                    { label: 'Maize', value: 'Maize' }
                                                                ]
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Land Details" name="landDetails" validateStatus={errors.landDetails ? 'error' : ''} help={errors.landDetails?.message} required>
                                                <Controller
                                                    name="landDetails"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Land Details"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Comment of the land" name="comment" validateStatus={errors.comment ? 'error' : ''} help={errors.comment?.message} required>
                                                <Controller
                                                    name="comment"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input.TextArea
                                                            {...field}
                                                            placeholder="Comment of the land"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Card>

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

                        {sourceOfIncome === 'Rental Income' && (
                            <Card title={"Rental Details"} size='small'>
                                <UnderConstruction />
                            </Card>
                        )}

                        {sourceOfIncome === 'Live Stock Income' && (
                            <Card title={"Live Stock Details"} size='small'>
                                <UnderConstruction />
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