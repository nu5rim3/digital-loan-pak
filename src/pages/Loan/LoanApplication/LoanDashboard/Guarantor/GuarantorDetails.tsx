import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Select } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import useStakeholderStore, { IStakeholder } from '../../../../../store/stakeholderStore';
import useCustomerStore from '../../../../../store/customerStore';
import useCommonStore from '../../../../../store/commonStore';
import { getStakeholderByType } from '../../../../../utils/stakholderFunction';
import { formatCNIC } from '../../../../../utils/formatterFunctions';
import { CaretLeftOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';

interface IGuarantorDetails {
    formDetails?: IStakeholder[];
}

// ✅ Validation Schema
const schema = yup.object().shape({
    appraisalID: yup.string(),
    stkOrgType: yup.string().required("Orgination Type is required"),
    stkCNic: yup.string().required("CNIC is required"),
    stkCNicIssuedDate: yup.string().required("CNIC Issued Date is required"),
    stkCNicExpDate: yup.string().required("CNIC Exp Date is required"),
    stkCNicStatus: yup.string().required("CNIC Status is required"),
    stkCusName: yup.string().required("Customer Name is required"),
    stkInitials: yup.string().required("Initials is required"),
    stkSurName: yup.string().required("Surname is required"),
    stkOtherName: yup.string().required("Other Name is required"),
    stkDob: yup.string().required("Date of Birth is required"),
    stkAge: yup.string().required("Age is required"),
    stkGender: yup.string().required("Gender is required"),
    stkMaritialStatus: yup.string().required("Maritial Status is required"),
    stkTitle: yup.string().required("Title is required"),
    stkFatherOrHusName: yup.string().required("Father or Husband Name is required"),
    currentResidences: yup.string().required("Current Residence is required"),
    relationship: yup.string().required("Relationship is required"),
    modeOfSecurity: yup.string().required("Mode of Security is required"),
});

const GuarantorDetails: React.FC<IGuarantorDetails> = () => {

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const { organizationType, organizationTypeLoading, fetchOrganizationType, cnicStaus, cnicStausLoading, fetchCNICStaus, fetchEducationLevel, headOfFamily, headOfFamilyLoading, fetchHeadOfFamily, healthCondition, healthConditionLoading, fetchHealthCondition } = useCommonStore()
    const { stakeholderLoading, stakeholders, fetchStackholderByAppId, addStakeholder, updateStakeholder } = useStakeholderStore()
    const { customers, fetchCustomerByAppId } = useCustomerStore()
    const { appId } = useParams()
    const navigate = useNavigate();
    const mode = useLocation().state?.mode ?? 'create';
    const selectedIndex = useLocation().state?.selectedIndx ?? '0';

    const [stakholderId, setStakholderId] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        console.log(data);
        if (mode === 'create') {
            addStakeholder({ ...data, appraisalID: appId ?? '', new: true, stkType: 'C' })
        } else if (mode === 'edit') {
            updateStakeholder(stakholderId, { ...data, appraisalID: appId ?? '', update: true, stkType: 'C' })
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
        if (mode === 'edit') {
            const formDetails = getStakeholderByType('G', stakeholders)[selectedIndex]
            setStakholderId(formDetails?.idx)
            if (formDetails) {
                setValue("appraisalID", formDetails?.appraisalID ?? appId ?? '');
                setValue("stkOrgType", formDetails?.stkOrgType);
                setValue("stkCNic", formDetails?.stkCNic);
                setValue("stkCNicIssuedDate", formDetails?.stkCNicIssuedDate);
                setValue("stkCNicExpDate", formDetails?.stkCNicExpDate);
                setValue("stkCNicStatus", formDetails?.stkCNicStatus);
                setValue("stkCusName", formDetails?.stkCusName);
                setValue("stkInitials", formDetails?.stkInitials);
                setValue("stkSurName", formDetails?.stkSurName);
                setValue("stkOtherName", formDetails?.stkOtherName);
                setValue("stkDob", formDetails?.stkDob);
                setValue("stkAge", formDetails?.stkAge);
                setValue("stkGender", formDetails?.stkGender);
                setValue("stkMaritialStatus", formDetails?.stkMaritialStatus);
                setValue("stkTitle", formDetails?.stkTitle);
                setValue("stkFatherOrHusName", formDetails?.stkFatherOrHusName);
                setValue("currentResidences", formDetails?.currentResidences);
                setValue("relationship", formDetails?.relationship);
                setValue("modeOfSecurity", formDetails?.modeOfSecurity);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeholders, customers])


    console.log('errors : ', errors);


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
                        <Form.Item label="Initials" validateStatus={errors.stkInitials ? "error" : ""} help={errors.stkInitials?.message} required>
                            <Controller
                                name="stkInitials"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Initials" />}
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
                                render={({ field }) => <Select {...field} placeholder="Select an CNIC Status" allowClear loading={cnicStausLoading} options={cnicStaus.map((item) => ({
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
                        <Form.Item label="CNIC Exp Date" validateStatus={errors.stkCNicExpDate ? "error" : ""} help={errors.stkCNicExpDate?.message} required>
                            <Controller
                                name="stkCNicExpDate"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter CNIC Exp Date" type='date' />}
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
                        <Form.Item label="Orgination Type" validateStatus={errors.stkOrgType ? "error" : ""} help={errors.stkOrgType?.message} required>
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
                        <Form.Item label="Maritial Status" validateStatus={errors.stkMaritialStatus ? "error" : ""} help={errors.stkMaritialStatus?.message} required>
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
                                        placeholder="Select Maritial Status" />
                                }
                            />
                        </Form.Item>


                        <Form.Item label="Father or Husband Name" validateStatus={errors.stkFatherOrHusName ? "error" : ""} help={errors.stkFatherOrHusName?.message} required>
                            <Controller
                                name="stkFatherOrHusName"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Father or Husband Name" />}
                            />
                        </Form.Item>
                        <Form.Item label="Current Residence" validateStatus={errors.currentResidences ? "error" : ""} help={errors.currentResidences?.message} required>
                            <Controller
                                name="currentResidences"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Current Residence" />}
                            />
                        </Form.Item>
                        <Form.Item label="Relationship" validateStatus={errors.relationship ? "error" : ""} help={errors.relationship?.message} required>
                            <Controller
                                name="relationship"
                                control={control}
                                render={({ field }) =>
                                    <Select {...field} placeholder="Select a Relationship" allowClear loading={headOfFamilyLoading} options={headOfFamily.map((item) => ({
                                        label: item.description,
                                        value: item.code
                                    }))}>
                                    </Select>}
                            />
                        </Form.Item>
                        <Form.Item label="Mode of Security" validateStatus={errors.modeOfSecurity ? "error" : ""} help={errors.modeOfSecurity?.message} required>
                            <Controller
                                name="modeOfSecurity"
                                control={control}
                                render={({ field }) =>
                                    <Select {...field} placeholder="Select a Mode of Security" allowClear loading={healthConditionLoading} options={healthCondition.map((item) => ({
                                        label: item.description,
                                        value: item.code
                                    }))}>
                                    </Select>}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <Button type="default" onClick={() => navigate(-1)} icon={<CaretLeftOutlined />}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit" loading={false} icon={<EditOutlined />}>
                            {mode === 'create' ? 'Save' : 'Update'}
                        </Button>
                        <Button type="default" onClick={onRestHandle} danger icon={<UndoOutlined />} loading={stakeholderLoading}>
                            Reset
                        </Button>
                    </div>
                </Form>
            </Card>

            <Card title={'Contact Information'}>

            </Card>
        </div >
    )
}

export default GuarantorDetails