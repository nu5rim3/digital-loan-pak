import { Button, Card, Descriptions, Form, Input, InputNumber, Select, Tag } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CalculatorOutlined, UndoOutlined } from '@ant-design/icons';

const schema = yup.object().shape({
    productFasility: yup.string(),
    productCategory: yup.string(),
    productType: yup.string(),
    productSubType: yup.string(),
    loanAmount: yup.string(),
    trems: yup.string(),
    markup: yup.string(),
    irr: yup.string(),
    paymentMethod: yup.string(),
    chargeType: yup.string(),
    calculationMethod: yup.string(),
    totalChargeAmount: yup.string(),
});

const TrialCalculation: React.FC = () => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log(data);
    }

    const onRestHandle = () => {
        reset();
    }

    return (
        <div>
            <Card title="Trial Calculation" className='w-full'>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-3">
                        <Form.Item label={'Type of Facility'} validateStatus={errors.productFasility ? "error" : ""} help={errors.productFasility?.message} required>
                            <Controller
                                name="productFasility"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Type of Facility" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Product Category'} validateStatus={errors.productCategory ? "error" : ""} help={errors.productCategory?.message} required>
                            <Controller
                                name="productCategory"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Product Category" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />

                        </Form.Item>

                        <Form.Item label={'Product Type'} validateStatus={errors.productType ? "error" : ""} help={errors.productType?.message} required>
                            <Controller
                                name="productType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Product Type" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Product Sub Type'} validateStatus={errors.productSubType ? "error" : ""} help={errors.productSubType?.message} required>
                            <Controller
                                name="productSubType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Product Sub Type" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
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

                        <Form.Item label={'Terms'} validateStatus={errors.trems ? "error" : ""} help={errors.trems?.message} required>
                            <Controller
                                name="trems"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter Terms" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Markup'} validateStatus={errors.markup ? "error" : ""} help={errors.markup?.message} required>
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

                        <Form.Item label={'Payment Method'} validateStatus={errors.paymentMethod ? "error" : ""} help={errors.paymentMethod?.message} required>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Payment Method" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />

                        </Form.Item>

                        <Form.Item label={'Charge Type'} validateStatus={errors.chargeType ? "error" : ""} help={errors.chargeType?.message} required>
                            <Controller
                                name="chargeType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Charge Type" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />

                        </Form.Item>

                        <Form.Item label={'Calculation Method'} validateStatus={errors.calculationMethod ? "error" : ""} help={errors.calculationMethod?.message} required>
                            <Controller
                                name="calculationMethod"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Calculation Method" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />
                        </Form.Item>

                        <Form.Item label={'Total Charge Amount'} validateStatus={errors.totalChargeAmount ? "error" : ""} help={errors.totalChargeAmount?.message} required>
                            <Controller
                                name="totalChargeAmount"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Enter Total Charge Amount" options={[{
                                        value: '1',
                                        label: '1',
                                    }, {
                                        value: '2',
                                        label: '2',
                                    }, {
                                        value: '3',
                                        label: '3',
                                    }, {
                                        value: '4',
                                        label: '4',
                                    }, {
                                        value: '5',
                                        label: '5',
                                    }]} />
                                )}
                            />
                        </Form.Item>


                    </div>
                    <div className='mb-5'>
                        <Card size='small' title={'Trial Calculation Charges'} styles={{
                            header: {
                                backgroundColor: '#002140',
                                fontStyle: 'bold',
                            },
                            title: {
                                color: 'white',
                            },
                        }}>
                            <Descriptions column={4}>
                                <Descriptions.Item label="Sequences">{'-'}</Descriptions.Item>
                                <Descriptions.Item label="Term">{'-'}</Descriptions.Item>
                                <Descriptions.Item label="TC Number">{'-'}</Descriptions.Item>
                                <Descriptions.Item label="Amount">{'-'}</Descriptions.Item>
                                <Descriptions.Item label="Down Payment Amount"><Tag color='red'><b>100,000.00</b></Tag></Descriptions.Item>
                                <Descriptions.Item label="Total Receivable"><Tag color='red'><b>100,000.00</b></Tag></Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </div>
                    <div>
                        <Button type="primary" htmlType="submit" className='mr-2' icon={<CalculatorOutlined />}>
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