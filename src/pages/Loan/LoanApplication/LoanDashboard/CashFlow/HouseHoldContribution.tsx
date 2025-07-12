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
    monthly: yup.string().required('Monthly is required').test('is-positive', 'Monthly must be a positive number', (value) => {
        const num = parseFloat(value ?? '0');
        return !isNaN(num) && num > 0;
    }),
    semiAnnual: yup.string().required('Semi-Annual is required').test('is-positive', 'Semi-Annual must be a positive number', (value) => {
        const num = parseFloat(value ?? '0');
        return !isNaN(num) && num > 0;
    }),
    annually: yup.string().required('Annually is required').test('is-positive', 'Annually must be a positive number', (value) => {
        const num = parseFloat(value ?? '0');
        return !isNaN(num) && num > 0;
    }),
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

const HouseHoldContribution: React.FC = () => {
    const { appId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<IFinancialEntry | null>(null);
    const { control, formState: { errors }, setValue, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema),
    });
    const [activeField, setActiveField] = useState<'monthly' | 'semiAnnual' | 'annually' | null>(null);
    const { cashFlows, cashFlowsLoading, houseHoldContribution, addHouseHoldContribution, updateHouseHoldContribution,
        fetchHouseHoldContribution, removeHouseHoldContribution, calculateTotalHouseRevenue, calculateTotalRevenue, calculateApplicantRevenue,
        calculateNetMonthlyDisposable, calculateAnnualDisposable, calculateAnnualHousehold, calculateAnnualRevenue,
        calculateMaxDebtBurden, checkAlegibleFroLoan, calucalteMaxLoanValue, calculateTaxableAmount, fetchCashFlows } = useCreditStore();

    useEffect(() => {
        fetchCashFlows(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    useEffect(() => {
        if (cashFlows) {
            addHouseHoldContribution(cashFlows?.houseHoldContribution ?? [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cashFlows])

    const openModal = (mode: 'save' | 'update' | 'remove', details: IFinancialEntry | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('key', details.key);
            setValue('monthly', details.monthly ?? '0.00');
            setValue('semiAnnual', details.semiAnnual ?? '0.00');
            setValue('annually', details.annually ?? '0.00');
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
            updateHouseHoldContribution(selectedDetail?.key ?? '', data).finally(closeModal);
        } else if (mode === 'save') {
            addHouseHoldContribution(data).finally(closeModal);
        } else if (mode === 'remove') {
            removeHouseHoldContribution(selectedDetail?.key ?? '').finally(closeModal);
        }
    };

    useEffect(() => {
        fetchHouseHoldContribution()
        calculateTotalHouseRevenue()
        calculateTotalRevenue()
        calculateApplicantRevenue()
        calculateNetMonthlyDisposable()
        calculateAnnualDisposable()
        calculateAnnualHousehold()
        calculateAnnualRevenue()
        calculateMaxDebtBurden()
        calucalteMaxLoanValue()
        checkAlegibleFroLoan()
        calculateTaxableAmount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addHouseHoldContribution, houseHoldContribution])

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

    const usedTypes = React.useMemo(
        () => houseHoldContribution.map((detail) => detail.key),
        [houseHoldContribution]
    );

    const options = [
        { value: 'Salaries', label: 'Salaries' },
        { value: 'Wages', label: 'Wages' },
        { value: 'Pension', label: 'Pension' },
        { value: 'Remittance', label: 'Remittance' },
        { value: 'Business', label: 'Business' },
        { value: 'Other', label: 'Other' },
    ];

    const diabledOptions = options.map(option => {
        return {
            ...option,
            disabled: usedTypes.includes(option.value)
        }
    })

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[
                    {
                        key: '1',
                        label: `House Hold Contribution`,
                        children: (
                            <>
                                <div className='flex justify-end pb-3'>
                                    <Button type="primary" onClick={() => openModal('save')} icon={<PlusOutlined />}>
                                        Add House Hold Contribution
                                    </Button>
                                </div>

                                {
                                    houseHoldContribution.length === 0 ? (
                                        <div className='flex flex-1 justify-center' >
                                            <Empty description={"No Revenue Details Found"} />
                                        </div>
                                    ) : (
                                        <div className='grid grid-cols-5 gap-4'>
                                            {
                                                houseHoldContribution.map((detail, index) => (
                                                    <DetailsCard
                                                        key={index}
                                                        loading={cashFlowsLoading}
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
                title={`${formatSentence(mode)} House Hold Contribution Details`}
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
                        <Form.Item label="Contribution" validateStatus={errors.key ? 'error' : ''} help={errors.key?.message} required>
                            <Controller
                                name="key"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Key"
                                        options={diabledOptions}
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
                                        stringMode // keeps precision in string format
                                        onFocus={() => setActiveField('monthly')}
                                        onChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Semi Annually" validateStatus={errors.semiAnnual ? 'error' : ''} help={errors.semiAnnual?.message}>
                            <Controller
                                name="semiAnnual"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="Semi Annually"
                                        style={{ width: '100%' }}
                                        formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value?.toString().indexOf('.') === -1 ? '.00' : '')
                                        }
                                        parser={(value) =>
                                            value ? parseFloat(value.replace(/[^0-9.]/g, '')).toFixed(2) : ''
                                        }
                                        step={0.01}
                                        stringMode // keeps precision in string format
                                        onFocus={() => setActiveField('semiAnnual')}
                                        onChange={(value) =>
                                            field.onChange(Number(value))
                                        }
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
                                        stringMode // keeps precision in string format
                                        onFocus={() => setActiveField('annually')}
                                        onChange={(value) =>
                                            field.onChange(Number(value))
                                        }
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

const DetailsCard: React.FC<{ detail: IFinancialEntry; onEdit: () => void; onRemove: () => void; loading: boolean; }> = ({ detail, loading, onEdit, onRemove }) => (
    <Card loading={loading}>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Contribution">{detail.key}</Descriptions.Item>
            <Descriptions.Item label="Monthly">{formatCurrency(Number(detail?.monthly ?? 0))}</Descriptions.Item>
            <Descriptions.Item label="Semi Annually">{formatCurrency(Number(detail?.semiAnnual ?? 0))}</Descriptions.Item>
            <Descriptions.Item label="Annually">{formatCurrency(Number(detail?.annually ?? 0))}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default HouseHoldContribution