import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
    status: string | 'Y' | 'N' | 'P' | '1' | '0' | 'A';
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
    let color = '';
    let text = '';

    switch (status) {
        case 'Y':
            color = 'red';
            text = 'Not Verified';
            break;
        case 'N':
            color = 'green';
            text = 'Verified';
            break;
        case 'P':
            color = 'yellow';
            text = 'Pending';
            break;
        default:
            color = 'gray';
            text = 'Unknown';
            break;
    }

    return <Tag color={color} className={`text-${color}-600`}><b>{text}</b></Tag>;
};

export default StatusTag;