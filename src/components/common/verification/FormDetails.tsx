import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select, Card, Space } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { CloseCircleOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
import useCommonStore from "../../../store/commonStore";
import useCustomerStore from "../../../store/customerStore";
import useLoanStore from "../../../store/loanStore";
import { formatCNIC, splitInitialAndSurname } from "../../../utils/formatterFunctions";
import useGuarantorStore from "../../../store/guarantorStore";
import ContactInput from "../inputs/ContactInput";
// import { useNavigate } from "react-router-dom";
const { Search } = Input;

// ✅ Validation Schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    initals: yup.string().notRequired().matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    surname: yup.string().notRequired().matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    telcoProvider: yup.string().required("Operator Name is required"),
    contactNumber: yup.string().required("Contact Number is required").matches(/^[0-9]{11}$/, "Contact Number must be 11 digits"),
    identificationType: yup.string().required("Identification Type is required"),
    identificationNumber: yup.string().required("Identification Number is required").matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format xxxxx-xxxxxxx-x'),
});

interface IFormDetails {
    type: string;
    setIdx: (idx: string) => void;
    setCNIC: (cnic: string) => void;
    setApprovalStatus: (status: string) => void;
    appId?: string | null
}

const FormDetails: React.FC<IFormDetails> = ({ type, appId, setIdx, setCNIC, setApprovalStatus }) => {
    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
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

        const postData = { ...data, appraisalId: appId ?? loan?.idx }
        // delete postData['name']
        delete postData['initals']
        delete postData['surname']

        if (type === 'C') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await addCustomer({ ...postData, fullName: data.name, type: type, client: 'WEB' })
            if (response) {
                setIdx(response?.idx);
                setCNIC(response?.identificationNumber);
            }
        } else if (type === 'G') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addGuarantor({ ...postData, fullName: data.name, type: type, client: 'WEB' }).then((response) => {
                setIdx(response?.idx ?? '');
                setCNIC(response?.identificationNumber);
            })
        }
    };

    useEffect(() => {
        if (customer && type === 'C') {
            setCNIC(customer?.identificationNumber);
            setIdx(customer?.idx || '');
        }
    }, [type, customer, setCNIC, setIdx]);

    const handleSearch = (value: string) => {
        if (type === 'C') {
            fetchCustomerByCNIC(value)
        } else if (type === 'G') {
            fetchGuarantorByCNIC(value)
        }
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
            const { initial, surname } = splitInitialAndSurname(selectedCustomer?.fullName?.toString());
            setValue("name", selectedCustomer?.fullName || '');
            setValue("initals", initial);
            setValue("surname", surname);
            setValue("telcoProvider", selectedCustomer?.telcoProvider || '');
            setValue("contactNumber", selectedCustomer?.contactNumber || '');
            setValue("identificationType", selectedCustomer?.identificationType || '');
            setValue("identificationNumber", selectedCustomer?.identificationNumber || '');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomer])

    useEffect(() => {
        if (type === 'G' && selectedGuarantor) {
            const { initial, surname } = splitInitialAndSurname(selectedGuarantor?.fullName?.toString());
            setValue("name", selectedGuarantor?.fullName || '');
            setValue("initals", initial);
            setValue("surname", surname);
            setValue("telcoProvider", selectedGuarantor?.telcoProvider || '');
            setValue("contactNumber", selectedGuarantor?.contactNumber || '');
            setValue("identificationType", selectedGuarantor?.identificationType || '');
            setValue("identificationNumber", selectedGuarantor?.identificationNumber || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGuarantor])

    const fullName = watch('name')


    useEffect(() => {
        if (fullName !== undefined && fullName !== '') {
            const { initial, surname } = splitInitialAndSurname(fullName?.toString());
            setValue("initals", initial);
            setValue("surname", surname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullName])


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
                        <Form.Item label="Full Name" validateStatus={errors.name ? "error" : ""} help={errors.name?.message} required>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Full Name" maxLength={50} />}
                            />
                        </Form.Item>

                        <Form.Item label="Initial" validateStatus={errors.initals ? "error" : ""} help={errors.initals?.message}>
                            <Controller
                                name="initals"
                                control={control}
                                disabled
                                render={({ field }) => <Input {...field} placeholder="Enter Initial" value={field.value || ''} />}
                            />
                        </Form.Item>
                        <Form.Item label="Surname" validateStatus={errors.surname ? "error" : ""} help={errors.surname?.message}>
                            <Controller
                                name="surname"
                                control={control}
                                disabled
                                render={({ field }) => <Input {...field} placeholder="Enter surname" value={field.value || ''} />}
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
                                    <ContactInput
                                        {...field}
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
