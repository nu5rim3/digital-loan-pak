import { Result, Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { mainURL } from '../../App';

const UnderConstruction: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Result
                status="info"
                title="Under Construction"
                subTitle="Sorry, this page is under construction."
                extra={
                    <Button type="primary" onClick={() => navigate(`${mainURL}/dashboard`)}>Go Home</Button>
                }
            />
        </div>
    )
}

export default UnderConstruction