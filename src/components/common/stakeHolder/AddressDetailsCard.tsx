// import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Select, Switch } from 'antd'
// import React, { useEffect, useState } from 'react'
// import { PlusOutlined, EditOutlined, UndoOutlined, SaveOutlined } from '@ant-design/icons'
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Controller, useForm } from 'react-hook-form';
// import * as yup from 'yup'
// import useCommonStore from '../../../store/commonStore';
// import CommonModal from '../modal/commonModal';
// import useStakeholderStore from '../../../store/stakeholderStore';
// import { getAddressType, getArea, getCommunity, getProvince, getResidenceType } from '../../../utils/stakholderFunction';
// import { splitDuration } from '../../../utils/formatterFunctions';

// interface IAddressDetailsCard {
//     subTitle?: string;
//     stkId?: string;
// }

// const schema = yup.object().shape({
//     residenceType: yup.string().required("Residence Type is required"),
//     addressType: yup.string().required("Address Type is required"),
//     addressLine1: yup.string().required("Address Line 1 is required"),
//     addressLine2: yup.string(),
//     addressLine3: yup.string(),
//     addressLine4: yup.string(),
//     area: yup.string().required("Area is required"),
//     city: yup.string().required("City is required"),
//     district: yup.string().required("District is required"),
//     province: yup.string().required("Province is required"),
//     community: yup.string().required("Community is required"),
//     nearByPopPlc: yup.string().required("Nearby Place is required"),
//     durOfCurrLoc: yup.string().required("Duration of Current Location is required"),
//     years: yup.string(),
//     months: yup.string(),
//     status: yup.string(),
// });

// const AddressDetailsCard: React.FC<IAddressDetailsCard> = ({ stkId, subTitle }) => {

//     const { control, formState: { errors }, setValue, handleSubmit, reset, getValues } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             status: 'A',
//         }
//     });
//     const [openModal, setOpenModal] = useState(false)
//     const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
//     const [selectedResId, setSelectedResId] = useState('');

//     const { communities, communityLoading, fetchCommunities, residenceType, residenceTypeLoading, fetchResidenceType, areas, areaLoading, fetchAreas } = useCommonStore()
//     const { addressDetails, addressDetailsLoading, addAddressDetail, updateAddressDetail, fetchAddressDetailsByStkId, inActivateAddressDetail } = useStakeholderStore()

