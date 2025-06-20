import { Button, Card, Form, Select } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextArea from 'antd/es/input/TextArea';
import { CheckSquareOutlined } from '@ant-design/icons';
import useApprovalStore from '../../../../store/approvalStore';
import { QrcodeOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// ✅ Validation Schema
const schema = yup.object().shape({
    type: yup.string().required("Exceptional method is required"),
    remark: yup.string().required("Comment is required"),
});

interface IExceptionalApproval {
    setOtpModalOpen: () => void;
    setNadraModalOpen: () => void;
    idx: string; // Assuming idx is required for the component
    otpVerification?: string; // Optional prop for OTP verification status
    appId?: string; // Optional prop for application ID
    // NADRAStatus: string | null | undefined;
}

const ExceptionalApproval: React.FC<IExceptionalApproval> = ({ setOtpModalOpen, setNadraModalOpen, otpVerification, idx, appId }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();

    const { obExceptionalApprovalLoading, obExceptionalApproval } = useApprovalStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        obExceptionalApproval({ ...data, appraisalIdx: appId ?? '', clienteleIdx: idx }).finally(() => {
            setOtpModalOpen();
        })
    }

    return (
        <Card title="Exceptional Approval">
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-3'>
                    <Form.Item label="Exceptional Method" validateStatus={errors.type ? "error" : ""} help={errors.type?.message} required hidden={otpVerification === 'Y'}>
                        <Controller
                            name='type'
                            control={control}
                            render={({ field }) =>
                                <Select
                                    {...field}
                                    placeholder="Select Exceptional Method"
                                    options={[
                                        { label: 'Black List', value: 'BLACKLIST' },
                                        { label: 'MSAS', value: 'MSASPRO' },
                                        { label: 'Internal Crib', value: 'INTCRIB' },

                                    ]}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        setValue('type', value);
                                    }}
                                />
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Comment" validateStatus={errors.remark ? "error" : ""} help={errors.remark?.message} required hidden={otpVerification === 'Y'}>
                        <Controller
                            name='remark'
                            control={control}
                            render={({ field }) => (
                                <TextArea {...field} />
                            )}
                        />
                    </Form.Item>
                </div>
                <div>
                    <Button type="default" icon={<CaretLeftOutlined />} onClick={() => navigate(-1)} className='mr-3'>
                        Back
                    </Button>
                    <Button type="primary" htmlType="submit" danger icon={<CheckSquareOutlined />} loading={obExceptionalApprovalLoading} className='mr-3' hidden={otpVerification === 'Y'}>Exceptional Approval</Button>
                    {/* <Button type='primary' onClick={() => {
                        navigate(`${mainURL}/loan/application/${loan?.idx ?? ''}`)
                    }} icon={<QrcodeOutlined />} hidden={otpVerification === 'P'} className='mr-3'>Calculate TC</Button> */}
                    <Button type='default' onClick={setNadraModalOpen} icon={<QrcodeOutlined />}>Scan QR</Button>
                </div>
            </Form>
        </Card>
    )
}

export default ExceptionalApproval