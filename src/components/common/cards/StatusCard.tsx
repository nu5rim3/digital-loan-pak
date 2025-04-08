import React, { ReactNode } from 'react'
import { Card } from 'antd';

interface StatusCardProps {
    itemKey: string;
    title: string;
    value?: number;
    hcolor: string;
    bcolor: string;
    icon: ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, hcolor, bcolor, icon, itemKey }) => {

    return (
        <Card variant='borderless' className={`mr-1 ${hcolor} ${bcolor}`} onClick={() => console.log('[KEY] - ', itemKey)}>
            <div className='flex flex-row justify-between'>
                <div>
                    <div className='text-2xl'>{title}</div>
                    <div className='text-5xl'>{value}</div>
                </div>
                <div className='flex items-end text-5xl'>
                    {icon}
                </div>
            </div>
        </Card>
    )
}

export default StatusCard