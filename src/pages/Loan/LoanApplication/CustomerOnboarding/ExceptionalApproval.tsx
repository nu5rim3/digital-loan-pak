import { Button, Card, Form, Select } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextArea from 'antd/es/input/TextArea';
import { CheckSquareOutlined } from '@ant-design/icons';

// ✅ Validation Schema
const schema = yup.object().shape({
    expMethod: yup.string().required("Exceptional method is required"),
    comment: yup.string().required("Comment is required"),
});

const ExceptionalApproval: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log("Form Data:", data)
    }

    return (
        <Card title="Exceptional Approval">
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-3'>
                    <Form.Item label="Exceptional Method" validateStatus={errors.expMethod ? "error" : ""} help={errors.expMethod?.message} required>
                        <Controller
                            name='expMethod'
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Select Exceptional Method">
                                    <Select.Option value="MSAS">MSAS</Select.Option>
                                    <Select.Option value="Blacklist">BlackList</Select.Option>
                                    <Select.Option value="InternalCRIB">Internal CRIB</Select.Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Comment" validateStatus={errors.comment ? "error" : ""} help={errors.comment?.message} required>
                        <Controller
                            name='comment'
                            control={control}
                            render={({ field }) => (
                                <TextArea {...field} />
                            )}
                        />
                    </Form.Item>
                </div>
                <div>
                    <Button type="primary" htmlType="submit" danger icon={<CheckSquareOutlined />}>Exceptional Approval</Button>
                </div>
            </Form>
        </Card>
    )
}

export default ExceptionalApproval