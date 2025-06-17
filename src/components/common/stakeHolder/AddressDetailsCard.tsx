import { Button, Card, Checkbox, Collapse, Descriptions, Empty, Form, Input, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined, EditOutlined, UndoOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import useCommonStore from '../../../store/commonStore';
import CommonModal from '../modal/commonModal';
import useStakeholderStore, { IAddressDetails } from '../../../store/stakeholderStore';
import { getAddressType, getArea, getCommunity, getProvince, getResidenceType } from '../../../utils/stakholderFunction';
import { splitDuration } from '../../../utils/formatterFunctions';

interface IAddressDetailsCard {
    subTitle?: string;
    stkId?: string;
}

const schema = yup.object().shape({
    residenceType: yup.string().required("Residence Type is required"),
    addressType: yup.string().required("Address Type is required"),
    addressLine1: yup.string().required("Address Line 1 is required"),
    addressLine2: yup.string(),
    addressLine3: yup.string(),
    addressLine4: yup.string(),
    area: yup.string().required("Area is required"),
    city: yup.string().required("City is required"),
    district: yup.string().required("District is required"),
    province: yup.string().required("Province is required"),
    community: yup.string().required("Community is required"),
    nearByPopPlc: yup.string().required("Nearby Popular Place is required"),
    durOfCurrLoc: yup.string().required("Duration of Current Location is required"),
    years: yup.string(),
    months: yup.string(),
    status: yup.string().default('A'),
    sameAsPermanent: yup.boolean().default(false),
});

const AddressDetailsCard: React.FC<IAddressDetailsCard> = ({ stkId, subTitle }) => {
    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const [selectedResId, setSelectedResId] = useState('');

    const { control, formState: { errors }, setValue, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: 'A' },
    });

    const {
        communities,
        communityLoading,
        fetchCommunities,
        residenceType,
        residenceTypeLoading,
        fetchResidenceType,
        areas,
        areaLoading,
        fetchAreas,
    } = useCommonStore();

    const {
        addressDetails,
        addressDetailsLoading,
        addAddressDetail,
        updateAddressDetail,
        fetchAddressDetailsByStkId,
        inActivateAddressDetail,
    } = useStakeholderStore();

    const fetchData = async () => {
        if (!openModal) {
            fetchAddressDetailsByStkId(stkId ?? '');
        } else {
            if (communities.length === 0) fetchCommunities();
            if (residenceType.length === 0) fetchResidenceType();
            if (areas.length === 0) fetchAreas();
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData(); }, [stkId, openModal]);

    const handleModalOpen = (mode: 'create' | 'edit', item?: IAddressDetails) => {
        setMode(mode);
        reset();
        if (mode === 'edit' && item) {
            setSelectedResId(item.idx ?? '');
            setValue("residenceType", item.residenceType);
            setValue("addressType", item.addressType);
            setValue("addressLine1", item.addressLine1);
            setValue("addressLine2", item.addressLine2 ?? '');
            setValue("addressLine3", item.addressLine3 ?? '');
            setValue("addressLine4", item.addressLine4 ?? '');
            setValue("area", item.area);
            setValue("city", item.city);
            setValue("district", item.district);
            setValue("province", item.province);
            setValue("community", item.community);
            setValue("nearByPopPlc", item.nearByPopPlc);
            setValue("status", item.status);
            setValue("durOfCurrLoc", item.durOfCurrLoc);
            const { years, months } = splitDuration(item.durOfCurrLoc);
            setValue("years", years);
            setValue("months", months);
        }
        setOpenModal(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        const requestData = { ...data, durOfCurrLoc: `${data.years}, ${data.months}` };
        const actions = {
            create: () => addAddressDetail(stkId ?? '', [requestData]),
            edit: () => updateAddressDetail(selectedResId, requestData),
            remove: () => inActivateAddressDetail(selectedResId),
        };
        await actions[mode]();
        reset();
        setOpenModal(false);
    };

    const renderAddressDetails = () => {
        if (addressDetailsLoading) return <Spin spinning={addressDetailsLoading}><Empty description="Loading Address Details..." /></Spin>;
        if (!addressDetails?.length) return <Empty description="No Address Details Available" />;
        return (
            <div className="grid grid-cols-3 gap-4">
                {addressDetails.map((item, index) => item.status === 'A' && (
                    <Card key={index}>
                        <div className="flex justify-end gap-1">
                            <Button
                                type="default"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => inActivateAddressDetail(item.idx).finally(() => fetchAddressDetailsByStkId(stkId ?? ''))}
                            />
                            <Button
                                type="default"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleModalOpen('edit', item)}
                            />
                        </div>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Address Type">{getAddressType(item.addressType)}</Descriptions.Item>
                            <Descriptions.Item label="Resident Type">{getResidenceType(item.residenceType)}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 1">{item.addressLine1}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 2">{item.addressLine2}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 3">{item.addressLine3}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 4">{item.addressLine4}</Descriptions.Item>
                            <Descriptions.Item label="Area">{getArea(item.area)}</Descriptions.Item>
                            <Descriptions.Item label="City">{item.city}</Descriptions.Item>
                            <Descriptions.Item label="District">{item.district}</Descriptions.Item>
                            <Descriptions.Item label="Province">{getProvince(item.province, areas)}</Descriptions.Item>
                            <Descriptions.Item label="Community">{getCommunity(item.community, communities)}</Descriptions.Item>
                            <Descriptions.Item label="Nearby Popular Place">{item.nearByPopPlc}</Descriptions.Item>
                            <Descriptions.Item label="Duration of Current Location">
                                {`${splitDuration(item.durOfCurrLoc).years}Y, ${splitDuration(item.durOfCurrLoc).months}M`}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                ))}
            </div>
        );
    };

    const usedAddressTypes = React.useMemo(
        () => addressDetails?.filter(a => a.status === 'A').map(a => a.addressType) ?? [],
        [addressDetails]
    );

    const addressTypeOptions = [
        { label: 'Permanent', value: 'PERMANANT' },
        { label: 'Residential', value: 'TEMPORARY' },
        { label: 'Business', value: 'BUSINESS' },
    ];

    const disabledAddressTypeOptions = addressTypeOptions.map(option => ({
        ...option,
        disabled: usedAddressTypes.includes(option.value as "PERMANANT" | "TEMPORARY" | "OTHER")
    }));


    const renderFormItems = () => (
        <>
            <Form.Item label="Address Type" validateStatus={errors.addressType ? "error" : ""} help={errors.addressType?.message} required>
                <Controller
                    control={control}
                    name="addressType"
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder="Select Address Type"
                            options={disabledAddressTypeOptions}
                        />
                    )}
                />
            </Form.Item>
            <Form.Item label="Residence Type" validateStatus={errors.residenceType ? "error" : ""} help={errors.residenceType?.message} required>
                <Controller
                    name="residenceType"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            allowClear
                            loading={residenceTypeLoading}
                            placeholder="Select Residence Type"
                            options={residenceType.map((item) => ({ label: item.description, value: item.code }))}
                        />
                    )}
                />
            </Form.Item>


            <Form.Item label="Address Line 1" validateStatus={errors.addressLine1 ? "error" : ""} help={errors.addressLine1?.message} required>
                <Controller
                    name="addressLine1"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter Address Line 1" />}
                />
            </Form.Item>

            <Form.Item label="Address Line 2" validateStatus={errors.addressLine2 ? "error" : ""} help={errors.addressLine2?.message}>
                <Controller
                    name="addressLine2"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter Address Line 2" />}
                />
            </Form.Item>

            <Form.Item label="Address Line 3" validateStatus={errors.addressLine3 ? "error" : ""} help={errors.addressLine3?.message}>
                <Controller
                    name="addressLine3"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter Address Line 3" />}
                />
            </Form.Item>

            <Form.Item label="Address Line 4" validateStatus={errors.addressLine4 ? "error" : ""} help={errors.addressLine4?.message}>
                <Controller
                    name="addressLine4"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter Address Line 4" />}
                />
            </Form.Item>

            <Form.Item label="Area" validateStatus={errors.area ? "error" : ""} help={errors.area?.message} required>
                <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            allowClear
                            loading={areaLoading}
                            placeholder="Select Area"
                            options={
                                [
                                    { label: 'Karachi', value: 'KHI' },
                                    { label: 'Common', value: '001' },
                                ]
                            }
                        />
                    )}
                />
            </Form.Item>

            <Form.Item label="City" validateStatus={errors.city ? "error" : ""} help={errors.city?.message} required>
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter City" />}
                />
            </Form.Item>

            <Form.Item label="District" validateStatus={errors.district ? "error" : ""} help={errors.district?.message} required>
                <Controller
                    name="district"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter District" />}
                />
            </Form.Item>

            <Form.Item label="Province" validateStatus={errors.province ? "error" : ""} help={errors.province?.message} required>
                <Controller
                    name="province"
                    control={control}
                    render={({ field }) =>
                        <Select
                            {...field}
                            allowClear
                            loading={areaLoading}
                            placeholder="Select Province"
                            options={areas.map((item) => ({ label: item.description, value: item.code }))}
                        />

                    }
                />
            </Form.Item>

            <Form.Item label="Community" validateStatus={errors.community ? "error" : ""} help={errors.community?.message} required>
                <Controller
                    name="community"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            allowClear
                            loading={communityLoading}
                            placeholder="Select Community"
                            options={communities.map((item) => ({ label: item.description, value: item.code }))}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item label="Nearby Popular Place" validateStatus={errors.nearByPopPlc ? "error" : ""} help={errors.nearByPopPlc?.message} required>
                <Controller
                    name="nearByPopPlc"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter Nearby Popular Place" />}
                />
            </Form.Item>

            <Form.Item label="Duration of Current Location" validateStatus={errors.durOfCurrLoc ? "error" : ""} help={errors.durOfCurrLoc?.message} required>
                <div className='grid grid-cols-2 gap-2'>
                    <Controller
                        name="years"
                        control={control}
                        defaultValue='0'
                        render={({ field }) =>
                            <Input
                                {...field}
                                suffix="Years"
                                placeholder="0"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setValue("years", value);
                                    setValue("durOfCurrLoc", `${value} , ${getValues('months')}`);
                                }}
                            />
                        }

                    />
                    <Controller
                        name="months"
                        control={control}
                        defaultValue='0'
                        render={({ field }) =>
                            <Input
                                {...field}
                                suffix="Months"
                                placeholder="0"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setValue("months", value);
                                    setValue("durOfCurrLoc", `${getValues('years')} , ${value}`);
                                }}
                            />
                        }

                    />
                </div>
            </Form.Item>

            <Form.Item hidden>
                <Controller
                    name="durOfCurrLoc"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} />
                    }
                />
            </Form.Item>
            {/* <Form.Item>
                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={field.value === 'A'}
                                onChange={(checked) => {
                                    setValue('status', checked ? 'A' : 'I')
                                    // setMode('remove')
                                }}
                            />
                            <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
                        </div>
                    )}
                />
            </Form.Item> */}
            {/* form item check box that ask same as the permenet address to fill */}
            <Form.Item hidden={mode !== 'edit'}>
                <Controller
                    name="sameAsPermanent"
                    control={control}
                    render={({ field }) => (
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                checked={field.value}
                                onChange={(checked) => {
                                    field.onChange(checked);
                                    if (checked) {
                                        const permentAddress = addressDetails.filter(a => a.addressType === 'PERMANANT' && a.status === 'A')[0];
                                        setValue("residenceType", permentAddress?.residenceType ?? '');
                                        setValue("addressLine1", permentAddress?.addressLine1 ?? '');
                                        setValue("addressLine2", permentAddress?.addressLine2 ?? '');
                                        setValue("addressLine3", permentAddress?.addressLine3 ?? '');
                                        setValue("addressLine4", permentAddress?.addressLine4 ?? '');
                                        setValue("area", permentAddress?.area ?? '');
                                        setValue("city", permentAddress?.city ?? '');
                                        setValue("district", permentAddress?.district ?? '');
                                        setValue("province", permentAddress?.province ?? '');
                                        setValue("community", permentAddress?.community ?? '');
                                        setValue("nearByPopPlc", permentAddress?.nearByPopPlc ?? '');
                                        setValue("durOfCurrLoc", permentAddress?.durOfCurrLoc ?? '');
                                        const { years, months } = splitDuration(permentAddress?.durOfCurrLoc ?? '');
                                        setValue("years", years);
                                        setValue("months", months);
                                    }
                                }}
                            />
                            <span>Same as Permanent Address</span>
                        </div>
                    )}
                />
            </Form.Item>
        </>
    );

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                items={[{
                    key: 1,
                    label: `Address Details${subTitle ? `: ${subTitle}` : ''}`,
                    children: (
                        <>
                            <div className="flex justify-end pb-3">
                                <Button type="primary" onClick={() => handleModalOpen('create')} icon={<PlusOutlined />}>Add Address</Button>
                            </div>
                            {renderAddressDetails()}
                        </>
                    ),
                }]}
            />
            <CommonModal
                footer
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={`${mode === 'create' ? 'Create' : 'Update'} Address`}
                size="large"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-3 pt-5">
                        {renderFormItems()}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={addressDetailsLoading} icon={<SaveOutlined />}>{mode === 'create' ? 'Save' : 'Update'}</Button>
                        <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
                        <Button type="default" onClick={() => setOpenModal(false)}>Cancel</Button>
                    </div>
                </Form>
            </CommonModal>
        </>
    );
};

export default AddressDetailsCard;