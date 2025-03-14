import { Button, Card, Form, Input, Tag } from 'antd'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    cnic: yup.string().required("CNIC is required"),
});

const Verification: React.FC = () => {
    const [cardLoading, setCardLoading] = useState(false)
    const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: yupResolver(schema),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log("Form Data:", data)
    }

    return (
        <Card title={'Blacklisted Verification'} loading={cardLoading}>
            <Form>
                <div className="grid grid-cols-3 gap-3">
                    <Form.Item label="Name">
                        <b>Shabira</b>
                    </Form.Item>
                    <Form.Item label="CNIC">
                        <b>12103-24-424-424</b>
                    </Form.Item>
                    <Form.Item label="Blacklist Status">
                        <Tag color="green">Not Blacklisted</Tag>
                        {/* <Tag color="red">Blacklisted</Tag> */}
                    </Form.Item>
                </div>
                <div>
                    <Button type="primary" onClick={handleSubmit(onSubmit)}>Refresh</Button>
                </div>
            </Form>
        </Card>
    )
}

export default Verification