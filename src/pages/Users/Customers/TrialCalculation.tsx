import { Button, Card, Checkbox, Descriptions, Empty, Form, Input, InputNumber, notification, Select, Space, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CalculatorOutlined, UndoOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import useCommonStore from '../../../store/commonStore'
import { formatCurrency, formatSentence } from '../../../utils/formatterFunctions'
import useLoanStore from '../../../store/loanStore'
import useUserStore from '../../../store/userStore'
import { specialChargesByCode } from '../../../utils/loanStats'
import useCreditStore, { ITrailCalulationResponse } from '../../../store/creditStore'

const schema = yup.object().shape({
    productFacility: yup.string().required('Type of Facility is required'),
    productCategory: yup.string().nullable().defined().required('Product Category is required'),
    productType: yup.string().nullable().defined().required('Product Type is required'),
    productSubType: yup.string().required('Product Sub Type is required'),
    loanAmount: yup
        .number()
        .typeError('Loan Amount must be a number')
        .required('Loan Amount is required')
        .min(0, 'Loan Amount must be greater than or equal to 0'),
    trems: yup
        .number()
        .typeError('Terms must be a number')
        .required('Terms is required')
        .min(0, 'Terms must be greater than or equal to 0'),
    markup: yup
        .number()
        .typeError('Markup must be a number')
        .required('Markup is required')
        .min(0, 'Markup must be greater than or equal to 0'),
    irr: yup.string(),
    calculationMethod: yup.string().required('Calculation Method is required'),
    paymentFrequency: yup.string().when('calculationMethod', {
        is: (val: string) => val === 'B',
        then: (schema) => schema.required('Payment Frequency is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    leaseKeyMoney: yup.string().when('productType', {
        is: (val: string) => val === '5' || val === '1',
        then: (schema) => schema.required('Goldsmith ID is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    executionDate: yup.string().when('productType', {
        is: (val: string) => val === '9' || val === 'E9',
        then: (schema) => schema.required('Execution Date is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    capitalPaid: yup.string().when('productType', {
        is: (val: string) => val === '9' || val === 'E9',
        then: (schema) => schema.required('Capital Paid is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    gracePeriod: yup.string().when('productType', {
        is: (val: string) => val === '9' || val === 'E9',
        then: (schema) => schema.required('Grace Period is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    expiryDate: yup.string().when('productType', {
        is: (val: string) => val === '9' || val === 'E9',
        then: (schema) => schema.required('Expiry Date is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    dateOfPaymenent: yup.string().when('productType', {
        is: (val: string) => val === '9' || val === 'E9',
        then: (schema) => schema.required('Date of Payment is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    remark: yup.string(),
    insuranceVE: yup.string().when('productType', {
        is: (val: string) => val === '1',
        then: (schema) => schema.required('Insurance VE is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    structuredPayment: yup.array().of(
        yup.object().shape({
            struSeq: yup.number().required('Structured Payment Sequence is required'),
            struPrds: yup.string().required('Structured Payment Period is required'),
            amount: yup
                .number()
                .typeError('Structured Payment Amount must be a number')
                .required('Structured Payment Amount is required'),
            isPayble: yup.string().default('Y'),
        }),
    ),
});

const TrialCalculation: React.FC = () => {
    const [validationSchema, setValidationSchema] = useState(schema);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedProductType, setSelectedProductType] = useState<any | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedSubProductType, setSelectedSubProductType] = useState<any | null>(null);

    const { control, handleSubmit, formState: { errors }, reset, watch, setValue, getValues } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            productFacility: undefined,
            productCategory: undefined,
            productType: undefined,
            productSubType: undefined,
            loanAmount: 0.00,
            trems: undefined,
            markup: undefined,
            irr: undefined,
            calculationMethod: undefined,
            paymentFrequency: undefined,
            leaseKeyMoney: undefined,
            executionDate: undefined,
            capitalPaid: undefined,
            gracePeriod: undefined,
            expiryDate: undefined,
            dateOfPaymenent: undefined,
            remark: undefined,
            insuranceVE: undefined,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'structuredPayment', // This matches the name in your schema
    });

    const {
        subProductTypes, subProductTypesLoading,
        productTypes, productTypesLoading,
        facilityTypes, facilityTypesLoading,
        fetchFacilityTypes,
        fetchProductTypes,
        fetchSubProductTypes } = useCommonStore();

    const { productDetails, productDetailsLoading, fetchProductDetails, resetProductDetails } = useLoanStore()
    const { user } = useUserStore()
    const { trailCalulationDetails, trailCalulationDetailsLoading, trailCalulation, trailCalulationLoading, sendTrailCalulation, fetchTrailCalulation } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log('form data: ', data);

        const __data = {
            "pFacilityType": data.productFacility ?? '', // facility type code
            "pMode": "T", // const T
            "pUser": user?.idx ?? '', // log user ID heshan.pe
            "pTrhdMe": user?.meCode ?? '', // user me code
            "pTrhdLType": productType ?? '', // Product Type
            "pTrhdMethod": calculationMethod ?? '', // calculation method
            "pTrhdBrh": user?.branches[0].code ?? '', // branch code
            "pTrhdTerm": data.trems ?? '', // // term
            "pTrhdNoPre": "0",  // "0"
            "pTrhdNoDw": "0",
            "pTrhdTr": "54",
            "pTrhdLocCost": data.loanAmount ?? '0', // loan amount
            "pTrhdStmYn": "N", // "N"
            "pTrhdStmPer1": "0",
            "pTrhdStmDuty1": "0",
            "pTrhdCurCode": "PKR", // sub product currency
            "pTrhdInvTax": "N",
            "pTrhdBus": productSubType ?? '', //selected sub product key
            "pTrhdInvTaxRt": "0",
            "pTrhdCrib": "0", // "0"
            "pTrhdFlexi": "N", // "N"
            "pTrhdBsCd": "", // ""
            "pTrhdBsTr": "0", // ""
            "pTrhdMgTr": "0", // ""
            "pTrhdReSeq": "", // ""
            "pTrhdCustTyp": "N", // "N"
            "pTrhdReward": "N", // "N"
            "pTrhdLCode": "", // ""
            "pTrhdQuo": "N", // "N"
            "pTrhdStmApp": "N", // calculation method R !== "N"
            "pTrhdInsuCoverFlg": "N", // "N"
            "pTrhdInsuCoverAmt": "0", // ""
            "pTrhdIntrType": "", // ""
            "pTrhdRewardPre": "", // ""
            "pTrhdRewardType": "", // ""
            "pTrhdRewardBusagent": "", // ""
            "pTrhdRewardAddMethod": "", // ""
            "pTrhdSplitReward": "", // ""
            "pInsuOption": "",
            "pTrhdStmPer": '',
            "pInsuAddCrit": "",
            "pTrhdColMeth": calculationMethod ?? '', // payment frequency code
            "pStru": calculationMethod === 'S' ? data.structuredPayment : [], // TODO: stucture payment
            "pTrhdDep": data.leaseKeyMoney ?? '', // "" Lease Key Money
            "pTrtx": productDetails?.specialCharges.map((item) => ({
                "trtxTrx": item.prtbTrx, // prtbTrx
                "trtxAmt": item.prtbCalAmt, // prtbCalAmt
                "trtxAddcrit": item.criteriaCode, //criteriaCode
                "trtxCalMethod": item.prtbCalMetod, //prtbCalMetod
                "prtbMndFlg": item.prtbMndFlg, // prtbMndFlg
            })) ?? [],
        }

        console.log('post data: ', __data);
        sendTrailCalulation(__data).then((res: ITrailCalulationResponse) => {
            if (res.code === '000') {
                notification.success({
                    message: 'Success',
                    description: 'Trail Calculation Success',
                })

                fetchTrailCalulation(trailCalulation?.object.tcNo ?? '', 'T')

            } else if (res.code === '999') {
                notification.error({
                    message: res.object?.message,
                    description: res.object?.detail,
                })
            }

        }).catch((err) => {
            notification.error({
                message: err.message ?? 'Something went wrong',
            })
        })


    }

    const onRestHandle = () => {
        reset();
        resetProductDetails()
    }

    useEffect(() => {
        fetchFacilityTypes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const productCategory = watch('productCategory');
    const productType = watch('productType');
    const productSubType = watch('productSubType');
    const calculationMethod = watch('calculationMethod');

    useEffect(() => {
        if (productCategory !== undefined) {
            setValue('productType', '');
            setValue('productSubType', '')
            setValue('loanAmount', 0)
            setValue('trems', 0)
            setSelectedProductType(null)
            setSelectedSubProductType(null)
            resetProductDetails()
            fetchProductTypes(productCategory ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productCategory])

    useEffect(() => {
        if (productType !== undefined && productType !== '') {
            setValue('productSubType', '')
            setSelectedSubProductType(null)
            fetchSubProductTypes(productType ?? '')
            resetProductDetails()
            setSelectedProductType(productTypes.find((item) => item.prodCode === productType))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productType])

    useEffect(() => {
        if (productSubType !== undefined) {
            setSelectedSubProductType(subProductTypes.find((item) => item.subTypeCode === productSubType))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSubType])


    useEffect(() => {
        if (selectedSubProductType !== null && selectedProductType !== null) {
            fetchProductDetails(selectedProductType?.prodCode, selectedSubProductType?.subTypeCode, user?.branches[0]?.lsbrProv?.toString() ?? '', selectedProductType.prodCurrency)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubProductType, selectedProductType])

    // Update validation dynamically based on product details
    useEffect(() => {
        if (selectedSubProductType !== null && selectedProductType !== null && productDetails?.generalInfo !== null && productDetails?.generalInfo.minLoanAmt && productDetails?.generalInfo.maxLoanAmt) {
            setValidationSchema(
                schema.shape({
                    loanAmount: yup
                        .number()
                        .typeError('Loan Amount must be a number')
                        .required('Loan Amount is required')
                        .min(Number(productDetails?.generalInfo.minLoanAmt), `Loan Amount must be at least ${productDetails?.generalInfo.minLoanAmt}`)
                        .max(Number(productDetails?.generalInfo.maxLoanAmt), `Loan Amount must be at most ${productDetails?.generalInfo.maxLoanAmt}`)
                        .default(Number(productDetails?.generalInfo.defaultLoanAmt)),
                    trems: yup
                        .number()
                        .typeError('Terms must be a number')
                        .required('Terms is required')
                        .min(Number(productDetails?.generalInfo.minTerm), `Terms must be at least ${productDetails?.generalInfo.minTerm}`)
                        .max(Number(productDetails?.generalInfo.maxTerm), `Terms must be at most ${productDetails?.generalInfo.maxTerm}`)
                        .default(Number(productDetails?.generalInfo.defaultTerm)),
                    markup: yup
                        .number()
                        .typeError('Markup must be a number')
                        .required('Markup is required')
                        .min(Number(productDetails?.generalInfo.minRate), `Markup must be at least ${productDetails?.generalInfo.minRate}`)
                        .max(Number(productDetails?.generalInfo.maxRate), `Markup must be at most ${productDetails?.generalInfo.maxRate}`)
                        .default(Number(productDetails?.generalInfo.defaultRate)),

                }),
            );
            setValue('loanAmount', Number(productDetails?.generalInfo.defaultLoanAmt))
            setValue('trems', Number(productDetails?.generalInfo.defaultTerm))
            setValue('markup', Number(productDetails?.generalInfo.defaultRate))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productDetails, selectedSubProductType, selectedProductType]);

    return (
        <div>
            <Card title="Trial Calculation" className='w-full'>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-3">
                        <Form.Item label={'Type of Facility'} validateStatus={errors.productFacility ? "error" : ""} help={errors.productFacility?.message} required>
                            <Controller
                                name="productFacility"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Enter Type of Facility"
                                        loading={facilityTypesLoading}
                                        options={facilityTypes.map((item) => ({
                                            value: item.code,
                                            label: item.description,
                                        }))}
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Product Category'} validateStatus={errors.productCategory ? "error" : ""} help={errors.productCategory?.message} required>
                            <Controller
                                name="productCategory"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Product Category" options={[
                                        {
                                            value: 'A',
                                            label: 'Leas',
                                        }, {
                                            value: 'C',
                                            label: 'Loan',
                                        }
                                    ]} />
                                )}
                            />

                        </Form.Item>

                        <Form.Item label={'Product Type'} validateStatus={errors.productType ? "error" : ""} help={errors.productType?.message} required>
                            <Controller
                                name="productType"
                                control={control}
                                disabled={productCategory === undefined}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Enter Product Type"
                                        loading={productTypesLoading}
                                        options={
                                            productTypes.map((item) => ({
                                                value: item.prodCode,
                                                label: formatSentence(item.prodName),
                                            }))
                                        }
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Product Sub Type'} validateStatus={errors.productSubType ? "error" : ""} help={errors.productSubType?.message} required>
                            <Controller
                                name="productSubType"
                                control={control}
                                disabled={productType === undefined}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Enter Product Sub Type"
                                        loading={subProductTypesLoading}
                                        options={
                                            subProductTypes.map((item) => ({
                                                value: item.subTypeCode,
                                                label: formatSentence(item.subTypeDesc),
                                            }))
                                        } />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Loan Amount'} validateStatus={errors.loanAmount ? "error" : ""} help={errors.loanAmount?.message} required>
                            <Controller
                                name="loanAmount"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Gold Collateral Value"
                                        style={{ width: '100%' }}
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                        }
                                        step={0.01}
                                        min={0}
                                        stringMode
                                        prefix={'Rs.'}
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Terms'} validateStatus={errors.trems ? "error" : ""} help={errors.trems?.message} required>
                            <Controller
                                name="trems"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Terms" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Interest Rate'} validateStatus={errors.markup ? "error" : ""} help={errors.markup?.message} required>
                            <Controller
                                name="markup"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Interest Rate" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'IRR'} validateStatus={errors.irr ? "error" : ""} help={errors.irr?.message} required>
                            <Controller
                                name="irr"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter IRR" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Calculation Method'} validateStatus={errors.calculationMethod ? "error" : ""} help={errors.calculationMethod?.message} required>
                            <Controller
                                name="calculationMethod"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Calculation Method"
                                        loading={productDetailsLoading}
                                        disabled={productType === '' || productSubType === ''}
                                        options={productDetails?.calMethods.map((item) => ({
                                            value: item.calMethodCode,
                                            label: formatSentence(item.calMethodDesc),
                                        }))} />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Payment Frequency'} validateStatus={errors.paymentFrequency ? "error" : ""} help={errors.paymentFrequency?.message} required hidden={calculationMethod !== 'B'}>
                            <Controller
                                name="paymentFrequency"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Enter Payment Frequency"
                                        options={[
                                            {
                                                value: 'M',
                                                label: 'Monthly',
                                            }, {
                                                value: 'A',
                                                label: 'Annually',
                                            }, {
                                                value: 'BA',
                                                label: 'Bi-Annually',
                                            }, {
                                                value: 'Q',
                                                label: 'Quarterly',
                                            }, {
                                                value: 'HY',
                                                label: 'Half Yearly',
                                            }
                                        ]}
                                    />
                                )}
                            />
                        </Form.Item>
                        {/* only in Murabaha */}
                        <Form.Item label={'Lease Key Money'} validateStatus={errors.leaseKeyMoney ? "error" : ""} help={errors.leaseKeyMoney?.message} hidden={productType !== '5' && productType !== '1'}>
                            <Controller
                                name="leaseKeyMoney"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Lease Key Money" />
                                )}
                            />
                        </Form.Item>
                        {/* only in  */}
                        <Form.Item label={'Execution Date'} validateStatus={errors.executionDate ? "error" : ""} help={errors.executionDate?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="executionDate"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Execution Date" type='date' />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Capital Paid'} validateStatus={errors.capitalPaid ? "error" : ""} help={errors.capitalPaid?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="capitalPaid"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Capital Paid" />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Grace Period'} validateStatus={errors.gracePeriod ? "error" : ""} help={errors.gracePeriod?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="gracePeriod"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Grace Period" />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Expiry Date'} validateStatus={errors.expiryDate ? "error" : ""} help={errors.expiryDate?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="expiryDate"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Expiry Date" type='date' />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Date of Payment'} validateStatus={errors.dateOfPaymenent ? "error" : ""} help={errors.dateOfPaymenent?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="dateOfPaymenent"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Date of Payment" type='date' />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Remark'} validateStatus={errors.remark ? "error" : ""} help={errors.remark?.message} hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="remark"
                                control={control}
                                render={({ field }) => (
                                    <Input.TextArea {...field} placeholder="Enter Remark" />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Insurance VE'} validateStatus={errors.insuranceVE ? "error" : ""} help={errors.insuranceVE?.message} required hidden={productType !== '1'}>
                            <Controller
                                name="insuranceVE"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Insurance VE"
                                        options={[
                                            {
                                                value: 'V',
                                                label: 'Vehicle',
                                            }, {
                                                value: 'E',
                                                label: 'Eequipment',
                                                disabled: true
                                            }
                                        ]}
                                    />
                                )}
                            />
                        </Form.Item>




                    </div>
                    <div className='grid grid-rows-1 gap-3'>

                        {calculationMethod === 'S' && (
                            <Card size='small' title={'Structured Payment'}
                                styles={{
                                    header: {
                                        backgroundColor: '#002140',
                                        fontStyle: 'bold',
                                    },
                                    title: {
                                        color: 'white',
                                    },
                                }}
                            >
                                {fields.map((field, index) => (
                                    <Space key={field.id} align="center" style={{ display: 'flex', marginBottom: 8 }}>

                                        <Form.Item
                                            label="Payment Sequence"
                                            validateStatus={errors?.structuredPayment?.[index]?.struSeq ? 'error' : ''}
                                            help={errors?.structuredPayment?.[index]?.struSeq?.message}
                                            required
                                        >
                                            <Controller
                                                name={`structuredPayment.${index}.struSeq`}
                                                defaultValue={(index + 1)}
                                                disabled
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field} value={index + 1} placeholder="Enter Payment Sequence" />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Payment Period"
                                            validateStatus={errors?.structuredPayment?.[index]?.struPrds ? 'error' : ''}
                                            help={errors?.structuredPayment?.[index]?.struPrds?.message}
                                            required
                                        >
                                            <Controller
                                                name={`structuredPayment.${index}.struPrds`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Enter Payment Period"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d*$/.test(value)) {
                                                                field.onChange(value);
                                                                setValue(`structuredPayment.${index}.struSeq`, Number(index + 1));
                                                                setTimeout(() => {
                                                                    const updatedStructuredPayment = getValues('structuredPayment');
                                                                    const totalPaymentPeriod = updatedStructuredPayment?.reduce((total, item) => {
                                                                        const periodValue = parseInt(item.struPrds || '0', 10);
                                                                        return total + (isNaN(periodValue) ? 0 : periodValue);
                                                                    }, 0);
                                                                    setValue('trems', totalPaymentPeriod ?? 0);
                                                                }, 0);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Is Payment Payable"
                                            validateStatus={errors?.structuredPayment?.[index]?.isPayble ? 'error' : ''}
                                            help={errors?.structuredPayment?.[index]?.isPayble?.message}
                                            required
                                        >
                                            <Controller
                                                name={`structuredPayment.${index}.isPayble`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        placeholder="Select Payment Type"
                                                        options={[
                                                            { value: 'Y', label: 'Yes' },
                                                            { value: 'N', label: 'No' },
                                                        ]}
                                                        onChange={(value) => {
                                                            field.onChange(value);
                                                            setValue(`structuredPayment.${index}.amount`, value === 'N' ? 0 : 1000);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Payment Amount"
                                            validateStatus={errors?.structuredPayment?.[index]?.amount ? 'error' : ''}
                                            help={errors?.structuredPayment?.[index]?.amount?.message}
                                            required
                                        >
                                            <Controller
                                                name={`structuredPayment.${index}.amount`}
                                                control={control}
                                                render={({ field }) => (
                                                    <InputNumber
                                                        {...field}
                                                        placeholder="Enter Payment Amount"
                                                        style={{ width: '100%' }}
                                                        formatter={(value) =>
                                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                                        }
                                                        step={0.01}
                                                        min={0}
                                                        stringMode
                                                        prefix={'Rs.'}
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                className='absolute top-3'
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => remove(index)}
                                            />
                                        </Form.Item>
                                    </Space>
                                ))}

                                <Button
                                    type="dashed"
                                    onClick={() =>
                                        append({ struSeq: 0, struPrds: '', amount: 0.00, isPayble: 'N' })
                                    }
                                    icon={<PlusOutlined />}
                                >
                                    Add Payment
                                </Button>
                            </Card>
                        )}

                        <Card size='small' title={'Special Charges'}
                            styles={{
                                header: {
                                    backgroundColor: '#002140',
                                    fontStyle: 'bold',
                                },
                                title: {
                                    color: 'white',
                                },
                            }}
                            // NOTE: this removed by BA
                            // extra={
                            //     <><span className='text-white'>Total Charges : <Tag color='red'><b>{formatCurrency(10000)}</b></Tag></span></>
                            // }
                            hidden={calculationMethod === undefined}
                        >

                            {
                                (productDetails === null || productDetails?.specialCharges.length === 0) &&
                                <Empty description='No Special Charges' />
                            }
                            <div className='grid grid-cols-4 gap-3'>
                                {
                                    productDetails?.specialCharges.map((item, index) => (
                                        <Card key={index} size='small' title={`${specialChargesByCode(item?.prtbCalMetod)}`} extra={
                                            <Checkbox checked={item?.prtbMndFlg === '1'} disabled={item?.prtbMndFlg === '1'} onChange={() => {
                                                console.log('checked', item?.prtbCalMetod)
                                            }} />
                                        }>
                                            <Descriptions column={1} key={index}>
                                                <Descriptions.Item label="Method">{specialChargesByCode(item?.prtbCalMetod)}</Descriptions.Item>
                                                <Descriptions.Item label="Charge Amount">{formatCurrency(Number(item?.prtbCalAmt ?? 0))}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    ))
                                }
                            </div>
                        </Card>

                        <Card size='small' title={'Trial Calculation Charges'}
                            styles={{
                                header: {
                                    backgroundColor: '#002140',
                                    fontStyle: 'bold',
                                },
                                title: {
                                    color: 'white',
                                },
                            }}
                            hidden={trailCalulationDetails === null}
                        >

                            <Card size='small' title={'Installment Details'} hidden={trailCalulationDetails?.object?.facilityDetails === undefined}>
                                <Descriptions column={3}>
                                    {
                                        trailCalulationDetails?.object?.facilityDetails.map((item, index) => (
                                            <div key={index}>
                                                <Descriptions.Item label={`Sequence`}>{item.seq}</Descriptions.Item>
                                                <Descriptions.Item label={`Trems`}>{item.term}</Descriptions.Item>
                                                <Descriptions.Item label={`Installment`}>
                                                    <Tag color='red'><b>{formatCurrency(Number(item.instalment ?? 0))}</b></Tag>
                                                </Descriptions.Item>

                                            </div>
                                        ))
                                    }
                                </Descriptions>
                            </Card>
                            <Descriptions column={4}>
                                <Descriptions.Item label="Term">{'-'}</Descriptions.Item>
                                <Descriptions.Item label="TC Number">{trailCalulationDetails?.object.tcNo ?? '-'}</Descriptions.Item>
                                <Descriptions.Item label="Loan Amount"><Tag color='red'>{formatCurrency(Number(trailCalulationDetails?.object.loanAmount ?? 0))}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Down Payment Amount"><Tag color='red'><b>{formatCurrency(Number(trailCalulationDetails?.object.downPayment ?? 0))}</b></Tag></Descriptions.Item>
                                <Descriptions.Item label="Total Receivable"><Tag color='red'><b>{formatCurrency(Number(trailCalulationDetails?.object.totalReceivable ?? 0))}</b></Tag></Descriptions.Item>
                            </Descriptions>


                        </Card>
                    </div>

                    <div className='mb-5'>

                    </div>
                    <div>
                        <Button type="primary" htmlType="submit" className='mr-2' icon={<CalculatorOutlined />} loading={trailCalulationLoading || trailCalulationDetailsLoading}>
                            Calculate
                        </Button>
                        <Button type="default" onClick={onRestHandle} className='mr-2' danger icon={<UndoOutlined />}>
                            Reset
                        </Button>
                    </div>
                </Form >
            </Card >
        </div >
    )
}

export default TrialCalculation