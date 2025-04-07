import React, { useEffect } from 'react'
import { Form, Input, Select, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useWitnessStore from '../../../store/witnessStore';
import useCommonStore from '../../../store/commonStore';

interface ICreateWitness {
    appId: string;
}

const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    cnic: yup.string().required("CNIC Number is required"),
    addressType: yup.string().required("Address Type is required"),
    addressLine1: yup.string().required("Address Line 1 is required"),
    addressLine2: yup.string().required("Address Line 2 is required"),
    operator: yup.string().required("Operator is required"),
    contactNumber: yup.string().required("Contact Number is required"),
});

const { Option } = Select;

const CreateWitness: React.FC<ICreateWitness> = ({ appId }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { witness, witnessLoading, addWitness } = useWitnessStore();
    const { operators, operatorLoading, fetchOperators } = useCommonStore()


    useEffect(() => {
        fetchOperators()
    }, [appId])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        console.log("Form Data:", data);
        addWitness({ ...data, appraisalID: appId }).then(() => {
            reset();
        })
    }


    console.log('appId : ', appId);
    console.log('witness : ', witness);

    return (
        <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
        >
            <div className="grid grid-cols-2 gap-3">
                <Form.Item validateStatus={errors.firstName ? "error" : ""} help={errors.firstName?.message} label="First Name" required>
                    <Controller name="firstName" control={control} render={({ field }) => <Input {...field} placeholder="First Name" />} />
                </Form.Item>
                <Form.Item validateStatus={errors.lastName ? "error" : ""} help={errors.lastName?.message} label="Last Name" required>
                    <Controller name="lastName" control={control} render={({ field }) => <Input {...field} placeholder="Last Name" />} />
                </Form.Item>
                <Form.Item validateStatus={errors.cnic ? "error" : ""} help={errors.cnic?.message} label="CNIC Number" required>
                    <Controller name="cnic" control={control} render={({ field }) => <Input {...field} placeholder="Enter CNIC Number" />} />
                </Form.Item>
                <Form.Item validateStatus={errors.addressType ? "error" : ""} help={errors.addressType?.message} label="Address Type" required>
                    <Controller
                        name="addressType"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} placeholder="Select an Address Type" >
                                <Option value="home">Home</Option>
                                <Option value="office">Office</Option>
                            </Select>
                        )}
                    />
                </Form.Item>
                <Form.Item validateStatus={errors.addressLine1 ? "error" : ""} help={errors.addressLine1?.message} label="Address Line 1" required>
                    <Controller name="addressLine1" control={control} render={({ field }) => <Input {...field} placeholder="Address Line 1" />} />
                </Form.Item>
                <Form.Item validateStatus={errors.addressLine2 ? "error" : ""} help={errors.addressLine2?.message} label="Address Line 2">
                    <Controller name="addressLine2" control={control} render={({ field }) => <Input {...field} placeholder="Address Line 2" />} />
                </Form.Item>
                <Form.Item validateStatus={errors.operator ? "error" : ""} help={errors.operator?.message} label="Operator" required>
                    <Controller
                        name="operator"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} placeholder="Select an Operator Type" loading={operatorLoading} options={operators.map((value) => {
                                return {
                                    label: value.vendorDesc,
                                    value: value.vendorDesc
                                }
                            })} >
                            </Select>
                        )}
                    />
                </Form.Item>
                <Form.Item validateStatus={errors.contactNumber ? "error" : ""} help={errors.contactNumber?.message} label="Contact Number" required>
                    <Controller name="contactNumber" control={control} render={({ field }) => <Input {...field} placeholder="Enter Contact Number" />} />
                </Form.Item>
            </div>

            <div className="flex gap-2 justify-end">
                <Button type="primary" htmlType="submit" loading={witnessLoading}>Save</Button>
                <Button type="default" htmlType="reset" onClick={() => reset()} danger>Reset</Button>
            </div>
        </Form>
    )
}

export default CreateWitness