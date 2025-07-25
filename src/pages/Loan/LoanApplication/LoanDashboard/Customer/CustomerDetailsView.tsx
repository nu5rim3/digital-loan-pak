import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Input, Form, Button, Card, Select, Collapse } from "antd";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonStore from '../../../../../store/commonStore';
import { formatCNIC, formatName } from '../../../../../utils/formatterFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomerStore from '../../../../../store/customerStore';
import { mainURL } from '../../../../../App';
import { IStakeholder } from '../../../../../store/stakeholderStore';
import { EditOutlined, QrcodeOutlined } from '@ant-design/icons';
// import TrailCalculation from '../../../../Users/Customers/TrialCalculation';
import ContactDetailsCard from '../../../../../components/common/stakeHolder/ContactDetailsCard';
import AddressDetailsCard from '../../../../../components/common/stakeHolder/AddressDetailsCard';
import InsuranceRecipientCard from '../../../../../components/common/stakeHolder/InsuranceRecipientCard';
import TrialCalculation from '../../../../Users/Customers/TrialCalculation';
import OtherDetails from '../../../../../components/common/stakeHolder/OtherDetails';
import BankDetails from '../../../../../components/common/stakeHolder/BankDetails';
import NADRAModal from '../../../../../components/common/modal/NADRAModal';
import moment from 'moment';

