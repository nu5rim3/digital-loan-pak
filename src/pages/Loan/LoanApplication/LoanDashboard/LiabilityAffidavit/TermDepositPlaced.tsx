/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Descriptions, Empty, Form, Input, InputNumber, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useLoanStore, { ITermDepositPlaced } from '../../../../../store/loanStore';
import CommonModal from '../../../../../components/common/modal/commonModal';
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { formatCamelCase, formatCurrency, formatSentence } from '../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../store/commonStore';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ITermDeposit {
    // Add any props if needed
}

const schema = yup.object().shape({
    bankCode: yup.string().required('Bank is required'),
    maturityDate: yup.string().required('Maturity Date is required'),
    // days only numbers no leters allow
    days: yup
        .string()
        .matches(/^\d+$/, 'Days must be a valid number')
        .required('Days is required'),
    months: yup.string().required('Months is required'),
    years: yup.string().required('Years is required'),
    profitOfFrequency: yup.string().required('Profit of Frequency is required'),
    tdrAmount: yup.string().required('TDR Amount is required'),
})



const TermDepositPlaced: React.FC<ITermDeposit> = () => {

    const { appId } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<ITermDepositPlaced | null>(null);
    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });


    const { termDepositPlaced, termDepositPlacedLoading, fetchTermDepositByAppId, addTermDepositPlaced, updateTermDepositPlaced, deleteTermDepositPlaced } = useLoanStore()

    const { banks, bankLoading, fetchBanks } = useCommonStore()

    const openModal = (mode: 'save' | 'update' | 'remove', details: ITermDepositPlaced | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('bankCode', details.bankCode);
            setValue('maturityDate', details.maturityDate);
            setValue('days', details.days);
            setValue('months', details.months);
            setValue('years', details.years);
            setValue('profitOfFrequency', details.profitOfFrequency);
            setValue('tdrAmount', details.tdrAmount);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
        fetchTermDepositByAppId(appId ?? '');
    };

    const onSubmit = (data: ITermDepositPlaced) => {
        if (mode === 'update') {
            updateTermDepositPlaced(selectedDetail?.idx ?? '', { ...data, depositPlaced: 'Y' }).finally(closeModal);
        } else if (mode === 'save') {
            addTermDepositPlaced({ ...data, depositPlaced: 'Y', appraisalIdx: appId }).finally(closeModal);
        } else if (mode === 'remove') {
            deleteTermDepositPlaced(selectedDetail?.idx ?? '').finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchTermDepositByAppId(appId ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId, fetchTermDepositByAppId, fetchBanks])

    useEffect(() => {
        fetchBanks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>

            <div className='flex flex-col gap-2'>
                <div className='flex justify-end'>
                    <Button type='primary' icon={<PlusOutlined />} onClick={() => openModal('save')}>Add Term Deposit</Button>
                </div>
                {termDepositPlacedLoading ? (
                    <Empty description="Loading Term Deposit Placed..." />
                ) : termDepositPlaced.length === 0 ? (
                    <Empty description="No Term Deposit Placed" />
                ) : (
                    <div className='grid grid-cols-4 gap-3'>
                        {termDepositPlaced.map((item, index) => (
                            <DetailsCard detail={item} key={index} onEdit={() => openModal('update', item)} onRemove={() => openModal('remove', item)} dataArray={[banks]} />
                        ))}
                    </div>
                )}
            </div>


            <CommonModal
                title={`${mode === 'save' ? 'Add' : mode === 'update' ? 'Update' : 'Remove'} Term Deposit`}
                footer={true}
                open={isModalOpen}
                onClose={closeModal}
                size="large"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-3 gap-3'>
                        <Form.Item label="Bank" validateStatus={errors.bankCode ? 'error' : ''} help={errors.bankCode?.message} required>
                            <Controller
                                name="bankCode"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Select Bank" loading={bankLoading} options={[
                                        ...banks.map((bank) => ({
                                            label: bank.description,
                                            value: bank.code,
                                        }))
                                    ]} />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Profit of Frequency" validateStatus={errors.profitOfFrequency ? 'error' : ''} help={errors.profitOfFrequency?.message} required>
                            <Controller
                                name="profitOfFrequency"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Profit of Frequency" options={[
                                        { label: 'Monthly', value: 'Monthly' },
                                        { label: 'Maturity', value: 'Maturity' },
                                    ]} />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Maturity Date" validateStatus={errors.maturityDate ? 'error' : ''} help={errors.maturityDate?.message} required>
                            <Controller
                                name="maturityDate"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Maturity Date"
                                        type='date'
                                        // only allow current date or feauture dates
                                        min={new Date().toISOString().split('T')[0]} // sets the minimum date to today
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Years" validateStatus={errors.years ? 'error' : ''} help={errors.years?.message} required>
                            <Controller
                                name="years"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Years"
                                        min={0}
                                        step={1}
                                        style={{ width: '100%' }}
                                        suffix="Years"
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Months" validateStatus={errors.months ? 'error' : ''} help={errors.months?.message} required>
                            <Controller
                                name="months"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Months"
                                        min={0}
                                        max={11}
                                        step={1}
                                        style={{ width: '100%' }}
                                        suffix="Months"
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Days" validateStatus={errors.days ? 'error' : ''} help={errors.days?.message} required>
                            <Controller
                                name="days"
                                control={control}
                                render={({ field }) => (
                                    // only input number not e or caracters alter onchange
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Days"
                                        min={0}
                                        step={1}
                                        style={{ width: '100%' }}
                                        suffix="Days"
                                        onChange={
                                            (e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                field.onChange(value);
                                            }
                                        }
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="TDR Amount" validateStatus={errors.tdrAmount ? 'error' : ''} help={errors.tdrAmount?.message} required>
                            <Controller
                                name="tdrAmount"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        placeholder="TDR Amount"
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
                                    />
                                )}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={termDepositPlacedLoading} icon={mode === 'remove' ? <DeleteOutlined /> : <SaveOutlined />} danger={mode === 'remove'}>
                            {formatSentence(mode)}
                        </Button>
                        <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
                        <Button type="default" onClick={closeModal}>Cancel</Button>
                    </div>
                </Form>
            </CommonModal>

        </>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DetailsCard: React.FC<{ detail: ITermDepositPlaced; onEdit: () => void; onRemove: () => void; dataArray: any[] }> = ({ detail, onEdit, onRemove, dataArray }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Bank">{formatCamelCase(dataArray[0].filter((item: any) => item.code === detail.bankCode)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Maturity Date">{detail.maturityDate ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Years">{detail.years ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Months">{detail.months ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Days">{detail.days ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Profit of Frequency">{detail.profitOfFrequency ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="TDR Amount">{formatCurrency(Number(detail.tdrAmount)) ?? '-'}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default TermDepositPlaced