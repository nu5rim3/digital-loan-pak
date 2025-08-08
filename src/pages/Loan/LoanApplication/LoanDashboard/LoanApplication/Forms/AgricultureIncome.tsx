import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, Descriptions, Empty, Form, Input, InputNumber, Select, Tag, Checkbox, notification } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatCNIC, formatCurrency, formatName, formatSentence, getDistrict } from '../../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../../store/commonStore';
import useCreditStore, { IAgricultureIncome, IOwnerships } from '../../../../../../store/creditStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
    SaveOutlined,
    UndoOutlined,
    CaretLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import CommonModal from '../../../../../../components/common/modal/commonModal';
import ContactInput from '../../../../../../components/common/inputs/ContactInput';

interface IAgricultureIncomeForm {
    sourceOfIncome: string
    resetSourceOfIncome: () => void
    formMode: 'save' | 'update'
    updateData: IAgricultureIncome | null
}

const schema = yup.object().shape({
    profession: yup.string().required('Profession is required'),
    sourceOfIncome: yup.string().required('Source of income is required'),
    natureOfTheBorrower: yup.string().required('Nature of the borrower is required'),
    ownOfCult: yup.string().required('Ownership of cultivation is required'),
    ownOfLand: yup.string().required('Ownership of land is required'),
    ownName: yup.string().required('Owner name is required').matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    ownCNIC: yup.string().required('Owner CNIC is required').matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format xxxxx-xxxxxxx-x'),
    ownAddress: yup.string().required('Owner address is required'),
    ownContact: yup.string().required('Owner contact number is required').matches(/^[0-9]{11}$/, 'Contact number must be 11 digits'),
    acresOwned: yup.string().typeError('Acres owned must be a number').required('Acres owned is required'),
    acresRented: yup.string().typeError('Acres rented must be a number').required('Acres rented is required'),
    acresTotal: yup.string().typeError('Total acres must be a number').required('Total acres are required'),
    acresOfRabi: yup.string().typeError('Acres of Rabi must be a number').required('Acres of Rabi are required'),
    rabiHarvestingDate: yup.string().required('Rabi harvesting date is required'),
    rabiCultivationDate: yup.string().required('Rabi cultivation date is required'),
    acresOfKharif: yup.string().typeError('Acres of Kharif must be a number').required('Acres of Kharif are required'),
    kharifHarvestingDate: yup.string().required('Kharif harvesting date is required'),
    kharifCultivationDate: yup.string().required('Kharif cultivation date is required'),
    ownLandLoc: yup.string().required('Location of owned land is required'),
    rentedLandLoc: yup.string().required('Location of rented land is required'),
    district: yup.string().required('District is required'),
    cropsToBeCult: yup.array().of(yup.string()).min(1, 'At least one crop must be selected').required(),
    cropsName: yup.string(),
    landDetails: yup.string(),
    comment: yup.string(),
    loanLimitRabi: yup.string().typeError('Loan limit for Rabi must be a number').required(),
    loanLimitKharif: yup.string().typeError('Loan limit for Kharif must be a number').required(),
    loanLimitTotal: yup.string().typeError('Total loan limit must be a number').required(),
    purposeOfLoan: yup.string().required('Purpose of Facility is required'),
    floodsFactor: yup.string().required('Floods factor is required'),
    irrigation: yup.string().required('Irrigation method is required'),
    methods: yup.string().required('Methods are required'),
    proofOfCult: yup.string().required('Proof of cultivation is required'),
    expInCult: yup.string().required('Experience in cultivation is required'),
    borrowerDistrict: yup.string().required('Borrower district is required'),
    loanTenure: yup.string().required('Loan Tenure in Days in Days is required'),
    insCompany: yup.string().required('Insurance company is required'),
    policyIssuedDate: yup.string().required('Policy issued date is required'),
    policyExpiredDate: yup.string().required('Policy expired date is required'),
    receiptNo: yup.string().required('Receipt number is required'),
    premiumRate: yup.string().typeError('Premium rate must be a number').required(),
    premiumRateForSugar: yup.string().typeError('Premium rate for sugar must be a number').required(),
    evidance: yup.string().required('Evidence is required'),
    claimLodged: yup.string().required('Claim lodged is required'),
    otherInfo1: yup.string(),
    otherInfo2: yup.string(),
    otherInfo3: yup.string(),
    assets: yup.array().required('Assets are required'),
    totAssetsValue: yup.string().typeError('Total assets value must be a number').required('Total assets value is required'),
    rabiCrop: yup.string().required('Name of Rabi Crop is required'),
    kharifCrop: yup.string().required('Name of Kharif Crop is required'),
    khasra: yup.string().required('Khasra number is required'),
    khewat: yup.string().required('Khewat number is required'),
    khtoni: yup.string().required('Khtoni number is required'),
    isAgriSecured: yup.boolean().required('Agricultural security is required').default(false),
    agriSecured: yup.string().when(['isAgriSecured'], ([isAgriSecured], schema) => {
        return isAgriSecured === true
            ? schema.required('Agricultural security number is required')
            : schema.notRequired().nullable();
    }),
    repeatCustomer: yup.string(),
    // .required('Repeat customer is required'),
    purposeOfCultLoan: yup.string().required('Purpose of cultivation loan is required'),
    marketCheck: yup.string().required('Market check is required'),
})

