import React from 'react';
import { Tag } from 'antd';

interface LoanStatusTagProps {
    status: string | '1' | '0';
    type: string;
}

const LoanStatusTag: React.FC<LoanStatusTagProps> = ({ status, type }) => {
    let color = '';
    let text = '';

    switch (status) {
        case '1':
            color = 'green';
            text = type === 'C' ? 'Completed' : 'Mandatory';
            break;
        case '0':
            color = 'red';
            text = type === 'C' ? 'Not Completed' : 'Not Mandatory';
            break;
        case 'A':
            color = 'yellow';
            text = 'Pending';
            break;
        default:
            color = 'gray';
            break;
    }

    return <Tag color={color} className={`text-${color}-600`}><b>{text}</b></Tag>;
};

export default LoanStatusTag;