// ✅ Validation Schema
const schema = yup.object().shape({
    appraisalID: yup.string(),
    stkOrgType: yup.string().required("Organization Type is required"),
    stkCNic: yup.string().required("CNIC is required").matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format xxxxx-xxxxxxx-x'),
    stkCNicIssuedDate: yup.string().required("CNIC Issued Date is required"),
    stkCNicExpDate: yup
        .string()
        .required("CNIC Expired Date is required")
        .test(
            "is-today-or-future",
            "Date cannot be in the past",
            value => moment(value).isSameOrAfter(moment(), 'day')
        ),
    stkCNicStatus: yup.string().required("CNIC Status is required"),
    stkCusName: yup.string().required("Customer Name is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkInitials: yup.string().required("Initial is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkSurName: yup.string().required("Surname is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkOtherName: yup.string().required("Other Name is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkDob: yup.string().required("Date of Birth is required"),
    stkAge: yup.string().required("Age is required"),
    stkGender: yup.string().required("Gender is required"),
    stkMaritialStatus: yup.string().required("Marital Status is required"),
    stkMaritialComment: yup.string().required("Marital Comment is required"),
    stkTitle: yup.string().required("Title is required"),
    stkFatherOrHusName: yup.string().required("Father or Husband Name is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    stkEduLevel: yup.string().required("Education Qualification is required"),
    stkPhysDisability: yup.string().required("Physical Disability is required"),
    relationship: yup.string().required("Relationship is required"),
    headOfFamily: yup.string().required("Head of Family is required"),
    healthCondition: yup.string().required("Health Condition is required"),
    stkSequence: yup.string(),
    stkNumOfDependents: yup.string().matches(/^[0-9]+$/, "Number of Dependents must be a number"),
    stkNumOfEarners: yup.string().matches(/^[0-9]+$/, "Number of Dependents must be a number"),
    stkCusCode: yup.string(),
    stkGrpRefNo: yup.string(),
    stkPhysDisabilityDesce: yup.string(),
    status: yup.string(),
    houseHoldCont: yup.string(),
    currentResPlace: yup.string(),
    modeOfSecurity: yup.string(),
    geoLocation: yup.string(),
    stkEmpNo: yup.string(),
});

interface ICustomerDetailsView {
    formDetails?: IStakeholder | null;
    // type: string;
    // setIdx: (idx: string) => void;
    // setCNIC: (cnic: string) => void;
    // setApprovalStatus: (status: string) => void;
}

const CustomerDetailsView: React.FC<ICustomerDetailsView> = ({ formDetails }) => {
    const [nadraModalOpen, setNadraModalOpen] = useState(false)

    const { control, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(schema),
    });
    const { locations, locationsLoading, organizationType, organizationTypeLoading, fetchOrganizationType, cnicStaus, cnicStausLoading, fetchCNICStaus, educationLevel, educationLevelLoading, fetchEducationLevel, headOfFamily, headOfFamilyLoading, fetchHeadOfFamily, healthCondition, healthConditionLoading, fetchHealthCondition, fetchLocations } = useCommonStore()
    const { customers, fetchCustomerByAppId, resetCustomer } = useCustomerStore()
    const { appId } = useParams()
    const navigate = useNavigate();


    useEffect(() => {
        fetchCustomerByAppId(appId ?? '')
        return () => {
            resetCustomer()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId])

    useEffect(() => {
        if (organizationType.length === 0) { fetchOrganizationType() }
        if (cnicStaus.length === 0) { fetchCNICStaus() }
        if (educationLevel.length === 0) { fetchEducationLevel() }
        if (headOfFamily.length === 0) { fetchHeadOfFamily() }
        if (healthCondition.length === 0) { fetchHealthCondition() }
        if (locations.length === 0) { fetchLocations() }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if (formDetails) {
            setValue("appraisalID", formDetails?.appraisalID ?? appId ?? '');
            setValue("stkSequence", formDetails?.stkSequence);
            setValue("stkOrgType", formDetails?.stkOrgType);
            setValue("stkCNic", formDetails?.stkCNic);
            setValue("stkCNicIssuedDate", formDetails?.stkCNicIssuedDate);
            setValue("stkCNicExpDate", formDetails?.stkCNicExpDate);
            setValue("stkCNicStatus", formDetails?.stkCNicStatus);
            setValue("stkCusCode", formDetails?.stkCusCode);
            setValue("stkCusName", formDetails?.stkCusName);
            setValue("stkInitials", formDetails?.stkInitials);
            setValue("stkSurName", formDetails?.stkSurName);
            setValue("stkOtherName", formDetails?.stkOtherName);
            setValue("stkDob", formDetails?.stkDob);
            setValue("stkAge", formDetails?.stkAge);
            setValue("stkGender", formDetails?.stkGender);
            setValue("stkMaritialStatus", formDetails?.stkMaritialStatus ?? '');
            setValue("stkMaritialComment", formDetails?.stkMaritialComment);
            setValue("stkTitle", formDetails?.stkTitle);
            setValue("stkFatherOrHusName", formDetails?.stkFatherOrHusName);
            setValue("stkNumOfDependents", formDetails?.stkNumOfDependents);
            setValue("stkNumOfEarners", formDetails?.stkNumOfEarners);
            setValue("stkEduLevel", formDetails?.stkEduLevel);
            setValue("stkPhysDisability", formDetails?.stkPhysDisability);
            setValue("stkPhysDisabilityDesce", formDetails?.stkPhysDisabilityDesce);
            setValue("stkGrpRefNo", formDetails?.stkGrpRefNo);
            setValue("status", formDetails?.status);
            setValue("relationship", formDetails?.relationship);
            setValue("headOfFamily", formDetails?.headOfFamily);
            setValue("houseHoldCont", formDetails?.houseHoldCont);
            setValue("healthCondition", formDetails?.healthCondition);
            setValue("geoLocation", formDetails?.geoLocation);
            setValue("stkEmpNo", formDetails?.stkEmpNo);
        }

        if (customers.length > 0) {
            setValue("stkCusName", customers[0]?.fullName);
            setValue("stkCNic", customers[0]?.identificationNumber);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formDetails, customers])

    const physDisability = watch('stkPhysDisability');

    if (formDetails === null) {
        return (
            <Card>
                <div className='pb-5'>
                    <TrialCalculation cliIdx={customers[0]?.idx ?? ''} cnic={customers[0]?.identificationNumber} />
                </div>
                <Card title={'Customer Details'}
                    extra={
                        <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />} >Customer QR</Button>
                    }
                >
                    <Form layout="vertical">
                        <div className="grid grid-cols-4 gap-3">
                            <Form.Item label="Full Name">
                                <Input value={customers[0]?.fullName ?? '-'} disabled />
                            </Form.Item>
                            <Form.Item label={'CNIC Type'}>
                                <Input value={customers[0]?.identificationType ?? '-'} disabled />
                            </Form.Item>
                            <Form.Item label="CNIC">
                                <Input value={customers[0]?.identificationNumber ?? '-'} disabled />
                            </Form.Item>
                            <Form.Item label="Contact Number">
                                <Input value={customers[0]?.contactNumber ?? '-'} disabled />
                            </Form.Item>
                        </div>
                        <div className="flex gap-3">
                            <Button type="primary" onClick={() => navigate(`${mainURL}/loan/application/${appId}/customer`, { state: { mode: 'create' } })}>
                                Add More Details
                            </Button>
                        </div>
                    </Form>
                </Card>

                {/* <CustomerScreen mode={mode} setMode={setMode} /> */}
                <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} cliIdx={customers[0]?.idx ?? ''} />
            </Card>
        )
    }

    return (
        <Card>
            <div className='flex flex-col gap-3'>
                <div className='pb-5'>
                    <TrialCalculation cliIdx={customers[0]?.idx ?? ''} cnic={customers[0]?.identificationNumber} />
                </div>
                <Collapse
                    size='small'
                    defaultActiveKey={['1']}
                    items={[{
                        key: 1,
                        label: 'Customer Details',
                        children: <>
                            <div className='flex justify-end'>
                                <>
                                    <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />} className='mr-2'>Customer QR</Button>
                                    <Button
                                        icon={<EditOutlined />}
                                        type="default"
                                        onClick={() => navigate(`${mainURL}/loan/application/${appId}/customer`, { state: { mode: 'edit' } })}>
                                        Update Details
                                    </Button>
                                </>
                            </div>
                            <Form layout="vertical" disabled className='p-4'>
                                <div className="grid grid-cols-4 gap-3">
                                    <Form.Item label="Title" validateStatus={errors.stkTitle ? "error" : ""} help={errors.stkTitle?.message} required>
                                        <Controller
                                            name="stkTitle"
                                            control={control}
                                            render={({ field }) =>
                                                <Select
                                                    {...field}
                                                    allowClear
                                                    options={[
                                                        { value: 'MR', label: 'Mr.' },
                                                        { value: 'MRS', label: 'Mrs.' },
                                                        { value: 'MS', label: 'Ms.' },
                                                        { value: 'DR', label: 'Dr.' },
                                                        { value: 'PROF', label: 'Prof.' },
                                                        { value: 'ENG', label: 'Eng.' },
                                                        { value: 'REV', label: 'Rev.' },
                                                        { value: 'M/S', label: 'M/S' },
                                                        { value: 'MST', label: 'Mst.' },
                                                    ]}
                                                    placeholder="Select Title"
                                                />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Full Name" validateStatus={errors.stkCusName ? "error" : ""} help={errors.stkCusName?.message} required>
                                        <Controller
                                            disabled
                                            name="stkCusName"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Customer Name" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Initial" validateStatus={errors.stkInitials ? "error" : ""} help={errors.stkInitials?.message} required>
                                        <Controller
                                            name="stkInitials"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Initial" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Surname" validateStatus={errors.stkSurName ? "error" : ""} help={errors.stkSurName?.message} required>
                                        <Controller
                                            name="stkSurName"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Surname" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Other Name" validateStatus={errors.stkOtherName ? "error" : ""} help={errors.stkOtherName?.message} required>
                                        <Controller
                                            name="stkOtherName"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Other Name" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="CNIC Status" validateStatus={errors.stkCNicStatus ? "error" : ""} help={errors.stkCNicStatus?.message} required>
                                        <Controller
                                            name="stkCNicStatus"
                                            control={control}
                                            render={({ field }) => <Select {...field} placeholder="Select a CNIC Status" allowClear loading={cnicStausLoading} options={cnicStaus.map((item) => ({
                                                label: item.description,
                                                value: item.code
                                            }))}>
                                            </Select>}
                                        />
                                    </Form.Item>
                                    <Form.Item label="CNIC" validateStatus={errors.stkCNic ? "error" : ""} help={errors.stkCNic?.message} required>
                                        <Controller
                                            name="stkCNic"
                                            disabled
                                            control={control}
                                            render={({ field }) => <Input {...field}
                                                maxLength={15} // Max length considering dashes
                                                placeholder="xxxxx-xxxxxxx-x"
                                                onChange={(e) => {
                                                    const formatted = formatCNIC(e.target.value);
                                                    setValue("stkCNic", formatted, { shouldValidate: true });
                                                }}
                                            />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="CNIC Issued Date" validateStatus={errors.stkCNicIssuedDate ? "error" : ""} help={errors.stkCNicIssuedDate?.message} required>
                                        <Controller
                                            name="stkCNicIssuedDate"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter CNIC Issued Date" type='date' />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="CNIC Expired Date" validateStatus={errors.stkCNicExpDate ? "error" : ""} help={errors.stkCNicExpDate?.message} required>
                                        <Controller
                                            name="stkCNicExpDate"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter CNIC Expired Date" type='date' min={moment().format("YYYY-MM-DD")} />}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Date of Birth" validateStatus={errors.stkDob ? "error" : ""} help={errors.stkDob?.message} required>
                                        <Controller
                                            name="stkDob"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Date of Birth" type='date' />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Age" validateStatus={errors.stkAge ? "error" : ""} help={errors.stkAge?.message} required>
                                        <Controller
                                            name="stkAge"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Age" type='number' />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Gender" validateStatus={errors.stkGender ? "error" : ""} help={errors.stkGender?.message} required>
                                        <Controller
                                            name='stkGender'
                                            control={control}
                                            render={({ field }) =>
                                                <Select
                                                    {...field}
                                                    allowClear
                                                    options={[
                                                        { value: 'F', label: 'Female' },
                                                        { value: 'M', label: 'Male' },
                                                        { value: 'A', label: 'Androgynous' },
                                                    ]}
                                                    placeholder="Select Gender"
                                                />
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label="Organization Type" validateStatus={errors.stkOrgType ? "error" : ""} help={errors.stkOrgType?.message} required>
                                        <Controller
                                            name="stkOrgType"
                                            control={control}
                                            render={({ field }) =>
                                                <Select {...field} placeholder="Select an Organization" allowClear loading={organizationTypeLoading} options={organizationType.map((item) => ({
                                                    label: item.description,
                                                    value: item.code
                                                }))}>
                                                </Select>
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label="Education Qualification" validateStatus={errors.stkEduLevel ? "error" : ""} help={errors.stkEduLevel?.message} required>
                                        <Controller
                                            name="stkEduLevel"
                                            control={control}
                                            render={({ field }) =>
                                                <Select
                                                    {...field}
                                                    allowClear
                                                    options={educationLevel.map((item) => ({
                                                        label: item.description,
                                                        value: item.code
                                                    }))}
                                                    placeholder="Select Education Qualification"
                                                    loading={educationLevelLoading}
                                                />
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label="Marital Status" validateStatus={errors.stkMaritialStatus ? "error" : ""} help={errors.stkMaritialStatus?.message} required>
                                        <Controller
                                            name="stkMaritialStatus"
                                            control={control}
                                            render={({ field }) =>
                                                <Select
                                                    {...field}
                                                    allowClear
                                                    options={[
                                                        { value: 'M', label: 'Married' },
                                                        { value: 'S', label: 'Single' },
                                                        { value: 'P', label: 'Separated' },
                                                        { value: 'W', label: 'Widow' },
                                                        { value: 'I', label: 'Widower' },
                                                    ]}
                                                    placeholder="Select Marital Status" />
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label="Marital Comment" validateStatus={errors.stkMaritialComment ? "error" : ""} help={errors.stkMaritialComment?.message} hidden>
                                        <Controller
                                            name="stkMaritialComment"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Marital Comment" />}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Father or Husband Name" validateStatus={errors.stkFatherOrHusName ? "error" : ""} help={errors.stkFatherOrHusName?.message} required>
                                        <Controller
                                            name="stkFatherOrHusName"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Father or Husband Name" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Number of Dependents" validateStatus={errors.stkNumOfDependents ? "error" : ""} help={errors.stkNumOfDependents?.message}>
                                        <Controller
                                            name="stkNumOfDependents"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Number of Dependents" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Number of Earners" validateStatus={errors.stkNumOfEarners ? "error" : ""} help={errors.stkNumOfEarners?.message}>
                                        <Controller
                                            name="stkNumOfEarners"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Number of Earners" />}
                                        />
                                    </Form.Item>


                                    <Form.Item label="Customer Code" validateStatus={errors.stkCusCode ? "error" : ""} help={errors.stkCusCode?.message}>
                                        <Controller
                                            name="stkCusCode"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Customer Code" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Group/Reference Number" validateStatus={errors.stkGrpRefNo ? "error" : ""} help={errors.stkGrpRefNo?.message}>
                                        <Controller
                                            name="stkGrpRefNo"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Group/Reference Number" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Status" validateStatus={errors.status ? "error" : ""} help={errors.status?.message} hidden>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Status" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Head of Family" validateStatus={errors.headOfFamily ? "error" : ""} help={errors.headOfFamily?.message} required>
                                        <Controller
                                            name="headOfFamily"
                                            control={control}
                                            render={({ field }) =>
                                                <Select
                                                    {...field}
                                                    allowClear
                                                    options={headOfFamily.map((item) => ({
                                                        label: item.description,
                                                        value: item.code
                                                    }))}
                                                    placeholder="Select Head of Family"
                                                    loading={headOfFamilyLoading}
                                                />
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label="Household Contact" validateStatus={errors.houseHoldCont ? "error" : ""} help={errors.houseHoldCont?.message} hidden>
                                        <Controller
                                            name="houseHoldCont"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Household Contact" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Health Condition" validateStatus={errors.healthCondition ? "error" : ""} help={errors.healthCondition?.message} required>
                                        <Controller
                                            name="healthCondition"
                                            control={control}
                                            render={({ field }) => <Select
                                                {...field}
                                                allowClear
                                                options={healthCondition.map((item) => ({
                                                    label: item.description,
                                                    value: item.code
                                                }))}
                                                placeholder="Select Health Condition"
                                                loading={healthConditionLoading}
                                            />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Physical Disability" validateStatus={errors.stkPhysDisability ? "error" : ""} help={errors.stkPhysDisability?.message} required>
                                        <Controller
                                            name="stkPhysDisability"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={field.value === undefined ? null : field.value}
                                                    allowClear
                                                    options={[
                                                        { value: 'true', label: 'Yes' },
                                                        { value: 'false', label: 'No' },
                                                    ]}
                                                    placeholder="Select Physical Disability"
                                                />
                                            )}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Description of Physical Disability" validateStatus={errors.stkPhysDisabilityDesce ? "error" : ""} help={errors.stkPhysDisabilityDesce?.message} hidden={physDisability === 'false'}>
                                        <Controller
                                            name="stkPhysDisabilityDesce"
                                            control={control}
                                            render={({ field }) => <Input {...field} placeholder="Enter Description of Physical Disability" />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Geographic Location" validateStatus={errors.geoLocation ? "error" : ""} help={errors.geoLocation?.message}>
                                        <Controller
                                            name="geoLocation"
                                            control={control}
                                            render={({ field }) =>
                                                <Select
                                                    {...field}
                                                    allowClear
                                                    loading={locationsLoading}
                                                    options={locations.map((item) => ({
                                                        label: formatName(item.locationName),
                                                        value: item.code
                                                    }))}
                                                />}
                                        />
                                    </Form.Item>
                                </div>
                            </Form>
                        </>
                    }]}
                />

                < ContactDetailsCard stkId={formDetails?.idx ?? ''} />


                < AddressDetailsCard stkId={formDetails?.idx ?? ''} />

                < InsuranceRecipientCard stkId={formDetails?.idx ?? ''} />

                < OtherDetails stkId={formDetails?.idx ?? ''} />

                < BankDetails stkId={formDetails?.idx ?? ''} />

                <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} cliIdx={customers[0]?.idx ?? ''} />

            </div >
        </Card>
    )
}

export default CustomerDetailsView