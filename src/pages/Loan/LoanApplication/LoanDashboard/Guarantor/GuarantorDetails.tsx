import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Select } from 'antd';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import useStakeholderStore, { IStakeholder } from '../../../../../store/stakeholderStore';
import useCommonStore from '../../../../../store/commonStore';
import { getStakeholderByType } from '../../../../../utils/stakholderFunction';
import { formatCNIC, formatName, splitInitialAndSurname, titleGenderMaritalMap } from '../../../../../utils/formatterFunctions';
import { CaretLeftOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import useGuarantorStore from '../../../../../store/guarantorStore';
import moment from 'moment';
import useCreditStore from '../../../../../store/creditStore';

interface IGuarantorDetails {
    formDetails?: IStakeholder[];
}

// ✅ Validation Schema
const schema = yup.object().shape({
    appraisalID: yup.string(),
    stkOrgType: yup.string().required("Organization Type is required"),
    stkCNic: yup.string().required("CNIC is required").matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format xxxxx-xxxxxxx-x'),
    stkDob: yup.string()
        .required("Date of Birth is required")
        .test('is-adult', 'Age must be at least 18', function (value) {
            const dob = new Date(value);
            const age = new Date().getFullYear() - dob.getFullYear()
            return !isNaN(age) && age >= 18;
        }),
    stkAge: yup.string()
        .required("Age is required")
        .matches(/^\d+$/, "Age must be a number")
        .test('is-valid-age', 'Age must be calculated from Date of Birth', function (value) {
            const { stkDob } = this.parent;
            if (stkDob) {
                const dob = new Date(stkDob);
                const age = new Date().getFullYear() - dob.getFullYear();
                return Number(value) === age;
            }
            return true;
        }),
    stkCNicIssuedDate: yup.string()
        .required("CNIC Issued Date is required")
        .test('is-later', 'CNIC Issued Date must not be earlier than Date of Birth', function (value) {
            const { stkDob } = this.parent;
            return value && stkDob ? new Date(value) >= new Date(stkDob) : true;
        }),
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
    stkGender: yup.string().required("Gender is required"),
    stkMaritialStatus: yup.string().required("Marital Status is required"),
    stkTitle: yup.string().required("Title is required"),
    stkFatherOrHusName: yup.string().required("Father or Husband Name is required").matches(/^[a-zA-Z.\s]+$/, "Name must contain only letters and spaces"),
    currentResPlace: yup.string().required("Current Residence is required"),
    relationship: yup.string().required("Relationship is required"),
    modeOfSecurity: yup.string().required("Mode of Security is required"),
});

const GuarantorDetails: React.FC<IGuarantorDetails> = () => {

    const { control, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
        resolver: yupResolver(schema),
    });

    const { selectedProductCode, relationaShipGaurantor, relationaShipGaurantorLoading, modeOfSecurity, modeOfSecurityLoading, organizationType, organizationTypeLoading, fetchOrganizationType, cnicStaus, cnicStausLoading, fetchCNICStaus, fetchEducationLevel, fetchModeOfSecurity, fetchRelationaShipGaurantor } = useCommonStore()
    const { stakeholderLoading, stakeholders, fetchStackholderByAppId, addStakeholder, updateStakeholder } = useStakeholderStore()
    const { guarantors, fetchGuarantorByAppId } = useGuarantorStore();
    const { setActiveStep } = useCreditStore()
    
    const [initialSave, setInitialSave] = useState(false);

    const { appId } = useParams()
    const navigate = useNavigate();
    const mode = useLocation().state?.mode ?? 'create';
    const { state } = useLocation()

    const [stakholderId, setStakholderId] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        if (initialSave) {
            addStakeholder({ ...data, stkCNic: state.cnicNumber, appraisalID: appId ?? '', new: true, stkType: 'G' })
            setInitialSave(false)
        } else if (mode === 'create') {
            addStakeholder({ ...data, appraisalID: appId ?? '', new: true, stkType: 'G' })
        } else if (mode === 'edit') {
            updateStakeholder(stakholderId, { ...data, stkCNic: state.cnicNumber, appraisalID: appId ?? '', update: true, stkType: 'G' })
        }
        fetchStackholderByAppId(appId ?? '')
    }

    useEffect(() => {
        fetchOrganizationType()
        fetchCNICStaus()
        fetchEducationLevel()
        // fetchHeadOfFamily()
        // fetchHealthCondition()
        fetchGuarantorByAppId(appId ?? '')
        fetchStackholderByAppId(appId ?? '')
        if(selectedProductCode){
        fetchModeOfSecurity(selectedProductCode ?? '')
        fetchRelationaShipGaurantor(selectedProductCode ?? '')
        }
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (mode === 'edit') {
            const formDetails = getStakeholderByType('G', stakeholders).find((item) => item.stkCNic === state.cnicNumber);
            const __selectedGuarantor = guarantors.find((item) => item.identificationNumber === state.cnicNumber || item.idx === state.idx)
            if (formDetails) {
                setStakholderId(formDetails?.idx)
                setInitialSave(false)
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
                setValue("stkMaritialStatus", formDetails?.stkMaritialStatus ?? '');
                setValue("stkTitle", formDetails?.stkTitle);
                setValue("stkFatherOrHusName", formDetails?.stkFatherOrHusName);
                setValue("currentResPlace", formDetails?.currentResPlace);
                setValue("relationship", formDetails?.relationship);
                setValue("modeOfSecurity", formDetails?.modeOfSecurity);
            } else if (__selectedGuarantor) {
                setInitialSave(true)
                setValue("appraisalID", appId ?? '');
                setValue("stkCNic", __selectedGuarantor.identificationNumber);
                setValue("stkCusName", __selectedGuarantor.fullName);
                const { initial, surname } = splitInitialAndSurname(__selectedGuarantor?.fullName?.toString());
                setValue("stkInitials", initial);
                setValue("stkSurName", surname);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeholders, guarantors])

    const onRestHandle = () => {
        if (mode === 'create') {
            reset()
        } else {
            fetchStackholderByAppId(appId ?? '')
        }
    }

    const stkDob = watch('stkDob')

    useEffect(() => {
        if (stkDob) {
            const today = new Date();
            const birthDate = new Date(stkDob);
            const age = today.getFullYear() - birthDate.getFullYear();
            setValue("stkAge", age.toString());
        }
    }, [stkDob, setValue]);

    const watchedTitle = watch("stkTitle");

    useEffect(() => {
        if (!watchedTitle) return;
        const map = titleGenderMaritalMap[watchedTitle];
        if (map) {
            if (map.gender) setValue("stkGender", map.gender);
            if (map.maritalStatus) setValue("stkMaritialStatus", map.maritalStatus);
        }
    }, [watchedTitle, setValue]);

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
                                name="stkCusName"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Customer Name" disabled />}
                            />
                        </Form.Item>
                        <Form.Item label="Initial" validateStatus={errors.stkInitials ? "error" : ""} help={errors.stkInitials?.message} required>
                            <Controller
                                name="stkInitials"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        {...field}
                                        placeholder="Enter Initial"
                                        onChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        disabled
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Surname" validateStatus={errors.stkSurName ? "error" : ""} help={errors.stkSurName?.message} required>
                            <Controller
                                name="stkSurName"
                                control={control}
                                render={({ field }) =>
                                    <Input
                                        {...field}
                                        placeholder="Enter Surname"
                                        onChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        disabled
                                    />
                                }
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
                                render={({ field }) => <Input
                                    {...field}
                                    placeholder="Enter CNIC Issued Date"
                                    type='date'
                                    // Ensure the issued date is not earlier than the date of birth
                                    min={watch('stkDob') ? moment(watch('stkDob')).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                                    // cannot be in the feture
                                    max={moment().format("YYYY-MM-DD")}
                                />}
                            />
                        </Form.Item>
                        <Form.Item label="CNIC Expired Date" validateStatus={errors.stkCNicExpDate ? "error" : ""} help={errors.stkCNicExpDate?.message} required>
                            <Controller
                                name="stkCNicExpDate"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter CNIC Expired Date" type='date' min={moment().format("YYYY-MM-DD")} />}
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
                                        value: item.code,
                                        disabled: item.code !== '0907' // Disable the 'Individual' option
                                    }))}>
                                    </Select>
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


                        <Form.Item label="Father or Husband Name" validateStatus={errors.stkFatherOrHusName ? "error" : ""} help={errors.stkFatherOrHusName?.message} required>
                            <Controller
                                name="stkFatherOrHusName"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Father or Husband Name" />}
                            />
                        </Form.Item>
                        <Form.Item label="Current Residence" validateStatus={errors.currentResPlace ? "error" : ""} help={errors.currentResPlace?.message} required>
                            <Controller
                                name="currentResPlace"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Enter Current Residence" />}
                            />
                        </Form.Item>
                        <Form.Item label="Relationship" validateStatus={errors.relationship ? "error" : ""} help={errors.relationship?.message} required>
                            <Controller
                                name="relationship"
                                control={control}
                                render={({ field }) =>
                                    <Select {...field} placeholder="Select a Relationship" allowClear loading={relationaShipGaurantorLoading} options={relationaShipGaurantor.map((item) => ({
                                        label: item.description,
                                        value: item.code
                                    }))}>
                                    </Select>
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Mode of Security" validateStatus={errors.modeOfSecurity ? "error" : ""} help={errors.modeOfSecurity?.message} required>
                            <Controller
                                name="modeOfSecurity"
                                control={control}
                                render={({ field }) =>
                                    <Select {...field} placeholder="Select a Mode of Security" allowClear loading={modeOfSecurityLoading} options={modeOfSecurity.map((item) => ({
                                        label: item.description,
                                        value: item.code
                                    }))}>
                                    </Select>}
                            />
                        </Form.Item>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <Button type="default" onClick={() =>
                            {
                                setActiveStep("guarantor")
                                navigate(-1)
                            }
                            
                             } icon={<CaretLeftOutlined />}>
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
        </div >
    )
}

export default GuarantorDetails