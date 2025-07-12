import React, { useEffect, useState } from 'react'
import logo from "../../assets/full_logo_black.png";
import { Card, Typography } from 'antd';

const { Text } = Typography;

const Dashboard: React.FC = () => {
    // State for live date and time
    const [dateTime, setDateTime] = useState<{ date: string, time: string }>({
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }),
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setDateTime({
                date: now.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
                time: now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='flex justify-center items-center h-full w-full'>
            <div className='flex flex-col justify-center items-center h-full w-full'>
                <div className='text-2xl font-bold mb-4'>Welcome to the Dashboard</div>
                <img src={logo} alt="Logo" />
                <Card
                    className='bg-white shadow-lg p-3 rounded-lg w-3/4'
                    style={{ maxWidth: '600px', textAlign: 'center' }}
                >
                    <Text style={{ fontSize: 28 }}>
                        <div className='text-lg mb-4'>
                            {dateTime.date} -:- {dateTime.time}
                        </div>
                    </Text>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;