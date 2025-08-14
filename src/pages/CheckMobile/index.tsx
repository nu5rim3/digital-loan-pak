import React from 'react'
import mobileImage from '../../assets/mobile-friendly.png';
import { Card, Result } from 'antd';

const CheckMobile: React.FC = () => {

    return (
        <Card className="flex items-center justify-center">
            <Result
                status="info"
                title="Please Check the Mobile Device"
                subTitle="Sorry, This component needs to be completed from the mobile application."
                extra={
                    <div className='flex flex-col items-center'>
                        <img
                            src={mobileImage}
                            alt="Mobile Friendly"
                            style={{ width: '200px', height: 'auto', marginBottom: '20px' }}
                        />
                    </div>
                }
            />
        </Card>
    )
}

export default CheckMobile