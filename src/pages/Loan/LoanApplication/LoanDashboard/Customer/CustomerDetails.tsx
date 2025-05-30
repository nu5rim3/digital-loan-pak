import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Input, Form, Button, Card, Select } from "antd";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import useStakeholderStore from '../../../../../store/stakeholderStore';
import useCommonStore from '../../../../../store/commonStore';
import { formatCNIC, formatName } from '../../../../../utils/formatterFunctions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useCustomerStore from '../../../../../store/customerStore';
import { CaretLeftOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import { getStakeholderByType } from '../../../../../utils/stakholderFunction';

// ✅ Validation Schema
const schema = yup.object().shape({
    appraisalID: yup.string(),
    stkOrgType: yup.string().required("Organization Type is required"),
    stkCNic: yup.string().required("CNIC is required"),
    stkCNicIssuedDate: yup.string().required("CNIC Issued Date is required"),
    stkCNicExpDate: yup.string().required("CNIC Expired Date is required"),
    stkCNicStatus: yup.string().required("CNIC Status is required"),
    stkCusName: yup.string().required("Customer Name is required"),
    stkInitials: yup.string().required("Initials is required"),
    stkSurName: yup.string().required("Surname is required"),
    stkOtherName: yup.string().required("Other Name is required"),
    stkDob: yup.string().required("Date of Birth is required"),
    stkAge: yup.string().required("Age is required"),
    stkGender: yup.string().required("Gender is required"),
    stkMaritialStatus: yup.string().required("Marital Status is required"),
    stkMaritialComment: yup.string().required("Marital Comment is required"),
    stkTitle: yup.string().required("Title is required"),
    stkFatherOrHusName: yup.string().required("Father or Husband Name is required"),
    stkEduLevel: yup.string().required("Education Qualification is required"),
    stkPhysDisability: yup.string().required("Description of Physical Disability  is required"),
    headOfFamily: yup.string().required("Head of Family is required"),
    healthCondition: yup.string().required("Health Condition is required"),
    stkSequence: yup.string(),
    stkNumOfDependents: yup.string().nullable(),
    stkNumOfEarners: yup.string().nullable(),
    stkCusCode: yup.string().nullable(),
    stkGrpRefNo: yup.string().nullable(),
    stkPhysDisabilityDesce: yup.string().nullable(),
    geoLocation: yup.string().required("Geo Location is required"),
});

const CustomerDetails: React.FC = () => {

    const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const { organizationType, organizationTypeLoading, fetchOrganizationType, cnicStaus, cnicStausLoading, fetchCNICStaus, educationLevel, educationLevelLoading, fetchEducationLevel, headOfFamily, headOfFamilyLoading, fetchHeadOfFamily, healthCondition, healthConditionLoading, fetchHealthCondition } = useCommonStore()
    const { stakeholderLoading, stakeholders, fetchStackholderByAppId, addStakeholder, updateStakeholder } = useStakeholderStore()
    const { customers, fetchCustomerByAppId } = useCustomerStore()
    const { appId } = useParams()
    const navigate = useNavigate();
    const mode = useLocation().state?.mode ?? 'create';

    const [stakholderId, setStakholderId] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (mode === 'create') {
            addStakeholder({
                ...data,
                appraisalID: appId ?? '',
                new: true,
                stkType: 'C',
                stkCNic: customers[0]?.identificationNumber ?? '',
                stkCusName: customers[0]?.fullName ?? ''
            })
            // TODO: histroy back
        } else if (mode === 'edit') {
            updateStakeholder(stakholderId, {
                ...data,
                appraisalID: appId ?? '',
                update: true,
                stkType: 'C',
                stkCNic: customers[0]?.identificationNumber ?? '',
                stkCusName: customers[0]?.fullName ?? ''
            })
            // TODO: histroy back
        }
    }

    useEffect(() => {
        fetchOrganizationType()
        fetchCNICStaus()
        fetchEducationLevel()
        fetchHeadOfFamily()
        fetchHealthCondition()
        fetchCustomerByAppId(appId ?? '')
        fetchStackholderByAppId(appId ?? '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (mode === 'edit' && stakeholders.length > 0) {
            const formDetails = getStakeholderByType('C', stakeholders)[0]
            setStakholderId(formDetails?.idx)
            if (formDetails) {
                setValue("appraisalID", formDetails?.appraisalID ?? appId ?? '');
                setValue("stkSequence", formDetails?.stkSequence);
                setValue("stkOrgType", formDetails?.stkOrgType);
                setValue("stkCNic", formDetails?.stkCNic);
                setValue("stkCNicIssuedDate", formDetails?.stkCNicIssuedDate);
                setValue("stkCNicExpDate", formDetails?.stkCNicExpDate);
                setValue("stkCNicStatus", formDetails?.stkCNicStatus);
                setValue("stkCusCode", formDetails?.stkCusCode ?? '');
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
                setValue("stkGrpRefNo", formDetails?.stkGrpRefNo ?? '');
                setValue("headOfFamily", formDetails?.headOfFamily);
                setValue("healthCondition", formDetails?.healthCondition);
                setValue("geoLocation", formDetails?.geoLocation);
            }
        }

        if (customers.length > 0) {
            setValue("stkCusName", customers[0]?.fullName);
            setValue("stkCNic", customers[0]?.identificationNumber);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeholders, customers])


    const physDisability = watch('stkPhysDisability');


    const onRestHandle = () => {
        if (mode === 'create') {
            reset()
        } else {
            fetchStackholderByAppId(appId ?? '')
        }
    }

    return (
        <div className='flex flex-col gap-3'>
            <Card title="Personal Details">
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
                                    label: formatName(item.description),
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

                        <Form.Item label="Date of Birth" validateStatus={errors.stkDob ? "error" : ""} help={errors.stkDob?.message} required>
                            <Controller
                                name="stkDob"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Date of Birth" type='date' />}
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
                                render={({ field }) => <Input {...field} placeholder="Enter CNIC Expired Date" type='date' />}
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
                                        label: formatName(item.description),
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
                                            label: formatName(item.description),
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
                                            { value: 'D', label: 'Married' },
                                            { value: 'S', label: 'Single' },
                                            { value: 'P', label: 'Separated' },
                                            { value: 'W', label: 'Widow' },
                                            { value: 'I', label: 'Widower' },
                                        ]}
                                        placeholder="Select Marital Status" />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Marital Comment" validateStatus={errors.stkMaritialComment ? "error" : ""} help={errors.stkMaritialComment?.message} required>
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
                                render={({ field }) => <Input {...field} placeholder="Enter Number of Dependents" value={field.value || ''} />}
                            />
                        </Form.Item>
                        <Form.Item label="Number of Earners" validateStatus={errors.stkNumOfEarners ? "error" : ""} help={errors.stkNumOfEarners?.message}>
                            <Controller
                                name="stkNumOfEarners"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Number of Earners" value={field.value || ''} />}
                            />
                        </Form.Item>
                        <Form.Item label="Customer Code" validateStatus={errors.stkCusCode ? "error" : ""} help={errors.stkCusCode?.message}>
                            <Controller
                                name="stkCusCode"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Customer Code" value={field.value || ''} />}
                            />
                        </Form.Item>
                        <Form.Item label="Group/Reference Number" validateStatus={errors.stkGrpRefNo ? "error" : ""} help={errors.stkGrpRefNo?.message}>
                            <Controller
                                name="stkGrpRefNo"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Group/Reference Number" value={field.value || ''} />}
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
                                            label: formatName(item.description),
                                            value: item.code
                                        }))}
                                        placeholder="Select Head of Family"
                                        loading={headOfFamilyLoading}
                                    />
                                }
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
                                        label: formatName(item.description),
                                        value: item.code
                                    }))}
                                    placeholder="Select Health Condition"
                                    loading={healthConditionLoading}
                                />}
                            />
                        </Form.Item>
                        <Form.Item label="Description of Physical Disability " validateStatus={errors.stkPhysDisability ? "error" : ""} help={errors.stkPhysDisability?.message} required>
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
                                        placeholder="Select Description of Physical Disability "
                                    />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Description of Physical Disability  Description" validateStatus={errors.stkPhysDisabilityDesce ? "error" : ""} help={errors.stkPhysDisabilityDesce?.message} hidden={physDisability === 'false'}>
                            <Controller
                                name="stkPhysDisabilityDesce"
                                control={control}
                                render={({ field }) => <Input.TextArea {...field} placeholder="Enter Description of Physical Disability  Description" value={field.value || ''} />}
                            />
                        </Form.Item>
                        <Form.Item label="Geo Location" validateStatus={errors.geoLocation ? "error" : ""} help={errors.geoLocation?.message} required>
                            <Controller
                                name="geoLocation"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Geo Location" />}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit" icon={<EditOutlined />} loading={stakeholderLoading}>
                            {mode === 'create' ? 'Save' : 'Update'}
                        </Button>
                        <Button type="default" onClick={onRestHandle} danger icon={<UndoOutlined />} loading={stakeholderLoading}>
                            Reset
                        </Button>
                    </div>
                </Form>
            </Card>
        </div >
    )
}

export default CustomerDetails