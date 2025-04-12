/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Card, Collapse, Descriptions, Empty, Form, Select } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonModal from '../modal/commonModal';
import { formatSentence } from '../../../utils/formatterFunctions';
import useStakeholderStore, { IOtherInfo } from '../../../store/stakeholderStore';
import useCommonStore from '../../../store/commonStore';

interface IOtherDetails {
    stkId: string
}

const schema = yup.object().shape({
    occupation: yup.string().required('Occupation is required'),
    subOccupation: yup.string().required('Sub Occupation is required'),
    howDidYouKnow: yup.string().required('How did you know is required'),
    prefLang: yup.string().required('Preferred Language is required'),
    sector: yup.string().required('Sector is required'),
    subSector: yup.string().required('Sub Sector is required'),
    savingsReq: yup.string().required('Savings Required is required'),
    whtDec: yup.string().required('WHT Declaration is required'),
    poliExpo: yup.string().required('Policy Exposure is required')
});


const OtherDetails: React.FC<IOtherDetails> = ({ stkId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit' | 'remove'>('create');
    const [selectedDetail, setSelectedDetail] = useState<IOtherInfo | null>(null);

    const { control, formState: { errors }, setValue, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema),
    });

    const { occupations, occupationLoading, fetchOccupations, informationSources, informationSourceLoading, fetchInformationSources, languages, languageLoading, fetchLanguages, sectors, sectorLoading, fetchSectors, subSectors, subSectorLoading, fetchSubSectors } = useCommonStore();
    const { otherInfo, otherInfoLoading, fetchOtherInfoByStkId, updateOtherInfo, addOtherInfo } = useStakeholderStore();

    const openModal = (mode: 'create' | 'edit', otherDetails: IOtherInfo | null = null) => {
        setMode(mode);
        setSelectedDetail(otherDetails);
        setIsModalOpen(true);
        if (otherDetails) {
            setValue('occupation', otherDetails.occupation);
            setValue('howDidYouKnow', otherDetails.howDidYouKnow);
            setValue('prefLang', otherDetails.prefLang);
            setValue('sector', otherDetails.sector);
            setValue('subSector', otherDetails.subSector ?? '');
            setValue('savingsReq', otherDetails.savingsReq);
            setValue('whtDec', otherDetails.whtDec ?? '');
            setValue('poliExpo', otherDetails.poliExpo);
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IOtherInfo) => {
        if (mode === 'edit') {
            updateOtherInfo(selectedDetail?.idx ?? '', data).finally(closeModal);
        } else if (mode === 'create') {
            addOtherInfo(stkId, data).finally(closeModal);
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchOtherInfoByStkId(stkId ?? '');
        } else {
            if (occupations.length === 0) {
                fetchOccupations();
            }
            if (informationSources.length === 0) {
                fetchInformationSources();
            }
            if (languages.length === 0) {
                fetchLanguages();
            }
            if (sectors.length === 0) {
                fetchSectors();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stkId, isModalOpen, fetchOtherInfoByStkId, fetchOccupations, fetchInformationSources, fetchLanguages, fetchSectors]);

    const sector = watch('sector');

    useEffect(() => {
        if (sector) {
            fetchSubSectors(sector);
        }
    }, [sector, fetchSubSectors]);


    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                className='w-full'
                items={[
                    {
                        key: '1',
                        label: `Other Details`,
                        children: (
                            <>
                                {
                                    otherInfo?.length === 0 &&
                                    <div className='flex justify-end pb-3'>
                                        <Button type="primary" onClick={() => openModal('create')} icon={<PlusOutlined />}>
                                            Add Other Details
                                        </Button>
                                    </div>}
                                {otherInfoLoading ?
                                    <div className='flex flex-1 justify-center' >
                                        <Empty description={"Loading Other Details..."} />
                                    </div> :
                                    <>
                                        {otherInfo?.length > 0 ?
                                            <div className='grid grid-cols-4 gap-4'>
                                                {otherInfo?.map((item, index) => (
                                                    <DetailsCard key={index} detail={item} onEdit={() => openModal('edit', item)} dataArray={[languages, occupations, sectors, subSectors, informationSources]} />
                                                ))}
                                            </div> :
                                            <div className='flex flex-1 justify-center' >
                                                <Empty description={"No Other Details Available"} />
                                            </div>
                                        }
                                    </>
                                }

                            </>
                        ),
                    },
                ]}
            />
            <CommonModal
                footer={true}
                open={isModalOpen}
                onClose={closeModal}
                title={`${mode === 'create' ? 'Create' : 'Update'} Other Details`}
                size="medium"
            >
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 gap-3'>
                        <Form.Item label="Preferred Language" validateStatus={errors.prefLang ? 'error' : ''} help={errors.prefLang?.message} required>
                            <Controller
                                name="prefLang"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="Preferred Language"
                                        options={languages.map((lang) => ({ label: lang.description, value: lang.code }))}
                                        loading={languageLoading}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Occupation" validateStatus={errors.occupation ? 'error' : ''} help={errors.occupation?.message} required>
                            <Controller
                                name="occupation"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="Occupation"
                                        options={occupations.map((occ) => ({ label: occ.description, value: occ.code }))}
                                        loading={occupationLoading}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Sector" validateStatus={errors.sector ? 'error' : ''} help={errors.sector?.message} required>
                            <Controller
                                name="sector"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="Sector"
                                        options={sectors.map((sec) => ({ label: formatSentence(sec.description), value: sec.code }))}
                                        loading={sectorLoading}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Sub Sector" validateStatus={errors.subSector ? 'error' : ''} help={errors.subSector?.message} required>
                            <Controller
                                name="subSector"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="Sub Sector"
                                        options={subSectors.map((sec) => ({ label: formatSentence(sec.description), value: sec.code }))}
                                        loading={subSectorLoading}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Savings Required" validateStatus={errors.savingsReq ? 'error' : ''} help={errors.savingsReq?.message} required>
                            <Controller
                                name="savingsReq"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="Savings Required"
                                        options={[{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }]}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Policy Exposure" validateStatus={errors.poliExpo ? 'error' : ''} help={errors.poliExpo?.message} required>
                            <Controller
                                name="poliExpo"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="Policy Exposure"
                                        options={[{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }]}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="How did you know" validateStatus={errors.howDidYouKnow ? 'error' : ''} help={errors.howDidYouKnow?.message} required>
                            <Controller
                                name="howDidYouKnow"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="How did you know"
                                        options={informationSources.map((info) => ({ label: formatSentence(info.description), value: info.code }))}
                                        loading={informationSourceLoading}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item label="WHT Declaration" validateStatus={errors.whtDec ? 'error' : ''} help={errors.whtDec?.message} required>
                            <Controller
                                name="whtDec"
                                control={control}
                                render={({ field }) =>
                                    <Select
                                        {...field}
                                        placeholder="WHT Declaration"
                                        options={[{ label: 'Yes', value: 'Y' }, { label: 'No', value: 'N' }]}
                                    />
                                }
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="primary" htmlType="submit" loading={otherInfoLoading} icon={<SaveOutlined />}>
                            {mode === 'create' ? 'Save' : 'Update'}
                        </Button>
                        <Button type="default" onClick={closeModal}>Cancel</Button>
                    </div>
                </Form>
            </CommonModal>
        </>
    )
}

const DetailsCard: React.FC<{ detail: IOtherInfo; onEdit: () => void; dataArray: any[] }> = ({ detail, onEdit, dataArray }) => (
    <Card>
        <div className="flex justify-end">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Preferred Language">{formatSentence(dataArray[0].filter((item: any) => item.code === detail.prefLang)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Occupation">{formatSentence(dataArray[1].filter((item: any) => item.code === detail.occupation)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Sector">{formatSentence(dataArray[2].filter((item: any) => item.code === detail.sector)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Sub Sector">{formatSentence(dataArray[3].filter((item: any) => item.code === detail.subSector)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Savings Required">{detail.savingsReq === 'YES' ? 'Yes' : 'No'}</Descriptions.Item>
            <Descriptions.Item label="Policy Exposure">{detail.poliExpo === 'Y' ? 'Yes' : 'No'}</Descriptions.Item>
            <Descriptions.Item label="How did you know">{formatSentence(dataArray[4].filter((item: any) => item.code === detail.howDidYouKnow)[0]?.description) ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="WHT Declaration">{detail.whtDec ?? '-'}</Descriptions.Item>

        </Descriptions>
    </Card>
);

export default OtherDetails