//     const onClickCreate = () => {
//         setMode('create')
//         reset()
//         setOpenModal(true)
//     }

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const onClickEdit = (item: any) => {
//         setMode('edit')
//         setSelectedResId(item.idx ?? '')
//         setValue("residenceType", item.residenceType)
//         setValue("addressType", item.addressType)
//         setValue("addressLine1", item.addressLine1)
//         setValue("addressLine2", item.addressLine2)
//         setValue("addressLine3", item.addressLine3)
//         setValue("addressLine4", item.addressLine4)
//         setValue("area", item.area)
//         setValue("city", item.city)
//         setValue("district", item.district)
//         setValue("province", item.province)
//         setValue("community", item.community)
//         setValue("nearByPopPlc", item.nearByPopPlc)
//         setValue("durOfCurrLoc", item.durOfCurrLoc)
//         setValue("years", splitDuration(item.durOfCurrLoc).years)
//         setValue("months", splitDuration(item.durOfCurrLoc).months)
//         setValue("status", item.status)
//         setOpenModal(true)

//     }

//     useEffect(() => {
//         if (!openModal) {
//             fetchAddressDetailsByStkId(stkId ?? '')
//         } else {
//             if (communities.length === 0) {
//                 fetchCommunities()
//             }
//             if (residenceType.length === 0) {
//                 fetchResidenceType()
//             }
//             if (areas.length === 0) {
//                 fetchAreas()
//             }
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [stkId, openModal])

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const onSubmit = (data: any) => {
//         if (mode === 'edit') {
//             updateAddressDetail(selectedResId ?? '', { ...data, durOfCurrLoc: `${data.years}, ${data.months}` }).finally(() => {
//                 reset()
//                 setOpenModal(false)
//             })
//         } else if (mode === 'create') {
//             addAddressDetail(stkId ?? '', [{ ...data, durOfCurrLoc: `${data.years}, ${data.months}` }]).finally(() => {
//                 reset()
//                 setOpenModal(false)
//             })
//         } else if (mode === 'remove') {
//             inActivateAddressDetail(selectedResId ?? '').finally(() => {
//                 reset()
//                 setOpenModal(false)
//             }
//             )
//         }
//     }

//     if (addressDetailsLoading) {
//         return (
//             <Card className='flex justify-center'>
//                 <Empty
//                     description={"Loading Address Details..."} />
//             </Card>
//         )
//     }

//     if (addressDetails?.length === 0) {
//         return (
//             <Card className='flex justify-center'>
//                 <Empty
//                     description={"No Address Details Available"}
//                     children={<Button type="primary" onClick={() => setOpenModal(true)} icon={<PlusOutlined />}>Add Address</Button>}
//                 />
//                 <CommonModal
//                     footer={true}
//                     open={openModal}
//                     onClose={() => setOpenModal(false)}
//                     title={`${mode === 'create' ? 'Create' : 'Update'} Address`}
//                     size='large'

//                 >
//                     <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
//                         <div className='grid grid-cols-3 gap-3 pt-5'>
//                             <Form.Item label="Residence Type" validateStatus={errors.residenceType ? "error" : ""} help={errors.residenceType?.message} required>
//                                 <Controller
//                                     control={control}
//                                     name="residenceType"
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             allowClear
//                                             loading={residenceTypeLoading}
//                                             placeholder="Select Residence Type"
//                                             options={residenceType.map((item) => ({ label: item.description, value: item.code }))}
//                                         />
//                                     )}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Address Type" validateStatus={errors.addressType ? "error" : ""} help={errors.addressType?.message} required>
//                                 <Controller
//                                     control={control}
//                                     name="addressType"
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             placeholder="Select Address Type"
//                                             options={[
//                                                 { label: 'Permanent Address', value: 'PERMANANT' },
//                                                 { label: 'Residential Address', value: 'TEMPORARY' },
//                                                 { label: 'Business Address', value: 'BUSINESS' },
//                                             ]}
//                                         />
//                                     )}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Address Line 1" validateStatus={errors.addressLine1 ? "error" : ""} help={errors.addressLine1?.message} required>
//                                 <Controller
//                                     name="addressLine1"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter Address Line 1" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Address Line 2" validateStatus={errors.addressLine2 ? "error" : ""} help={errors.addressLine2?.message}>
//                                 <Controller
//                                     name="addressLine2"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter Address Line 2" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Address Line 3" validateStatus={errors.addressLine3 ? "error" : ""} help={errors.addressLine3?.message}>
//                                 <Controller
//                                     name="addressLine3"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter Address Line 3" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Address Line 4" validateStatus={errors.addressLine4 ? "error" : ""} help={errors.addressLine4?.message}>
//                                 <Controller
//                                     name="addressLine4"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter Address Line 4" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Area" validateStatus={errors.area ? "error" : ""} help={errors.area?.message} required>
//                                 <Controller
//                                     name="area"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             allowClear
//                                             loading={areaLoading}
//                                             placeholder="Select Area"
//                                             options={
//                                                 [
//                                                     { label: 'Karachi', value: 'KHI' },
//                                                     { label: 'Common', value: '001' },
//                                                 ]
//                                             }
//                                         />
//                                     )}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="City" validateStatus={errors.city ? "error" : ""} help={errors.city?.message} required>
//                                 <Controller
//                                     name="city"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter City" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="District" validateStatus={errors.district ? "error" : ""} help={errors.district?.message} required>
//                                 <Controller
//                                     name="district"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter District" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Province" validateStatus={errors.province ? "error" : ""} help={errors.province?.message} required>
//                                 <Controller
//                                     name="province"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Select
//                                             {...field}
//                                             allowClear
//                                             loading={areaLoading}
//                                             placeholder="Select Province"
//                                             options={areas.map((item) => ({ label: item.description, value: item.code }))}
//                                         />

//                                     }
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Community" validateStatus={errors.community ? "error" : ""} help={errors.community?.message} required>
//                                 <Controller
//                                     name="community"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             allowClear
//                                             loading={communityLoading}
//                                             placeholder="Select Community"
//                                             options={communities.map((item) => ({ label: item.description, value: item.code }))}
//                                         />
//                                     )}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Nearby Place" validateStatus={errors.nearByPopPlc ? "error" : ""} help={errors.nearByPopPlc?.message} required>
//                                 <Controller
//                                     name="nearByPopPlc"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} placeholder="Enter Nearby Place" />}
//                                 />
//                             </Form.Item>

//                             <Form.Item label="Duration of Current Location" validateStatus={errors.durOfCurrLoc ? "error" : ""} help={errors.durOfCurrLoc?.message} required>
//                                 <div className='grid grid-cols-2 gap-2'>
//                                     <Controller
//                                         name="years"
//                                         control={control}
//                                         defaultValue='0Y'
//                                         render={({ field }) =>
//                                             <Select {...field} placeholder="Years" options={[
//                                                 { label: '0 Year', value: '0Y' },
//                                                 { label: '1 Year', value: '1Y' },
//                                                 { label: '2 Years', value: '2Y' },
//                                                 { label: '3 Years', value: '3Y' },
//                                                 { label: '4 Years', value: '4Y' },
//                                                 { label: '5 Years', value: '5Y' },
//                                                 { label: '6 Years', value: '6Y' },
//                                                 { label: '7 Years', value: '7Y' },
//                                                 { label: '8 Years', value: '8Y' },
//                                                 { label: '9 Years', value: '9Y' },
//                                                 { label: '10 Years', value: '10Y' },
//                                             ]}
//                                                 onChange={(e) => {
//                                                     setValue("years", e)
//                                                     setValue("durOfCurrLoc", `${e}, ${getValues('months')}`)

//                                                 }}
//                                             />
//                                         }

//                                     />
//                                     <Controller
//                                         name="months"
//                                         control={control}
//                                         defaultValue='0M'
//                                         render={({ field }) =>
//                                             <Select {...field} placeholder="Months" options={[
//                                                 { label: '0 Month', value: '0M' },
//                                                 { label: '1 Month', value: '1M' },
//                                                 { label: '2 Months', value: '2M' },
//                                                 { label: '3 Months', value: '3M' },
//                                                 { label: '4 Months', value: '4M' },
//                                                 { label: '5 Months', value: '5M' },
//                                                 { label: '6 Months', value: '6M' },
//                                                 { label: '7 Months', value: '7M' },
//                                                 { label: '8 Months', value: '8M' },
//                                                 { label: '9 Months', value: '9M' },
//                                                 { label: '10 Months', value: '10M' },
//                                                 { label: '11 Months', value: '11M' },
//                                             ]}
//                                                 onChange={(e) => {
//                                                     setValue("months", e)
//                                                     setValue("durOfCurrLoc", `${getValues('years')} , ${e}`)

//                                                 }}
//                                             />
//                                         }

//                                     />
//                                 </div>
//                             </Form.Item>

//                             <Form.Item hidden>
//                                 <Controller
//                                     name="durOfCurrLoc"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <Input {...field} />
//                                     }
//                                 />
//                             </Form.Item>

//                             <Form.Item>
//                                 <Controller
//                                     name="status"
//                                     control={control}
//                                     render={({ field }) =>
//                                         <div className='flex items-center gap-2'>
//                                             <Switch
//                                                 checked={field.value === 'A'}
//                                                 onChange={(checked) => {
//                                                     setValue("status", checked ? 'A' : 'I')
//                                                     setMode('remove')
//                                                 }} />
//                                             <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
//                                         </div>
//                                     }
//                                 />

//                             </Form.Item>
//                         </div>

//                         <div className='flex justify-end gap-3'>
//                             <Button type="primary" htmlType='submit' loading={addressDetailsLoading} icon={<SaveOutlined />}>{mode === 'create' ? 'Save' : 'Update'}</Button>
//                             <Button type="default" htmlType='reset' onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
//                             <Button type="default" onClick={() => setOpenModal(false)}>Cancel</Button>

//                         </div>
//                     </Form>
//                 </CommonModal>
//             </Card>
//         )
//     }


//     return (
//         <>
//             <Collapse
//                 size='small'
//                 defaultActiveKey={['1']}
//                 items={[{
//                     key: 1,
//                     label: `Address Details${subTitle !== undefined ? ': ' + subTitle : ''}`,
//                     children: <>
//                         <div className='flex justify-end pb-3'>
//                             <Button type="primary" onClick={onClickCreate} icon={<PlusOutlined />}>Add Address</Button>
//                         </div>
//                         {addressDetails?.length > 0 ?
//                             <div className='grid grid-cols-3 gap-4'>
//                                 {addressDetails?.map((item, index) => item.status === 'A' && (
//                                     <Card key={index} styles={{
//                                         header: { display: 'none' },
//                                         body: { padding: '0px', paddingInline: '15px', paddingBlock: '10px' },
//                                     }}>
//                                         <div className='flex justify-end'>
//                                             <Button type='default' size='small' className='ml-3' icon={<EditOutlined />} onClick={() => onClickEdit(item)} />
//                                         </div>
//                                         <Descriptions column={1}>
//                                             <Descriptions.Item label="Resident Type">{getResidenceType(item.residenceType)}</Descriptions.Item>
//                                             <Descriptions.Item label="Address Type">{getAddressType(item.addressType)}</Descriptions.Item>
//                                             <Descriptions.Item label="Address Line 1">{item.addressLine1}</Descriptions.Item>
//                                             <Descriptions.Item label="Address Line 2">{item.addressLine2}</Descriptions.Item>
//                                             <Descriptions.Item label="Address Line 3">{item.addressLine3}</Descriptions.Item>
//                                             <Descriptions.Item label="Address Line 4">{item.addressLine4}</Descriptions.Item>
//                                             <Descriptions.Item label="Area">{getArea(item.area)}</Descriptions.Item>
//                                             <Descriptions.Item label="City">{item.city}</Descriptions.Item>
//                                             <Descriptions.Item label="District">{item.district}</Descriptions.Item>
//                                             <Descriptions.Item label="Province">{getProvince(item.province, areas)}</Descriptions.Item>
//                                             <Descriptions.Item label="Community">{getCommunity(item.community, communities)}</Descriptions.Item>
//                                             <Descriptions.Item label="Nearby Place">{item.nearByPopPlc}</Descriptions.Item>
//                                             <Descriptions.Item label="Duration of Current Location">{item.durOfCurrLoc}</Descriptions.Item>
//                                         </Descriptions>
//                                     </Card>
//                                 ))}
//                             </div> :
//                             <div className='flex flex-1 justify-center' >
//                                 <Empty description={"No Address Details Available"} />
//                             </div>
//                         }
//                     </>,
//                     // extra: <Button type="primary" className='mr-3' icon={<PlusOutlined />} onClick={onClickCreate}>Add Address</Button>,
//                 }]}
//             />

//             <CommonModal
//                 footer={true}
//                 open={openModal}
//                 onClose={() => setOpenModal(false)}
//                 title={`${mode === 'create' ? 'Create' : 'Update'} Address`}
//                 size='large'

//             >
//                 <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
//                     <div className='grid grid-cols-3 gap-3 pt-5'>
//                         <Form.Item label="Residence Type" validateStatus={errors.residenceType ? "error" : ""} help={errors.residenceType?.message} required>
//                             <Controller
//                                 control={control}
//                                 name="residenceType"
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         allowClear
//                                         loading={residenceTypeLoading}
//                                         placeholder="Select Residence Type"
//                                         options={residenceType.map((item) => ({ label: item.description, value: item.code }))}
//                                     />
//                                 )}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Address Type" validateStatus={errors.addressType ? "error" : ""} help={errors.addressType?.message} required>
//                             <Controller
//                                 control={control}
//                                 name="addressType"
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         placeholder="Select Address Type"
//                                         options={[
//                                             { label: 'Permanent Address', value: 'PERMANANT' },
//                                             { label: 'Residential Address', value: 'TEMPORARY' },
//                                             { label: 'Business Address', value: 'BUSINESS' },
//                                         ]}
//                                     />
//                                 )}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Address Line 1" validateStatus={errors.addressLine1 ? "error" : ""} help={errors.addressLine1?.message} required>
//                             <Controller
//                                 name="addressLine1"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter Address Line 1" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Address Line 2" validateStatus={errors.addressLine2 ? "error" : ""} help={errors.addressLine2?.message}>
//                             <Controller
//                                 name="addressLine2"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter Address Line 2" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Address Line 3" validateStatus={errors.addressLine3 ? "error" : ""} help={errors.addressLine3?.message}>
//                             <Controller
//                                 name="addressLine3"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter Address Line 3" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Address Line 4" validateStatus={errors.addressLine4 ? "error" : ""} help={errors.addressLine4?.message}>
//                             <Controller
//                                 name="addressLine4"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter Address Line 4" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Area" validateStatus={errors.area ? "error" : ""} help={errors.area?.message} required>
//                             <Controller
//                                 name="area"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         allowClear
//                                         loading={areaLoading}
//                                         placeholder="Select Area"
//                                         options={
//                                             [
//                                                 { label: 'Karachi', value: 'KHI' },
//                                                 { label: 'Common', value: '001' },
//                                             ]
//                                         }
//                                     />
//                                 )}
//                             />
//                         </Form.Item>

//                         <Form.Item label="City" validateStatus={errors.city ? "error" : ""} help={errors.city?.message} required>
//                             <Controller
//                                 name="city"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter City" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="District" validateStatus={errors.district ? "error" : ""} help={errors.district?.message} required>
//                             <Controller
//                                 name="district"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter District" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Province" validateStatus={errors.province ? "error" : ""} help={errors.province?.message} required>
//                             <Controller
//                                 name="province"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Select
//                                         {...field}
//                                         allowClear
//                                         loading={areaLoading}
//                                         placeholder="Select Province"
//                                         options={areas.map((item) => ({ label: item.description, value: item.code }))}
//                                     />

//                                 }
//                             />
//                         </Form.Item>

//                         <Form.Item label="Community" validateStatus={errors.community ? "error" : ""} help={errors.community?.message} required>
//                             <Controller
//                                 name="community"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         allowClear
//                                         loading={communityLoading}
//                                         placeholder="Select Community"
//                                         options={communities.map((item) => ({ label: item.description, value: item.code }))}
//                                     />
//                                 )}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Nearby Place" validateStatus={errors.nearByPopPlc ? "error" : ""} help={errors.nearByPopPlc?.message} required>
//                             <Controller
//                                 name="nearByPopPlc"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} placeholder="Enter Nearby Place" />}
//                             />
//                         </Form.Item>

//                         <Form.Item label="Duration of Current Location" validateStatus={errors.durOfCurrLoc ? "error" : ""} help={errors.durOfCurrLoc?.message} required>
//                             <div className='grid grid-cols-2 gap-2'>
//                                 <Controller
//                                     name="years"
//                                     control={control}
//                                     defaultValue='0Y'
//                                     render={({ field }) =>
//                                         <Select {...field} placeholder="Years" options={[
//                                             { label: '0 Year', value: '0Y' },
//                                             { label: '1 Year', value: '1Y' },
//                                             { label: '2 Years', value: '2Y' },
//                                             { label: '3 Years', value: '3Y' },
//                                             { label: '4 Years', value: '4Y' },
//                                             { label: '5 Years', value: '5Y' },
//                                             { label: '6 Years', value: '6Y' },
//                                             { label: '7 Years', value: '7Y' },
//                                             { label: '8 Years', value: '8Y' },
//                                             { label: '9 Years', value: '9Y' },
//                                             { label: '10 Years', value: '10Y' },
//                                         ]}
//                                             onChange={(e) => {
//                                                 setValue("years", e)
//                                                 setValue("durOfCurrLoc", `${e}, ${getValues('months')}`)

//                                             }}
//                                         />
//                                     }

//                                 />
//                                 <Controller
//                                     name="months"
//                                     control={control}
//                                     defaultValue='0M'
//                                     render={({ field }) =>
//                                         <Select {...field} placeholder="Months" options={[
//                                             { label: '0 Month', value: '0M' },
//                                             { label: '1 Month', value: '1M' },
//                                             { label: '2 Months', value: '2M' },
//                                             { label: '3 Months', value: '3M' },
//                                             { label: '4 Months', value: '4M' },
//                                             { label: '5 Months', value: '5M' },
//                                             { label: '6 Months', value: '6M' },
//                                             { label: '7 Months', value: '7M' },
//                                             { label: '8 Months', value: '8M' },
//                                             { label: '9 Months', value: '9M' },
//                                             { label: '10 Months', value: '10M' },
//                                             { label: '11 Months', value: '11M' },
//                                         ]}
//                                             onChange={(e) => {
//                                                 setValue("months", e)
//                                                 setValue("durOfCurrLoc", `${getValues('years')} , ${e}`)

//                                             }}
//                                         />
//                                     }

//                                 />
//                             </div>
//                         </Form.Item>

//                         <Form.Item hidden>
//                             <Controller
//                                 name="durOfCurrLoc"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <Input {...field} />
//                                 }
//                             />
//                         </Form.Item>

//                         <Form.Item>
//                             <Controller
//                                 name="status"
//                                 control={control}
//                                 render={({ field }) =>
//                                     <div className='flex items-center gap-2'>
//                                         <Switch
//                                             checked={field.value === 'A'}
//                                             onChange={(checked) => {
//                                                 setValue("status", checked ? 'A' : 'I')
//                                                 setMode('remove')
//                                             }} />
//                                         <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
//                                     </div>
//                                 }
//                             />

//                         </Form.Item>
//                     </div>

//                     <div className='flex justify-end gap-3'>
//                         <Button type="primary" htmlType='submit' loading={addressDetailsLoading} icon={<SaveOutlined />}>{mode === 'create' ? 'Save' : 'Update'}</Button>
//                         <Button type="default" htmlType='reset' onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
//                         <Button type="default" onClick={() => setOpenModal(false)}>Cancel</Button>

//                     </div>
//                 </Form>
//             </CommonModal>
//         </>
//     )
// }

// export default AddressDetailsCard


import { Button, Card, Collapse, Descriptions, Empty, Form, Input, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined, EditOutlined, UndoOutlined, SaveOutlined } from '@ant-design/icons';
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
    nearByPopPlc: yup.string().required("Nearby Place is required"),
    durOfCurrLoc: yup.string().required("Duration of Current Location is required"),
    years: yup.string(),
    months: yup.string(),
    status: yup.string(),
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
        if (addressDetailsLoading) return <Empty description="Loading Address Details..." />;
        if (!addressDetails?.length) return <Empty description="No Address Details Available" />;
        return (
            <div className="grid grid-cols-3 gap-4">
                {addressDetails.map((item, index) => item.status === 'A' && (
                    <Card key={index}>
                        <div className="flex justify-end">
                            <Button
                                type="default"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleModalOpen('edit', item)}
                            />
                        </div>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Resident Type">{getResidenceType(item.residenceType)}</Descriptions.Item>
                            <Descriptions.Item label="Address Type">{getAddressType(item.addressType)}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 1">{item.addressLine1}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 2">{item.addressLine2}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 3">{item.addressLine3}</Descriptions.Item>
                            <Descriptions.Item label="Address Line 4">{item.addressLine4}</Descriptions.Item>
                            <Descriptions.Item label="Area">{getArea(item.area)}</Descriptions.Item>
                            <Descriptions.Item label="City">{item.city}</Descriptions.Item>
                            <Descriptions.Item label="District">{item.district}</Descriptions.Item>
                            <Descriptions.Item label="Province">{getProvince(item.province, areas)}</Descriptions.Item>
                            <Descriptions.Item label="Community">{getCommunity(item.community, communities)}</Descriptions.Item>
                            <Descriptions.Item label="Nearby Place">{item.nearByPopPlc}</Descriptions.Item>
                            <Descriptions.Item label="Duration of Current Location">{item.durOfCurrLoc}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                ))}
            </div>
        );
    };

    const renderFormItems = () => (
        <>
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
            <Form.Item label="Address Type" validateStatus={errors.addressType ? "error" : ""} help={errors.addressType?.message} required>
                <Controller
                    control={control}
                    name="addressType"
                    render={({ field }) => (
                        <Select
                            {...field}
                            placeholder="Select Address Type"
                            options={[
                                { label: 'Permanent Address', value: 'PERMANANT' },
                                { label: 'Residential Address', value: 'TEMPORARY' },
                                { label: 'Business Address', value: 'BUSINESS' },
                            ]}
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

            <Form.Item label="Nearby Place" validateStatus={errors.nearByPopPlc ? "error" : ""} help={errors.nearByPopPlc?.message} required>
                <Controller
                    name="nearByPopPlc"
                    control={control}
                    render={({ field }) =>
                        <Input {...field} placeholder="Enter Nearby Place" />}
                />
            </Form.Item>

            <Form.Item label="Duration of Current Location" validateStatus={errors.durOfCurrLoc ? "error" : ""} help={errors.durOfCurrLoc?.message} required>
                <div className='grid grid-cols-2 gap-2'>
                    <Controller
                        name="years"
                        control={control}
                        defaultValue='0Y'
                        render={({ field }) =>
                            <Select {...field} placeholder="Years" options={[
                                { label: '0 Year', value: '0Y' },
                                { label: '1 Year', value: '1Y' },
                                { label: '2 Years', value: '2Y' },
                                { label: '3 Years', value: '3Y' },
                                { label: '4 Years', value: '4Y' },
                                { label: '5 Years', value: '5Y' },
                                { label: '6 Years', value: '6Y' },
                                { label: '7 Years', value: '7Y' },
                                { label: '8 Years', value: '8Y' },
                                { label: '9 Years', value: '9Y' },
                                { label: '10 Years', value: '10Y' },
                            ]}
                                onChange={(e) => {
                                    setValue("years", e)
                                    setValue("durOfCurrLoc", `${e}, ${getValues('months')}`)

                                }}
                            />
                        }

                    />
                    <Controller
                        name="months"
                        control={control}
                        defaultValue='0M'
                        render={({ field }) =>
                            <Select {...field} placeholder="Months" options={[
                                { label: '0 Month', value: '0M' },
                                { label: '1 Month', value: '1M' },
                                { label: '2 Months', value: '2M' },
                                { label: '3 Months', value: '3M' },
                                { label: '4 Months', value: '4M' },
                                { label: '5 Months', value: '5M' },
                                { label: '6 Months', value: '6M' },
                                { label: '7 Months', value: '7M' },
                                { label: '8 Months', value: '8M' },
                                { label: '9 Months', value: '9M' },
                                { label: '10 Months', value: '10M' },
                                { label: '11 Months', value: '11M' },
                            ]}
                                onChange={(e) => {
                                    setValue("months", e)
                                    setValue("durOfCurrLoc", `${getValues('years')} , ${e}`)

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

            <Form.Item>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) =>
                        <div className='flex items-center gap-2'>
                            <Switch
                                checked={field.value === 'A'}
                                onChange={(checked) => {
                                    setValue("status", checked ? 'A' : 'I')
                                    setMode('remove')
                                }} />
                            <span>{field.value === 'A' ? 'Active' : 'Inactive'}</span>
                        </div>
                    }
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