import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Input, Form, Button, Card, Select, Empty, Spin } from "antd";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonStore from '../../../../../store/commonStore';
import { formatCNIC } from '../../../../../utils/formatterFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import { mainURL } from '../../../../../App';
import { PlusOutlined, EditOutlined, QrcodeOutlined, DeleteOutlined } from '@ant-design/icons';
import useStakeholderStore, { IStakeholder } from '../../../../../store/stakeholderStore';
import useGuarantorStore from '../../../../../store/guarantorStore';
import ContactDetailsCard from '../../../../../components/common/stakeHolder/ContactDetailsCard';
import AddressDetailsCard from '../../../../../components/common/stakeHolder/AddressDetailsCard';
import IncomeDetails from '../../../../../components/common/stakeHolder/IncomeDetails';
import NADRAModal from '../../../../../components/common/modal/NADRAModal';
import useVerificationStore from '../../../../../store/verificationStore';
import moment from 'moment';

// ✅ Validation Schema
const schema = yup.object().shape({
    idx: yup.string(),
    appraisalID: yup.string(),
    stkOrgType: yup.string().required("Organization Type is required"),
    stkCNic: yup.string().required("CNIC is required").matches(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format xxxxx-xxxxxxx-x'),
    stkCNicIssuedDate: yup.string().required("CNIC Issued Date is required"),
    stkCNicExpDate: yup.string().required("CNIC Expired Date is required"),
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
    stkEduLevel: yup.string().required("Education Level is required"),
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

interface IGuarantorDetailsView {
    formDetails?: IStakeholder[] | [];
}

const GuarantorDetailsView: React.FC<IGuarantorDetailsView> = ({ formDetails }) => {
    const [nadraModalOpen, setNadraModalOpen] = useState(false)
    const { control, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(schema),
    });
    const { selectedProductCode, relationaShipGaurantor, relationaShipGaurantorLoading, organizationType, organizationTypeLoading, modeOfSecurity, modeOfSecurityLoading, fetchModeOfSecurity, fetchOrganizationType, cnicStaus, cnicStausLoading, fetchCNICStaus, fetchRelationaShipGaurantor } = useCommonStore()
    const { appId } = useParams()
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState('');
    const [selectedCliIdx, setSelectedCliIdx] = useState('');

    const { guarantors, guarantorLoading, fetchGuarantorByAppId, deleteGuarantor, resetSelectedGuarantor } = useGuarantorStore()
    const { resetAll } = useVerificationStore()
    const { deleteStakeholder } = useStakeholderStore()

    useEffect(() => {
        fetchGuarantorByAppId(appId ?? '')
        if(selectedProductCode){
         fetchRelationaShipGaurantor(selectedProductCode ?? '')
        fetchModeOfSecurity(selectedProductCode ?? '')
        }
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (organizationType.length === 0) { fetchOrganizationType() }
        if (cnicStaus.length === 0) { fetchCNICStaus() }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onClickCreate = () => {
        resetAll()
        resetSelectedGuarantor()
        navigate(`${mainURL}/loan/application/${appId}/guarantor/set`, { state: { appId: appId } })
    }

    const selectedGuarantor = (identificationNumber: string) => {
        const selected = formDetails?.find((item) => item.stkCNic === identificationNumber);
        const __selected = guarantors?.find((item) => item.identificationNumber === identificationNumber);
        setSelectedIdx(selected?.idx ?? '');
        setSelectedCliIdx(__selected?.idx ?? '');
        if (selected) {
            setSelectedIdx(selected?.idx);
            setValue("idx", selected?.idx ?? '');
            setValue("appraisalID", selected?.appraisalID ?? appId ?? '');
            setValue("stkSequence", selected?.stkSequence);
            setValue("stkOrgType", selected?.stkOrgType);
            setValue("stkCNic", selected?.stkCNic);
            setValue("stkCNicIssuedDate", selected?.stkCNicIssuedDate);
            setValue("stkCNicExpDate", selected?.stkCNicExpDate);
            setValue("stkCNicStatus", selected?.stkCNicStatus);
            setValue("stkCusCode", selected?.stkCusCode);
            setValue("stkCusName", selected?.stkCusName);
            setValue("stkInitials", selected?.stkInitials);
            setValue("stkSurName", selected?.stkSurName);
            setValue("stkOtherName", selected?.stkOtherName);
            setValue("stkDob", selected?.stkDob);
            setValue("stkAge", selected?.stkAge);
            setValue("stkGender", selected?.stkGender);
            setValue("stkMaritialStatus", selected?.stkMaritialStatus ?? '');
            setValue("stkMaritialComment", selected?.stkMaritialComment);
            setValue("stkTitle", selected?.stkTitle);
            setValue("stkFatherOrHusName", selected?.stkFatherOrHusName);
            setValue("relationship", selected?.relationship);
            setValue("currentResPlace", selected?.currentResPlace);
            setValue("modeOfSecurity", selected?.modeOfSecurity);
        } else if (__selected) {
            setSelectedIdx('');
            setValue("idx", __selected?.idx ?? '');
            setValue("appraisalID", appId ?? '');
            setValue("stkSequence", __selected?.sequence);
            setValue("stkOrgType", '');
            setValue("stkCNic", __selected.identificationNumber);
            setValue("stkCNicIssuedDate", '');
            setValue("stkCNicExpDate", '');
            setValue("stkCNicStatus", '');
            setValue("stkCusCode", '');
            setValue("stkCusName", __selected.fullName);
            setValue("stkInitials", '');
            setValue("stkSurName", '');
            setValue("stkOtherName", '');
            setValue("stkDob", '');
            setValue("stkAge", '');
            setValue("stkGender", '');
            setValue("stkMaritialStatus", '');
            setValue("stkMaritialComment", '');
            setValue("stkTitle", '');
            setValue("stkFatherOrHusName", '');
            setValue("relationship", '');
        }
    }

    const idx = watch("idx");
    const cnicNumber = watch("stkCNic");

    const onDeleteGuarantor = () => {
        if (selectedCliIdx !== '') {
            deleteGuarantor(selectedCliIdx)
        }
        if (selectedIdx !== '') {
            deleteStakeholder(selectedIdx)
        }
        setSelectedIndex(0);
    }

    if (guarantors?.length === 0) {
        return (
            <Card>
                <Spin spinning={guarantorLoading}>
                    <Empty description={<span>Guarantors are not available. Please create a guarantor.</span>} children={<Button type="primary" onClick={onClickCreate} icon={<PlusOutlined />}>Add Guarantor</Button>} />
                </Spin>
            </Card>
        )
    }

    return (
        <Card>
            <div className='flex flex-col gap-3'>
                <div className='flex justify-end mb-4'>
                    <Button type="primary" onClick={onClickCreate} icon={<PlusOutlined />} disabled={guarantors.length >= 2}>Add Guarantor</Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {guarantors?.map((item, index) => (
                        <Button key={index} type="primary" onClick={() => {
                            setSelectedIndex(index + 1);
                            selectedGuarantor(item.identificationNumber ?? '');
                        }}>
                            {/* {`Guarantor ${index + 1} - ${item.sequence}`} */}
                              {`Guarantor ${index + 1}`}
                        </Button>
                    ))}
                </div>
                {
                    selectedIndex > 0 && (
                        <>
                            <Card title={`Personal Details: Guarantor ${selectedIndex}`}
                                extra={
                                    <div className='grid grid-cols-3 gap-2'>
                                        <Button type='default' onClick={() => setNadraModalOpen(true)} icon={<QrcodeOutlined />} >Guarantor QR</Button>
                                        <Button type="default" onClick={() => {
                                            navigate(`${mainURL}/loan/application/${appId}/guarantor`, { state: { mode: 'edit', idx: idx, cnicNumber: cnicNumber } })
                                        }} icon={<EditOutlined />}>Update details</Button>
                                        <Button type='default' danger icon={<DeleteOutlined />} onClick={onDeleteGuarantor}>Delete</Button>
                                    </div>
                                }
                            >
                                <Form layout="vertical" disabled>
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
                                                    //max={moment().format("YYYY-MM-DD")}
                                                     max={moment().subtract(1, "day").format("YYYY-MM-DD")}
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
                                                        label: item.description,
                                                        value: item.code
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
                                        <Form.Item label="Status" validateStatus={errors.status ? "error" : ""} help={errors.status?.message} hidden>
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => <Input {...field} placeholder="Enter Status" />}
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
                                        <Form.Item label="Current Residence" validateStatus={errors.currentResPlace ? "error" : ""} help={errors.currentResPlace?.message} required>
                                            <Controller
                                                name="currentResPlace"
                                                control={control}
                                                render={({ field }) => <Input {...field} placeholder="Enter Current Residence" />}
                                            />
                                        </Form.Item>
                                        <Form.Item hidden>
                                            <Controller
                                                name="idx"
                                                control={control}
                                                render={({ field }) => <Input {...field} />}
                                            />
                                        </Form.Item>
                                    </div>
                                </Form>
                            </Card>
                            {
                                selectedIdx !== '' && (
                                    <>
                                        <ContactDetailsCard stkId={selectedIdx ?? ''} subTitle={`Guarantor ${selectedIndex}`} />

                                        <AddressDetailsCard stkId={selectedIdx ?? ''} subTitle={`Guarantor ${selectedIndex}`} />

                                        <IncomeDetails stkId={selectedIdx ?? ''} subTitle={`Guarantor ${selectedIndex}`} />
                                    </>
                                )
                            }

                            <NADRAModal open={nadraModalOpen} onCancel={() => setNadraModalOpen(false)} cliIdx={guarantors[selectedIndex]?.idx ?? selectedCliIdx} />

                        </>
                    )
                }

            </div>
        </Card>
    )
}

export default GuarantorDetailsView