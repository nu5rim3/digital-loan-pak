import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Card, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { CloseCircleOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
import useCommonStore from "../../../store/commonStore";
import useCustomerStore from "../../../store/customerStore";
import useLoanStore from "../../../store/loanStore";
import { formatCNIC } from "../../../utils/formatterFunctions";
import useGuarantorStore from "../../../store/guarantorStore";
// import { useNavigate } from "react-router-dom";
const { Search } = Input;

// ✅ Validation Schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    initals: yup.string().required("Initial is required"),
    surname: yup.string(),
    telcoProvider: yup.string().required("Operator Name is required"),
    contactNumber: yup.string().required("Contact Number is required").matches(/^[0-9]{11}$/, "Contact Number must be 11 digits"),
    identificationType: yup.string().required("Identification Type is required"),
    identificationNumber: yup.string().required("Identification Number is required"),
});

interface IFormDetails {
    type: string;
    setIdx: (idx: string) => void;
    setCNIC: (cnic: string) => void;
    setApprovalStatus: (status: string) => void;
    appId?: string | null
}

const FormDetails: React.FC<IFormDetails> = ({ type, appId, setIdx, setCNIC, setApprovalStatus }) => {
    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    const [searchValue, setSearchValue] = useState('');

    const { selectedCustomer, customer, customerLoading, addCustomer, fetchCustomerByCNIC, resetCustomer } = useCustomerStore();
    const { selectedGuarantor, guarantor, guarantorLoading, addGuarantor, fetchGuarantorByCNIC } = useGuarantorStore()
    const { operatorLoading, operators, fetchOperators } = useCommonStore();
    const { loan } = useLoanStore();
    // const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {

        const postData = { ...data, fullName: `${data.name ?? ''} ${data.initals ?? ''} ${data.surname ?? ''}`, appraisalId: appId ?? loan?.idx }
        delete postData['name']
        delete postData['initals']
        delete postData['surname']

        if (type === 'C') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await addCustomer({ ...postData, type: type })
            if (response) {
                setIdx(response?.idx);
                setCNIC(response?.identificationNumber);
            }
        } else if (type === 'G') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await addGuarantor({ ...postData, type: type })
            if (response) {
                setIdx(response?.idx);
                setCNIC(response?.identificationNumber);
            }
        }
    };

    useEffect(() => {
        if (customer && type === 'C') {
            setCNIC(customer?.identificationNumber);
            setIdx(customer?.idx || '');
        }
        if (guarantor && type === 'G') {
            setCNIC(guarantor?.identificationNumber);
            setIdx(guarantor?.idx || '');
        }
    }, [type, guarantor, customer, setCNIC, setIdx]);


    const handleSearch = (value: string) => {
        if (type === 'C') {
            fetchCustomerByCNIC(value)
        } else if (type === 'G') {
            fetchGuarantorByCNIC(value)
        }
        setCNIC(value)
    }

    const clearSreach = () => {
        setSearchValue('')
        setIdx('')
        setCNIC('')
        setApprovalStatus('')
    }

    const formRest = () => {
        reset()
        clearSreach()
        resetCustomer()
    }

    const loadFormvalue = () => {
        fetchOperators()
    }

    useEffect(() => {
        loadFormvalue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (type === 'C' && selectedCustomer) {
            setValue("name", selectedCustomer?.fullName?.split(' ')[0] || '');
            setValue("initals", selectedCustomer?.fullName?.split(' ')[1] || '');
            setValue("surname", selectedCustomer?.fullName?.split(' ')[2] || '');
            setValue("telcoProvider", selectedCustomer?.telcoProvider || '');
            setValue("contactNumber", selectedCustomer?.contactNumber || '');
            setValue("identificationType", selectedCustomer?.identificationType || '');
            setValue("identificationNumber", selectedCustomer?.identificationNumber || '');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomer])

    useEffect(() => {
        if (type === 'G' && selectedGuarantor) {
            setValue("name", selectedGuarantor?.fullName?.split(' ')[0] || '');
            setValue("initals", selectedGuarantor?.fullName?.split(' ')[1] || '');
            setValue("surname", selectedGuarantor?.fullName?.split(' ')[2] || '');
            setValue("telcoProvider", selectedGuarantor?.telcoProvider || '');
            setValue("contactNumber", selectedGuarantor?.contactNumber || '');
            setValue("identificationType", selectedGuarantor?.identificationType || '');
            setValue("identificationNumber", selectedGuarantor?.identificationNumber || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGuarantor])

    return (
        <Card title={`${type === 'C' ? 'Customer' : 'Guarantor'} Onboarding`}>
            <Form layout="vertical">
                <div>
                    <Form.Item label={`Search By ${type === 'C' ? 'Customer' : 'Guarantor'} CNIC`}>
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

                        <Form.Item label="Initial" validateStatus={errors.initals ? "error" : ""} help={errors.initals?.message} required>
                            <Controller
                                name="initals"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Initial" />}
                            />
                        </Form.Item>
                        <Form.Item label="Surname" validateStatus={errors.surname ? "error" : ""} help={errors.surname?.message}>
                            <Controller
                                name="surname"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter surname" />}
                            />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-3">

                        <Form.Item label="Operator Name" validateStatus={errors.telcoProvider ? "error" : ""} help={errors.telcoProvider?.message} required>
                            <Controller
                                name="telcoProvider"
                                control={control}
                                render={({ field }) =>

                                    <Select {...field} placeholder="Select an Operator Name" allowClear loading={operatorLoading} options={operators.map((item) => ({
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
                                render={({ field }) =>
                                    <Input
                                        {...field}
                                        placeholder="Enter Contact Number"
                                        maxLength={11}
                                        style={{ width: '100%' }}
                                        type="text"
                                        onKeyDown={e => {
                                            // Allow control keys (backspace, delete, arrows, etc.)
                                            if (
                                                !/[0-9]/.test(e.key) &&
                                                e.key !== 'Backspace' &&
                                                e.key !== 'Delete' &&
                                                e.key !== 'ArrowLeft' &&
                                                e.key !== 'ArrowRight' &&
                                                e.key !== 'Tab'
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={e => {
                                            // Allow clearing the input
                                            const value = e.target.value;
                                            // If user clears input, value is '', allow it
                                            const sanitized = value === '' ? '' : value.replace(/\D/g, '').slice(0, 11);
                                            field.onChange(sanitized);
                                        }}
                                    />
                                }
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
                    <Button type="primary" htmlType="submit" loading={customerLoading || guarantorLoading} icon={<SaveOutlined />}>
                        Save and Verify
                    </Button>
                    <Button type="default" onClick={formRest} danger icon={<UndoOutlined />}>
                        Reset
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default FormDetails;
