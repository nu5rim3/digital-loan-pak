import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, Form, Input, Select, Checkbox } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatName, formatSentence, getDistrict } from '../../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../../store/commonStore';
import useCreditStore, { ILiveStockIncome } from '../../../../../../store/creditStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
    SaveOutlined,
    UndoOutlined,
    CaretLeftOutlined
} from '@ant-design/icons';


interface ILiveStockIncomeProps {
    sourceOfIncome: string;
    resetSourceOfIncome: () => void;
    mode: 'save' | 'update';
    updateData: ILiveStockIncome | null;
}

const schema = yup.object().shape({
    profession: yup.string().required('Profession is required'),
    sourceOfIncome: yup.string().required('Source of Income is required'),
    purposeOfLoan: yup.string().required('Purpose of Loan is required'),
    animalOrCrop: yup.string().required('Animal or Crop is required'),
    buffaloes: yup.string().required('Buffaloes are required'),
    cows: yup.string().required('Cows are required'),
    bulls: yup.string().required('Bulls are required'),
    collateral: yup.string().required('Collateral is required'),
    claimLodged: yup.string().required('Claim Lodged is required'),
    animalTagging: yup.string().required('Animal Tagging is required'),
    borrowerDistrict: yup.string().required('Borrower District is required'),
    sowodo: yup.string().required('Sowodo is required'),
    loanTenure: yup.string().required('Loan Tenure is required'),
    insCompany: yup.string().required('Insurance Company is required'),
    policyIssuedDate: yup.string().required('Policy Issued Date is required'),
    policyExpiredDate: yup.string().required('Policy Expired Date is required'),
    receiptNo: yup.string().required('Receipt No. is required'),
    premiumRate: yup.string().required('Premium Rate is required'),
    floodsFactor: yup.string().required('Floods Factor is required'),
    irrigation: yup.string().required('Irrigation is required'),
    methods: yup.string().required('Methods are required'),
    proofOfCult: yup.string().required('Proof of Cultivation is required'),
    expInCult: yup.string().required('Experience in Cultivation is required'),
    isAgriSecured: yup.boolean().required('Agricultural security is required').default(false),
    agriSecured: yup.string().when(['isAgriSecured'], ([isAgriSecured], schema) => {
        return isAgriSecured === true
            ? schema.required('Agricultural security number is required')
            : schema.notRequired().nullable();
    }),
    marketCheck: yup.string().required('Market Check is required'),
    natureOfTheBorrower: yup.string().required('Nature of the Borrower is required'),
    ownOfLand: yup.string().required('Ownership of Land is required'),
});
const LiveStockIncome: React.FC<ILiveStockIncomeProps> = ({ sourceOfIncome, resetSourceOfIncome, mode, updateData }) => {

    const { appId } = useParams();
    const navigate = useNavigate();

    const { control, formState: { errors }, handleSubmit, reset, setValue, watch } = useForm({
        resolver: yupResolver(schema), defaultValues: {
            loanTenure: '360'
        }
    });

    const { marketCheck, marketCheckLoading, agriMethods, agriMethodsLoading, proofOfCultivation, proofOfCultivationLoading, floodsFactor, floodsFactorLoading, irrigation, irrigationLoading,
        facilityPurpose, facilityPurposeLoading, fetchFacilityPurpose, fetchRepeatCustomersWithProdCode, fetchOwnership, fetchIrrigation, fetchFloodsFactor, fetchProofOfCultivation, fetchAgriMethods,
        fetchMarketCheck } = useCommonStore()

    const { liveStockIncomeLoading, fetchProduct, product, addLiveStockIncome, updateLiveStockIncome } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {

        delete data.isAgriSecured
        if (mode === 'save') {
            addLiveStockIncome(appId ?? '', data).finally(() => {
                reset()
                resetSourceOfIncome()
                navigate(-1)
            })
        } else if (mode === 'update') {
            const _data = { ...updateData, ...data }
            updateLiveStockIncome(updateData?.idx ?? '', _data).finally(() => {
                reset()
                resetSourceOfIncome()
                navigate(-1)
            })
        }
    }

    const onRest = () => {
        reset()
        resetSourceOfIncome()
    }

    useEffect(() => {
        setValue('sourceOfIncome', sourceOfIncome)
        fetchFacilityPurpose()
        fetchProduct(appId ?? '')
        const productCode = product?.pTrhdLType ?? ''
        if (product?.pTrhdLType) {
            fetchOwnership(productCode)
            fetchIrrigation(productCode)
            fetchFloodsFactor(productCode)
            fetchProofOfCultivation(productCode)
            fetchAgriMethods(productCode)
            fetchMarketCheck(productCode)
            fetchRepeatCustomersWithProdCode(productCode)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    const isAgriSecured = watch('isAgriSecured');

    useEffect(() => {
        if (mode === 'update' && updateData) {
            setValue('profession', updateData.profession)
            setValue('sourceOfIncome', updateData.sourceOfIncome)
            setValue('purposeOfLoan', updateData.purposeOfLoan)
            setValue('animalOrCrop', updateData.animalOrCrop)
            setValue('buffaloes', updateData.buffaloes)
            setValue('cows', updateData.cows)
            setValue('bulls', updateData.bulls)
            setValue('collateral', updateData.collateral)
            setValue('claimLodged', updateData.claimLodged)
            setValue('animalTagging', updateData.animalTagging)
            setValue('borrowerDistrict', updateData.borrowerDistrict)
            setValue('sowodo', updateData.sowodo)
            setValue('loanTenure', updateData.loanTenure)
            setValue('insCompany', updateData.insCompany)
            setValue('policyIssuedDate', updateData.policyIssuedDate)
            setValue('policyExpiredDate', updateData.policyExpiredDate)
            setValue('receiptNo', updateData.receiptNo)
            setValue('premiumRate', updateData.premiumRate)
            setValue('floodsFactor', updateData.floodsFactor)
            setValue('irrigation', updateData.irrigation)
            setValue('methods', updateData.methods)
            setValue('proofOfCult', updateData.proofOfCult)
            setValue('expInCult', updateData.expInCult)
            setValue('agriSecured', updateData.agriSecured ?? '')
            if (updateData.agriSecured === '') {
                setValue('isAgriSecured', false)
            } else {
                setValue('isAgriSecured', true)
            }
            setValue('marketCheck', updateData.marketCheck ?? '')
            setValue('natureOfTheBorrower', updateData.natureOfTheBorrower ?? '')
            setValue('ownOfLand', updateData.ownOfLand ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])


    return (
        <Card title="Live Stock Income Details" size='small'>
            <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
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

                    <Form.Item label="Borrower District" name="borrowerDistrict" validateStatus={errors.borrowerDistrict ? 'error' : ''} help={errors.borrowerDistrict?.message} required>
                        <Controller
                            name="borrowerDistrict"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder="Select Borrower District"
                                    options={
                                        getDistrict().map((item) => ({ label: formatName(item.label), value: item.value }))
                                    }
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Nature of The Borrower" name="natureOfTheBorrower" validateStatus={errors.natureOfTheBorrower ? 'error' : ''} help={errors.natureOfTheBorrower?.message} required>
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
                    <Form.Item label="SO/ WO/ DO s" name="sowodo" validateStatus={errors.sowodo ? 'error' : ''} help={errors.sowodo?.message} required>
                        <Controller
                            name="sowodo"
                            control={control}
                            render={({ field }) => (
                                <Input.TextArea
                                    {...field}
                                    placeholder='Enter S/O, W/O, D/O s'
                                />
                            )}
                        />
                    </Form.Item>

                </div>
                <div className='flex flex-col gap-3'>
                    <Card size='small' title={<span>Animals Information</span>}>
                        <div className='grid grid-cols-5 gap-3'>
                            {/* cows */}
                            <Form.Item label="Cows" name="cows" validateStatus={errors.cows ? 'error' : ''} help={errors.cows?.message} required>
                                <Controller
                                    name="cows"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder='Enter Cows'
                                        />
                                    )}
                                />
                            </Form.Item>
                            {/* buffaloes */}
                            <Form.Item label="Buffaloes" name="buffaloes" validateStatus={errors.buffaloes ? 'error' : ''} help={errors.buffaloes?.message} required>
                                <Controller
                                    name="buffaloes"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder='Enter Buffaloes'
                                        />
                                    )}
                                />
                            </Form.Item>
                            {/* bulls */}
                            <Form.Item label="Bulls" name="bulls" validateStatus={errors.bulls ? 'error' : ''} help={errors.bulls?.message} required>
                                <Controller
                                    name="bulls"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder='Enter Bulls'
                                        />
                                    )}
                                />
                            </Form.Item>
                            {/* animalTagging */}

                            <Form.Item label="Animal Tagging" name="animalTagging" validateStatus={errors.animalTagging ? 'error' : ''} help={errors.animalTagging?.message} required>
                                <Controller
                                    name="animalTagging"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Animal Tagging"
                                            options={
                                                [
                                                    { label: 'Ear Tag', value: 'Ear Tag' },
                                                    { label: 'Tattoo', value: 'Tattoo' },
                                                    { label: 'Microchip', value: 'Microchip' }
                                                ]
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>
                            {/* animalOrCrop */}
                            <Form.Item label="Animal Or Crop" name="animalOrCrop" validateStatus={errors.animalOrCrop ? 'error' : ''} help={errors.animalOrCrop?.message} required>
                                <Controller
                                    name="animalOrCrop"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Animal Or Crop"
                                            options={
                                                [
                                                    { label: 'Animal', value: 'Animal' },
                                                    { label: 'Crop', value: 'Crop', disabled: true }
                                                ]
                                            }
                                        />
                                    )}
                                />
                            </Form.Item>

                        </div>
                    </Card>
                    <Card size='small' title={<span>Basic Information</span>}>
                        <div className='grid grid-cols-3 gap-3'>

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

                            <Form.Item label="Proof of Cultivation" name="proofOfCult" validateStatus={errors.proofOfCult ? 'error' : ''} help={errors.proofOfCult?.message} required>
                                <Controller
                                    name="proofOfCult"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select Proof of Cultivation"
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
                            {/* collateral */}
                            <Form.Item label="Collateral" name="collateral" validateStatus={errors.collateral ? 'error' : ''} help={errors.collateral?.message} required>
                                <Controller
                                    name="collateral"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter Collateral"
                                        />
                                    )}
                                />
                            </Form.Item>
                        </div>
                    </Card>
                    <Card size='small' title={<span className='text-gray-600'>Farm Loan Insureance Report (FLIR)</span>}>
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
                        </div>
                    </Card>
                </div>
                <div className='flex justify-start pt-5'>
                    <Button type="default" icon={<CaretLeftOutlined />} onClick={() => navigate(-1)} className='mr-2'>
                        Back
                    </Button>
                    <Button type="primary" icon={<SaveOutlined />} htmlType="submit" className='mr-2' loading={liveStockIncomeLoading}>
                        {formatSentence(mode)} Livestock
                    </Button>
                    <Button type="default" icon={<UndoOutlined />} onClick={onRest} danger >
                        Reset
                    </Button>
                </div>
            </Form>
        </Card>
    )
}

export default LiveStockIncome