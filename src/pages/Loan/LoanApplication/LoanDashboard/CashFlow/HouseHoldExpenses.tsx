/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Collapse, Descriptions, Empty, Form, InputNumber, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCreditStore, { IFinancialEntry } from '../../../../../store/creditStore';
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import CommonModal from '../../../../../components/common/modal/commonModal';
import { formatCurrency, formatSentence } from '../../../../../utils/formatterFunctions';
import { useParams } from 'react-router-dom';

const schema = yup.object().shape({
    key: yup.string().required('Key is required'),
    monthly: yup.string(),
    semiAnnual: yup.string(),
    annually: yup.string(),
}).test(
    'at-least-one-value',
    'At least one of Monthly, Semi-Annual, or Annually must be provided',
    function (value) {
        return (
            !!value.monthly?.trim() ||
            !!value.semiAnnual?.trim() ||
            !!value.annually?.trim()
        );
    }
);

const HouseHoldExpenses: React.FC = () => {
    const { appId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<IFinancialEntry | null>(null);
    const { control, formState: { errors }, setValue, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            monthly: '0.00',
            semiAnnual: '0.00',
            annually: '0.00'
        }

    });
    const [activeField, setActiveField] = useState<'monthly' | 'semiAnnual' | 'annually' | null>(null);

    const { cashFlows, cashFlowsLoading, houseHoldExpenses, addHouseHoldExpenses, updateHouseHoldExpenses, removeHouseHoldExpenses, fetchHouseHoldExpenses, calculateTotalBusinessExpense,
        calculateTotalExpense, calculateTotalHouseholdExpense, calculateNetMonthlyDisposable, calculateAnnualDisposable, fetchCashFlows,
        calculateAnnualHousehold, calculateAnnualRevenue, checkAlegibleFroLoan, calculateMaxDebtBurden, calculateTaxableAmount, calucalteMaxLoanValue
    } = useCreditStore()

    useEffect(() => {
        fetchCashFlows(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    useEffect(() => {
        if (cashFlows) {
            addHouseHoldExpenses(cashFlows?.houseHoldExpenses ?? [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cashFlows])

    const openModal = (mode: 'save' | 'update' | 'remove', details: IFinancialEntry | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('key', details.key);
            setValue('monthly', details.monthly);
            setValue('semiAnnual', details.semiAnnual);
            setValue('annually', details.annually);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IFinancialEntry) => {
        if (mode === 'update') {
            updateHouseHoldExpenses(selectedDetail?.key ?? '', data).finally(closeModal);
        } else if (mode === 'save') {
            addHouseHoldExpenses(data).finally(closeModal);
        } else if (mode === 'remove') {
            removeHouseHoldExpenses(selectedDetail?.key ?? '').finally(closeModal);
        }
    };

    useEffect(() => {
        fetchHouseHoldExpenses()
        calculateTotalBusinessExpense()
        calculateTotalExpense()
        calculateTotalHouseholdExpense()
        calculateNetMonthlyDisposable()
        calculateAnnualDisposable()
        calculateAnnualHousehold()
        calculateAnnualRevenue()
        calculateMaxDebtBurden()
        calucalteMaxLoanValue()
        checkAlegibleFroLoan()
        calculateTaxableAmount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addHouseHoldExpenses, houseHoldExpenses])

    const monthly = watch('monthly');
    const semiAnnual = watch('semiAnnual');
    const annually = watch('annually');

    const _monthly = parseFloat(monthly ?? '0.00')
    const _semiAnnual = parseFloat(semiAnnual ?? '0.00')
    const _annually = parseFloat(annually ?? '0.00')


    // Monthly drives the rest
    useEffect(() => {
        if (activeField === 'monthly') {
            const m = _monthly;
            if (!isNaN(m)) {
                setValue('semiAnnual', (m * 6).toFixed(2));
                setValue('annually', (m * 12).toFixed(2));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthly]);

    // Semi-Annual drives the rest
    useEffect(() => {
        if (activeField === 'semiAnnual') {
            const s = _semiAnnual;
            if (!isNaN(s)) {
                setValue('monthly', (s / 6).toFixed(2));
                setValue('annually', (s * 2).toFixed(2));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [semiAnnual]);

    // Annually drives the rest
    useEffect(() => {
        if (activeField === 'annually') {
            const a = _annually;
            if (!isNaN(a)) {
                setValue('monthly', (a / 12).toFixed(2));
                setValue('semiAnnual', (a / 2).toFixed(2));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annually]);

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `Household Expenses`,
                        children: (
                            <>
                                <div className='flex justify-end pb-3' hidden={cashFlows?.houseHoldExpenses !== null}>
                                    <Button type="primary" onClick={() => openModal('save')} icon={<PlusOutlined />}>
                                        Add Household Expenses
                                    </Button>
                                </div>

                                {
                                    houseHoldExpenses.length === 0 ? (
                                        <div className='flex flex-1 justify-center' >
                                            <Empty description={"No Household Expenses Found"} />
                                        </div>
                                    ) : (
                                        <div className='grid grid-cols-5 gap-4'>
                                            {
                                                houseHoldExpenses.map((detail, index) => (
                                                    <DetailsCard
                                                        key={index}
                                                        loading={cashFlowsLoading}
                                                        cashFlows={cashFlows}
                                                        detail={detail}
                                                        onEdit={() => openModal('update', detail)}
                                                        onRemove={() => openModal('remove', detail)}
                                                    />
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                ]}
            />

            <CommonModal
                title={`${formatSentence(mode)} Revenue`}
                open={isModalOpen}
                onClose={closeModal}
                footer={true}
                size='large'
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubmit(onSubmit)}
                >
                    <div className='grid grid-cols-4 gap-2'>
                        <Form.Item label="Key" validateStatus={errors.key ? 'error' : ''} help={errors.key?.message} required>
                            <Controller
                                name="key"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Key"
                                        options={[
                                            { value: 'Food', label: 'Food' },
                                            { value: 'Rent', label: 'Rent' },
                                            { value: 'Utilities', label: 'Utilities' },
                                            { value: 'Transportation', label: 'Transportation' },
                                            { value: 'Insurance', label: 'Insurance' },
                                            { value: 'Healthcare', label: 'Healthcare' },
                                            { value: 'Entertainment', label: 'Entertainment' },
                                            { value: 'Clothing', label: 'Clothing' },
                                            { value: 'Education', label: 'Education' },
                                            { value: 'Miscellaneous', label: 'Miscellaneous' },
                                            { value: 'Loan Repayment', label: 'Loan Repayment' },
                                            { value: 'Religious', label: 'Religious' },
                                            { value: 'Events', label: 'Events' },
                                            { value: 'Coummunication', label: 'Communication' },
                                            { value: 'Tax', label: 'Tax' },
                                            { value: 'License', label: 'License' },
                                            { value: 'Other', label: 'Other' },
                                        ]}
                                    />
                                )}
                            />

                        </Form.Item>
                        <Form.Item label="Monthly" validateStatus={errors.monthly ? 'error' : ''} help={errors.monthly?.message}>
                            <Controller
                                name="monthly"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Monthly"
                                        style={{ width: '100%' }}
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                        }
                                        parser={(value) =>
                                            value ? parseFloat(value.replace(/[^0-9.]/g, '')).toFixed(2) : ''
                                        }
                                        step={0.01}
                                        min={0}
                                        stringMode // keeps precision in string format
                                        onFocus={() => setActiveField('monthly')}
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Semi Annual" validateStatus={errors.semiAnnual ? 'error' : ''} help={errors.semiAnnual?.message}>
                            <Controller
                                name="semiAnnual"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Semi Annual"
                                        style={{ width: '100%' }}
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                        }
                                        parser={(value) =>
                                            value ? parseFloat(value.replace(/[^0-9.]/g, '')).toFixed(2) : ''
                                        }
                                        step={0.01}
                                        min={0}
                                        stringMode // keeps precision in string format
                                        onFocus={() => setActiveField('semiAnnual')}
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Annually" validateStatus={errors.annually ? 'error' : ''} help={errors.annually?.message}>
                            <Controller
                                name="annually"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Annually"
                                        style={{ width: '100%' }}
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                        }
                                        parser={(value) =>
                                            value ? parseFloat(value.replace(/[^0-9.]/g, '')).toFixed(2) : ''
                                        }
                                        step={0.01}
                                        min={0}
                                        stringMode // keeps precision in string format
                                        onFocus={() => setActiveField('annually')}
                                    />
                                )}
                            />
                        </Form.Item>

                    </div>
                    <div className='flex pb-5'>
                        <div className='flex-1/4' />
                        <div className='flex-3/4' >
                            {(errors as any)[""]?.message && (
                                <div className="text-red-500 text-sm col-span-4">
                                    {(errors as any)[""]?.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} danger={mode === 'remove'}>
                            {formatSentence(mode)}
                        </Button>
                        <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>
                            Reset
                        </Button>
                        <Button type="default" onClick={closeModal}>
                            Cancel
                        </Button>

                    </div>
                </Form>

            </CommonModal>
        </>
    )
}



const DetailsCard: React.FC<{ detail: IFinancialEntry; onEdit: () => void; onRemove: () => void; loading: boolean; cashFlows: any }> = ({ detail, loading, cashFlows, onEdit, onRemove }) => (
    <Card loading={loading}>
        <div className="flex justify-end gap-1" hidden={cashFlows.houseHoldExpenses !== null}>
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Key">{detail.key}</Descriptions.Item>
            <Descriptions.Item label="Monthly">{formatCurrency(Number(detail?.monthly ?? 0))}</Descriptions.Item>
            <Descriptions.Item label="Semi Annual">{formatCurrency(Number(detail?.semiAnnual ?? 0))}</Descriptions.Item>
            <Descriptions.Item label="Annually">{formatCurrency(Number(detail?.annually ?? 0))}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default HouseHoldExpenses