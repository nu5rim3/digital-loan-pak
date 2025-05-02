import { Breadcrumb, Button, Card, Checkbox, Descriptions, Empty, Form, Input, InputNumber, Select, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useCommonStore from '../../../../../store/commonStore'
import { formatCurrency, formatName, formatSentence, getDistrict } from '../../../../../utils/formatterFunctions'
import {
    PlusOutlined,
    EditOutlined,
    SaveOutlined,
    FileTextOutlined,
    UndoOutlined,
    CaretLeftOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { schema, schema2 } from './FormLoanAppliactionSchema'
import useCreditStore, { IOwnerships } from '../../../../../store/creditStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import UnderConstruction from '../../../../UnderConstroction'
import CommonModal from '../../../../../components/common/modal/commonModal'


const FormLoanAppliaction: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<IOwnerships | null>(null);
    const { appId } = useParams()
    const { pathname } = useLocation()
    const cleanUrl = pathname.replace('/loan-application', '')
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit, reset, watch, setValue } = useForm({
        resolver: yupResolver(schema), defaultValues: {
            acresOwned: '0',
            acresRented: '0',
            acresTotal: '0',
            loanLimitRabi: '0',
            loanLimitKharif: '0',
            loanLimitTotal: '0',
        }
    });

    const { control: ownerControl, formState: { errors: ownerError }, handleSubmit: ownerSubmit, reset: ownerReset, watch: ownerWatch, setValue: ownerSetValue } = useForm({
        resolver: yupResolver(schema2), defaultValues: {
            amount: '0.00',
            qty: 1,
            totalAmount: '0.00',
        }
    });

    const { marketCheck, marketCheckLoading, cultLoanPurposes, cultLoanPurposesLoading, agriMethods, agriMethodsLoading, proofOfCultivation, proofOfCultivationLoading, floodsFactor, floodsFactorLoading, irrigation, irrigationLoading, businessOwnership, businessOwnershipLoading, repeatCustomers, repeatCustomersLoading,
        salary, salaryLoading, distanceForResidenceOrWork, distanceForResidenceOrWorkLoading,
        jobs, jobsLoading, natureOfEmployment, natureOfEmploymentLoading, natureOfBusiness, natureOfBusinessLoading,
        facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchNatureOfBusiness, fetchNatureOfEmployment,
        fetchJobs, fetchDistanceForResidenceOrWork, fetchSalary, fetchRepeatCustomersWithProdCode, fetchBusinessOwnership,
        fetchRepeatCustomers, fetchOwnership, fetchIrrigation, fetchFloodsFactor, fetchProofOfCultivation, fetchAgriMethods, fetchCultLoanPurposes,
        fetchMarketCheck } = useCommonStore()

    const { businessIncomeList, ownerships, product, fetchProduct, addOwnerships, updateOwnerships, removeOwnerships, addSalaryIncome, addBusinessIncome } = useCreditStore()

    const openModal = (mode: 'save' | 'update' | 'remove', details: IOwnerships | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            ownerSetValue('ownership', details.ownership);
            ownerSetValue('qty', Number(details.qty));
            ownerSetValue('amount', details.amount);
            ownerSetValue('totalAmount', details.totalAmount ?? '0.00');
        } else {
            ownerReset();
        }
    };



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const actionMap: any = {
            'Salary Income': () => addSalaryIncome(appId ?? '', data),
            'Agricultural Income': () => console.log('Agricultural Income: ', data),
            'Business Income': () => addBusinessIncome(data),
            'Live Stock Income': () => console.log('Live Stock Income: ', data),
        }
        const action = actionMap[data.sourceOfIncome] ?? '';
        if (action) {
            action().finally(() => {
                // reset();
                // navigate(cleanUrl);
            });
        } else {
            // navigate(cleanUrl);
        }
    }

    console.log('businessIncomeList', businessIncomeList);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOwnerSubmit = (data: any) => {

        if (mode === 'update') {
            updateOwnerships(selectedDetail?.ownership ?? '', { ...data }).finally(closeModal)
        } else if (mode === 'save') {
            addOwnerships(data).finally(closeModal).finally(closeModal)
        } else if (mode === 'remove') {
            removeOwnerships(selectedDetail?.ownership ?? '').finally(closeModal)
        }

    }

    const closeModal = () => {
        ownerReset();
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchFacilityPurpose()
        fetchProduct(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sourceOfIncome = watch('sourceOfIncome') // 'Agricultural Income'

    // watch('sourceOfIncome')

    useEffect(() => {
        if (sourceOfIncome === 'Salary Income') {
            fetchNatureOfBusiness()
            fetchNatureOfEmployment()
            fetchJobs()
            const productCode = product?.pTrhdLType ?? ''
            if (product?.pTrhdLType) {
                fetchDistanceForResidenceOrWork(productCode)
                fetchSalary(productCode)
                fetchRepeatCustomersWithProdCode(productCode)
            }
        }

        if (sourceOfIncome === 'Business Income') {
            fetchBusinessOwnership()
            fetchRepeatCustomers()
        }
        if (sourceOfIncome === 'Agricultural Income') {
            const productCode = 'ZA'//product?.pTrhdLType ?? ''
            if (product?.pTrhdLType) {
                fetchOwnership(productCode)
                fetchIrrigation(productCode)
                fetchFloodsFactor(productCode)
                fetchProofOfCultivation(productCode)
                fetchAgriMethods(productCode)
                fetchCultLoanPurposes(productCode)
                fetchMarketCheck(productCode)
                fetchRepeatCustomersWithProdCode(productCode)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOfIncome, product?.pTrhdLType])

    const acresOwned = watch('acresOwned');
    const acresRented = watch('acresRented');

    const loanLimitRabi = watch('loanLimitRabi');
    const loanLimitKharif = watch('loanLimitKharif');

    const isAgriSecured = watch('isAgriSecured');

    const qty = ownerWatch('qty');
    const amount = ownerWatch('amount');

    useEffect(() => {
        if (!isAgriSecured) {
            setValue('agriSecured', '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAgriSecured])


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


    useEffect(() => {
        const perAmount = parseFloat(amount ?? '') || 0;
        const qtyValue = parseFloat(qty?.toString() ?? '') || 0;
        ownerSetValue('totalAmount', (perAmount * qtyValue).toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qty, amount])


    useEffect(() => {
        if (ownerships.length > 0) {
            const totalAmount = ownerships.reduce((acc, item) => acc + parseFloat(item.totalAmount ?? '0'), 0);
            setValue('totAssetsValue', totalAmount.toString());
        } else {
            setValue('totAssetsValue', '0');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerships])


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
                            <div className='flex flex-col gap-3'>
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

                                    </div>
                                    {/* TODO: formSubmit and add the detail to business detail array */}
                                    <div className='flex'>
                                        <Button type='primary' icon={<SaveOutlined />} htmlType='submit'>
                                            Save Business
                                        </Button>
                                        <Button type='default' className='ml-2' icon={<UndoOutlined />} onClick={() => reset()} danger>
                                            Reset
                                        </Button>
                                    </div>
                                </Card>
                                <Card size='small' title={<span>Business Details List</span>}>
                                    <Empty description='No Business Details Found' />
                                    {/* TODO: show as edit remove card list of business detail array */}
                                    {/* <BusinessDetailsCard /> */}
                                </Card>
                            </div>
                        )}
                        {sourceOfIncome === 'Agricultural Income' && (
                            <Card title={"Agricultural  Details"} size='small'>

                                <div className='flex flex-col gap-3'>
                                    <Card size='small' title={
                                        <span className='text-gray-600'>Nature Of The Borrower</span>
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
                                            <Form.Item label="Full Name" name="ownName" validateStatus={errors.ownName ? 'error' : ''} help={errors.ownName?.message} required>
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
                                            <Form.Item label="CNIC Number" name="ownCNIC" validateStatus={errors.ownCNIC ? 'error' : ''} help={errors.ownCNIC?.message} required>
                                                <Controller
                                                    name="ownCNIC"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="CNIC Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Contact Number" name="ownContact" validateStatus={errors.ownContact ? 'error' : ''} help={errors.ownContact?.message} required>
                                                <Controller
                                                    name="ownContact"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Contact Number"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Address" name="ownAddress" validateStatus={errors.ownAddress ? 'error' : ''} help={errors.ownAddress?.message} required>
                                                <Controller
                                                    name="ownAddress"
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
                                                            options={getDistrict()}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>

                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>Crop Information</span>}>
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

                                    <Card size='small' title={<span>Basic Information</span>}>
                                        <div className='grid grid-cols-3 gap-3'>

                                            <Form.Item label="Purpose Of Cultivation Loan" name="purposeOfCultLoan" validateStatus={errors.purposeOfCultLoan ? 'error' : ''} help={errors.purposeOfCultLoan?.message} required>
                                                <Controller
                                                    name="purposeOfCultLoan"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Purpose of Cultivation Loan"
                                                            loading={cultLoanPurposesLoading}
                                                            options={cultLoanPurposes.map((item) => ({ label: formatName(item.description), value: item.description }))}
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

                                            <Form.Item label="Irrigation" name="irrigation" validateStatus={errors.irrigation ? 'error' : ''} help={errors.irrigation?.message} required>
                                                <Controller
                                                    name="irrigation"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Irrigation"
                                                            loading={irrigationLoading}
                                                            options={irrigation.map((item) => ({ label: item.description, value: item.description }))}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Floods Factor" name="floodsFactor" validateStatus={errors.floodsFactor ? 'error' : ''} help={errors.floodsFactor?.message} required>
                                                <Controller
                                                    name="floodsFactor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Floods Factor"
                                                            loading={floodsFactorLoading}
                                                            options={floodsFactor.map((item) => ({ label: item.description, value: item.description }))}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Proof Of Cultivation" name="proofOfCult" validateStatus={errors.proofOfCult ? 'error' : ''} help={errors.proofOfCult?.message} required>
                                                <Controller
                                                    name="proofOfCult"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Proof Of Cultivation"
                                                            loading={proofOfCultivationLoading}
                                                            options={proofOfCultivation.map((item) => ({ label: item.description, value: item.description }))}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Agriculturing Methods" name="methods" validateStatus={errors.methods ? 'error' : ''} help={errors.methods?.message} required>
                                                <Controller
                                                    name="methods"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Agriculturing Methods"
                                                            loading={agriMethodsLoading}
                                                            options={agriMethods.map((item) => ({ label: item.description, value: item.description }))}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Market Check" name="marketCheck" validateStatus={errors.marketCheck ? 'error' : ''} help={errors.marketCheck?.message} required>
                                                <Controller
                                                    name="marketCheck"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Market Check"
                                                            loading={marketCheckLoading}
                                                            options={marketCheck.map((item) => ({ label: item.description, value: item.description }))}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Experience In Cultivation" name="expInCult" validateStatus={errors.expInCult ? 'error' : ''} help={errors.expInCult?.message} required>
                                                <Controller
                                                    name="expInCult"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Select Experience In Cultivation"
                                                            options={[
                                                                { label: '1 Year', value: '1Y' },
                                                                { label: '2 Years', value: '2Y' },
                                                                { label: '3 Years', value: '3Y' },
                                                                { label: '4 Years', value: '4Y' },
                                                                { label: '5 Years', value: '5Y' },
                                                                { label: '6 Years', value: '6Y' },
                                                                { label: '7 Years', value: '7Y' },
                                                                { label: '8 Years', value: '8Y' },
                                                                { label: '9 Years', value: '9Y' },
                                                                { label: '10 Years', value: '10Y' }
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <div className='flex'>
                                                <div className='flex flex-2/5'>
                                                    <Form.Item label="Is Agriculture Secured" name="isAgriSecured" validateStatus={errors.isAgriSecured ? 'error' : ''} help={errors.isAgriSecured?.message} tooltip={'Is agri passbook available'}>
                                                        <Controller
                                                            name="isAgriSecured"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Checkbox
                                                                    {...field}
                                                                />
                                                            )}
                                                        />
                                                    </Form.Item>
                                                </div>
                                                <div className='flex-3/5' hidden={!isAgriSecured}>
                                                    <Form.Item label="Agriculture Pass Book Number" name="agriSecured" validateStatus={errors.agriSecured ? 'error' : ''} help={errors.agriSecured?.message} required>
                                                        <Controller
                                                            name="agriSecured"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Agriculture Pass Book Number"
                                                                />
                                                            )}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>

                                        </div>
                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>Ownerships</span>}>
                                        <div className='flex justify-end'>
                                            <Button type='primary' onClick={() => openModal('save')} icon={<PlusOutlined />}>Add Ownership</Button>
                                        </div>

                                        {ownerships.length === 0 && (
                                            <div className='flex justify-center'>
                                                <Empty description={'No Ownership Found'} />
                                            </div>
                                        )}
                                        <div className='grid grid-cols-5 gap-3 py-3'>
                                            {ownerships !== null && ownerships.map((item, index) => (
                                                <DetailsCard
                                                    key={index}
                                                    detail={item}
                                                    onEdit={() => openModal('update', item)}
                                                    onRemove={() => openModal('remove', item)}
                                                />
                                            ))}
                                        </div>

                                        <Form.Item label="Total Assets Value" name="totAssetsValue" validateStatus={errors.totAssetsValue ? 'error' : ''} help={errors.totAssetsValue?.message} required>
                                            <Controller
                                                name="totAssetsValue"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputNumber
                                                        className='w-1/3'
                                                        {...field}
                                                        placeholder="Total Assets Value"
                                                        defaultValue='0.00'
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
                                                        readOnly
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                    </Card>

                                    <Card size='small' title={<span className='text-gray-600'>Crop Loan Insureance Report (CLIR)</span>}>
                                        {/* loanTenure */}
                                        <div className='grid grid-cols-4 gap-3'>
                                            <Form.Item label="Loan Tenure" name="loanTenure" validateStatus={errors.loanTenure ? 'error' : ''} help={errors.loanTenure?.message} required>
                                                <Controller
                                                    name="loanTenure"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Loan Tenure"
                                                            defaultValue='360'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Insurance Company" name="insCompany" validateStatus={errors.insCompany ? 'error' : ''} help={errors.insCompany?.message} required>
                                                <Controller
                                                    name="insCompany"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Insurance Company"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Policy Issued Date" name="policyIssuedDate" validateStatus={errors.policyIssuedDate ? 'error' : ''} help={errors.policyIssuedDate?.message} required>
                                                <Controller
                                                    name="policyIssuedDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Policy Issued Date"
                                                            type='date'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Policy Expired Date" name="policyExpiredDate" validateStatus={errors.policyExpiredDate ? 'error' : ''} help={errors.policyExpiredDate?.message} required>
                                                <Controller
                                                    name="policyExpiredDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Policy Expired Date"
                                                            type='date'
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Premium Paid Receipt No" name="receiptNo" validateStatus={errors.receiptNo ? 'error' : ''} help={errors.receiptNo?.message} required>
                                                <Controller
                                                    name="receiptNo"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Premium Paid Receipt No"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            {/* premiumRate */}
                                            <Form.Item label="Premium Rate" name="premiumRate" validateStatus={errors.premiumRate ? 'error' : ''} help={errors.premiumRate?.message} required>
                                                <Controller
                                                    name="premiumRate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Premium Rate"
                                                            type='number'
                                                            suffix="%"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Premium Rate For Sugarcane" name="premiumRateForSugar" validateStatus={errors.premiumRateForSugar ? 'error' : ''} help={errors.premiumRateForSugar?.message} required>
                                                <Controller
                                                    name="premiumRateForSugar"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <InputNumber
                                                            className='w-full'
                                                            {...field}
                                                            placeholder="Premium Rate For Sugarcane"
                                                            defaultValue='0.00'
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

                                            <Form.Item label="Evidence of Land Holding" name="evidance" validateStatus={errors.evidance ? 'error' : ''} help={errors.evidance?.message} required>
                                                <Controller
                                                    name="evidance"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Evidence of Land Holding"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Number of Time Claim Loged" name="claimLodged" validateStatus={errors.claimLodged ? 'error' : ''} help={errors.claimLodged?.message} required>
                                                <Controller
                                                    name="claimLodged"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Number of Time Claim Loged"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Other Information 1" name="otherInfo1" validateStatus={errors.otherInfo1 ? 'error' : ''} help={errors.otherInfo1?.message}>
                                                <Controller
                                                    name="otherInfo1"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Other Information 1"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Other Information 2" name="otherInfo2" validateStatus={errors.otherInfo2 ? 'error' : ''} help={errors.otherInfo2?.message}>
                                                <Controller
                                                    name="otherInfo2"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Other Information 2"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Other Information 3" name="otherInfo3" validateStatus={errors.otherInfo3 ? 'error' : ''} help={errors.otherInfo3?.message}>
                                                <Controller
                                                    name="otherInfo3"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Other Information 3"
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                </div>
                                <Tag color="green" className='mt-3 font-bold'>Note: I test hereby undertake that I am the owner/ tenant/ shared cropper of the crops on the above specified land and will utilize the loan only for the purchase of inputs and other production activities of the reported crops.</Tag>

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

                        {/* {sourceOfIncome === 'Rental Income' && (
                            <Card title={"Rental Details"} size='small'>
                                <UnderConstruction />
                            </Card>
                        )} */}

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
            <CommonModal
                title="Ownerships"
                open={isModalOpen}
                onClose={closeModal}
                footer={true}
                size='large'
            >
                <Form layout='vertical'
                    onFinish={ownerSubmit(onOwnerSubmit)}>
                    <div className='grid grid-cols-4 gap-3'>
                        <Form.Item label="Ownership Type" name="ownership" validateStatus={ownerError.ownership ? 'error' : ''} help={ownerError.ownership?.message} required>
                            <Controller
                                name="ownership"
                                control={ownerControl}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Ownership Type"
                                        options={[
                                            {
                                                label: <span>Propeties</span>,
                                                title: 'propeties',
                                                options: [
                                                    { label: <span>Home</span>, value: 'Home' },
                                                    { label: <span>Agri Land</span>, value: 'Agri Land' },
                                                    { label: <span>Land</span>, value: 'Land' },
                                                    { label: <span>Tube Well</span>, value: 'Tube Well' },
                                                    { label: <span>Trolly</span>, value: 'Trolly' },
                                                ],
                                            },
                                            {
                                                label: <span>Vehicles</span>,
                                                title: 'vehicles',
                                                options: [
                                                    { label: <span>Tractor</span>, value: 'Tractor' },
                                                    { label: <span>Car</span>, value: 'Car' },
                                                    { label: <span>Motor Cycle</span>, value: 'Motor Cycle' },
                                                ],
                                            },
                                            {
                                                label: <span>Animals</span>,
                                                title: 'animals',
                                                options: [
                                                    { label: <span>Cows</span>, value: 'Cows' },
                                                    { label: <span>Goat</span>, value: 'Goat' },
                                                    { label: <span>Sheep</span>, value: 'Sheep' },
                                                    { label: <span>Buffalo</span>, value: 'Buffalo' },
                                                ],
                                            },
                                        ]}
                                    />
                                )}
                            />
                        </Form.Item>
                        {/* qty */}
                        <Form.Item label="Quantity" name="qty" validateStatus={ownerError.qty ? 'error' : ''} help={ownerError.qty?.message} required>
                            <Controller
                                name="qty"
                                control={ownerControl}
                                render={({ field }) => (
                                    <InputNumber
                                        className='w-full'
                                        {...field}
                                        placeholder="Quantity"
                                        defaultValue='1'
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Amount" name="amount" validateStatus={ownerError.amount ? 'error' : ''} help={ownerError.amount?.message} required>
                            <Controller
                                name="amount"
                                control={ownerControl}
                                render={({ field }) => (
                                    <InputNumber
                                        className='w-full'
                                        {...field}
                                        placeholder="Amount"
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
                        <Form.Item label="Total Amount" name="totalAmount" validateStatus={ownerError.totalAmount ? 'error' : ''} help={ownerError.totalAmount?.message} required>
                            <Controller
                                name="totalAmount"
                                control={ownerControl}
                                render={({ field }) => (
                                    <InputNumber
                                        className='w-full'
                                        {...field}
                                        placeholder="Total Amount"
                                        defaultValue='0'
                                        readOnly
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
                    </div>
                    <div className='flex justify-end'>
                        <Button type="primary" htmlType="submit" icon={mode === 'remove' ? <DeleteOutlined /> : <SaveOutlined />} danger={mode === 'remove'}>
                            {formatSentence(mode)}
                        </Button>
                        <Button type='default' className='ml-3' danger icon={<UndoOutlined />} onClick={() => ownerReset()}>
                            Reset
                        </Button>
                    </div>
                </Form>
            </CommonModal>
        </div>
    )
}

const DetailsCard: React.FC<{ detail: IOwnerships; onEdit: () => void; onRemove: () => void; }> = ({ detail, onEdit, onRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Ownership">{detail.ownership ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{detail.qty ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Per Amount">{formatCurrency(Number(detail.amount)) ?? '0.00'}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">{formatCurrency(Number(detail.totalAmount)) ?? '0.00'}</Descriptions.Item>
        </Descriptions>
    </Card>
);


// const BusinessDetailsCard: React.FC<{ detail: IOwnerships; onEdit: () => void; onRemove: () => void; }> = ({ detail, onEdit, onRemove }) => (
//     <Card>
//         <div className="flex justify-end gap-1">
//             <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
//             <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
//         </div>
//         <Descriptions column={1}>
//             <Descriptions.Item label="Ownership">{detail.ownership ?? '-'}</Descriptions.Item>
//             <Descriptions.Item label="Quantity">{detail.qty ?? '-'}</Descriptions.Item>
//             <Descriptions.Item label="Per Amount">{formatCurrency(Number(detail.amount)) ?? '0.00'}</Descriptions.Item>
//             <Descriptions.Item label="Total Amount">{formatCurrency(Number(detail.totalAmount)) ?? '0.00'}</Descriptions.Item>
//         </Descriptions>
//     </Card>
// );
export default FormLoanAppliaction