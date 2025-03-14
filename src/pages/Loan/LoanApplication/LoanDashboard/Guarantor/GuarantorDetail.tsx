import React from 'react'
import CustomerDetails from '../../CustomerOnboarding/CustomerDetails'
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import Verification from '../../CustomerOnboarding/Verification';
import CRIBDetails from '../../CustomerOnboarding/CRIBDetails';

const GuarantorDetail: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='flex flex-col gap-2'>
                <CustomerDetails />
                <Verification />
                <CRIBDetails />
            </div>
            <div className="absolute bottom-16 flex">
                {/* Your additional content goes here */}
                <Button type="default" onClick={() => navigate(-1)}>Back</Button>
                {/* <Button type="primary" className="ml-3">Ready to Apply</Button> */}
            </div>
        </div>
    )
}

export default GuarantorDetail