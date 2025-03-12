import React from 'react';
import { Button } from 'antd';

interface ButtonProps {
    text: string;
    onClick: () => void;
}

const CButton: React.FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <Button type="primary" onClick={onClick}>
            {text}
        </Button>
    );
};

export default CButton;