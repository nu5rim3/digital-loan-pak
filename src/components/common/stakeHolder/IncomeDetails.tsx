import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Select, Spin } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonModal from '../modal/commonModal';
import useStakeholderStore, { IIncomeDetails } from '../../../store/stakeholderStore';

interface IIncomeDetail {
    stkId: string
    subTitle?: string
}

const { TextArea } = Input;

const schema = yup.object().shape({
    sourceOfIncome: yup.string().required('Source of Income is required'),
    monthlyIncome: yup.string().required('Monthly Income is required'),
    assetsDesc: yup.string().required('Assets Description is required'),
    totValAssets: yup.string().required('Total Value of Assets is required'),
    totMonIncome: yup.string().required('Total Monthly Income is required'),
});

const sourceOfIncomeOptions = [
    { label: 'Salary Income', value: 'SI' },
    { label: 'Business Income', value: 'BI' },
    { label: 'Agriculture Income', value: 'AI' },
    { label: 'Rental Income', value: 'RI' },
    { label: 'Live Stock', value: 'LS' },
    { label: 'Pension', value: 'PN' }
];


const IncomeDetails: React.FC<IIncomeDetail> = ({ stkId, subTitle }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const [selectedDetail, setSelectedDetail] = useState<IIncomeDetails | null>(null);

    const { control, formState: { errors }, setValue, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });


    const { incomesDetails, incomeDetailsLoading, fetchIncomeDetailsByStkId, addIncomeDetail, updateIncomeDetail } = useStakeholderStore();


    const openModal = (mode: 'create' | 'edit', details: IIncomeDetails | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('sourceOfIncome', details.sourceOfIncome ?? '');
            setValue('monthlyIncome', details.monthlyIncome);
            setValue('assetsDesc', details.assetsDesc);
            setValue('totValAssets', details.totValAssets);
            setValue('totMonIncome', details.totMonIncome);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IIncomeDetails) => {
        if (mode === 'edit') {
            updateIncomeDetail(selectedDetail?.idx ?? '', data).finally(closeModal);
        } else if (mode === 'create') {
            addIncomeDetail(stkId, data).finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchIncomeDetailsByStkId(stkId ?? '');
        }
    }, [stkId, isModalOpen, fetchIncomeDetailsByStkId]);

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                className='w-full'
                items={[
                    {
                        key: '1',
                        label: `Income/Assets Details${subTitle !== undefined ? ': ' + subTitle : ''}`,
                        children: (
                            <>
                                <div className='flex justify-end pb-3'>
                                    <Button type="primary" onClick={() => openModal('create')} icon={<PlusOutlined />}>
                                        Add Income/Assets Details
                                    </Button>
                                </div>
                                {incomeDetailsLoading ?
                                    <div className='flex flex-1 justify-center' >
                                        <Spin spinning={incomeDetailsLoading}>
                                            <Empty description={"Loading Income/Assets Details..."} />
                                        </Spin>
                                    </div> :
                                    <>
                                        {incomesDetails?.length > 0 ?
                                            <div className='grid grid-cols-4 gap-4'>
                                                {incomesDetails?.map((item, index) => (
                                                    <DetailsCard key={index} detail={item} onEdit={() => openModal('edit', item)} />
                                                ))}
                                            </div> :
                                            <div className='flex flex-1 justify-center' >
                                                <Empty description={"No Income/Assets Details Available"} />
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
                title={`${mode === 'create' ? 'Create' : 'Update'} Other Income Details`}
                size="medium"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-3'>
                        <Form.Item label="Source of Income" validateStatus={errors.sourceOfIncome ? 'error' : ''} help={errors.sourceOfIncome?.message} required>
                            <Controller
                                name="sourceOfIncome"
                                control={control}
                                render={({ field }) => <Select {...field} placeholder="Select Source of Income" options={sourceOfIncomeOptions} />}
                            />
                        </Form.Item>
                        <Form.Item label="Monthly Income" validateStatus={errors.monthlyIncome ? 'error' : ''} help={errors.monthlyIncome?.message} required>
                            <Controller
                                name="monthlyIncome"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Monthly Income" />}
                            />
                        </Form.Item>
                        <Form.Item label="Assets Description" validateStatus={errors.assetsDesc ? 'error' : ''} help={errors.assetsDesc?.message} required>
                            <Controller
                                name="assetsDesc"
                                control={control}
                                render={({ field }) => <TextArea {...field} placeholder="Assets Description" />}
                            />
                        </Form.Item>
                        <Form.Item label="Total Value of Assets" validateStatus={errors.totValAssets ? 'error' : ''} help={errors.totValAssets?.message} required>
                            <Controller
                                name="totValAssets"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Total Value of Assets" />}
                            />
                        </Form.Item>
                        <Form.Item label="Total Monthly Income" validateStatus={errors.totMonIncome ? 'error' : ''} help={errors.totMonIncome?.message} required>
                            <Controller
                                name="totMonIncome"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Total Monthly Income" />}
                            />
                        </Form.Item>

                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={incomeDetailsLoading} icon={<SaveOutlined />}>
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

const DetailsCard: React.FC<{ detail: IIncomeDetails; onEdit: () => void; }> = ({ detail, onEdit }) => (
    <Card>
        <div className="flex justify-end">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Source of Income">{detail.sourceOfIncome}</Descriptions.Item>
            <Descriptions.Item label="Monthly Income">{detail.monthlyIncome}</Descriptions.Item>
            <Descriptions.Item label="Assets Description">{detail.assetsDesc}</Descriptions.Item>
            <Descriptions.Item label="Total Value of Assets">{detail.totValAssets}</Descriptions.Item>
            <Descriptions.Item label="Total Monthly Income">{detail.totMonIncome}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default IncomeDetails