import React from 'react'
import { SyncOutlined, PlusCircleFilled } from '@ant-design/icons';
import StatusCard from '../../components/common/cards/StatusCard';

const Dashboard: React.FC = () => {

    return (
        <div className="grid grid-cols-4 gap-4">
            <StatusCard
                itemKey="PENDING"
                title="Pending Loans"
                hcolor="hover:bg-yellow-200"
                bcolor="bg-yellow-100"
                value={55}
                icon={<SyncOutlined className="text-green-500" />}
            />
            <div onClick={() => console.log('Create Loans clicked')} className='cursor-pointer'>
                <StatusCard
                    itemKey="CREATE"
                    title="Create New Loans"
                    hcolor="hover:bg-yellow-200"
                    bcolor="bg-yellow-100"
                    icon={<PlusCircleFilled className="text-green-500" />}
                />
            </div>

        </div>
    );
};

export default Dashboard;