const schema2 = yup.object().shape({
    ownership: yup.string().required('Ownership is required'),
    // qty cannot add negative value or zero
    qty: yup.string().required('Quantity is required').default('0'),
    totalAmount: yup.string().required('Total Amount is required'),
    amount: yup.string().required('Amount is required'),
});


const AgricultureIncome: React.FC<IAgricultureIncomeForm> = ({ sourceOfIncome, resetSourceOfIncome, formMode, updateData }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<IOwnerships | null>(null);

    const { appId } = useParams()
    const navigate = useNavigate()
    const { control, formState: { errors }, handleSubmit, reset, setValue, watch } = useForm({
        resolver: yupResolver(schema), defaultValues: {
            isAgriSecured: false,
            loanTenure: '360'
        }
    });

    const { control: ownerControl, formState: { errors: ownerError }, handleSubmit: ownerSubmit, reset: ownerReset, watch: ownerWatch, setValue: ownerSetValue } = useForm({
        resolver: yupResolver(schema2), defaultValues: {
            amount: '0.00',
            qty: '0',
            totalAmount: '0.00',
        }
    });

    const { marketCheck, marketCheckLoading, cultLoanPurposes, cultLoanPurposesLoading, agriMethods, agriMethodsLoading, proofOfCultivation, proofOfCultivationLoading, floodsFactor, floodsFactorLoading, irrigation, irrigationLoading, businessOwnership, businessOwnershipLoading, repeatCustomers, repeatCustomersLoading,
        facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchRepeatCustomersWithProdCode, fetchOwnership, fetchIrrigation, fetchFloodsFactor, fetchProofOfCultivation, fetchAgriMethods, fetchCultLoanPurposes,
        fetchMarketCheck } = useCommonStore()

    const { agricultureIncomeLoading, ownerships, product, fetchProduct, addOwnerships, updateOwnerships, removeOwnerships, addOwnershipsList, resetOwnerships, addAgricultureIncome, updateAgricultureIncome } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        if (formMode === 'save') {
            delete data.isAgriSecured
            addAgricultureIncome(appId ?? '', data).finally(onReset)
        } else if (formMode === 'update') {
            delete data.isAgriSecured
            const _data = { ...updateData, ...data }
            updateAgricultureIncome(updateData?.idx ?? '', _data).finally(onReset)
        }
    }

    useEffect(() => {
        resetOwnerships()
        fetchFacilityPurpose()
        fetchProduct(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValue('sourceOfIncome', sourceOfIncome)
        const productCode = product?.pTrhdLType ?? ''
        if (productCode !== '') {
            fetchOwnership(productCode)
            fetchIrrigation(productCode)
            fetchFloodsFactor(productCode)
            fetchProofOfCultivation(productCode)
            fetchAgriMethods(productCode)
            fetchCultLoanPurposes(productCode)
            fetchMarketCheck(productCode)
            fetchRepeatCustomersWithProdCode(productCode)
        } else {
            notification.error({
                message: 'Error',
                description: 'Product code not found. Please check the product details.',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onReset = () => {
        reset()
        resetSourceOfIncome()
        resetOwnerships()
    }

    const openModal = (mode: 'save' | 'update' | 'remove', details: IOwnerships | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            ownerSetValue('ownership', details.ownership);
            ownerSetValue('qty', details.qty);
            ownerSetValue('amount', details.amount);
            ownerSetValue('totalAmount', details.totalAmount ?? '0.00');
        } else {
            ownerReset();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onOwnerSubmit = (data: any) => {

        if (mode === 'update') {
            updateOwnerships(selectedDetail?.ownership ?? '', { ...data }).finally(closeModal)
        } else if (mode === 'save') {
            addOwnerships(data).finally(closeModal).finally(closeModal)
        } else if (mode === 'remove') {
            removeOwnerships(selectedDetail?.ownership ?? '').finally(closeModal)
        }

        setValue('assets', [...ownerships, data]);

    }

    const closeModal = () => {
        ownerReset();
        setIsModalOpen(false);
    };

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
        const owned = acresOwned ?? 0;
        const rented = acresRented ?? 0;
        setValue('acresTotal', (owned + rented));
    }, [acresOwned, acresRented, setValue]);

    useEffect(() => {
        const rabi = loanLimitRabi ?? 0;
        const kharif = loanLimitKharif ?? 0;
        setValue('loanLimitTotal', (rabi + kharif));
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

    useEffect(() => {
        if (mode === 'update' && updateData) {
            setValue('profession', updateData.profession)
            setValue('sourceOfIncome', updateData.sourceOfIncome)
            setValue('purposeOfLoan', updateData.purposeOfLoan)
            setValue('natureOfTheBorrower', updateData.natureOfTheBorrower)
            setValue('ownOfCult', updateData.ownOfCult)
            setValue('ownOfLand', updateData.ownOfLand)
            setValue('ownName', updateData.ownName)
            setValue('ownCNIC', updateData.ownCNIC)
            setValue('ownAddress', updateData.ownAddress)
            setValue('ownContact', updateData.ownContact)
            setValue('acresOwned', updateData.acresOwned)
            setValue('acresRented', updateData.acresRented)
            setValue('acresTotal', updateData.acresTotal)
            setValue('rabiCrop', updateData.rabiCrop)
            setValue('kharifCrop', updateData.kharifCrop)
            setValue('acresOfRabi', updateData.acresOfRabi)
            setValue('acresOfKharif', updateData.acresOfKharif)
            setValue('rabiHarvestingDate', updateData.rabiHarvestingDate)
            setValue('rabiCultivationDate', updateData.rabiCultivationDate)
            setValue('kharifHarvestingDate', updateData.kharifHarvestingDate)
            setValue('kharifCultivationDate', updateData.kharifCultivationDate)
            setValue('ownLandLoc', updateData.ownLandLoc)
            setValue('rentedLandLoc', updateData.rentedLandLoc)
            setValue('district', updateData.district)
            setValue('borrowerDistrict', updateData.borrowerDistrict)
            if (updateData.assets) {
                setValue('assets', updateData.assets)
                addOwnershipsList(updateData.assets)
            }
            if (updateData.agriSecured === '') {
                setValue('isAgriSecured', false)
            } else {
                setValue('isAgriSecured', true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formMode])


    return (

        <Card title={"Agriculture Income details"} size='small'>
            <Form layout='vertical' onFinish={handleSubmit(onSubmit)} >
                <div className='flex flex-col gap-3'>
                    <Card size='small' title={<span className='text-gray-600'>Nature of the Borrower</span>}>
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
                                            disabled
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Nature of the Borrower" name="natureOfTheBorrower" validateStatus={errors.natureOfTheBorrower ? 'error' : ''} help={errors.natureOfTheBorrower?.message} required>
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
                            <Form.Item label="Ownership of Cultivation" name="ownOfCult" validateStatus={errors.ownOfCult ? 'error' : ''} help={errors.ownOfCult?.message} required>
                                <Controller
                                    name="ownOfCult"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select a Ownership of Cultivation"
                                            loading={businessOwnershipLoading}
                                            options={businessOwnership.map((item) => ({ label: item.description, value: item.description }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Ownership of Land" name="ownOfLand" validateStatus={errors.ownOfLand ? 'error' : ''} help={errors.ownOfLand?.message} required>
                                <Controller
                                    name="ownOfLand"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select a Ownership of Land"
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
                            {/* borrowerDistrict */}
                            <Form.Item label="Borrower District" name="borrowerDistrict" validateStatus={errors.borrowerDistrict ? 'error' : ''} help={errors.borrowerDistrict?.message} required>
                                <Controller
                                    name="borrowerDistrict"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Borrower District"
                                            options={getDistrict()}
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
                                            maxLength={15} // Max length considering dashes
                                            onChange={(e) => {
                                                const formatted = formatCNIC(e.target.value);
                                                setValue("ownCNIC", formatted, { shouldValidate: true });
                                            }}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Contact Number" name="ownContact" validateStatus={errors.ownContact ? 'error' : ''} help={errors.ownContact?.message} required>
                                <Controller
                                    name="ownContact"
                                    control={control}
                                    render={({ field }) => (
                                        <ContactInput
                                            {...field}
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
                    <Card size='small' title={<span className='text-gray-600'>Land Under Cultivation in Acres</span>}>
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
                                        <Form.Item label="Name of Rabi Crop" name="rabiCrop" validateStatus={errors.rabiCrop ? 'error' : ''} help={errors.rabiCrop?.message} required>
                                            <Controller
                                                name="rabiCrop"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Name of Rabi Crop"
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Acres of Rabi" name="acresOfRabi" validateStatus={errors.acresOfRabi ? 'error' : ''} help={errors.acresOfRabi?.message} required>
                                            <Controller
                                                name="acresOfRabi"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputNumber
                                                        className='w-full'
                                                        {...field}
                                                        placeholder="Acres of Rabi"
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
                                        <Form.Item label="Name of Kharif Crop" name="kharifCrop" validateStatus={errors.kharifCrop ? 'error' : ''} help={errors.kharifCrop?.message} required>
                                            <Controller
                                                name="kharifCrop"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Name of Kharif Crop"
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Acres of Kharif" name="acresOfKharif" validateStatus={errors.acresOfKharif ? 'error' : ''} help={errors.acresOfKharif?.message} required>
                                            <Controller
                                                name="acresOfKharif"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputNumber
                                                        className='w-full'
                                                        {...field}
                                                        placeholder="Acres of Kharif"
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
                                            type='number'
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
                                            type='number'
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
                                            type='number'
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
                            <Form.Item label="Crops Name" name="cropsName" validateStatus={errors.cropsName ? 'error' : ''} help={errors.cropsName?.message} required>
                                <Controller
                                    name="cropsName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Crops Name"
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

                            <Form.Item label="Purpose of Cultivation Loan" name="purposeOfCultLoan" validateStatus={errors.purposeOfCultLoan ? 'error' : ''} help={errors.purposeOfCultLoan?.message} required>
                                <Controller
                                    name="purposeOfCultLoan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Purpose of Cultivation Loan"
                                            loading={cultLoanPurposesLoading}
                                            options={cultLoanPurposes.map((item) => ({ label: formatName(item.description), value: item.code }))}
                                        />
                                    )}
                                />
                            </Form.Item>
                            {/* required */}
                            <Form.Item label="Repeat Customer" name="repeatCustomer" validateStatus={errors.repeatCustomer ? 'error' : ''} help={errors.repeatCustomer?.message} >
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

                            <Form.Item label="Irrigation" name="irrigation" validateStatus={errors.irrigation ? 'error' : ''} help={errors.irrigation?.message} required>
                                <Controller
                                    name="irrigation"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Irrigation"
                                            loading={irrigationLoading}
                                            options={irrigation.map((item) => ({ label: item.description, value: item.code }))}
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
                                            options={floodsFactor.map((item) => ({ label: item.description, value: item.code }))}
                                        />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item label="Proof of Cultivation" name="proofOfCult" validateStatus={errors.proofOfCult ? 'error' : ''} help={errors.proofOfCult?.message} required>
                                <Controller
                                    name="proofOfCult"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Proof of Cultivation"
                                            loading={proofOfCultivationLoading}
                                            options={proofOfCultivation.map((item) => ({ label: item.description, value: item.code }))}
                                        />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item label="Methods use for Agriculture Machineries" name="methods" validateStatus={errors.methods ? 'error' : ''} help={errors.methods?.message} required>
                                <Controller
                                    name="methods"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Methods use for Agriculture Machineries"
                                            loading={agriMethodsLoading}
                                            options={agriMethods.map((item) => ({ label: item.description, value: item.code }))}
                                        />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item label="Market Check through Feild Verfication" name="marketCheck" validateStatus={errors.marketCheck ? 'error' : ''} help={errors.marketCheck?.message} required>
                                <Controller
                                    name="marketCheck"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Market Check through Feild Verfication"
                                            loading={marketCheckLoading}
                                            options={marketCheck.map((item) => ({ label: item.description, value: item.code }))}
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
                                                { label: '10 Years', value: '10Y' },
                                                { label: '10 Years +', value: '10Y+' }
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
                                                    checked={field.value}
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

                    <Card size='small' title={<span className='text-gray-600'>Ownership</span>}>
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

                    <Card size='small' title={<span className='text-gray-600'>Crop Loan Insurance Report (CLIR)</span>}>
                        {/* loanTenure */}
                        <div className='grid grid-cols-4 gap-3'>
                            <Form.Item label="Loan Tenure" name="loanTenure" validateStatus={errors.loanTenure ? 'error' : ''} help={errors.loanTenure?.message} required>
                                <Controller
                                    name="loanTenure"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Loan Tenure in Days"
                                            defaultValue='360'
                                            suffix="Days"
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

                            <Form.Item label="Number Of Times Claim Lodged" name="claimLodged" validateStatus={errors.claimLodged ? 'error' : ''} help={errors.claimLodged?.message} required>
                                <Controller
                                    name="claimLodged"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Number Of Times Claim Lodged"
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

                    <Tag color="green" className='mt-3 font-bold text-center'>Note: I test hereby undertake that I am the owner/ tenant/ shared cropper of the crops on the above specified land and will utilize the loan only <br /> for the purchase of inputs and other production activities of the reported crops.</Tag>

                    <div className='pt-5'>
                        <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>Back</Button>
                        <Button type='primary' className='ml-3' htmlType='submit' icon={<SaveOutlined />} loading={agricultureIncomeLoading}>
                            {formatSentence(formMode)} Agriculture
                        </Button>
                        <Button type='default' className='ml-3' danger icon={<UndoOutlined />} onClick={onReset}>
                            Reset
                        </Button>

                    </div>
                </div>
            </Form>




            <CommonModal
                title="Ownership"
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
        </Card >
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

export default AgricultureIncome