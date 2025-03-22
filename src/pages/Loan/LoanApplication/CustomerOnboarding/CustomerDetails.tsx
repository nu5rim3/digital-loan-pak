import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Card, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import useCustomerStore from "../../../../store/customerStore";
import useCommonStore from "../../../../store/commonStore";
import useLoanStore from "../../../../store/loanStore";
const { Search } = Input;

// ✅ Validation Schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    initals: yup.string().required("Initials is required"),
    surname: yup.string().required("Surname is required"),
    telcoProvider: yup.string().required("Operator is required"),
    contactNumber: yup.string().required("Contact Number is required"),
    identificationType: yup.string().required("Identification Type is required"),
    identificationNumber: yup.string().required("Identification Number is required"),
});

interface ICustomerDetails {
    setCustomerIdx: (idx: string) => void;
    setCustomerCNIC: (cnic: string) => void;
    setApprovalStatus: (status: string) => void;
}

const CustomerDetails: React.FC<ICustomerDetails> = ({ setCustomerIdx, setCustomerCNIC, setApprovalStatus }) => {
    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const [searchValue, setSearchValue] = useState('');

    const { customer, customerLoading, selectedCustomer, addCustomer, fetchCustomerByCNIC } = useCustomerStore();
    const { operatorLoading, operators, fetchOperators } = useCommonStore();
    const { loan } = useLoanStore();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {

        const postData = { ...data, type: "G", fullName: `${data.name} ${data.initals} ${data.surname}`, appraisalId: loan?.idx }
        delete postData['name']
        delete postData['initals']
        delete postData['surname']

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await addCustomer({ ...postData })
        if (response) {
            setCustomerIdx(response?.idx);
            setCustomerCNIC(response?.identificationNumber);
        }

    };

    useEffect(() => {
        if (customer) {
            setCustomerCNIC(customer?.identificationNumber);
            setCustomerIdx(customer?.idx || '');
        }
    }, [customer, setCustomerCNIC, setCustomerIdx]);


    const handleSearch = (value: string) => {
        console.log('handleSearch : ', value);
        fetchCustomerByCNIC(value)
        setCustomerCNIC(value)
    }

    const clearSreach = () => {
        setSearchValue('')
        setCustomerIdx('')
        setCustomerCNIC('')
        setApprovalStatus('')
    }

    const formRest = () => {
        reset()
        clearSreach()
    }

    console.log('selectedCustomer : ', selectedCustomer);

    const loadFormvalue = () => {
        fetchOperators()
    }

    useEffect(() => {
        loadFormvalue()
    }, [])

    const formatCNIC = (value: string) => {
        const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
        const match = cleaned.match(/^(\d{0,5})(\d{0,7})?(\d{0,1})?$/);
        if (!match) return value;

        return [match[1], match[2], match[3]]
            .filter(Boolean) // Remove empty groups
            .join("-");
    };

    return (
        <Card title={'Customer Onboarding'}>
            <Form layout="vertical">
                <div>
                    <Form.Item label="Search Customer using CNIC">
                        <Space.Compact className='flex-1'>
                            <Search
                                value={searchValue}
                                onChange={(e) => {
                                    const formatted = formatCNIC(e.target.value);
                                    setSearchValue(formatted)
                                }}
                                placeholder="Search..."
                                enterButton
                                style={{ width: 500 }}
                                onSearch={handleSearch}
                            />
                            <Button type="default" onClick={clearSreach} danger icon={<CloseCircleOutlined />} />
                        </Space.Compact>
                    </Form.Item>
                </div>
            </Form>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>

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

                        <Form.Item label="Operator" validateStatus={errors.telcoProvider ? "error" : ""} help={errors.telcoProvider?.message} required>
                            <Controller
                                name="telcoProvider"
                                control={control}
                                render={({ field }) =>

                                    <Select {...field} placeholder="Select an Operator" allowClear loading={operatorLoading} options={operators.map((item) => ({
                                        label: item.vendorDesc,
                                        value: item.vendorDesc
                                    }))}>
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
                                        <Select.Option value="CNIC">CNIC</Select.Option>
                                    </Select>
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Identification Number" validateStatus={errors.identificationNumber ? "error" : ""} help={errors.identificationNumber?.message} required>
                            <Controller
                                name="identificationNumber"
                                control={control}
                                render={({ field }) =>
                                    <Input {...field}
                                        maxLength={15} // Max length considering dashes
                                        placeholder="xxxxx-xxxxxxx-x"
                                        onChange={(e) => {
                                            const formatted = formatCNIC(e.target.value);
                                            setValue("identificationNumber", formatted, { shouldValidate: true });
                                        }}
                                    />}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <Button type="primary" htmlType="submit" loading={customerLoading}>
                        Save and Verify
                    </Button>
                    <Button type="default" onClick={formRest} danger>
                        Reset
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default CustomerDetails;
