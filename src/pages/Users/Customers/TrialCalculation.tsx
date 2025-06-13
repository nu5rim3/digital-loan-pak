import { Button, Card, Checkbox, Descriptions, Empty, Form, Input, InputNumber, notification, Select, Space, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CalculatorOutlined, UndoOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import useCommonStore from '../../../store/commonStore'
import { formatCurrency, formatSentence } from '../../../utils/formatterFunctions'
import useLoanStore from '../../../store/loanStore'
import useUserStore from '../../../store/userStore'
import { specialChargesByCode } from '../../../utils/loanStats'
import useCreditStore, { ITrailCalulationResponse } from '../../../store/creditStore'
import { useParams } from 'react-router-dom'
import useVerificationStore from '../../../store/verificationStore'
import moment from 'moment'

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
        .min(0, 'Terms must be greater than or equal to 0')
        .when('productType', {
            is: (val: string) => val === '9' || val === 'E9',
            then: (schema) => schema.notRequired(),
            otherwise: (schema) => schema.required('Terms is required'),
        }),
    markup: yup
        .number()
        .typeError('Markup rate must be a number')
        .required('Markup rate is required')
        .min(0, 'Markup rate must be greater than or equal to 0'),
    irr: yup.string(),
    calculationMethod: yup.string().required('Calculation Method is required'),
    paymentFrequency: yup.string().when('calculationMethod', {
        is: (val: string) => val === 'B',
        then: (schema) => schema.required('Payment Frequency is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    leaseKeyMoney: yup.string().when('productType', {
        is: (val: string) => val === '5' || val === '1',
        then: (schema) => schema.required('Lease Key Money is required'),
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
    cost: yup.number().when('insuranceVE', {
        is: (val: string) => val === 'V',
        then: (schema) => schema.required('Cost is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    structuredPayment: yup.array().of(
        yup.object().shape({
            struSeq: yup.number().required('Structured Payment Sequence is required'),
            struPrds: yup.string().required('Structured Payment Period is required'),
            struRent: yup
                .number()
                .typeError('Structured Payment Amount must be a number')
                .required('Structured Payment Amount is required'),
            isPayble: yup.string().default('Y'),
        }),
    ),
    prevLoanProd: yup.string().when('productFacility', {
        is: (val: string) => val === 'RO',
        then: (schema) => schema.required('Previous Loan Product is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    prevLoanContractNo: yup.string().when('productFacility', {
        is: (val: string) => val === 'RO',
        then: (schema) => schema.required('Previous Loan Contract No is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    prevLoanOutstanding: yup.number().when('productFacility', {
        is: (val: string) => val === 'RO',
        then: (schema) => schema.required('Previous Loan Outstanding is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    countOfRollOver: yup.string().when('productFacility', {
        // max length: 2
        is: (val: string) => val === 'RO',
        then: (schema) => schema.required('Count of Roll Over is required').max(2, 'Count of Roll Over must be at most 2'),
        otherwise: (schema) => schema.notRequired(),
    }),
});


interface ISaveTrialCalculation {
    cliIdx: string;
    cnic?: string;
}

const TrialCalculation: React.FC<ISaveTrialCalculation> = ({ cliIdx, cnic }) => {
    const { appId } = useParams()
    const [isSaveShow, setIsSaveShow] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rollOverDetail, setRollOverDetail] = useState<any | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [calculationPayload, setCalculationPayload] = useState<any | null>(null);
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
            cost: 0.00,
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
            prevLoanOutstanding: 0.00,
            prevLoanProd: undefined,
            prevLoanContractNo: undefined,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'structuredPayment', // This matches the name in your schema
    });

    const {
        productCategories,
        subProductTypes, subProductTypesLoading,
        productTypes, productTypesLoading,
        facilityTypes, facilityTypesLoading,
        fetchFacilityTypes,
        fetchProductTypes,
        fetchSubProductTypes,
        setSelectedProductCategory, setSelectedProductCode } = useCommonStore();

    const { productDetails, productDetailsLoading, fetchProductDetails, resetProductDetails } = useLoanStore()
    const { user } = useUserStore()
    const { cribDetails, cribLoading, fetchCRIBByCnic, resetCRIBDetails } = useVerificationStore()
    const { trailCalulationDetails, trailCalulationDetailsLoading, trailCalucationData, trailCalucationDataLoading, trailCalulationLoading, sendTrailCalulation, fetchTrailCalulation, resetTrailCalculationDetails, saveTrailCalulation, fetchTrailCalulationDetailsByAppId } = useCreditStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {

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
            "pTrhdTr": data.markup ?? '0', //makeup rate
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
            "pTrhdColMeth": calculationMethod === 'B' ? data.paymentFrequency : '', // payment frequency code
            "pStru": calculationMethod === 'S' ? data.structuredPayment : [], // TODO: stucture payment
            "pTrhdDep": data.leaseKeyMoney ?? '', // "" Lease Key Money
            "pTrtx": productDetails?.specialCharges.map((item) => ({
                "trtxTrx": item.prtbTrx, // prtbTrx
                "trtxAmt": item.prtbCalAmt, // prtbCalAmt
                "trtxAddcrit": item.criteriaCode, //criteriaCode
                "trtxCalMethod": item.prtbCalMetod, //prtbCalMetod
                "prtbMndFlg": item.prtbMndFlg, // prtbMndFlg
            })) ?? [],
            "pSnrv": productType === '9' || productType === 'E9' ?
                [
                    {
                        "snrvFac": data.loanAmount ?? '0',
                        "snrvCap": data.capitalPaid ?? '0', //data.loanAmount
                        "snrvExpDate": moment(data.expiryDate).format('YYYYMMDD') ?? '',
                        "snrvIntRt": "10",
                        "snrvPInt": "0",
                        "snrvDtPay": data.dateOfPaymenent ?? '',
                        "snrvGPrd": data.gracePeriod ?? '',
                    }
                ] : [],
            "pTreq": productType === '1' ?
                [
                    {
                        "treqEv": data.insuranceVE ?? '', // insuranceVE
                        "treqEqpCost": data.cost ?? '0', // cost
                    }
                ] : []
        }

        if (facilityType === 'RO') {
            setRollOverDetail({
                prevLoanProd: data.prevLoanProd ?? '',
                prevLoanContractNo: data.prevLoanContractNo ?? '',
                prevLoanOutstanding: data.prevLoanOutstanding ?? 0,
                countOfRollOver: data.countOfRollOver ?? '',
            })
        }

        sendTrailCalulation(__data).then((res: ITrailCalulationResponse) => {
            if (res.code === '000') {
                notification.success({
                    message: 'Success',
                    description: 'Trial Calculation Success',
                })
                setCalculationPayload(__data ?? null)
                fetchTrailCalulation(res?.object.tcNo ?? '', 'T')
                setIsSaveShow(true)
            } else if (res.code === '999') {
                notification.error({
                    message: res.object?.message,
                    description: res.object?.detail,
                })
                setIsSaveShow(false)
            }

        }).catch((err) => {
            notification.error({
                message: err.message ?? 'Something went wrong',
            })
        })
    }

    const onRestHandle = () => {
        reset(
            {
                productFacility: undefined,
                productCategory: undefined,
                productType: undefined,
                productSubType: undefined,
                loanAmount: 0.00,
                cost: 0.00,
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
                prevLoanOutstanding: 0.00,
                prevLoanProd: undefined,
                prevLoanContractNo: undefined,
            }
        );
        resetProductDetails()
        resetTrailCalculationDetails()
        resetCRIBDetails()
        setIsSaveShow(false)
    }

    useEffect(() => {
        fetchFacilityTypes()
        fetchTrailCalulationDetailsByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const productCategory = watch('productCategory');
    const productType = watch('productType');
    const productSubType = watch('productSubType');
    const calculationMethod = watch('calculationMethod');
    const facilityType = watch('productFacility');

    useEffect(() => {
        if (productCategory !== undefined) {
            setValue('productType', '');
            setValue('loanAmount', 0)
            setValue('trems', 0)
            setSelectedProductType(null)
            setSelectedSubProductType(null)
            resetProductDetails()
            fetchProductTypes(productCategory ?? '')

            // Save the selected product category to the store
            const selectedCategory = productCategories.find(cat => cat.code === productCategory);
            if (selectedCategory) {
                setSelectedProductCategory(selectedCategory);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productCategory])

    useEffect(() => {
        if (productType !== undefined && productType !== '') {
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
        // if (facilityType !== 'RO') {
        if (selectedSubProductType !== null && selectedProductType !== null) {
            fetchProductDetails(selectedProductType?.prodCode, selectedSubProductType?.subTypeCode, user?.branches[0]?.lsbrProv?.toString() ?? '', selectedProductType?.prodCurrency ?? trailCalucationData?.pTrhdCurCode)
            // }
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
                        .min(Number(productDetails?.generalInfo.minLoanAmt), `Loan Amount must be at least ${formatCurrency(Number(productDetails?.generalInfo.minLoanAmt))}`)
                        .max(Number(productDetails?.generalInfo.maxLoanAmt), `Loan Amount must be at most ${formatCurrency(Number(productDetails?.generalInfo.maxLoanAmt))}`)
                        .default(Number(productDetails?.generalInfo.defaultLoanAmt)),
                    terms: yup
                        .number()
                        .typeError('Terms must be a number')
                        .when('productType', {
                            is: (val: string) => val === '9' || val === 'E9',
                            then: (schema) => schema.notRequired(),
                            otherwise: (schema) => schema.required('Terms is required'),
                        })
                        .min(
                            Number(productDetails?.generalInfo.minTerm ?? 1),
                            `Terms must be at least ${productDetails?.generalInfo.minTerm ?? 1}`
                        )
                        .max(
                            Number(productDetails?.generalInfo.maxTerm ?? 999),
                            `Terms must be at most ${productDetails?.generalInfo.maxTerm ?? 999}`
                        )
                        .default(Number(productDetails?.generalInfo.defaultTerm ?? 1)),
                    markup: yup
                        .number()
                        .typeError('Markup rate must be a number')
                        .required('Markup rate is required')
                        .min(Number(productDetails?.generalInfo.minRate), `Markup rate must be at least ${productDetails?.generalInfo.minRate}`)
                        .max(Number(productDetails?.generalInfo.maxRate), `Markup rate must be at most ${productDetails?.generalInfo.maxRate}`)
                        .default(Number(productDetails?.generalInfo.defaultRate)),

                }),
            );
            setValue('loanAmount', Number(productDetails?.generalInfo.defaultLoanAmt))
            if (productType !== '9' && productType !== 'E9') {
                setValue('trems', Number(productDetails?.generalInfo.defaultTerm))
            } else {
                setValue('trems', 1) // Reset terms for product type 9 or E9
            }
            setValue('markup', Number(productDetails?.generalInfo.defaultRate))
        } else {
            setValidationSchema(schema);
            setValue('loanAmount', 0)
            setValue('trems', 0)
            setValue('markup', 0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productDetails, selectedSubProductType, selectedProductType]);

    const saveCalculationHandle = () => {

        let __calculationPayload = calculationPayload;
        if (facilityType === 'RO') {
            __calculationPayload = {
                ...calculationPayload,
                prevLoanProd: facilityType === 'RO' ? rollOverDetail.prevLoanProd : '', // previous loan product
                prevLoanContractNo: facilityType === 'RO' ? rollOverDetail.prevLoanContractNo : '', // previous loan contract no
                prevLoanOutstanding: facilityType === 'RO' ? rollOverDetail.prevLoanOutstanding : '', // previous loan outstanding
                countOfRollOver: facilityType === 'RO' ? rollOverDetail.countOfRollOver : '', // count of roll over
            }
        }
        const productCode = __calculationPayload.pTrhdLType
        setSelectedProductCode(productCode)
        saveTrailCalulation(appId ?? '', cliIdx, __calculationPayload)
    }

    useEffect(() => {

        if (facilityType === 'RO') {
            fetchCRIBByCnic(cnic ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facilityType])

    useEffect(() => {
        if (isSaveShow) {
            const subscription = watch((_value, { name, type }) => {
                console.log(`Field changed: ${name}, Type: ${type}`);
                setIsSaveShow(false);
            });
            return () => subscription.unsubscribe();
        }
    }, [isSaveShow, watch]);

    useEffect(() => {
        if (trailCalucationData?.tcNo !== '') {
            setSelectedProductCode(trailCalucationData?.pTrhdLType ?? '')
            fetchTrailCalulation(trailCalucationData?.tcNo ?? '', 'T')
        } else {
            resetTrailCalculationDetails();
            resetCRIBDetails();
            resetProductDetails();
            setSelectedProductCategory(null);
            setSelectedProductCode('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trailCalucationData?.tcNo])

    const loanAmount = watch('loanAmount');

    useEffect(() => {
        if (productType === '9' || productType === 'E9') {
            setValue('capitalPaid', loanAmount.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productType, loanAmount])

    const executionDate = watch('executionDate');
    const gracePeriod = watch('gracePeriod');

    useEffect(() => {
        if (productType === '9' || productType === 'E9') {
            if (executionDate && gracePeriod) {
                const expiryMoment = moment(executionDate).add(gracePeriod, 'months');
                setValue('expiryDate', expiryMoment.format('YYYY-MM-DD'));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executionDate, gracePeriod])




    return (
        <div className='flex flex-col gap-3'>
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
                                    <Select {...field} placeholder="Enter Product Category" options={productCategories.map((item) => ({
                                        value: item.code,
                                        label: item.description
                                    }))} />
                                )}
                            />

                        </Form.Item>

                        <Form.Item label={'Previous Loan Product'} validateStatus={errors.prevLoanProd ? "error" : ""} help={errors.prevLoanProd?.message} required hidden={facilityType !== 'RO'}>
                            <Controller
                                name="prevLoanProd"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Enter Previous Loan Product"
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

                        <Form.Item label={'Previous Loan Contract No'} validateStatus={errors.prevLoanContractNo ? "error" : ""} help={errors.prevLoanContractNo?.message} required hidden={facilityType !== 'RO'}>
                            <Controller
                                name="prevLoanContractNo"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        loading={cribLoading}
                                        options={Array.isArray(cribDetails) ? cribDetails?.map((item) => ({
                                            value: item?.contractNo ?? '',
                                            label: item?.contractNo ?? '',
                                        })) ?? [] : []}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            const selectedContract = cribDetails?.find((item) => item.contractNo === value);
                                            setValue('prevLoanOutstanding', selectedContract ? Number(selectedContract.totalDues ?? 0) : 0);
                                        }}
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Previous Loan Outstanding'} validateStatus={errors.prevLoanOutstanding ? "error" : ""} help={errors.prevLoanOutstanding?.message} required hidden={facilityType !== 'RO'}>
                            <Controller
                                name="prevLoanOutstanding"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Enter Previous Loan Outstanding"
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

                        <Form.Item label={'Count of Roll Over'} validateStatus={errors.countOfRollOver ? "error" : ""} help={errors.countOfRollOver?.message} required hidden={facilityType !== 'RO'}>
                            <Controller
                                name="countOfRollOver"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Count of Roll Over" type='number' maxLength={2} />
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
                                        placeholder="Loan Amount"
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

                        <Form.Item label={'Terms'} validateStatus={errors.trems ? "error" : ""} help={errors.trems?.message} required hidden={productType === '9' || productType === 'E9'}>
                            <Controller
                                name="trems"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Terms" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Markup Rate'} validateStatus={errors.markup ? "error" : ""} help={errors.markup?.message} required>
                            <Controller
                                name="markup"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Markup Rate" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'IRR'} validateStatus={errors.irr ? "error" : ""} help={errors.irr?.message}>
                            <Controller
                                name="irr"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter IRR" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Calculation Method'} validateStatus={errors.calculationMethod ? "error" : ""} help={errors.calculationMethod?.message} required>
                            {/* hidden={facilityType === 'RO'} */}
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
                                            // disabled: item.calMethodCode === 'S'
                                        }))} />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Payment Frequency'} validateStatus={errors.paymentFrequency ? "error" : ""} help={errors.paymentFrequency?.message} required hidden={calculationMethod !== 'B'}>
                            <Controller
                                name="paymentFrequency"
                                control={control}
                                disabled={facilityType === 'RO'}
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
                                        onChange={(value) => {
                                            field.onChange(value);
                                            if (value === 'M') {
                                                setValue('trems', 1); // Set terms to 1 for monthly payment frequency
                                            } else if (value === 'A') {
                                                setValue('trems', 12); // Set terms to 12 for annually
                                            } else if (value === 'BA') {
                                                setValue('trems', 6); // Set terms to 6 for bi-annually
                                            } else if (value === 'Q') {
                                                setValue('trems', 3); // Set terms to 3 for quarterly
                                            } else if (value === 'HY') {
                                                setValue('trems', 6); // Set terms to 6 for half yearly
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Form.Item>
                        {/* only in Murabaha */}
                        <Form.Item label={'Lease Key Money'} validateStatus={errors.leaseKeyMoney ? "error" : ""} help={errors.leaseKeyMoney?.message} hidden={productType !== '5' && productType !== '1'} required>
                            <Controller
                                name="leaseKeyMoney"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Lease Key Money" />
                                )}
                            />
                        </Form.Item>
                        {/* only in  */}
                        <Form.Item label={'Capital Paid'} validateStatus={errors.capitalPaid ? "error" : ""} help={errors.capitalPaid?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="capitalPaid"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Capital Paid"
                                        style={{ width: '100%' }}
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                        }
                                        step={0.01}
                                        min={0}
                                        stringMode
                                        prefix={'Rs.'}
                                        disabled
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label={'Execution Date'} validateStatus={errors.executionDate ? "error" : ""} help={errors.executionDate?.message} required hidden={productType !== '9' && productType !== 'E9'}>
                            <Controller
                                name="executionDate"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Execution Date" type='date' />
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
                                    <Select {...field} placeholder="Enter Date of Payment" options={
                                        [
                                            {
                                                value: '31',
                                                label: 'End of Month',
                                            }, {
                                                value: '0',
                                                label: 'End of Term',
                                            },
                                        ]
                                    } />
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
                        <Form.Item label={'Cost'} validateStatus={errors.cost ? "error" : ""} help={errors.cost?.message} required hidden={productType !== '1'}>
                            <Controller
                                name="cost"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Enter Cost"
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
                                                            setValue(`structuredPayment.${index}.struRent`, value === 'N' ? 0 : 1000);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Payment Amount"
                                            validateStatus={errors?.structuredPayment?.[index]?.struRent ? 'error' : ''}
                                            help={errors?.structuredPayment?.[index]?.struRent?.message}
                                            required
                                        >
                                            <Controller
                                                name={`structuredPayment.${index}.struRent`}
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
                                        append({ struSeq: 0, struPrds: '', struRent: 0.00, isPayble: 'N' })
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
                                (productDetails === null || productDetails?.specialCharges.length === 0) && facilityType !== 'RO' &&
                                <Empty description='No Special Charges' />
                            }
                            {
                                (trailCalucationData === null || trailCalucationData?.pTrtx?.length === 0) && facilityType === 'RO' &&
                                <Empty description='No Special Charges' />
                            }
                            <div className='grid grid-cols-4 gap-3'>
                                {
                                    facilityType !== 'RO' && productDetails?.specialCharges.map((item, index) => (
                                        <Card key={index} size='small' title={`${specialChargesByCode(item?.prtbCalMetod)}`} extra={
                                            <Checkbox
                                                checked={item?.prtbMndFlg === '1'}
                                                disabled={item?.prtbMndFlg === '1'}
                                                onChange={() => {
                                                    console.log('checked', item?.prtbCalMetod)
                                                }}
                                            />
                                        }>
                                            <Descriptions column={1} key={index}>
                                                <Descriptions.Item label="Method">{specialChargesByCode(item?.prtbCalMetod)}</Descriptions.Item>
                                                <Descriptions.Item label="Charge Amount">{formatCurrency(Number(item?.prtbCalAmt ?? 0))}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    ))
                                }



                                {
                                    facilityType === 'RO' && trailCalucationData !== null && trailCalucationData?.pTrtx?.map((item, index) => (
                                        <Card key={index} size='small' title={`${specialChargesByCode(item?.trtxCalMethod ?? '')}`} extra={
                                            <Checkbox
                                                checked={item?.prtbMndFlg === '1'}
                                                disabled={item?.prtbMndFlg === '1'}
                                                onChange={() => {
                                                    console.log('checked', item?.prtbMndFlg)
                                                }}
                                            />
                                        }>
                                            <Descriptions column={1} key={index}>
                                                <Descriptions.Item label="Method">{specialChargesByCode(item?.trtxCalMethod ?? '')}</Descriptions.Item>
                                                <Descriptions.Item label="Charge Amount">{formatCurrency(Number(item?.trtxAmt ?? 0))}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    ))
                                }
                            </div>
                        </Card>
                        {
                            trailCalulationDetails?.object.tcNo !== undefined &&
                            <Card size='small' title={'Latest Trial Calculation'}
                                styles={{
                                    header: {
                                        backgroundColor: '#002140',
                                        fontStyle: 'bold',
                                    },
                                    title: {
                                        color: 'white',
                                    },
                                }}
                                loading={trailCalulationDetailsLoading}
                            >
                                {trailCalulationDetails?.object?.facilityDetails !== undefined &&
                                    <div className='grid grid-cols-2 gap-3'>
                                        <Card size='small' title={'Installment Details'} className='mb-3'>
                                            {
                                                trailCalulationDetails?.object?.facilityDetails.map((item, index) => (
                                                    <Descriptions column={3} key={index} className='mb-2'>
                                                        <Descriptions.Item label="Sequence" className='w-30'>{item.seq}</Descriptions.Item>
                                                        <Descriptions.Item label={`Trems`} className='w-30'>{item.term}</Descriptions.Item>
                                                        <Descriptions.Item label={`Installment Amount`}>
                                                            <Tag color='green'><b>{formatCurrency(Number(item.instalment ?? 0))}</b></Tag>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                ))
                                            }
                                        </Card>

                                        <Card size='small' title={'Applied Charges Details'} className='mb-3' hidden={trailCalulationDetails?.object?.facilityDetails === undefined}>
                                            {
                                                trailCalulationDetails?.object?.trtx.map((item, index) => (
                                                    <Descriptions column={2} key={index}>
                                                        <Descriptions.Item label="Method">{specialChargesByCode(item?.trtxTrx)}</Descriptions.Item>
                                                        <Descriptions.Item label="Charge Amount"><Tag color='green'><b>{formatCurrency(Number(item?.trtxAmt ?? 0))}</b></Tag></Descriptions.Item>
                                                    </Descriptions>
                                                ))
                                            }
                                        </Card>
                                    </div>
                                }
                                <Card size='small' title={'Loan Calculation Details'} className='mb-3'>
                                    <Descriptions column={4}>
                                        <Descriptions.Item label="TC Number">{trailCalulationDetails?.object.tcNo ?? '-'}</Descriptions.Item>
                                        <Descriptions.Item label="Loan Amount"><Tag color='green'><b>{formatCurrency(Number(trailCalulationDetails?.object.loanAmount ?? 0))}</b></Tag></Descriptions.Item>
                                        <Descriptions.Item label="Down Payment Amount"><Tag color='green'><b>{formatCurrency(Number(trailCalulationDetails?.object.downPayment ?? 0))}</b></Tag></Descriptions.Item>
                                        <Descriptions.Item label="Total Receivable"><Tag color='green'><b>{formatCurrency(Number(trailCalulationDetails?.object.totalReceivable ?? 0))}</b></Tag></Descriptions.Item>
                                    </Descriptions>

                                </Card>
                            </Card>
                        }

                    </div>

                    <div className='mb-5'>

                    </div>
                    <div>
                        <Button type="primary" className='mr-2' icon={<SaveOutlined />} loading={trailCalulationLoading} onClick={
                            saveCalculationHandle
                        } hidden={!isSaveShow}>
                            Save Calculation
                        </Button>
                        <Button type="primary" htmlType="submit" className='mr-2' icon={<CalculatorOutlined />} loading={trailCalulationLoading || trailCalulationDetailsLoading} hidden={isSaveShow}>
                            Trial Calculate
                        </Button>
                        <Button type="default" onClick={onRestHandle} className='mr-2' danger icon={<UndoOutlined />} loading={trailCalucationDataLoading}>
                            Reset
                        </Button>
                    </div>
                </Form >
            </Card >
        </div >
    )
}

export default TrialCalculation