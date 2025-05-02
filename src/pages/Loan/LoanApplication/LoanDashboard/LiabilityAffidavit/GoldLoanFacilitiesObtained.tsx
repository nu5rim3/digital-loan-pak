/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Descriptions, Empty, Form, Input, InputNumber, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useLoanStore, { IGoldLoanFacilities } from '../../../../../store/loanStore';
import CommonModal from '../../../../../components/common/modal/commonModal';
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { formatCamelCase, formatCurrency, formatSentence } from '../../../../../utils/formatterFunctions';
import useCommonStore from '../../../../../store/commonStore';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IGoldLoanFacilitiesObtained {
    // Add any props if needed
}

const schema = yup.object().shape({
    bankCode: yup.string().required('Bank is required'),
    loanAmount: yup.string().required('Loan Amount is required'),
    renewalDate: yup.string().required('Renewal Date is required'),
})
const GoldLoanFacilitiesObtained: React.FC<IGoldLoanFacilitiesObtained> = () => {
    const { appId } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<IGoldLoanFacilities | null>(null);
    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const { goldLoanFacilities, goldLoanFacilitiesLoading, fetchGoldLoanFacilities, addGoldLoanFacilities, updateGoldLoanFacilities, deleteGoldLoanFacilities } = useLoanStore()
    const { banks, bankLoading, fetchBanks } = useCommonStore()

    const openModal = (mode: 'save' | 'update' | 'remove', details: IGoldLoanFacilities | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('bankCode', details.bankCode);
            setValue('loanAmount', details.loanAmount);
            setValue('renewalDate', details.renewalDate);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IGoldLoanFacilities) => {
        if (mode === 'update') {
            updateGoldLoanFacilities(selectedDetail?.idx ?? '', { ...data, facilityObtained: 'Y' }).finally(closeModal);
        } else if (mode === 'save') {
            addGoldLoanFacilities({ ...data, appraisalIdx: appId, facilityObtained: 'Y' }).finally(closeModal);
        } else if (mode === 'remove') {
            deleteGoldLoanFacilities(selectedDetail?.idx ?? '').finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchGoldLoanFacilities(appId ?? '')
        }
    }, [isModalOpen, fetchGoldLoanFacilities, appId, fetchBanks])


    useEffect(() => {
        fetchBanks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='flex justify-end pb-3'>
                <Button type="primary" onClick={() => openModal('save')} icon={<PlusOutlined />}>
                    Add Gold Loan Facility
                </Button>
            </div>
            {goldLoanFacilitiesLoading || bankLoading ? (
                <Empty description="Loading..." />
            ) : (
                <>
                    {goldLoanFacilities.length > 0 ? (
                        <div className='grid grid-cols-4 gap-4'>
                            {
                                goldLoanFacilities.map((detail, index) => (
                                    <DetailsCard key={index} detail={detail} onEdit={() => openModal('update', detail)} onRemove={() => openModal('remove', detail)} dataArray={[banks]} />
                                ))}
                        </div>
                    ) : (
                        <Empty description="No Gold Loan Facilities Obtained" />
                    )}
                </>
            )}
            <CommonModal
                open={isModalOpen}
                onClose={closeModal}
                title={`${formatSentence(mode)} Gold Loan Facility`}
                size="large"
                footer={true}
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-3 gap-3'>
                        <Form.Item label="Bank" validateStatus={errors.bankCode ? 'error' : ''} help={errors.bankCode?.message}>
                            <Controller
                                name="bankCode"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Select Bank" loading={bankLoading} options={
                                        banks.map((bank) => ({
                                            label: bank.description,
                                            value: bank.code,
                                        }))
                                    } />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Loan Amount" validateStatus={errors.loanAmount ? 'error' : ''} help={errors.loanAmount?.message}>
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
                        <Form.Item label="Renewal Date" validateStatus={errors.renewalDate ? 'error' : ''} help={errors.renewalDate?.message}>
                            <Controller
                                name="renewalDate"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Renewal Date" type='date' />
                                )}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={goldLoanFacilitiesLoading} icon={mode === 'remove' ? <DeleteOutlined /> : <SaveOutlined />} danger={mode === 'remove'}>
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
const DetailsCard: React.FC<{ detail: IGoldLoanFacilities; onEdit: () => void; onRemove: () => void; dataArray: any[] }> = ({ detail, onEdit, onRemove, dataArray }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Bank">{formatCamelCase(dataArray[0].filter((item: any) => item.code === detail.bankCode)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Loan Amount">{formatCurrency(Number(detail.loanAmount)) ?? '0.00'}</Descriptions.Item>
            <Descriptions.Item label="Renewal Date">{detail.renewalDate ?? '-'}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default GoldLoanFacilitiesObtained