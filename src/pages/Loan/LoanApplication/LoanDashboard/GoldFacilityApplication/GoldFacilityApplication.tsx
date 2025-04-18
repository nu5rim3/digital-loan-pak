/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Descriptions, Empty, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCreditStore, { IGoldLoanAppArticleDetails, IGoldLoanAppDetails } from '../../../../../store/creditStore';
import useCommonStore from '../../../../../store/commonStore';
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import useUserStore from '../../../../../store/userStore';
import { useParams } from 'react-router-dom';
import CommonModal from '../../../../../components/common/modal/commonModal';
import { convertStringToNumber, formatSentence } from '../../../../../utils/formatterFunctions';

const schema = yup.object().shape({
    tppNumber: yup.string().required('TTP Number is required'),
    goldLoanAppType: yup
        .string()
        .required('Gold Facility Type is required')
        .oneOf(['DEN', 'GOD'], 'Gold Facility Type must be either Dencimeter or Goldsmith'),
    // Fields required only if goldLoanAppType is GOD
    goldsmithIdFx: yup.string().when('goldLoanAppType', {
        is: 'GOD',
        then: (schema) => schema.required('Goldsmith ID is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    goldsmithId: yup.string().when('goldLoanAppType', {
        is: 'GOD',
        then: (schema) => schema.required('Goldsmith ID is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    goldCollateralValue: yup.string().when('goldLoanAppType', {
        is: 'GOD',
        then: (schema) => schema.required('Gold Collateral Value is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    goldGrossWeight: yup.string().when('goldLoanAppType', {
        is: 'GOD',
        then: (schema) => schema.required('Gold Gross Weight is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    goldMarketValue: yup.string().when('goldLoanAppType', {
        is: 'GOD',
        then: (schema) => schema.required('Gold Market Value is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    goldNetWeight: yup.string().when('goldLoanAppType', {
        is: 'GOD',
        then: (schema) => schema.required('Gold Net Weight is required'),
        otherwise: (schema) => schema.notRequired(),
    }),

    // Fields required only if goldLoanAppType is DEN
    denCollateralValue: yup.string().when('goldLoanAppType', {
        is: 'DEN',
        then: (schema) => schema.required('Den Collateral Value is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    denGrossWeight: yup.string().when('goldLoanAppType', {
        is: 'DEN',
        then: (schema) => schema.required('Den Gross Weight is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    denMarketValue: yup.string().when('goldLoanAppType', {
        is: 'DEN',
        then: (schema) => schema.required('Den Market Value is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    denNetWeight: yup.string().when('goldLoanAppType', {
        is: 'DEN',
        then: (schema) => schema.required('Den Net Weight is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    goldLoanAppArticleDtlsDtoList: yup.array().min(1, 'At least one article detail is required')
});

const schema2 = yup.object().shape({
    articleDtls: yup.string().required('Article Details is required'),
    articleQuantity: yup.string().required('Article Quantity is required'),
    masterArticleCode: yup.string().required('Article Code is required'),
    articleStatus: yup.string().required('Article Status is required'),
});


const GoldFacilityApplication: React.FC = () => {

    const { appId } = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState<'save' | 'update' | 'remove'>('save');
    const [selectedDetail, setSelectedDetail] = useState<IGoldLoanAppDetails | null>(null);
    const [goldLoanAppArticleDtlsDtoList, setfGoldLoanAppArticleDtlsDtoList] = useState<IGoldLoanAppArticleDetails[]>([]);

    const { control, formState: { errors }, setValue, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema),
    });

    const {
        control: articleControl,
        formState: { errors: articleErrors },
        handleSubmit: handleArticleSubmit,
        reset: resetArticle,
        setValue: setArticleValue,
    } = useForm({
        resolver: yupResolver(schema2),
    });


    const { goldsmiths, goldsmithLoading, marketValue, articleMaster, articleMasterLoading, fetchGoldsmith, fetchArticleMaster, fetchMarketValue } = useCommonStore();
    const { user } = useUserStore();
    const { goldLoanAppDetails, goldLoanAppDetailsLoading, addGoldLoanAppDetails, fetachGoldLoanAppDetails, updateGoldLoanAppDetails } = useCreditStore();

    const openModal = (mode: 'save' | 'update' | 'remove', details: IGoldLoanAppDetails | null = null) => {
        setMode(mode);
        setSelectedDetail(details);
        setIsModalOpen(true);
        if (details) {
            setValue('tppNumber', details.tppNumber ?? '');
            setValue('goldLoanAppType', details.goldLoanAppType);
            if (details.goldLoanAppType === 'GOD') {
                setValue('goldsmithIdFx', details.goldsmithIdFx ?? '');
                setValue('goldsmithIdFx', details.goldsmithIdFx ?? '');
                setValue('goldCollateralValue', details.goldCollateralValue ?? '');
                setValue('goldGrossWeight', details.goldGrossWeight ?? '');
                setValue('goldMarketValue', details.goldMarketValue ?? '');
                setValue('goldNetWeight', details.goldNetWeight ?? '');
            } else if (details.goldLoanAppType === 'DEN') {
                setValue('denCollateralValue', details.denCollateralValue ?? '');
                setValue('denGrossWeight', details.denGrossWeight ?? '');
                setValue('denMarketValue', details.denMarketValue ?? '');
                setValue('denNetWeight', details.denNetWeight ?? '');
            }
        } else {
            reset();
        }
    };

    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

    const onSubmit = (data: IGoldLoanAppDetails) => {
        const _data: IGoldLoanAppDetails = { ...data, goldLoanAppArticleDtlsDtoList: goldLoanAppArticleDtlsDtoList, loanAppStatus: 'A', id: '' }
        if (mode === 'update') {
            updateGoldLoanAppDetails(selectedDetail?.appIdx ?? '', _data).finally(closeModal);
        } else if (mode === 'save') {
            addGoldLoanAppDetails({ ..._data, appIdx: appId ?? '' }).finally(closeModal);
        }
    };

    const onSubmitArticle = (data: IGoldLoanAppArticleDetails) => {
        setfGoldLoanAppArticleDtlsDtoList((prev) => [...prev, { ...data, articleStatus: 'A' }]);
        resetArticle()
    }

    const removeSelectedIndex = (index: number) => {
        setfGoldLoanAppArticleDtlsDtoList((prev) => prev.filter((_, i) => i !== index));
    }

    const editSelectedIndex = (index: number) => {
        const selectedItem = goldLoanAppArticleDtlsDtoList[index];
        setArticleValue('masterArticleCode', selectedItem.masterArticleCode ?? '', { shouldValidate: true });
        setArticleValue('articleStatus', selectedItem.articleStatus ?? '', { shouldValidate: true });
        setArticleValue('articleQuantity', selectedItem.articleQuantity ?? '', { shouldValidate: true });
        setfGoldLoanAppArticleDtlsDtoList((prev) => prev.filter((_, i) => i !== index));
    }

    useEffect(() => {
        if (!isModalOpen) {
            fetachGoldLoanAppDetails(appId ?? '')
        } else {
            fetchGoldsmith(user?.branches[0].code ?? '')
            fetchArticleMaster()
            fetchMarketValue()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isModalOpen, fetachGoldLoanAppDetails, appId, fetchGoldsmith])

    const goldLoanType = watch('goldLoanAppType');
    const goldNetWeight = watch('goldNetWeight');


    useEffect(() => {
        if (marketValue) {
            if (goldLoanType === 'GOD') {
                setValue('goldMarketValue', marketValue?.valueAmount ?? '');
                setValue('goldsmithIdFx', user?.branches[0].code ?? '');
                setValue('denMarketValue', '0');
                setValue('denCollateralValue', '0');
                setValue('denGrossWeight', '0');
                setValue('denNetWeight', '0');
                setValue('goldLoanAppArticleDtlsDtoList', goldLoanAppArticleDtlsDtoList);
            } else if (goldLoanType === 'DEN') {
                setValue('denMarketValue', marketValue?.valueAmount ?? '');
                setValue('goldMarketValue', '0');
                setValue('goldsmithIdFx', '0');
                setValue('goldCollateralValue', '0');
                setValue('goldGrossWeight', '0');
                setValue('goldNetWeight', '0');
                setValue('goldsmithId', '0');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketValue, goldLoanType])

    useEffect(() => {
        console.log('goldNetWeight', Number(goldNetWeight))
        console.log('goldMarketValue', convertStringToNumber(marketValue?.valueAmount ?? ''))
        if (goldLoanType === 'GOD' && marketValue !== undefined && Number(goldNetWeight) > 0) {
            setValue('goldCollateralValue', (Number(goldNetWeight) * convertStringToNumber(marketValue?.valueAmount ?? '')).toString());
        } else if (goldLoanType === 'DEN' && marketValue !== undefined && Number(goldNetWeight) > 0) {
            setValue('denCollateralValue', (Number(goldNetWeight) * convertStringToNumber(marketValue?.valueAmount ?? '')).toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [goldNetWeight, marketValue])



    return (
        <>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-end'>
                    <Button type='primary' icon={<PlusOutlined />} onClick={() => openModal('save')}>Add Article Details</Button>
                </div>
                {goldLoanAppDetailsLoading ? (
                    <Empty description="Loading Term Deposit Placed..." />
                ) : goldLoanAppDetails.length === 0 ? (
                    <Empty description="No Term Deposit Placed" />
                ) : (
                    <div className='grid grid-cols-2 gap-3'>
                        {goldLoanAppDetails.map((item, index) => (
                            <DetailsCard detail={item} key={index} onEdit={() => openModal('update', item)} onRemove={() => openModal('remove', item)} dataArray={[goldsmiths]} />
                        ))}
                    </div>
                )}
            </div>

            <CommonModal
                open={isModalOpen}
                onClose={closeModal}
                title={`${formatSentence(mode)} Gold Facility Application`}
                footer={true}
                size='large'
            >
                <Card>
                    <Form layout='vertical' onFinish={handleArticleSubmit(onSubmitArticle)}>
                        <div className='grid grid-cols-2 gap-3'>
                            <Form.Item label="Article Type" validateStatus={articleErrors.masterArticleCode ? 'error' : ''} help={articleErrors.masterArticleCode?.message} required>
                                <Controller
                                    name="masterArticleCode"
                                    control={articleControl}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            allowClear
                                            placeholder="Select Article Details"
                                            onChange={(value) => {
                                                setArticleValue('masterArticleCode', value, { shouldValidate: true });
                                                setArticleValue('articleStatus', 'A', { shouldValidate: true });
                                                setArticleValue('articleDtls', articleMaster.find((item) => item.code === value)?.description ?? '', {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            options={articleMaster.map((item) => ({ label: item.description, value: item.code }))}
                                            loading={articleMasterLoading}
                                        />
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label="Article Quantity" validateStatus={articleErrors.articleQuantity ? 'error' : ''} help={articleErrors.articleQuantity?.message} required>
                                <Controller
                                    name="articleQuantity"
                                    control={articleControl}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Article Quantity" />
                                    )}
                                />
                            </Form.Item>
                        </div>
                        <div className='flex justify-end gap-2'>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Add</Button>
                            <Button type="default" htmlType="reset" onClick={() => resetArticle()} danger icon={<UndoOutlined />}>Reset</Button>
                        </div>
                    </Form>


                    {
                        goldLoanAppArticleDtlsDtoList.length > 0 ? (
                            <>
                                <div className='grid grid-cols-2 gap-3 py-5'>
                                    {goldLoanAppArticleDtlsDtoList.map((item, index) => (
                                        <Card key={index} className='bg-gray-100'>
                                            <div className="flex justify-end gap-1">
                                                <Button type="default" size="small" icon={<EditOutlined />} onClick={() => { editSelectedIndex(index) }} />
                                                <Button type="default" size="small" icon={<DeleteOutlined />} onClick={() => { removeSelectedIndex(index) }} danger />
                                            </div>
                                            <Descriptions column={1}>
                                                <Descriptions.Item label="Article Details">{item.articleDtls}</Descriptions.Item>
                                                <Descriptions.Item label="Article Quantity">{item.articleQuantity}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    ))}
                                </div>
                                <div>
                                    <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <Form.Item label="Gold Facility Type" validateStatus={errors.goldLoanAppType ? 'error' : ''} help={errors.goldLoanAppType?.message} required>
                                                <Controller
                                                    name="goldLoanAppType"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            allowClear
                                                            placeholder="Select Gold Facility Type"
                                                            options={[{ label: 'Goldsmith', value: 'GOD' }, { label: 'Dencimeter', value: 'DEN' }]}
                                                        />
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item label="TTP Number" validateStatus={errors.tppNumber ? 'error' : ''} help={errors.tppNumber?.message} required>
                                                <Controller
                                                    name="tppNumber"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="TTP Number" />
                                                    )}
                                                />
                                            </Form.Item>
                                            {
                                                goldLoanType === 'GOD' && (
                                                    <>
                                                        <Form.Item label="Goldsmith" validateStatus={errors.goldsmithIdFx ? 'error' : ''} help={errors.goldsmithIdFx?.message} required>
                                                            <Controller
                                                                name="goldsmithId"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        allowClear
                                                                        placeholder="Select Goldsmith ID"
                                                                        options={goldsmiths.map((item) => ({ label: item.ownerName, value: item.id }))}
                                                                        loading={goldsmithLoading}
                                                                        onChange={(value) => {
                                                                            setValue('goldsmithId', value, { shouldValidate: true });
                                                                            setValue('goldsmithIdFx', goldsmiths.find((item) => item.id === value)?.branchIdFx ?? '', { shouldValidate: true });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Gold Market Value" validateStatus={errors.goldMarketValue ? 'error' : ''} help={errors.goldMarketValue?.message} required>
                                                            <Controller
                                                                name="goldMarketValue"
                                                                control={control}
                                                                disabled
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Gold Market Value" />
                                                                )}
                                                            />
                                                        </Form.Item>

                                                        <Form.Item label="Gold Gross Weight" validateStatus={errors.goldGrossWeight ? 'error' : ''} help={errors.goldGrossWeight?.message} required>
                                                            <Controller
                                                                name="goldGrossWeight"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Gold Gross Weight" />
                                                                )}
                                                            />
                                                        </Form.Item>

                                                        <Form.Item label="Gold Net Weight" validateStatus={errors.goldNetWeight ? 'error' : ''} help={errors.goldNetWeight?.message} required>
                                                            <Controller
                                                                name="goldNetWeight"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Gold Net Weight" />
                                                                )}
                                                            />
                                                        </Form.Item>

                                                        <Form.Item label="Gold Collateral Value" validateStatus={errors.goldCollateralValue ? 'error' : ''} help={errors.goldCollateralValue?.message} required>
                                                            <Controller
                                                                name="goldCollateralValue"
                                                                control={control}
                                                                disabled
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Gold Collateral Value" />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                    </>
                                                )
                                            }

                                            {
                                                goldLoanType === 'DEN' && (
                                                    <>
                                                        <Form.Item label="Den Market Value" validateStatus={errors.denMarketValue ? 'error' : ''} help={errors.denMarketValue?.message} required>
                                                            <Controller
                                                                name="denMarketValue"
                                                                control={control}
                                                                disabled
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Den Market Value" />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Den Collateral Value" validateStatus={errors.denCollateralValue ? 'error' : ''} help={errors.denCollateralValue?.message} required>
                                                            <Controller
                                                                name="denCollateralValue"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Den Collateral Value" />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Den Gross Weight" validateStatus={errors.denGrossWeight ? 'error' : ''} help={errors.denGrossWeight?.message} required>
                                                            <Controller
                                                                name="denGrossWeight"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Den Gross Weight" />
                                                                )}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="Den Net Weight" validateStatus={errors.denNetWeight ? 'error' : ''} help={errors.denNetWeight?.message} required>
                                                            <Controller
                                                                name="denNetWeight"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Den Net Weight" />
                                                                )}
                                                            />
                                                        </Form.Item>

                                                    </>
                                                )
                                            }
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Button type="primary" htmlType="submit" loading={goldLoanAppDetailsLoading} icon={mode === 'remove' ? <DeleteOutlined /> : <SaveOutlined />} danger={mode === 'remove'}>
                                                {formatSentence(mode)}
                                            </Button>
                                            <Button type="default" htmlType="reset" onClick={() => reset()} danger icon={<UndoOutlined />}>Reset</Button>
                                            <Button type="default" onClick={closeModal}>Cancel</Button>
                                        </div>
                                    </Form>
                                </div>
                            </>
                        ) : (
                            <Empty description="No Article Details Available" />
                        )
                    }
                </Card>

            </CommonModal>
        </>
    )
}

const DetailsCard: React.FC<{ detail: IGoldLoanAppDetails; onEdit: () => void; onRemove: () => void; dataArray: any[] }> = ({ detail, onEdit, onRemove, dataArray }) => (
    <Card>
        <div className="flex justify-end gap-1" hidden>
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
        </div>

        {detail.goldLoanAppArticleDtlsDtoList?.length === 0 ? (
            <Descriptions.Item label="Article Details">No Article Details Available</Descriptions.Item>
        ) : (
            <>
                <div className='grid grid-cols-2 gap-4 my-3'>
                    {
                        detail?.goldLoanAppArticleDtlsDtoList?.map((item, index) => (
                            <Card key={index} className='bg-gray-100'>
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Article Details">{item.articleDtls}</Descriptions.Item>
                                    <Descriptions.Item label="Article Quantity">{item.articleQuantity}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        ))
                    }
                </div>
                <Descriptions column={2}>
                    <Descriptions.Item label="TTP Number">{detail.tppNumber}</Descriptions.Item>
                    <Descriptions.Item label="Gold Loan App Type">{detail.goldLoanAppType === 'DEN' ? 'Dencimeter' : 'Goldsmith'}</Descriptions.Item>
                    {
                        detail.goldLoanAppType === 'GOD' && (
                            <>
                                <Descriptions.Item label="Goldsmith ID">{dataArray[0].find((item: any) => item.id === detail.goldsmithIdFx)?.name}</Descriptions.Item>
                                <Descriptions.Item label="Gold Collateral Value">{detail.goldCollateralValue}</Descriptions.Item>
                                <Descriptions.Item label="Gold Gross Weight">{detail.goldGrossWeight}</Descriptions.Item>
                                <Descriptions.Item label="Gold Market Value">{detail.goldMarketValue}</Descriptions.Item>
                                <Descriptions.Item label="Gold Net Weight">{detail.goldNetWeight}</Descriptions.Item>
                            </>
                        )
                    }
                    {
                        detail.goldLoanAppType === 'DEN' && (
                            <>
                                <Descriptions.Item label="Den Collateral Value">{detail.denCollateralValue}</Descriptions.Item>
                                <Descriptions.Item label="Den Gross Weight">{detail.denGrossWeight}</Descriptions.Item>
                                <Descriptions.Item label="Den Market Value">{detail.denMarketValue}</Descriptions.Item>
                                <Descriptions.Item label="Den Net Weight">{detail.denNetWeight}</Descriptions.Item>
                            </>
                        )
                    }
                </Descriptions>

            </>
        )}

    </Card>
);

export default GoldFacilityApplication