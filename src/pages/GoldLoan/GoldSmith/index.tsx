import React, { ReactNode, useState } from 'react'
import StatusCard from '../../../components/common/cards/StatusCard';
import { SyncOutlined, ArrowUpOutlined, ArrowDownOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface StatusCardProps {
    itemKey: string;
    title: string;
    value: number;
    hcolor: string;
    bcolor: string;
    icon: ReactNode;
}


interface DataType {
    key: string;
    branch: string;
    shopName: string;
    ownerName: string;
    requestedDate: string;
    requestedBy: string;
    approvalStatus: string;
    updatedBy: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Branch',
        dataIndex: 'branch',
        key: 'branch',
    },
    {
        title: 'Shop Name',
        dataIndex: 'shopName',
        key: 'shopName',
    },
    {
        title: 'Owner Name',
        dataIndex: 'ownerName',
        key: 'ownerName',
    },
    {
        title: 'Requested Date',
        dataIndex: 'requestedDate',
        key: 'requestedDate',
    },
    {
        title: 'Requested By',
        dataIndex: 'requestedBy',
        key: 'requestedBy',
    },
    {
        title: 'Approval Status',
        dataIndex: 'approvalStatus',
        key: 'approvalStatus',
        render: (status) => (
            <>
                {status === 'Approved' && <Tag color='green'>{status}</Tag>}
                {status === 'Rejected' && <Tag color='red'>{status}</Tag>}
                {status === 'Pending' && <Tag color='orange'>{status}</Tag>}
                {status === 'Returned' && <Tag color='yellow'>{status}</Tag>}
            </>
        ),
    },
    {
        title: 'Updated By',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
    },
    {
        title: 'Actions',
        key: 'action',
        render: (_, data) => (
            <div className="flex space-x-2">
                {data.approvalStatus === 'Pending' && <Button type='link'>View</Button>}
                {data.approvalStatus === 'Returned' && <> <Button type='link'>View</Button><Button type='link'>Update</Button></>}
                {data.approvalStatus === 'Rejected' && <> <Button type='link'>View</Button><Button type='link' danger>Discard</Button></>}
            </div>
        ),
    },
];

const columnsChecker: ColumnsType<DataType> = [
    {
        title: 'Branch',
        dataIndex: 'branch',
        key: 'branch',
    },
    {
        title: 'Shop Name',
        dataIndex: 'shopName',
        key: 'shopName',
    },
    {
        title: 'Owner Name',
        dataIndex: 'ownerName',
        key: 'ownerName',
    },
    {
        title: 'Requested Date',
        dataIndex: 'requestedDate',
        key: 'requestedDate',
    },
    {
        title: 'Requested By',
        dataIndex: 'requestedBy',
        key: 'requestedBy',
    },
    {
        title: 'Action Type',
        dataIndex: 'approvalStatus',
        key: 'approvalStatus',
        render: (status) => (
            <>
                {status === 'Create' && <Tag color='green'>{status}</Tag>}
                {status === 'Active' && <Tag color='blue'>{status}</Tag>}
                {status === 'Delist' && <Tag color='orange'>{status}</Tag>}
                {status === 'Blacklist' && <Tag color='yellow'>{status}</Tag>}
            </>
        ),
    },
    {
        title: 'Updated By',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
    },
    {
        title: 'Actions',
        key: 'action',
        render: () => (
            <div className="flex space-x-2">
                <Button type='link'>View</Button>
            </div>
        ),
    },
];

const dataMaker: DataType[] = [
    {
        key: '1',
        branch: 'Branch 1',
        shopName: 'Shop 1',
        ownerName: 'Owner 1',
        requestedDate: '2024/05/30',
        requestedBy: 'Adam Stone',
        approvalStatus: 'Pending',
        updatedBy: '-',
    },
    {
        key: '2',
        branch: 'Branch 2',
        shopName: 'Shop 2',
        ownerName: 'Owner 2',
        requestedDate: '2024/06/30',
        requestedBy: 'Anna Smith',
        approvalStatus: 'Rejected',
        updatedBy: 'Paul Smith',
    },
    {
        key: '3',
        branch: 'Branch 3',
        shopName: 'Shop 3',
        ownerName: 'Owner 3',
        requestedDate: '2024/07/30',
        requestedBy: 'Sarah Johnson',
        approvalStatus: 'Pending',
        updatedBy: '-',
    },
    {
        key: '4',
        branch: 'Branch 4',
        shopName: 'Shop 4',
        ownerName: 'Owner 4',
        requestedDate: '2024/08/30',
        requestedBy: 'David Wilson',
        approvalStatus: 'Returned',
        updatedBy: 'Emily Davis',
    },
    {
        key: '5',
        branch: 'Branch 5',
        shopName: 'Shop 5',
        ownerName: 'Owner 5',
        requestedDate: '2024/09/30',
        requestedBy: 'Jessica Taylor',
        approvalStatus: 'Rejected',
        updatedBy: 'Daniel Anderson',
    },
];

