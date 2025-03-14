import React, { ReactNode } from 'react'
import StatusCard from '../../components/common/cards/StatusCard'
import { ArrowDownOutlined, ArrowUpOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';

interface StatusCardProps {
    itemKey: string;
    title: string;
    value: number;
    hcolor: string;
    bcolor: string;
    icon: ReactNode;
}

const Dashboard: React.FC = () => {

    const cardData: StatusCardProps[] = [
        { itemKey: 'PENDING', title: 'Pending', value: 20, hcolor: 'hover:bg-yellow-200', bcolor: 'bg-yellow-100', icon: <SyncOutlined className="text-yellow-500" /> },
        { itemKey: 'APPROVED', title: 'Approved', value: 20, hcolor: 'hover:bg-blue-200', bcolor: 'bg-blue-100', icon: <ArrowUpOutlined className="text-blue-500" /> },
        { itemKey: 'RETURNED', title: 'Returned', value: 10, hcolor: 'hover:bg-orange-200', bcolor: 'bg-orange-100', icon: <ArrowDownOutlined className="text-orange-500" /> },
        { itemKey: 'REJECTED', title: 'Rejected', value: 5, hcolor: 'hover:bg-red-200', bcolor: 'bg-red-100', icon: <StopOutlined className="text-red-500" /> },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {cardData.map((data, index) => <StatusCard key={`${data.itemKey}${index}`} itemKey={data.itemKey} title={data.title} hcolor={data.hcolor} bcolor={data.bcolor} value={data.value} icon={data.icon} />)}
        </div>
    )
}

export default Dashboard