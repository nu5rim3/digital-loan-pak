import { Button, Card, Form, Input, Select } from 'antd'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextArea from 'antd/es/input/TextArea';
import { CheckSquareOutlined } from '@ant-design/icons';
import useApprovalStore from '../../../../store/approvalStore';
import useLoanStore from '../../../../store/loanStore';
import useUserStore from '../../../../store/userStore';
import { QrcodeOutlined } from '@ant-design/icons';

// ✅ Validation Schema
const schema = yup.object().shape({
    category: yup.string().required("Exceptional method is required"),
    categoryDec: yup.string().required("Exceptional method is required"),
    remark: yup.string().required("Comment is required"),
});

interface IExceptionalApproval {
    setOtpModalOpen: () => void;
    setNadraModalOpen: () => void;
    // NADRAStatus: string | null | undefined;
}

const ExceptionalApproval: React.FC<IExceptionalApproval> = ({ setOtpModalOpen, setNadraModalOpen }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const { loan } = useLoanStore()
    const { currentRole } = useUserStore()

    const { exceptionalApprovalCategories, exceptionalApprovalCategoriesLoading, appraisalApprovalLoading, fetchExceptionalApprovalCategories, requestExceptionalApproval } = useApprovalStore()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        requestExceptionalApproval({ ...data, roleCode: currentRole?.code, role: currentRole?.description, appraisalIdx: loan?.idx }).then(() => {
            setOtpModalOpen();
        })
    }

    useEffect(() => {
        fetchExceptionalApprovalCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Function to get the description of the selected category
    const getCategoryDescription = (categoryCode: string) => {
        const category = exceptionalApprovalCategories.find(item => item.code === categoryCode);
        return category ? category.description : '';
    }

    return (
        <Card title="Exceptional Approval">
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-3'>
                    <Form.Item label="Exceptional Method" validateStatus={errors.category ? "error" : ""} help={errors.category?.message} required>
                        <Controller
                            name='category'
                            control={control}
                            render={({ field }) => {
                                const options = exceptionalApprovalCategories
                                    .filter(item => item.status === 'A')  // Filter out items with status other than 'A'
                                    .map(item => ({
                                        label: item.description,
                                        value: item.code
                                    }));

                                return (
                                    <Select
                                        {...field}
                                        placeholder="Select Exceptional Method"
                                        loading={exceptionalApprovalCategoriesLoading}
                                        options={options}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            setValue('categoryDec', getCategoryDescription(value));
                                        }}
                                    />
                                )
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Comment" validateStatus={errors.remark ? "error" : ""} help={errors.remark?.message} required>
                        <Controller
                            name='remark'
                            control={control}
                            render={({ field }) => (
                                <TextArea {...field} />
                            )}
                        />
                    </Form.Item>
                    <Form.Item validateStatus={errors.categoryDec ? "error" : ""} help={errors.categoryDec?.message} required hidden>
                        <Controller
                            name='categoryDec'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} />
                            )}
                        />
                    </Form.Item>
                </div>
                <div>
                    <Button type="primary" htmlType="submit" danger icon={<CheckSquareOutlined />} loading={appraisalApprovalLoading}>Exceptional Approval</Button>
                    <Button type='default' onClick={setNadraModalOpen} icon={<QrcodeOutlined />}>Scan QR</Button>
                </div>
            </Form>
        </Card>
    )
}

export default ExceptionalApproval