const dataChecker: DataType[] = [
    {
        key: '1',
        branch: 'Branch 1',
        shopName: 'Shop 1',
        ownerName: 'Owner 1',
        requestedDate: '2024/05/30',
        requestedBy: 'Adam Stone',
        approvalStatus: 'Create',
        updatedBy: '-',
    },
    {
        key: '2',
        branch: 'Branch 2',
        shopName: 'Shop 2',
        ownerName: 'Owner 2',
        requestedDate: '2024/06/30',
        requestedBy: 'Anna Smith',
        approvalStatus: 'Delist',
        updatedBy: '-',
    },
    {
        key: '3',
        branch: 'Branch 3',
        shopName: 'Shop 3',
        ownerName: 'Owner 3',
        requestedDate: '2024/07/30',
        requestedBy: 'Sarah Johnson',
        approvalStatus: 'Active',
        updatedBy: '-',
    },
    {
        key: '4',
        branch: 'Branch 4',
        shopName: 'Shop 4',
        ownerName: 'Owner 4',
        requestedDate: '2024/08/30',
        requestedBy: 'David Wilson',
        approvalStatus: 'Create',
        updatedBy: '-',
    },
    {
        key: '5',
        branch: 'Branch 5',
        shopName: 'Shop 5',
        ownerName: 'Owner 5',
        requestedDate: '2024/09/30',
        requestedBy: 'Jessica Taylor',
        approvalStatus: 'Blacklist',
        updatedBy: '-',
    },
];

const GoldSmith: React.FC = () => {

    const makerCardData: StatusCardProps[] = [
        { itemKey: 'CREATE', title: 'Create', value: 20, hcolor: 'hover:bg-yellow-200', bcolor: 'bg-yellow-100', icon: <SyncOutlined className="text-yellow-500" /> },
        { itemKey: 'ACTIVE', title: 'Active', value: 20, hcolor: 'hover:bg-blue-200', bcolor: 'bg-blue-100', icon: <ArrowUpOutlined className="text-blue-500" /> },
        { itemKey: 'DELIST', title: 'Delist', value: 10, hcolor: 'hover:bg-orange-200', bcolor: 'bg-orange-100', icon: <ArrowDownOutlined className="text-orange-500" /> },
        { itemKey: 'BLACKLIST', title: 'Black List', value: 5, hcolor: 'hover:bg-red-200', bcolor: 'bg-red-100', icon: <StopOutlined className="text-red-500" /> },
    ];

    const checkerCardData: StatusCardProps[] = [
        { itemKey: 'PENDING', title: 'Pending', value: 20, hcolor: 'hover:bg-yellow-200', bcolor: 'bg-yellow-100', icon: <SyncOutlined className="text-yellow-500" /> },
        { itemKey: 'APPROVED', title: 'Approved', value: 20, hcolor: 'hover:bg-blue-200', bcolor: 'bg-blue-100', icon: <ArrowUpOutlined className="text-blue-500" /> },
        { itemKey: 'RETURNED', title: 'Returned', value: 10, hcolor: 'hover:bg-orange-200', bcolor: 'bg-orange-100', icon: <ArrowDownOutlined className="text-orange-500" /> },
        { itemKey: 'REJECTED', title: 'Rejected', value: 5, hcolor: 'hover:bg-red-200', bcolor: 'bg-red-100', icon: <StopOutlined className="text-red-500" /> },
    ];

    const [userRole, setUserRole] = useState('CHECKER');

    return (
        <div>
            <div className='my-2'>
                <Button onClick={() => setUserRole('MAKER')}>Maker</Button>
                <Button onClick={() => setUserRole('CHECKER')}>Checker</Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {userRole === 'MAKER' && makerCardData.map((data, index) => <StatusCard key={`${data.itemKey}${index}`} itemKey={data.itemKey} title={data.title} hcolor={data.hcolor} bcolor={data.bcolor} value={data.value} icon={data.icon} />)}

                {userRole === 'CHECKER' && checkerCardData.map((data, index) => <StatusCard key={`${data.itemKey}${index}`} itemKey={data.itemKey} title={data.title} hcolor={data.hcolor} bcolor={data.bcolor} value={data.value} icon={data.icon} />)}
            </div>

            <div className="my-4">
                {userRole === 'MAKER' &&
                    <Table
                        size='small'
                        columns={columns}
                        dataSource={dataMaker}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        className="shadow-md"
                    />}
                {userRole === 'CHECKER' &&
                    <Table
                        size='small'
                        columns={columnsChecker}
                        dataSource={dataChecker}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        className="shadow-md"
                    />}
            </div>
        </div>
    )
}

export default GoldSmith