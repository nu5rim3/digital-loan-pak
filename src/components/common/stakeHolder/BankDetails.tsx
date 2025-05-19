/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonModal from '../modal/commonModal';
import { formatSentence } from '../../../utils/formatterFunctions';
import useStakeholderStore, { IPDCDetails } from '../../../store/stakeholderStore';
import useCommonStore from '../../../store/commonStore';

interface IBankDetails {
    stkId: string
}

const schema = yup.object().shape({
    bank: yup.string().required('Bank is required'),
    chequeNo: yup.string().required('Cheque No is required'),
    accountNo: yup.string().required('Account No is required'),
    accountTitle: yup.string().required('Account Title is required'),
});

const BankDetails: React.FC<IBankDetails> = ({ stkId }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const [selectedDetail, setSelectedDetail] = useState<IPDCDetails | null>(null);

    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const { banks, bankLoading, fetchBanks } = useCommonStore();
    const { pdcDetailsLoading, PDCDetails, fetchPDCDetailsByStkId, addPDCDetail, updatePDCDetail } = useStakeholderStore();

    const openModal = (mode: 'create' | 'edit', details: IPDCDetails | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('bank', details.bank ?? '');
            setValue('chequeNo', details.chequeNo);
            setValue('accountNo', details.accountNo);
            setValue('accountTitle', details.accountTitle);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IPDCDetails) => {
        if (mode === 'edit') {
            updatePDCDetail(selectedDetail?.idx ?? '', data).finally(closeModal);
        } else if (mode === 'create') {
            addPDCDetail(stkId, data).finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchPDCDetailsByStkId(stkId ?? '');
        } else {
            if (banks.length === 0) {
                fetchBanks();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stkId, isModalOpen, fetchPDCDetailsByStkId, fetchBanks]);


    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                className='w-full'
                items={[
                    {
                        key: '1',
                        label: `Post Dated Cheque Details`,
                        children: (
                            <>
                                <div className='flex justify-end pb-3'>
                                    <Button type="primary" onClick={() => openModal('create')} icon={<PlusOutlined />}>
                                        Add Post Dated Cheque Details
                                    </Button>
                                </div>
                                {pdcDetailsLoading ?
                                    <div className='flex flex-1 justify-center' >
                                        <Empty description={"Loading Post Dated Cheque Details..."} />
                                    </div> :
                                    <>
                                        {PDCDetails?.length > 0 ?
                                            <div className='grid grid-cols-4 gap-4'>
                                                {PDCDetails?.map((item, index) => (
                                                    <DetailsCard key={index} detail={item} onEdit={() => openModal('edit', item)} dataArray={[banks]} />
                                                ))}
                                            </div> :
                                            <div className='flex flex-1 justify-center' >
                                                <Empty description={"No Post Dated Cheque Details Available"} />
                                            </div>
                                        }
                                    </>
                                }
                            </>

                        )
                    }]} />
            <CommonModal
                footer={true}
                open={isModalOpen}
                onClose={closeModal}
                title={`${mode === 'create' ? 'Create' : 'Update'} Post Dated Cheque Details`}
                size="medium"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-3'>
                        <Form.Item label="Bank" validateStatus={errors.bank ? 'error' : ''} help={errors.bank?.message} required>
                            <Controller
                                name="bank"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        allowClear
                                        placeholder="Select Bank"
                                        options={banks.map((lang) => ({ label: lang.description, value: lang.code }))}
                                        loading={bankLoading}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Cheque No" validateStatus={errors.chequeNo ? 'error' : ''} help={errors.chequeNo?.message} required>
                            <Controller
                                name="chequeNo"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Cheque No" />}
                            />
                        </Form.Item>
                        <Form.Item label="Account No" validateStatus={errors.accountNo ? 'error' : ''} help={errors.accountNo?.message} required>
                            <Controller
                                name="accountNo"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Account No" />}
                            />
                        </Form.Item>
                        <Form.Item label="Account Title" validateStatus={errors.accountTitle ? 'error' : ''} help={errors.accountTitle?.message} required>
                            <Controller
                                name="accountTitle"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Account Title" />}
                            />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={pdcDetailsLoading} icon={<SaveOutlined />}>
                            {mode === 'create' ? 'Save' : 'Update'}
                        </Button>
                        <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
                        <Button type="default" onClick={closeModal}>Cancel</Button>
                    </div>
                </Form>
            </CommonModal>
        </ >
    )
}

const DetailsCard: React.FC<{ detail: IPDCDetails; onEdit: () => void; dataArray: any[] }> = ({ detail, onEdit, dataArray }) => (
    <Card>
        <div className="flex justify-end">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Bank">{formatSentence(dataArray[0].filter((item: any) => item.code === detail.bank)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Cheque No">{detail.chequeNo ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Account No">{detail.accountNo ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Account Title">{detail.accountTitle ?? '-'}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default BankDetails