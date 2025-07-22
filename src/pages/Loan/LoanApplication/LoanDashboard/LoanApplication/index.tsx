import { Button, Card, Descriptions, Empty, Form, Popconfirm, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
    //  EditOutlined, SaveOutlined, DeleteOutlined, UndoOutlined 
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import useCreditStore, { IAgricultureIncome, IBusinessIncome, ILiveStockIncome, IOtherIncome, ISalaryIncome } from '../../../../../store/creditStore';
import { formatCurrency } from '../../../../../utils/formatterFunctions';

const LoanApplication: React.FC = () => {
    const { appId } = useParams()

    const navigate = useNavigate()

    const handleCreateLoanApplication = () => {
        navigate('loan-application', { state: { sourceOfIncome } })
    }

    const [sourceOfIncome, setSourceOfIncome] = useState(null)
    const [selectedIdx, setSelectedIdx] = useState('')

    const { otherIncome, otherIncomeLoading, liveStockIncome, liveStockIncomeLoading, salaryIncome, salaryIncomeLoading, agricultureIncome, agricultureIncomeLoading, businessIncome, businessIncomeLoading, fetchBusinessIncome, fetchAgricultureIncome, fetchSalaryIncome, fetchLiveStockIncome, fetchOtherIncome } = useCreditStore()


    useEffect(() => {
        if (sourceOfIncome === 'Salary Income') {
            fetchSalaryIncome(appId ?? '')
        } else if (sourceOfIncome === 'Agricultural Income') {
            fetchAgricultureIncome(appId ?? '')
        } else if (sourceOfIncome === 'Business Income') {
            fetchBusinessIncome(appId ?? '')
        } else if (sourceOfIncome === 'Live Stock Income') {
            fetchLiveStockIncome(appId ?? '')
        } else if (sourceOfIncome === 'Other Income') {
            fetchOtherIncome(appId ?? '')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOfIncome])

    const onSelectedRemove = () => {
        // Remove business income logic here
        if (sourceOfIncome === 'Business Income') {
            // Call the remove function from your store or API
            // Example: removeBusinessIncome(id)
            console.log(`Removing business income with id: ${selectedIdx}`);
        } else if (sourceOfIncome === 'Agricultural Income') {
            // Call the remove function from your store or API
            // Example: removeAgriculturalIncome(id)
            console.log(`Removing agricultural income with id: ${selectedIdx}`);
        } else if (sourceOfIncome === 'Salary Income') {
            // Call the remove function from your store or API
            // Example: removeSalaryIncome(id)
            console.log(`Removing salary income with id: ${selectedIdx}`);
        } else if (sourceOfIncome === 'Live Stock Income') {
            // Call the remove function from your store or API
            // Example: removeLiveStockIncome(id)
            console.log(`Removing live stock income with id: ${selectedIdx}`);
        }
    }


    return (
        <>
            <div className='flex justify-between'>
                <Form className='w-1/4' layout='vertical'>
                    <Form.Item label="Source of Income">
                        <Select
                            className='w-1/4'
                            placeholder="Select Income Source"
                            value={sourceOfIncome}
                            options={[
                                { label: 'Agriculture Income ', value: 'Agriculture Income ' },
                                { label: 'Business Income', value: 'Business Income' },
                                { label: 'Salary Income', value: 'Salary Income' },
                                { label: 'Live Stock Income', value: 'Live Stock Income' },
                                { label: 'Other Income', value: 'Other Income' }
                            ]}
                            onChange={(value => setSourceOfIncome(value))}
                        />
                    </Form.Item>
                </Form>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateLoanApplication}>
                    Create a Loan Application
                </Button>
            </div>
            {
                businessIncome.length === 0 && sourceOfIncome === 'Business Income' && (
                    <Spin spinning={businessIncomeLoading} size='small'>
                        <Empty description="No Business Income Found" />
                    </Spin>
                )}
            {sourceOfIncome === 'Business Income' && (
                <div className='grid grid-cols-4 gap-3'>
                    {businessIncome.map((item) => (
                        <BusinessDetailsCard detail={item}
                            onEdit={() => {
                                navigate('loan-application', { state: { sourceOfIncome, businessIncome: item, mode: 'update' } })
                            }}
                            onRemove={() => setSelectedIdx(item.idx ?? '')}
                            onSelectedRemove={onSelectedRemove}
                        />
                    ))}
                </div>
            )
            }

            {
                agricultureIncome.length === 0 && sourceOfIncome === 'Agriculture Income ' && (
                    <Spin spinning={agricultureIncomeLoading} size='small'>
                        <Empty description="No Agricultural Income Found" />
                    </Spin>
                )}
            {sourceOfIncome === 'Agricultural Income' && (
                <div className='grid grid-cols-4 gap-3'>
                    {agricultureIncome.map((item) => (
                        <AgriDetailsCard detail={item}
                            onEdit={() => { }}
                            onRemove={() => setSelectedIdx(item.idx ?? '')}
                            onSelectedRemove={onSelectedRemove}
                        />
                    ))}
                </div>
            )
            }

            {
                salaryIncome.length === 0 && sourceOfIncome === 'Salary Income' && (
                    <Spin spinning={salaryIncomeLoading} size='small'>
                        <Empty description="No Salary Income Found" />
                    </Spin>
                )}

            {sourceOfIncome === 'Salary Income' && (
                <div className='grid grid-cols-4 gap-3'>
                    {salaryIncome.map((item) => (
                        <SalaryDetailsCard detail={item}
                            onEdit={() => {
                                navigate('loan-application', { state: { sourceOfIncome, salaryIncome: item, mode: 'update' } })
                            }}
                            onRemove={() => setSelectedIdx(item.idx ?? '')}
                            onSelectedRemove={onSelectedRemove}
                        />
                    ))}
                </div>
            )
            }

            {
                liveStockIncome.length === 0 && sourceOfIncome === 'Live Stock Income' && (
                    <Spin spinning={liveStockIncomeLoading} size='small'>
                        <Empty description="No Live Stock Income Found" />
                    </Spin>
                )}
            {sourceOfIncome === 'Live Stock Income' && (
                <div className='grid grid-cols-4 gap-3'>
                    {liveStockIncome.map((item) => (
                        <LiveStockDetailsCard detail={item}
                            onEdit={() => {
                                navigate('loan-application', { state: { sourceOfIncome, liveStockIncome: item, mode: 'update' } })
                            }}
                            onRemove={() => setSelectedIdx(item.idx ?? '')}
                            onSelectedRemove={onSelectedRemove}
                        />
                    ))}
                </div>
            )
            }

            {
                otherIncome.length === 0 && sourceOfIncome === 'Other Income' && (
                    <Spin spinning={otherIncomeLoading} size='small'>
                        <Empty description="No Other Income Found" />
                    </Spin>
                )}

            {sourceOfIncome === 'Other Income' && (
                <div className='grid grid-cols-4 gap-3'>
                    {otherIncome.map((item) => (
                        <OtherDetailsCard detail={item}
                            onEdit={() => {
                                navigate('loan-application', { state: { sourceOfIncome, otherIncome: item, mode: 'update' } })
                            }}
                            onRemove={() => setSelectedIdx(item.idx ?? '')}
                            onSelectedRemove={onSelectedRemove}
                        />
                    ))}
                </div>
            )
            }
        </>
    )
}

const BusinessDetailsCard: React.FC<{ detail: IBusinessIncome; onEdit: () => void; onRemove: () => void; onSelectedRemove: () => void; }> = ({ detail, onEdit, onRemove, onSelectedRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Popconfirm
                title="Delete"
                description="Are you sure to delete?"
                onConfirm={onSelectedRemove}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
            </Popconfirm>
        </div>
        <Descriptions column={1}>
            <Descriptions.Item label="Business Name">{detail.bnsName}</Descriptions.Item>
            <Descriptions.Item label="Business Phone">{detail.phoneNo}</Descriptions.Item>
            <Descriptions.Item label="Business Asset and Stock">{formatCurrency(Number(detail.costOfBns))}</Descriptions.Item>
            {/* <Descriptions.Item label="Business Ratings">{detail.bnsRatings ?? '-'}</Descriptions.Item> */}
        </Descriptions>
    </Card>
);

const AgriDetailsCard: React.FC<{ detail: IAgricultureIncome; onEdit: () => void; onRemove: () => void; onSelectedRemove: () => void; }> = ({ detail, onEdit, onRemove, onSelectedRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Popconfirm
                title="Delete"
                description="Are you sure to delete?"
                onConfirm={onSelectedRemove}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
            </Popconfirm>
        </div>
        <Descriptions column={1} colon>
            <Descriptions.Item label="Crop Name">{detail.cropsName}</Descriptions.Item>
            <Descriptions.Item label="Borrower District">{detail.borrowerDistrict}</Descriptions.Item>
            <Descriptions.Item label="Total Acres">{detail.acresTotal}</Descriptions.Item>
        </Descriptions>
    </Card>
);

const SalaryDetailsCard: React.FC<{ detail: ISalaryIncome; onEdit: () => void; onRemove: () => void; onSelectedRemove: () => void; }> = ({ detail, onEdit, onRemove, onSelectedRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Popconfirm
                title="Delete"
                description="Are you sure to delete?"
                onConfirm={onSelectedRemove}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
            </Popconfirm>
        </div>
        <Descriptions column={1} colon>
            <Descriptions.Item label="Employer">{detail.employer}</Descriptions.Item>
            <Descriptions.Item label="Designation">{detail.designation}</Descriptions.Item>
            <Descriptions.Item label="Contact Number">{detail.contactNo}</Descriptions.Item>
        </Descriptions>
    </Card>
);

const LiveStockDetailsCard: React.FC<{ detail: ILiveStockIncome; onEdit: () => void; onRemove: () => void; onSelectedRemove: () => void; }> = ({ detail, onEdit, onRemove, onSelectedRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Popconfirm
                title="Delete"
                description="Are you sure to delete?"
                onConfirm={onSelectedRemove}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
            </Popconfirm>
        </div>
        <Descriptions column={1} colon>
            <Descriptions.Item label="Borrower District">{detail.borrowerDistrict}</Descriptions.Item>
            <Descriptions.Item label="SO/ WO/ DO">{detail.sowodo}</Descriptions.Item>
            <Descriptions.Item label="Collateral">{detail.collateral}</Descriptions.Item>
        </Descriptions>
    </Card>
);


const OtherDetailsCard: React.FC<{ detail: IOtherIncome; onEdit: () => void; onRemove: () => void; onSelectedRemove: () => void; }> = ({ detail, onEdit, onRemove, onSelectedRemove }) => (
    <Card>
        <div className="flex justify-end gap-1">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={onEdit} />
            <Popconfirm
                title="Delete"
                description="Are you sure to delete?"
                onConfirm={onSelectedRemove}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button type="default" size="small" icon={<DeleteOutlined />} onClick={onRemove} danger />
            </Popconfirm>
        </div>
        <Descriptions column={1} colon>
            <Descriptions.Item label="Other Income Category">{detail.incomeCategory}</Descriptions.Item>
            <Descriptions.Item label="Description">{detail.description}</Descriptions.Item>
        </Descriptions>
    </Card>
);

export default LoanApplication