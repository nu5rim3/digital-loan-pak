import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Radio, Select, Card, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
const { Search } = Input;

// ✅ Validation Schema
const schema = yup.object().shape({
    customerType: yup.string().required("Customer Type is required"),
    name: yup.string().required("Name is required"),
    initals: yup.string().required("Initials is required"),
    surname: yup.string().required("Surname is required"),
    operator: yup.string().required("Operator is required"),
    contactNumber: yup.string().required("Contact Number is required"),
    identificationType: yup.string().required("Identification Type is required"),
    identificationNumber: yup.string().required("Identification Number is required"),
    province: yup.string().required("Province is required"),
});

const CustomerDetails = () => {
    const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [cardLoading, setCardLoading] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        setIsSubmit(true)
        setTimeout(() => {
            setIsSubmit(false)
        }, 2000);
        console.log("Form Data:", data)
    };

    const customerType = watch("customerType");

    useEffect(() => {
        setTimeout(() => {
            setCardLoading(false);
        }, 2000);
    }, [])


    return (
        <Card title={'Customer Onboarding'} loading={cardLoading}>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                {/* Customer Type Radio */}
                <Form.Item label="Customer Type" validateStatus={errors.customerType ? "error" : ""} help={errors.customerType?.message} required>
                    <Controller
                        name='customerType'
                        control={control}
                        render={({ field }) => (
                            <Radio.Group {...field}>
                                <Radio value="new">New Customer</Radio>
                                <Radio value="existing">Existing Customer</Radio>
                            </Radio.Group>
                        )}
                    />
                </Form.Item>

                {customerType === "new" && (
                    <div>
                        <div className="grid grid-cols-3 gap-3">
                            <Form.Item label="Name" validateStatus={errors.name ? "error" : ""} help={errors.name?.message} required>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder="Enter name" />}
                                />
                            </Form.Item>

                            <Form.Item label="Initals" validateStatus={errors.initals ? "error" : ""} help={errors.initals?.message} required>
                                <Controller
                                    name="initals"
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder="Enter initals" />}
                                />
                            </Form.Item>
                            <Form.Item label="Surname" validateStatus={errors.surname ? "error" : ""} help={errors.surname?.message} required>
                                <Controller
                                    name="surname"
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder="Enter surname" />}
                                />
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-2 gap-3">

                            <Form.Item label="Operator" validateStatus={errors.operator ? "error" : ""} help={errors.operator?.message} required>
                                <Controller
                                    name="operator"
                                    control={control}
                                    render={({ field }) =>

                                        <Select {...field} placeholder="Select an Operator" allowClear>
                                            <Select.Option value="dialog">Dialog</Select.Option>
                                            <Select.Option value="mobitel">Mobitel</Select.Option>
                                        </Select>
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="Contact Number" validateStatus={errors.contactNumber ? "error" : ""} help={errors.contactNumber?.message} required>
                                <Controller
                                    name="contactNumber"
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder="Enter contact number" />}
                                />
                            </Form.Item>
                            <Form.Item label="Identification Type" validateStatus={errors.identificationType ? "error" : ""} help={errors.identificationType?.message} required>
                                <Controller
                                    name="identificationType"
                                    control={control}
                                    render={({ field }) =>

                                        <Select {...field} placeholder="Select an Identification Type" allowClear>
                                            <Select.Option value="cnic">CNIC</Select.Option>
                                        </Select>
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="Identification Number" validateStatus={errors.identificationNumber ? "error" : ""} help={errors.identificationNumber?.message} required>
                                <Controller
                                    name="identificationNumber"
                                    control={control}
                                    render={({ field }) => <Input {...field} placeholder="Enter identification number" />}
                                />
                            </Form.Item>
                            <Form.Item label="Province" validateStatus={errors.province ? "error" : ""} help={errors.province?.message} required>
                                <Controller
                                    name="province"
                                    control={control}
                                    render={({ field }) =>
                                        <Select {...field} placeholder="Select an Province" allowClear>
                                            <Select.Option value="west">West</Select.Option>
                                            <Select.Option value="north">North</Select.Option>
                                            <Select.Option value="south">South</Select.Option>
                                            <Select.Option value="east">East</Select.Option>
                                        </Select>}
                                />
                            </Form.Item>
                        </div>
                        {/* Submit Button */}
                        <div className="flex flex-row">


                            <Button type="primary" htmlType="submit" className="mt-3" loading={isSubmit}>Save and Verify</Button>
                            <Button type="default" htmlType="reset" className="mt-3 ml-3" onClick={() => reset()}>Reset</Button>
                        </div>

                    </div>
                )}

                {customerType === "existing" && (
                    <>
                        {/* Note */}
                        <Form.Item label="Search Customer using CNIC">
                            <Space.Compact className='flex-1'>
                                <Search
                                    // value={searchValue}
                                    // onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search..."
                                    enterButton
                                    style={{ width: 500 }}
                                // loading={isloading}
                                // onSearch={handleSearch}
                                />
                                <Button type="default" onClick={() => reset()} danger icon={<CloseCircleOutlined />} />
                            </Space.Compact>
                        </Form.Item>
                        {/* Submit Button */}
                        <div className="flex flex-row">


                            <Button type="primary" htmlType="submit" className="mt-3" loading={isSubmit}>Submit and Verify</Button>
                            <Button type="default" htmlType="reset" className="mt-3 ml-3" onClick={() => reset()}>Reset</Button>
                        </div>

                    </>
                )}


            </Form>
        </Card>
    );
};

export default CustomerDetails;
